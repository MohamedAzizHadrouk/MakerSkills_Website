import { PartialType } from '@nestjs/mapped-types';
import { CreateHeroSectionDto } from './create-hero-section.dto';

export class UpdateHeroSectionDto extends PartialType(CreateHeroSectionDto) {}
