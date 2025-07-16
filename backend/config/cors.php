<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'habitaciones', 'hoteles'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://hospedajes-decameron.netlify.app'], // o el puerto de tu Angular
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];