import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  finalSearchCriteria: string;

  constructor(private http: HttpClient) { }

  getFilms(criteria): Observable<any> {
    this.finalSearchCriteria = `/api/films?title=${criteria.title}&description=${criteria.description}`;
    console.log(this.finalSearchCriteria);
    return this.http.get(`${environment.api_url}${this.finalSearchCriteria}`);
  }

  getFilmDetails(criteria): Observable<any> {
    return this.http.get(`${environment.api_url}/api/films/${criteria}`);
  }

}
