<?php

namespace App\Http\Controllers\Api;

use App\Models\Hotel;
use App\Models\Habitacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class HotelController extends Controller
{
    public function index(): JsonResponse
    {
        $hoteles = Hotel::all(); // Obtiene todos los conductores
        return response()->json($hoteles); // Devuelve JSON
    }

    public function show($id)
    {
        $hotel = Hotel::with('habitaciones')->find($id);
        return $hotel
            ? response()->json($hotel)
            : response()->json(['message' => 'Hotel no encontrado'], 404);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|unique:hoteles,nombre',
                'direccion' => 'required',
                'ciudad' => 'required',
                'nit' => 'required|unique:hoteles,nit',
                'numero_habitaciones' => 'required|integer|min:1',
                'habitaciones' => 'required|array|min:1',
                'habitaciones.*.tipo' => 'required',
                'habitaciones.*.acomodacion' => 'required',
                'habitaciones.*.cantidad' => 'required|integer|min:1',
            ]);


            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $totalHabitaciones = array_sum(array_column($request->habitaciones, 'cantidad'));

            if ($totalHabitaciones > $request->numero_habitaciones) {
                return response()->json([
                    'message' => '❌ La cantidad de habitaciones excede el máximo configurado para el hotel.',
                    'diferencia' => $totalHabitaciones - $request->numero_habitaciones
                ], 400);
            }


            // Verificar combinaciones duplicadas
            $combinaciones = [];
            foreach ($request->habitaciones as $hab) {
                $tipo = trim($hab['tipo']);
                $acomodacion = trim($hab['acomodacion']);

                // Validar tipo y acomodación con los permitidos
                $reglas = [
                    'Estandar' => ['Sencilla', 'Doble'],
                    'Junior' => ['Triple', 'Cuadruple'],
                    'Suite' => ['Sencilla', 'Doble', 'Triple']
                ];

                if (!isset($reglas[$tipo]) || !in_array($acomodacion, $reglas[$tipo])) {
                    return response()->json([
                        'message' => "❌ Combinación inválida de tipo y acomodación en habitación.",
                        'tipo' => $tipo,
                        'acomodacion' => $acomodacion
                    ], 400);
                }

                // Ver duplicados
                $key = $tipo . '-' . $acomodacion;
                if (in_array($key, $combinaciones)) {
                    return response()->json([
                        'message' => '❌ No se permiten combinaciones repetidas de tipo y acomodación.'
                    ], 400);
                }
                $combinaciones[] = $key;
            }


            // Crear hotel
            $hotel = Hotel::create($request->only(['nombre', 'direccion', 'ciudad', 'nit', 'numero_habitaciones']));

            // Asociar habitaciones
            foreach ($request->habitaciones as $hab) {
                Habitacion::create([
                    'hotel_id' => $hotel->id,
                    'tipo' => $hab['tipo'],
                    'acomodacion' => $hab['acomodacion'],
                    'cantidad' => $hab['cantidad'],
                ]);
            }

            return response()->json(['message' => 'Hotel registrado exitosamente'], 201);
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'habitaciones_acomodacion_check')) {
                return response()->json([
                    'message' => '❌ Combinación inválida de tipo y acomodación en habitación.',
                ], 400);
            }

            Log::error('Error al registrar hotel', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => '❌ Error interno: ' . $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ], 500);
        }
    }
    public function update(Request $request, $id): JsonResponse
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json(['message' => 'Hotel no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|unique:hoteles,nombre,' . $hotel->id,
            'direccion' => 'required',
            'ciudad' => 'required',
            'nit' => 'required|unique:hoteles,nit,' . $hotel->id,
            'numero_habitaciones' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Actualizar los campos permitidos
        $hotel->update($request->only(['nombre', 'direccion', 'ciudad', 'nit', 'numero_habitaciones']));

        return response()->json(['message' => 'Hotel actualizado correctamente'], 200);
    }
    public function destroy($id): JsonResponse
    {
        $hotel = Hotel::find($id);

        if (!$hotel) {
            return response()->json(['message' => 'Hotel no encontrado'], 404);
        }

        $hotel->habitaciones()->delete(); // Elimina habitaciones relacionadas si aplica
        $hotel->delete();

        return response()->json(['message' => 'Hotel eliminado correctamente'], 200);
    }
}
