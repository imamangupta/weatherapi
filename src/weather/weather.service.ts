import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Weather } from 'src/schemas/Weather.schemas';


interface WeatherData {
    description: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    place: string;
    visibility: string;
}

@Injectable()
export class WeatherService {



    constructor(@InjectModel(Weather.name) private weatherModel: Model<Weather>,
        @Inject('CACHE_MANAGER') private cacheManager: Cache) { }


    // New Routes Services
    async getWeatherByCity(city: string) {
        try {
            console.log(`Adding weather data for ${city}`);
            const cacheData = await this.cacheManager.get<{ createdAt: string }>(city);

            if (cacheData) {

                const dataCreationTime = new Date(cacheData.createdAt).getTime();
                const currentTime = new Date().getTime();
                const sixHoursInMs = 6 * 60 * 60 * 1000;

                if (currentTime - dataCreationTime < sixHoursInMs) {
                    console.log('Cache Hit (current):', cacheData);
                    return cacheData;
                } else {
                    console.log('Cache expired, fetching new data');
                    await this.cacheManager.del(city);
                }
            }

            const response = await fetch(
                `${process.env.WEATHER_URL}?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
            }

            const weatherApiData = await response.json();
            const weatherData: WeatherData = {
                description: weatherApiData.weather[0].description,
                temperature: `${weatherApiData.main.temp}°C`,
                humidity: `${weatherApiData.main.humidity}%`,
                windSpeed: `${weatherApiData.wind.speed} km/h`,
                place: weatherApiData.name,
                visibility: `${weatherApiData.visibility / 1000} km`
            };

            const newWeather = new this.weatherModel(weatherData);
            const savedWeather = await newWeather.save();
            await this.cacheManager.set(city, savedWeather);

            return savedWeather;
        } catch (error) {
            console.error('Error When Getting Weather Data:', error);
            throw new HttpException("No data found for the city.", HttpStatus.NOT_FOUND);
        }
    }

    async deleteWeatherByCity(city: string) {
        try {
            console.log(`Deleting weather data for  ${city}`);
            await this.cacheManager.del(city);

            const weatherData = await this.weatherModel.findOneAndDelete({ place: city });
            if (!weatherData) {
                throw new HttpException("No data found for the city.", HttpStatus.NOT_FOUND);
            }

            return { status: true, message: "Weather data deleted successfully.", data: city };
        } catch (error) {
            console.error('Error When Getting Weather Data:', error);
            throw new HttpException("No data found for the city.", HttpStatus.NOT_FOUND);
        }
    }

    async updateWeatherByCity(city: string) {
        try {
            console.log(`Updating weather data for ${city}`);
            await this.cacheManager.del(city);

            const response = await fetch(
                `${process.env.WEATHER_URL}?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
            }

            const weatherApiData = await response.json();
            const weatherData: WeatherData = {
                description: weatherApiData.weather[0].description,
                temperature: `${weatherApiData.main.temp}°C`,
                humidity: `${weatherApiData.main.humidity}%`,
                windSpeed: `${weatherApiData.wind.speed} km/h`,
                place: weatherApiData.name,
                visibility: `${weatherApiData.visibility / 1000} km`
            };

            const updatedWeather = await this.weatherModel.findOneAndUpdate(
                { place: city },
                weatherData
            );

            await this.cacheManager.set(city, weatherData);

            return {
                status: true,
                message: "Weather data updated successfully.",
                data: updatedWeather
            };

        } catch (error) {
            console.error('Error when updating weather data:', error);
            throw new HttpException("Failed to update weather data for the city.", HttpStatus.NOT_FOUND);
        }
    }






    // Previous code

    async getWeatherById(place: string) {
        try {
            console.log("inside service add");
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${process.env.WEATHER_API_KEY}&units=metric`
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

            return { status: true, data: savedWeather };

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
        try {
            await this.cacheManager.del('weatherHistory');
            return this.weatherModel.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error To Delete Data ', id);
            return { error: "Error To Delete:- " + id };
        }
    }

}
