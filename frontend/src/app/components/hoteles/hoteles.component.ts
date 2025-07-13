import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '../../services/hotel.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hoteles.component.html'
})
export class HotelesComponent {
  hoteles: Hotel[] = [];

  // Incluir habitaciones en la interfaz de nuevo hotel
  nuevoHotel: Partial<Hotel> & { habitaciones?: any[] } = {
    habitaciones: []
  };

  constructor(private hotelService: HotelService) {
    this.cargarHoteles();
  }

  cargarHoteles() {
    this.hotelService.getHoteles().subscribe({
      next: (data) => this.hoteles = data,
      error: (err) => console.error('Error al cargar hoteles', err)
    });
  }

  agregarHabitacion() {
    this.nuevoHotel.habitaciones?.push({
      tipo: '',
      acomodacion: '',
      cantidad: 1
    });
  }

  eliminarHabitacion(index: number) {
    this.nuevoHotel.habitaciones?.splice(index, 1);
  }
  acomodacionesPorTipo: { [tipo: string]: string[] } = {
    'Estandar': ['Sencilla', 'Doble'],
    'Junior': ['Triple', 'Cuadruple'],
    'Suite': ['Sencilla', 'Doble', 'Triple']
  };

  esAcomodacionValida(tipo: string, acomodacion: string): boolean {
    const reglas: Record<string, string[]> = {
      'Estandar': ['Sencilla', 'Doble'],
      'Junior': ['Triple', 'Cuadruple'],
      'Suite': ['Sencilla', 'Doble', 'Triple']
    };

    const tipoLimpio = tipo.trim().toLowerCase();
    const acomodacionLimpia = acomodacion.trim().toLowerCase();

    const reglasNormalizadas = Object.fromEntries(
      Object.entries(reglas).map(([t, acoms]) => [
        t.toLowerCase(),
        acoms.map(a => a.toLowerCase())
      ])
    );

    return reglasNormalizadas[tipoLimpio]?.includes(acomodacionLimpia) ?? false;
  }

  registrarHotel() {
    const habitacionesInvalidas = this.nuevoHotel.habitaciones?.filter(h =>
      !this.esAcomodacionValida(h.tipo, h.acomodacion)
    );

    if (habitacionesInvalidas && habitacionesInvalidas.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Acomodación inválida',
        html: 'Verifica las combinaciones de <b>tipo</b> y <b>acomodación</b>. Algunas no son válidas.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    this.hotelService.crearHotel(this.nuevoHotel).subscribe({
      next: () => {
        this.cargarHoteles();
        this.nuevoHotel = { habitaciones: [] };

        Swal.fire({
          icon: 'success',
          title: '¡Hotel registrado!',
          text: 'El hotel se registró correctamente.',
          timer: 3000,
          buttonsStyling: true,
          customClass: {
            confirmButton: 'bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 focus:outline-none'
          }
        });
      },
      error: (err) => {
        console.error('Error al registrar hotel', err);

        // ✅ Validación desde el backend: excede habitaciones
        if (err.status === 400 && err.error?.message?.includes('excede el máximo')) {
          Swal.fire({
            icon: 'error',
            title: 'Habitaciones excedidas',
            html: `
            <strong>${err.error.message}</strong><br>
            Diferencia: <b>${err.error.diferencia}</b> habitaciones adicionales
          `,
            confirmButtonText: 'Entendido'
          });
          return;
        }

        // ✅ Validación por campos requeridos
        if (err.status === 422 && err.error.errors) {
          const errores = err.error.errors;
          const mensajes = Object.keys(errores)
            .map(campo => `• ${campo.toUpperCase()}: ${errores[campo].join(', ')}`)
            .join('<br>');

          Swal.fire({
            icon: 'error',
            title: 'Errores de validación',
            html: mensajes,
            confirmButtonText: 'Entendido',
            width: 600
          });
        } else {
          // Error inesperado
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            html: `Algo salió mal al registrar el hotel.<br><br>
            <b>${err.error?.message ?? 'Sin mensaje del servidor'}</b>`,
            width: 600
          });
        }
      }
    });
  }


  hotelSeleccionado: Hotel | null = null;
  mostrarModal = false;

