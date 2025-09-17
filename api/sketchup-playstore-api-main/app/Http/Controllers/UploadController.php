<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * POST /api/milestones/{milestone}/files
     * Form-Data: file (binary)
     */
    public function uploadToMilestone(Request $request, Milestone $milestone)
    {
        // Max 50MB; bump if you need larger assets
        $request->validate([
            'file' => 'required|file|max:51200',
        ]);

        $file = $request->file('file');

        // Folder per milestone
        $dir = 'milestones/' . $milestone->id;

        // Safe filename + timestamp to avoid collisions
        $ext      = $file->getClientOriginalExtension() ?: 'bin';
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeBase = Str::slug($basename) ?: 'file';
        $key      = $dir . '/' . $safeBase . '-' . time() . '.' . $ext;

        // Upload to the 's3' disk (your .env maps this to Wasabi)
        $stream = fopen($file->getRealPath(), 'r');
        Storage::disk('s3')->put($key, $stream, [
            'visibility'   => 'public',                 // ensure public access
            'ACL'          => 'public-read',            // extra hint; some drivers ignore
            'ContentType'  => $file->getMimeType() ?: 'application/octet-stream',
            'CacheControl' => 'public, max-age=31536000, immutable',
        ]);
        if (is_resource($stream)) {
            fclose($stream);
        }

        // Public URL from Wasabi
        $url = Storage::disk('s3')->url($key);

        // Attach to milestone and auto-move to 'delivered' if it was 'open'
        $files   = $milestone->files ?? [];
        $files[] = $url;

        $milestone->update([
            'files'  => array_values($files),
            'status' => $milestone->status === 'open' ? 'delivered' : $milestone->status,
        ]);

        return response()->json([
            'url'       => $url,
            'key'       => $key,
            'milestone' => $milestone->fresh(),
        ]);
    }
}
