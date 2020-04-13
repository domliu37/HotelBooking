import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //default should be false, changed to true for easy testing
  private _userIsAuthenticate = true;
  private _userId = 'Naomi';

  get userIsAuthenticated() {
    return this._userIsAuthenticate;
  }

  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this._userIsAuthenticate = true;
  }

  logout() {
    this._userIsAuthenticate = false;
  }
}
