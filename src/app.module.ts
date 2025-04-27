import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
// import { config } from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
// import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    WeatherModule, 
    MongooseModule.forRoot('mongodb+srv://amanwebdevv:4QH6NQrvaUBAzTcA@cluster0.g8atonj.mongodb.net/nestjs_tutorial'),
    // ConfigModule.forRoot({
    //   load: [config],
    //   isGlobal: true,
    // }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: async (config) => {
    //     const store = await redisStore({
    //       socket:{
    //         host: config.get('redis.host'),
    //         port: config.get('redis.port'),
    //       }
    //     });
    //     return {store,ttl: 5, max: 100};
    //   },
    //  inject: [ConfigService],
    // })
    CacheModule.register({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 60000, // milliseconds
        }),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
