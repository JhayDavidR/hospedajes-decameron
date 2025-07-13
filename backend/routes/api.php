<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\HabitacionController;

logger('✅ Se está cargando api.php'); // Esto nos ayuda a verificar que el archivo se está cargando.

// Ruta de prueba
Route::get('/ping', function () {
    return response()->json(['message' => '¡API conectada!']);
});

// Rutas para hoteles (Usando apiResource para las rutas RESTful)
Route::apiResource('hoteles', HotelController::class);

// Rutas para habitaciones (Usando apiResource para las rutas RESTful)
Route::apiResource('habitaciones', HabitacionController::class);

// Nota: Eliminamos las líneas 'Route::get('/hoteles', ...)' y 'Route::get('/habitaciones', ...)'
// porque Route::apiResource() ya crea la ruta GET para el método 'index'.