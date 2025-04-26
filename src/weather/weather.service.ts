import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from 'src/schemas/Weather.schemas';

@Injectable()
export class WeatherService {

    constructor(@InjectModel(Weather.name) private weatherModel: Model<Weather>,) { }

    async getWeatherById(place: string) {
        try {

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=c38c2ab810a1f5c88861c5b2659d9a5b&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
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

            return `Weather Data Added: ${JSON.stringify(savedWeather)}`;

        } catch (error) {
            console.error('Error When Data Adding...', error);
            return { error: "Error To Add Data" };
        }
    }

    async getHistory() {
        try {
        
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            await this.weatherModel.deleteMany({
                createdAt: { $lt: oneHourAgo }
            });

            const recentWeatherData = await this.weatherModel.find({
                createdAt: { $gte: oneHourAgo }
            });

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

            console.log('Updated weather data:', updatedWeather);
            return updatedWeather;
        } catch (error) {
            console.error('Error To Update Data ', id);
            return { error: "Error To Update:- " + id };
        }
    }

    deleteWeatherById(id: string) {
        return this.weatherModel.findByIdAndDelete(id);
    }

}
