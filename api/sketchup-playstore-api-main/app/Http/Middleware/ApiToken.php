<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiToken
{
    /**
     * Simple header-based API key check.
     * Set your token in .env as APP_API_TOKEN=...
     * Send it in requests as: X-API-Key: <token>
     */
    public function handle(Request $request, Closure $next)
    {
        $expected = (string) config('app.api_token');
        $token    = (string) $request->header('X-API-Key');

        if (!$expected || !$token || !hash_equals($expected, $token)) {
            return response()->json(['ok' => false, 'error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
