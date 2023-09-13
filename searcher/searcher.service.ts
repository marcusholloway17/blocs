import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class SearcherService {
  private url!: string;

  constructor(private http: HttpClient) {}

  setUrl(url: string) {
    this.url = url;
    return this;
  }

  getUrl(): string {
    return this.url;
  }

  search(data: any) {
    return this.http.get(this.url, { params: data });
  }

  customSearch(data: any = {}, url: string = this.url) {
    return this.http.get(url ?? this.url, { params: data });
  }
}
