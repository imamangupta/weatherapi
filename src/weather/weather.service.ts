import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {

    getWeatherById(place: string) {
        return 'Weather data by id: ' + place;
    }

    getHistory() {
        return 'Weather data by history' + [];
    }

    updateWeatherById(id: string, weatherUpdate: {}) {
        return 'Weather data by id: ' + id + ' updated with: ' + JSON.stringify(weatherUpdate);
    }

    deleteWeatherById(id: string) {
        return 'Weather data by id: ' + id;
    }

}
