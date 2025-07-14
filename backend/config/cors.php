<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'habitaciones', 'hoteles'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200'], // o el puerto de tu Angular
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];