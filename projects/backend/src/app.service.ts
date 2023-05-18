import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Welcome To API Backend (Talenty-Store) Developed By Jose Agraz - Joseagraz29@gmail.com';
  }
}
