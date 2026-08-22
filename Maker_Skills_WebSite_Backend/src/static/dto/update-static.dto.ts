import { PartialType } from '@nestjs/swagger';
import { CreateStaticDto } from './create-static.dto';

export class UpdateStaticDto extends PartialType(CreateStaticDto) {}
