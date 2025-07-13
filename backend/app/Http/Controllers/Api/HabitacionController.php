<?php

namespace App\Http\Controllers\Api;
use App\Models\Habitacion;
use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class HabitacionController extends Controller
{
    public function index(): JsonResponse
    {
        $habitacion = Habitacion::all(); // Obtiene todos los conductores
        return response()->json($habitacion); // Devuelve JSON
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hotel_id' => 'required|exists:hoteles,id',
            'tipo' => 'required|in:Estándar,Junior,Suite',
            'acomodacion' => 'required',
            'cantidad' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        // Validación de acomodación permitida por tipo
        $acomodacionesPermitidas = [
            'Estándar' => ['Sencilla', 'Doble'],
            'Junior' => ['Triple', 'Cuádruple'],
            'Suite' => ['Sencilla', 'Doble', 'Triple']
        ];

        if (!in_array($request->acomodacion, $acomodacionesPermitidas[$request->tipo])) {
            return response()->json(['error' => 'Acomodación no permitida para el tipo'], 400);
        }

        // Validar que no se dupliquen tipo/acomo/hotel
        $existe = Habitacion::where('hotel_id', $request->hotel_id)
            ->where('tipo', $request->tipo)
            ->where('acomodacion', $request->acomodacion)
            ->exists();

        if ($existe) {
            return response()->json(['error' => 'Ya existe una configuración igual para este hotel'], 409);
        }

        // Validar cantidad total
        $hotel = Hotel::with('habitaciones')->find($request->hotel_id);
        $totalAsignadas = $hotel->habitaciones->sum('cantidad');
        $disponible = $hotel->numero_habitaciones - $totalAsignadas;

        if ($request->cantidad > $disponible) {
            return response()->json(['error' => "Solo quedan $disponible habitaciones por asignar"], 400);
        }

        $habitacion = Habitacion::create($request->all());
        return response()->json($habitacion, 201);
    }
}
