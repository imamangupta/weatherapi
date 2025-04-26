import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherModule } from './weather/weather.module';
import { WeatherService } from './weather/weather.service';

@Module({
  imports: [WeatherModule],
  controllers: [AppController, WeatherController],
  providers: [AppService, WeatherService],

})

export class AppModule {}
