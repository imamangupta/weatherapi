import { Body, Controller, Delete, Get, Param, Patch, Query, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) { }
    
    
    // @CacheTTL(60 * 1000)
    @Get()
    getWeatherById(@Query('place') place: string) {
        return this.weatherService.getWeatherById(place);
    }
    
    @CacheKey('weatherHistory')
    @Get("history")
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
