import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class CreateWeatherDto {
    
    @IsNotEmpty()
    @IsString()
    description?: string;
    
    @IsNotEmpty()
    @IsString()
    temperature?: string;

    @IsNotEmpty()
    @IsString()
    humidity?: string;

    @IsNotEmpty()
    @IsString()
    windSpeed?: string;
    
    @IsNotEmpty()
    @IsString()
    place?: string;
    
    @IsNotEmpty()
    @IsString()
    visibility?: string;
}