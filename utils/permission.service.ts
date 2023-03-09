import { Inject, Injectable } from '@angular/core';
import { AUTH_SERVICE } from 'src/app/views/login/constants';
import { AuthServiceInterface } from 'src/app/views/login/contracts';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  public permissions!: string[];
  public user!: any;
  constructor(@Inject(AUTH_SERVICE) private auth: AuthServiceInterface) {
    this.auth.signInState$.subscribe((data: any) => {
      // console.log(data.scopes);
      this.user = data;
      this.permissions = data?.scopes;
    });
  }

  getPermissions() {
    return this.permissions;
  }

  getUser() {
    return this.user;
  }
}
