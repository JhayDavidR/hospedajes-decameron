import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  numero_habitaciones: number;
  habitaciones?: {
    tipo: string;
    acomodacion: string;
    cantidad: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = ' https://hospedajes-decameron-backend-c25debc06c4c.herokuapp.com/api/hoteles';

  constructor(private http: HttpClient) { }

  getHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  crearHotel(data: Partial<Hotel>): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarHotel(hotel: Hotel): Observable<any> {
    return this.http.put(`${this.apiUrl}/${hotel.id}`, hotel);
  }
  eliminarHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
