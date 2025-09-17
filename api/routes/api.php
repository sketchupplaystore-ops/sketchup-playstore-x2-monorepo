<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MilestoneController;
use App\Http\Controllers\Api\FileUploadController;

Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);

Route::patch('/milestones/{milestone}/claim', [MilestoneController::class, 'claim']);
Route::patch('/milestones/{milestone}/deliver', [MilestoneController::class, 'deliver']);
Route::patch('/milestones/{milestone}/approve', [MilestoneController::class, 'approve']);
Route::patch('/milestones/{milestone}/revision', [MilestoneController::class, 'revision']);
Route::patch('/milestones/{milestone}/reopen', [MilestoneController::class, 'reopen']);

Route::post('/milestones/{milestone}/files', [FileUploadController::class, 'uploadToMilestone']);