verDetalle(hotel: Hotel) {
  this.hotelSeleccionado = hotel;
  this.mostrarModal = true;
  this.indiceCarrusel = 0;

  // Asignar imágenes locales aleatorias si aún no se han asignado
  if (!this.imagenesCarruselMap[hotel.id]) {
    // Supongamos que tienes 10 imágenes: hotel1.jpg ... hotel10.jpg
    const totalImagenes = 10;
    const usadas: number[] = [];

    const obtenerImagenUnica = (): string => {
      let numero;
      do {
        numero = Math.floor(Math.random() * totalImagenes) + 1;
      } while (usadas.includes(numero));
      usadas.push(numero);
      return `assets/hoteles/hotel${numero}.png`;
    };

    this.imagenesCarruselMap[hotel.id] = Array.from({ length: 5 }, () => obtenerImagenUnica());
  }
}


  cerrarModal() {
    this.mostrarModal = false;
  }
  modoEdicion = false;

  editarHotel(hotel: Hotel) {
    this.hotelSeleccionado = { ...hotel };
    this.mostrarModal = true;
    this.modoEdicion = true;
  }
  guardarEdicion() {
    if (!this.hotelSeleccionado?.id) return;

    this.hotelService.actualizarHotel(this.hotelSeleccionado).subscribe({
      next: () => {
        this.cargarHoteles();
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: '¡Hotel actualizado!',
          text: 'Los datos del hotel se actualizaron correctamente.',
          timer: 3000,
          buttonsStyling: true,
          customClass: {
            confirmButton: 'bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 focus:outline-none'
          }
        });
      },
      error: (err) => {
        console.error('Error al actualizar hotel', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un error al intentar actualizar el hotel.'
        });
      }
    });
  }

  confirmarEliminacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el hotel permanentemente.',
      icon: 'warning',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: true,
      customClass: {
        confirmButton: 'bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 focus:outline-none',
        cancelButton: 'bg-gray-300 text-black font-semibold px-4 py-2 rounded hover:bg-gray-400 focus:outline-none ml-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelService.eliminarHotel(id).subscribe({
          next: () => {
            this.cargarHoteles();
            this.cerrarModal();
            Swal.fire('Eliminado', 'El hotel ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar hotel', err);
            Swal.fire('Error', 'No se pudo eliminar el hotel.', 'error');
          }
        });
      }
    });
  }

  imagenFallbackMap: { [id: number]: boolean } = {};
  imagenUrls: { [id: number]: string } = {};
  imagenHotelMap: { [hotelId: number]: string } = {};
  imagenesCarruselMap: { [hotelId: number]: string[] } = {};
  indiceCarrusel = 0;


  getImagenHotel(hotel: Hotel): string {
    const index = hotel.id % 5 + 1; // Suponiendo 5 imágenes locales
    return `assets/hoteles/hotel${index}.png`;
  }
  getImagenesCarruselDetalle(hotel: Hotel): string[] {
    if (!this.imagenesCarruselMap[hotel.id]) {
      // Usa nombres de archivo estáticos o genera rutas dinámicas
      this.imagenesCarruselMap[hotel.id] = [
        `assets/hoteles/hotel1.png`,
        `assets/hoteles/hotel2.png`,
        `assets/hoteles/hotel3.png`,
        `assets/hoteles/hotel4.png`,
        `assets/hoteles/hotel5.png`
      ];
    }

    return this.imagenesCarruselMap[hotel.id];
  }

  cambiarImagenCarrusel(direccion: number) {
    const total = this.imagenesCarruselMap[this.hotelSeleccionado!.id]?.length || 0;
    this.indiceCarrusel = (this.indiceCarrusel + direccion + total) % total;
  }
}
