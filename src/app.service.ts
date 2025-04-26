import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): {Statut: string; Message: string} {
    let serverStatus = {Statut: "OK", Message: "Welcome to the Weather API"}
    return serverStatus;
  }

}
