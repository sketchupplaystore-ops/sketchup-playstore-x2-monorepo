<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // Register ALL your route files here
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',   // <<— this is the missing line
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Alias for your API key middleware (protects /api/files*)
        $middleware->alias([
            'api.key' => \App\Http\Middleware\RequireApiKey::class,
        ]);

        // You can add global / route middleware here later if needed
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
