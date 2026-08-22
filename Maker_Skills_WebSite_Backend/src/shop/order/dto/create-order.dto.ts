import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  // For simplicity we accept any phone number; adjust locale if needed
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  delivery?: boolean = false;

  // address is required only when delivery is true
  @ValidateIf((o) => o.delivery === true)
  @IsString()
  address?: string;

  @IsOptional()
  notes?: string;

  // Delivery method (e.g., 'on-site' or 'delivery')
  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  unitPrice?: number;

  @IsOptional()
  totalPrice?: number;

  @IsOptional()
  orderDate?: Date;

  @IsOptional()
  status?: string;

  @IsOptional()
  withFormation?: boolean;
}
