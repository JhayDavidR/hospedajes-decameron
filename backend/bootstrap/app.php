<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // ← Asegúrate que esta línea existe
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'api/*' // Desactiva CSRF para rutas API
        ]);
        
        // Configuración CORS manual
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
