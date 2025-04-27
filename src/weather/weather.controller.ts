import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';


// @UseInterceptors(CacheInterceptor)
@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) { }

    // New Routes 
    @Get("get")
    getWeatherByCity(@Query('city') city: string) {
        return this.weatherService.getWeatherByCity(city);
    }

    @Delete("delete")
    deleteWeatherByCity(@Query('city') city: string) {
        return this.weatherService.deleteWeatherByCity(city);
    }

    @Put("update")
    updateWeatherByCity(@Query('city') city: string) {
        return this.weatherService.updateWeatherByCity(city);
    }

    // previous code
    @Get()
    getWeatherById(@Query('place') place: string) {
        return this.weatherService.getWeatherById(place);
    }

    // @CacheKey('weatherHistory')
    // @Get("history")
    getHistory() {
        console.log("inside controller");
        return this.weatherService.getHistory();
    }

    @Patch("update/:id")
    updateWeatherById(@Param('id') id: string, @Body() weatherUpdate: {}) {
        return this.weatherService.updateWeatherById(id, weatherUpdate);
    }

    @Delete('delete/:id')
    deleteWeatherById(@Param('id') id: string) {
        return this.weatherService.deleteWeatherById(id);
    }

}
