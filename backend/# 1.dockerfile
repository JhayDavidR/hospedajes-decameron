# 1. Usar una imagen base de PHP-FPM con Alpine (ligera y eficiente)
FROM php:8.3-fpm-alpine

# 2. Instalar dependencias del sistema y extensiones de PHP
RUN apk update && apk add --no-cache \
    nginx \
    git \
    supervisor \
    # Dependencias para PostgreSQL (Supabase)
    postgresql-dev \
    libzip-dev \
    # Otras dependencias comunes para Laravel
    libpng-dev \
    jpeg-dev \
    libjpeg-turbo-dev \
    bash

# Instalar extensiones de PHP necesarias
RUN docker-php-ext-install pdo pdo_pgsql zip gd

# 3. Instalar Composer (el gestor de paquetes de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configurar el directorio de trabajo
WORKDIR /app/backend

# 5. Copiar los archivos de la aplicación a la imagen
COPY . /app/backend

# 6. Instalar dependencias de Laravel (Composer)
RUN composer install --no-dev --optimize-autoloader

# 7. Configurar permisos de directorios de Laravel (storage y cache)
# Render usará las variables de entorno para configurar el .env
RUN chown -R www-data:www-data /app/backend/storage /app/backend/bootstrap/cache
RUN chmod -R 775 /app/backend/storage /app/backend/bootstrap/cache

# 8. Exponer el puerto por defecto de Laravel
EXPOSE 8000

# 9. Definir el comando de inicio para Render
# Usamos php artisan serve para ejecutar el servidor de desarrollo en producción
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]