import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CrudService {
  private url!: string;

  constructor(private http: HttpClient) {}

  setURL(url: string) {
    this.url = url;
    return this;
  }

  create(data: any) {
    return this.http.post(this.url, data);
  }

  update(id: any, data: any) {
    return this.http.put(this.url + id, data);
  }

  getById(id: any, data?: any) {
    return this.http.get(this.url + id, { params: data });
  }

  getAll(data?: any) {
    return this.http.get(this.url, { params: data });
  }

  delete(id: any) {
    return this.http.delete(this.url + id);
  }
}
