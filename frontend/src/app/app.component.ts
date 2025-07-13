import { Component } from '@angular/core';
import { HotelesComponent } from './components/hoteles/hoteles.component'; // ajusta la ruta si es diferente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HotelesComponent], // Importa el componente de hoteles
  template: `
    <app-hoteles></app-hoteles> <!-- Aquí se muestra el componente -->
  `
})
export class AppComponent {}
