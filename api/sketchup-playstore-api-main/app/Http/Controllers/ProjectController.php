<?php

namespace App\Http\Controllers;

use App\Models\Project;

class ProjectsController extends Controller
{
    public function index()
    {
        // Return projects with milestones
        $projects = Project::with(['milestones' => function ($q) {
            $q->orderBy('id');
        }])->orderBy('id','desc')->get();

        return response()->json($projects);
    }
}
