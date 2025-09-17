<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireApiKey
{
    /**
     * Check for X-API-Key header and compare with config('api.key')
     */
    public function handle(Request $request, Closure $next): Response
    {
        $provided = (string) $request->header('X-API-Key', '');
        $expected = (string) config('api.key', '');

        if ($expected === '') {
            return response()->json(['ok' => false, 'error' => 'Server missing API key'], 500);
        }

        if ($provided === '' || ! hash_equals($expected, $provided)) {
            return response()->json(['ok' => false, 'error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
