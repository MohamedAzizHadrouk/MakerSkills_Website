import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou format invalide');
    }
    const token = authHeader.split(' ')[1];
    console.log('JWT reçu:', token);
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
      );
      // Optionnel: tu peux aussi vérifier ici la date d'expiration si tu veux un contrôle manuel
    } catch (e) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
    if (err || !user) {
      throw err || new UnauthorizedException('Token invalide ou expiré');
    }
    return user;
  }
}
