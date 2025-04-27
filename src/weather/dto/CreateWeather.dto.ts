import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateWeatherDto {

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  temperature?: string;

  @IsString()
  humidity?: string;

  @IsString()
  windSpeed?: string;

  @IsNotEmpty()
  @IsString()
  place?: string;

  @IsString()
  visibility?: string;
}