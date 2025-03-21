import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  user_login: boolean = false;
  constructor() { }
}
