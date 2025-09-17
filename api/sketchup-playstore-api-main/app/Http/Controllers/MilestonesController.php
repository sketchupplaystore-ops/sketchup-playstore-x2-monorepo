<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Milestone;
use Illuminate\Http\Request;

class MilestonesController extends Controller
{
    public function index(Project $project)
    {
        return $project->milestones;
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $milestone = $project->milestones()->create($validated);

        return response()->json($milestone, 201);
    }
}
