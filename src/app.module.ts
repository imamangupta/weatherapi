import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ WeatherModule, MongooseModule.forRoot('mongodb+srv://amanwebdevv:4QH6NQrvaUBAzTcA@cluster0.g8atonj.mongodb.net/nestjs_tutorial'),
    ],
  controllers: [],
  providers: [],
})

export class AppModule {}
