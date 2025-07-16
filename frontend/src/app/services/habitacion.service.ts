import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = ' https://hospedajes-decameron-backend-c25debc06c4c.herokuapp.com/api/habitaciones';

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHabitacion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
