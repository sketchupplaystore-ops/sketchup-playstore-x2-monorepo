<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    public function index()
    {
        return Project::with('milestones')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }
}
