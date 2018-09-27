import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // array to store data for edit page
  editDetails = {};
  // array to store upc12s
  upc12s = [];

  // concatenated query string for API
  finalSearchCriteria: string;

  constructor(private http: HttpClient) { }

  getGroceries(criteria): Observable<any> {
    this.finalSearchCriteria = `/api/groceries?brand=${criteria.brand}&name=${criteria.name}`;
    console.log(this.finalSearchCriteria);
    return this.http.get(`${environment.api_url}${this.finalSearchCriteria}`);
  }

  editGroceryDetails(details): Observable<any> {
    return this.http.put(`${environment.api_url}/api/groceries/edit`, details);
  }

  addGroceryDetails(details): Observable<any> {
    return this.http.post(`${environment.api_url}/api/groceries/add`, details);
  }

  deleteGrocery(details): Observable<any> {
    return this.http.post(`${environment.api_url}/api/groceries/delete`, details);
  }

}
