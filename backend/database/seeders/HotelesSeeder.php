<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\Habitacion;

class HotelesSeeder extends Seeder
{
    public function run()
    {
        $hotel = Hotel::create([
            'nombre' => 'Decameron Cartagena',
            'direccion' => 'Calle 23 58-25',
            'ciudad' => 'Cartagena',
            'nit' => '12345678-9',
            'numero_habitaciones' => 42
        ]);

        $habitaciones = [
            ['tipo' => 'Estandar', 'acomodacion' => 'Sencilla', 'cantidad' => 25],
            ['tipo' => 'Junior', 'acomodacion' => 'Triple', 'cantidad' => 12],
            ['tipo' => 'Estandar', 'acomodacion' => 'Doble', 'cantidad' => 5]
        ];

        foreach ($habitaciones as $h) {
            Habitacion::create(array_merge($h, ['hotel_id' => $hotel->id]));
        }
    }
}
