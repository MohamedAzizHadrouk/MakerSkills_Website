import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @IsString()
  @IsOptional()
  logo?: string;
}
