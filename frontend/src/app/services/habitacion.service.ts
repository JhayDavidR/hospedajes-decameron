import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = 'http://localhost:8000/api/habitaciones';

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHabitacion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
