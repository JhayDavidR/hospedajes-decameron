import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ListarHotelesComponent } from './components/listar-hoteles/listar-hoteles.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registro-hoteles', component: HotelesComponent },
  { path: 'registro-habitaciones', component: HabitacionesComponent },
  { path: 'listar-hoteles', component: ListarHotelesComponent },
];
