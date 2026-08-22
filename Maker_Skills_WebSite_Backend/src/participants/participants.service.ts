import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  CreateParticipantDto,
  RegisterForEventDto,
} from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  /**
   * Retourne un tableau d'objets, chacun contenant :
   *   - eventId
   *   - eventName
   *   - price (ou autres champs de l'événement)
   *   - event (document complet de l'événement)
   *   - participants: Participant[]
   */
  async findAll() {
    try {
      const result = await this.participantModel.aggregate([
        {
          $match: {
            event: { $exists: true },
          },
        },
        {
          $addFields: {
            event: {
              $convert: { input: '$event', to: 'objectId', onError: null },
            },
          },
        },
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },
        { $unwind: '$event' },
        {
          $group: {
            _id: '$event._id',
            event: { $first: '$event' },
            participants: { $push: '$$ROOT' },
          },
        },
        {
          $project: {
            _id: 0,
            eventId: '$_id',
            eventName: '$event.name',
            price: '$event.price',
            event: '$event',
            participants: 1,
          },
        },
      ]);

      return {
        message: 'Participants groupés par événement',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la récupération des participants : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Vérif si un participant avec l'email donné est déjà inscrit à l'événement
   */
  async checkDuplicateParticipant(email: string, eventId: string): Promise<boolean> {
    if (!isValidObjectId(eventId)) {
      throw new BadRequestException('ID d\'événement invalide');
    }

    const existingParticipant = await this.participantModel.findOne({
      email: email.toLowerCase().trim(),
      event: eventId,
    });

    return !!existingParticipant;
  }

  /**
   * Inscrire un participant à un événement
   * Empêche les inscriptions en double (même email + même événement)
   * Permet au même email de s'inscrire à différents événements
   */
  async registerForEvent(dto: RegisterForEventDto) {
    try {
      const { eventId, email, ...participantData } = dto;

      // Valider que l'événement existe
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new BadRequestException('Événement introuvable');
      }

      // Vérifier si le participant est déjà inscrit à cet événement spécifique
      const isDuplicate = await this.checkDuplicateParticipant(email, eventId);
      if (isDuplicate) {
        throw new ConflictException(
          `L'email ${email} est déjà inscrit à cet événement : ${event.name}`
        );
      }

      // Créer le participant
      const participant = await this.participantModel.create({
        ...participantData,
        email: email.toLowerCase().trim(), // Normaliser l'email
        event: eventId,
      });

      // Ajouter la référence du participant au tableau Event.participants (éviter les doublons)
      await this.eventModel.findByIdAndUpdate(
        eventId,
        { $addToSet: { participants: participant._id } },
        { new: true },
      );

      return {
        message: 'Inscription réussie à l\'événement',
        data: participant,
        event: {
          id: event._id,
          name: event.name,
        },
      };
    } catch (error) {
      console.log(error);
      // Gérer l'erreur de clé dupliquée MongoDB comme sauvegarde (si l'index existe)
      if (error.code === 11000) {
        throw new ConflictException('Email déjà inscrit à cet événement');
      }
      
      // Re-lancer les exceptions connues
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      // Gérer les erreurs inconnues
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de l\'inscription du participant : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Créer un participant sans l'associer à un événement
   */
  async create(createParticipantDto: CreateParticipantDto) {
    try {
      const participant = await this.participantModel.create({
        ...createParticipantDto,
        email: createParticipantDto.email.toLowerCase().trim(),
      });

      return {
        message: 'Participant créé avec succès',
        data: participant,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la création du participant : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtenir tous les participants d'un événement spécifique
   */
  async findByEvent(eventId: string) {
    try {
      if (!isValidObjectId(eventId)) {
        throw new BadRequestException('ID d\'événement invalide');
      }

      const participants = await this.participantModel
        .find({ event: eventId })
        .populate('event', 'name description price')
        .exec();

      return {
        message: 'Participants de l\'événement récupérés avec succès',
        data: participants,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la récupération des participants : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtenir tous les événements auxquels un participant (par email) est inscrit
   */
  async findEventsByParticipantEmail(email: string) {
    try {
      const participants = await this.participantModel
        .find({ 
          email: email.toLowerCase().trim(),
          event: { $exists: true, $ne: null }
        })
        .populate('event')
        .exec();

      const events = participants.map(p => p.event);

      return {
        message: 'Événements du participant récupérés avec succès',
        data: {
          email,
          events,
          totalEvents: events.length,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la récupération des événements du participant : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Mettre à jour les informations du participant
   */
  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID de participant invalide');
      }

      const updateData = { ...updateParticipantDto };
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase().trim();
      }

      const participant = await this.participantModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('event')
        .exec();

      if (!participant) {
        throw new HttpException(
          'Participant introuvable',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Participant mis à jour avec succès',
        data: participant,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la mise à jour du participant : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Supprimer le participant du système
   */
  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID de participant invalide');
      }

      const participant = await this.participantModel.findById(id);
      if (!participant) {
        throw new HttpException(
          'Participant introuvable',
          HttpStatus.NOT_FOUND,
        );
      }

      // Supprimer la référence du participant de l'événement si elle existe
      if (participant.event) {
        await this.eventModel.findByIdAndUpdate(
          participant.event,
          { $pull: { participants: participant._id } }
        );
      }

      await this.participantModel.findByIdAndDelete(id);

      return {
        message: 'Participant supprimé avec succès',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Échec de la suppression du participant : ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}