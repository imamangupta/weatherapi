import { Injectable,Inject  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Weather } from 'src/schemas/Weather.schemas';

@Injectable()
export class WeatherService {

    constructor(@InjectModel(Weather.name) private weatherModel: Model<Weather>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache) { }

    async getWeatherById(place: string) {
        try {
            console.log("inside service add");
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=c38c2ab810a1f5c88861c5b2659d9a5b&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}, ${process.env.WEATHER_API_KEY}`);
            }

            const weatherApiData = await response.json();

            const weatherData = {
                description: weatherApiData.weather[0].description,
                temperature: `${weatherApiData.main.temp}°C`,
                humidity: `${weatherApiData.main.humidity}%`,
                windSpeed: `${weatherApiData.wind.speed} km/h`,
                place: weatherApiData.name,
                visibility: `${weatherApiData.visibility / 1000} km`
            };

            console.log(weatherData);
            const newWeather = new this.weatherModel(weatherData);
            const savedWeather = await newWeather.save();
            await this.cacheManager.del('weatherHistory');

            return `Weather Data Added: ${JSON.stringify(savedWeather)}`;

        } catch (error) {
            console.error('Error When Data Adding...', error);
            return { error: "Error To Add Data" };
        }
    }

    async getHistory() {
        try {
            console.log("inside service");
            const cacheData = await this.cacheManager.get('weatherHistory');
            if (cacheData) {
                console.log('Cache Hit:', cacheData);
                return cacheData;
            }
            console.log('Cache Miss, Fetching from DB...');
        
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            await this.weatherModel.deleteMany({
                createdAt: { $lt: oneHourAgo }
            });

            const recentWeatherData = await this.weatherModel.find({
                createdAt: { $gte: oneHourAgo }
            });

            await this.cacheManager.set('weatherHistory', recentWeatherData);

            return recentWeatherData;
        } catch (error) {
            console.error('Error To Update Data', error);
            return { error: "Error To Get Data" };
        }
    }

    async updateWeatherById(id: string, weatherUpdate: Partial<Weather>) {
        try {

            const updatedWeather = await this.weatherModel.findByIdAndUpdate(
                id,
                weatherUpdate,
                { new: true }
            );

            if (!updatedWeather) {
                throw new Error(`Weather record with ID ${id} not found`);
            }
            await this.cacheManager.del('weatherHistory');
            console.log('Updated weather data:', updatedWeather);
            return updatedWeather;
        } catch (error) {
            console.error('Error To Update Data ', id);
            return { error: "Error To Update:- " + id };
        }
    }

    async deleteWeatherById(id: string) {
        await this.cacheManager.del('weatherHistory');
        return this.weatherModel.findByIdAndDelete(id);
    }

}
