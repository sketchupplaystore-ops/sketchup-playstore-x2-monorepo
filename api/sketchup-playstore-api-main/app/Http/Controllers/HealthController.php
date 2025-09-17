<?php

namespace App\Http\Controllers;

class HealthController extends Controller
{
    public function index()
    {
        return response()->json([
            'ok'   => true,
            'app'  => config('app.name'),
            'time' => now()->toIso8601String(),
        ]);
    }
}
