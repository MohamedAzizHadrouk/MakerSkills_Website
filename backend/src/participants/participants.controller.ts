import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { RegisterForEventDto } from './dto/create-participant.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  create(@Body() createParticipantDto: RegisterForEventDto) {
    return this.participantsService.registerForEvent(createParticipantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.participantsService.findAll();
  }
}
