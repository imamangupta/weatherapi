import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) { }
    
    @Get()
    getWeatherById(@Query('place') place: string) {
        return this.weatherService.getWeatherById(place);
    }

    @Get("history")
    getHistory() {
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
