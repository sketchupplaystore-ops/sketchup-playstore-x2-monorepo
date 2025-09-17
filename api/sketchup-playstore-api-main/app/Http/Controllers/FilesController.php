<?php

namespace App\Http\Controllers;

use Aws\Exception\AwsException;
use Aws\S3\S3Client;
use Illuminate\Http\Request;

class FilesController extends Controller
{
    private function s3(): S3Client
    {
        return new S3Client([
            'version'                 => 'latest',
            'region'                  => config('filesystems.disks.s3.region', 'us-central-1'),
            'credentials'             => [
                'key'    => config('filesystems.disks.s3.key'),
                'secret' => config('filesystems.disks.s3.secret'),
            ],
            'endpoint'                => config('filesystems.disks.s3.endpoint', 'https://s3.us-central-1.wasabisys.com'),
            'use_path_style_endpoint' => (bool) config('filesystems.disks.s3.use_path_style_endpoint', true),
        ]);
    }

    // GET /api/files?prefix=uploads/&token=...  (token for pagination)
    public function index(Request $request)
    {
        $prefix = $request->query('prefix', 'uploads/');
        $token  = $request->query('token');

        try {
            $args = [
                'Bucket'  => config('filesystems.disks.s3.bucket'),
                'Prefix'  => $prefix,
                'MaxKeys' => 1000,
            ];
            if ($token) {
                $args['ContinuationToken'] = $token;
            }

            $result = $this->s3()->listObjectsV2($args);

            $items = [];
            foreach ($result['Contents'] ?? [] as $obj) {
                $items[] = [
                    'key'          => (string) ($obj['Key'] ?? ''),
                    'size'         => (int)   ($obj['Size'] ?? 0),
                    'lastModified' => isset($obj['LastModified']) && $obj['LastModified'] instanceof \DateTimeInterface
                        ? $obj['LastModified']->format(DATE_ISO8601)
                        : null,
                ];
            }

            return response()->json([
                'ok'        => true,
                'count'     => count($items),
                'items'     => $items,
                'nextToken' => $result['NextContinuationToken'] ?? null,
            ]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/files/url  { key, expires? }
    public function url(Request $request)
    {
        $data = $request->validate([
            'key'     => 'required|string',
            'expires' => 'sometimes|integer|min:60|max:604800',
        ]);
        $expires = $data['expires'] ?? 600;

        try {
            $cmd  = $this->s3()->getCommand('GetObject', [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $data['key'],
            ]);
            $req  = $this->s3()->createPresignedRequest($cmd, "+{$expires} seconds");
            $url  = (string) $req->getUri();

            return response()->json(['ok' => true, 'url' => $url]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // GET /api/files/download?key=...&expires=600  (302 redirect to presigned)
    public function download(Request $request)
    {
        $request->validate([
            'key'     => 'required|string',
            'expires' => 'sometimes|integer|min:60|max:604800',
        ]);
        $key     = $request->query('key');
        $expires = (int) $request->query('expires', 600);

        try {
            $cmd = $this->s3()->getCommand('GetObject', [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $key,
            ]);
            $req = $this->s3()->createPresignedRequest($cmd, "+{$expires} seconds");
            return redirect()->away((string) $req->getUri(), 302);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/files/rename  { fromKey, toKey }
    public function rename(Request $request)
    {
        $data = $request->validate([
            'fromKey' => 'required|string',
            'toKey'   => 'required|string',
        ]);

        $s3 = $this->s3();
        try {
            // Copy
            $s3->copyObject([
                'Bucket'     => config('filesystems.disks.s3.bucket'),
                'Key'        => $data['toKey'],
                'CopySource' => config('filesystems.disks.s3.bucket') . '/' . $data['fromKey'],
                'MetadataDirective' => 'COPY',
            ]);

            // Delete old
            $s3->deleteObject([
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $data['fromKey'],
            ]);

            return response()->json(['ok' => true]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // DELETE /api/files?key=...
    public function destroy(Request $request)
    {
        $key = $request->query('key');
        if (!$key) {
            return response()->json(['ok' => false, 'error' => 'key required'], 422);
        }

        try {
            $this->s3()->deleteObject([
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $key,
            ]);

            return response()->json(['ok' => true]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/files/share  { key, expires?, downloadName? }
    public function share(Request $request)
    {
        $data = $request->validate([
            'key'          => 'required|string',
            'expires'      => 'sometimes|integer|min:60|max:604800',
            'downloadName' => 'sometimes|string',
        ]);
        $expires = $data['expires'] ?? 3600;

        $disposition = isset($data['downloadName'])
            ? 'attachment; filename="' . addslashes($data['downloadName']) . '"'
            : 'attachment';

        try {
            $cmd = $this->s3()->getCommand('GetObject', [
                'Bucket' => config('filesystems.disks.s3.bucket'),
                'Key'    => $data['key'],
                'ResponseContentDisposition' => $disposition,
            ]);
            $req = $this->s3()->createPresignedRequest($cmd, "+{$expires} seconds");
            return response()->json(['ok' => true, 'url' => (string) $req->getUri()]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }
}
