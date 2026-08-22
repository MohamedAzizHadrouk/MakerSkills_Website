// uploads.controller.ts
import {
  Controller,
  Get,
  Req,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { existsSync, statSync, createReadStream } from 'fs';
import { resolve, normalize } from 'path';

@Controller('uploads')
export class UploadsController {
  /**
   * Obtient le chemin du dossier uploads
   * Essaie plusieurs méthodes pour trouver le bon chemin
   */
  private getUploadsPath(): string {
    // Méthode 1: Utiliser process.cwd() qui devrait pointer vers ~/backend en production
    const cwd = process.cwd();
    let uploadsPath = resolve(cwd, 'uploads');
    
    // Si process.cwd() pointe vers dist/, remonter d'un niveau
    if (cwd.includes('dist')) {
      uploadsPath = resolve(cwd, '..', 'uploads');
    }
    
    // Vérifier si ce chemin existe
    if (existsSync(uploadsPath)) {
      return uploadsPath;
    }
    
    // Méthode 2: Utiliser __dirname pour remonter à la racine
    const currentDir = __dirname;
    if (currentDir.includes('dist')) {
      // En production: __dirname = dist/uploads
      uploadsPath = resolve(currentDir, '..', 'uploads');
    } else {
      // En développement: __dirname = src/uploads
      uploadsPath = resolve(currentDir, '../..', 'uploads');
    }
    
    // Vérifier si ce chemin existe
    if (existsSync(uploadsPath)) {
      return uploadsPath;
    }
    
    // Méthode 3: Chemin absolu basé sur le home directory (pour production)
    // Si on est sur Linux et que process.cwd() est dans ~/backend
    if (process.platform !== 'win32') {
      const homeDir = process.env.HOME || process.env.USERPROFILE || '';
      if (homeDir) {
        uploadsPath = resolve(homeDir, 'backend', 'uploads');
        if (existsSync(uploadsPath)) {
          return uploadsPath;
        }
      }
    }
    
    // Par défaut, retourner le chemin basé sur process.cwd()
    return resolve(process.cwd().includes('dist') ? resolve(process.cwd(), '..') : process.cwd(), 'uploads');
  }

  @Get('*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    // Extraire le chemin du fichier depuis req.path
    // req.path sera /uploads/filename.png ou /api/uploads/filename.png
    // ou /uploads/hero-section/file.jpg ou /api/uploads/hero-section/file.jpg
    let filePath = req.path;

    // Retirer le préfixe /uploads/ ou /api/uploads/
    filePath = filePath.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');

    // Vérifier que le chemin n'est pas vide
    if (!filePath || filePath === 'uploads' || filePath === 'api/uploads' || filePath === '/') {
      throw new NotFoundException('File path is required');
    }

    // Construire le chemin complet du fichier
    const uploadsPath = this.getUploadsPath();
    
    // Normaliser le chemin en supprimant les tentatives de path traversal
    // et en gardant les sous-dossiers comme hero-section/, products/, etc.
    let normalizedPath = filePath.replace(/^(\.\.[\/\\])+/g, '').replace(/^[\/\\]+/, '');
    
    // Utiliser join au lieu de resolve pour préserver les sous-dossiers
    const fullFilePath = resolve(uploadsPath, normalizedPath);

    // Log pour déboguer (peut être retiré en production)
    console.log('Tentative d\'accès au fichier:', {
      requestedPath: req.path,
      extractedPath: filePath,
      normalizedPath,
      uploadsPath,
      fullFilePath,
      exists: existsSync(fullFilePath),
    });

    // Sécuriser : empêcher l'accès aux fichiers en dehors du dossier uploads
    // Normaliser les deux chemins pour la comparaison
    const normalizedUploadsPath = resolve(uploadsPath);
    const normalizedFullPath = resolve(fullFilePath);
    
    if (!normalizedFullPath.startsWith(normalizedUploadsPath)) {
      throw new NotFoundException('Invalid file path');
    }

    // Vérifier que le fichier existe
    if (!existsSync(fullFilePath)) {
      // Essayer aussi avec le chemin tel quel (sans normalisation)
      const altPath = resolve(uploadsPath, filePath);
      if (existsSync(altPath)) {
        // Utiliser le chemin alternatif
        return this.sendFile(res, altPath, filePath);
      }
      throw new NotFoundException(`File not found: ${filePath} at ${fullFilePath}`);
    }

    return this.sendFile(res, fullFilePath, filePath);
  }

  private sendFile(res: Response, fullFilePath: string, filePath: string) {
    // Obtenir les stats du fichier
    const stats = statSync(fullFilePath);
    const fileSize = stats.size;

    // Déterminer le Content-Type selon l'extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      mp3: 'audio/mpeg',
      json: 'application/json',
    };

    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';

    // Définir les headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileSize.toString());
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Envoyer le fichier
    const fileStream = createReadStream(fullFilePath);
    fileStream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading file' });
      }
    });
    fileStream.pipe(res);
  }
}

