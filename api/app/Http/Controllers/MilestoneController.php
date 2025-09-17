<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MilestonesController extends Controller
{
    private function asJson(Milestone $m)
    {
        // Ensure fresh + include project_id for the UI’s updater
        $m->refresh();
        return response()->json($m);
    }

    public function claim($id, Request $req)
    {
        $data = $req->validate([
            'assignee' => 'required|string|max:255',
        ]);

        $m = Milestone::findOrFail($id);
        if ($m->status !== 'open') {
            return response()->json(['message' => 'Only open milestones can be claimed'], 422);
        }

        $m->status   = 'claimed';
        $m->assignee = $data['assignee'];
        $m->save();

        return $this->asJson($m);
    }

    public function deliver($id, Request $req)
    {
        $data = $req->validate([
            'files' => 'nullable|array',
            'files.*' => 'string',
        ]);

        $m = Milestone::findOrFail($id);
        if (!in_array($m->status, ['claimed','revision'])) {
            return response()->json(['message' => 'Only claimed or revision milestones can be delivered'], 422);
        }

        // Append any file URLs provided by the client (UI may send previous list)
        $files = $m->files ?: [];
        if (!empty($data['files'])) {
            $files = array_values(array_unique(array_merge($files, $data['files'])));
        }

        $m->status = 'delivered';
        $m->files  = $files;
        $m->save();

        return $this->asJson($m);
    }

    public function approve($id)
    {
        $m = Milestone::findOrFail($id);
        if ($m->status !== 'delivered') {
            return response()->json(['message' => 'Only delivered milestones can be approved'], 422);
        }
        $m->status = 'approved';
        $m->save();

        return $this->asJson($m);
    }

    public function revision($id)
    {
        $m = Milestone::findOrFail($id);
        if ($m->status !== 'delivered') {
            return response()->json(['message' => 'Only delivered milestones can be moved to revision'], 422);
        }
        $m->status = 'revision';
        $m->save();

        return $this->asJson($m);
    }

    public function reopen($id)
    {
        $m = Milestone::findOrFail($id);
        if (!in_array($m->status, ['revision','approved'])) {
            return response()->json(['message' => 'Only revision/approved milestones can be reopened'], 422);
        }
        $m->status   = 'open';
        $m->assignee = null;
        $m->save();

        return $this->asJson($m);
    }

    public function upload($id, Request $req)
    {
        $req->validate([
            'file' => 'required|file|max:102400', // 100MB
        ]);

        $m = Milestone::findOrFail($id);

        // Upload to Wasabi (S3-compatible). .env already set.
        // FILESYSTEM_DISK should be s3; AWS_* are configured.
        $path = "milestones/{$m->id}/".time().'_'.$req->file('file')->getClientOriginalName();

        $disk = Storage::disk(config('filesystems.default','s3'));
        $disk->put($path, file_get_contents($req->file('file')->getRealPath()), 'public');

        $url = $disk->url($path);

        $files = $m->files ?: [];
        $files[] = $url;
        $m->files = $files;
        $m->save();

        return response()->json([
            'url' => $url,
            'milestone' => $m->fresh(),
        ]);
    }
}
