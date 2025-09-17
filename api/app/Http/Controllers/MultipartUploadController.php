<?php

namespace App\Http\Controllers;

use Aws\Exception\AwsException;
use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MultipartUploadController extends Controller
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

    // POST /api/uploads/create  { key?, contentType?, size? }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'key'         => 'sometimes|string',
            'contentType' => 'nullable|string',
            'size'        => 'nullable|integer|max:10737418240', // 10 GB
        ]);

        $allowed = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/octet-stream', // sketchup often octet-stream
        ];
        if (isset($validated['contentType']) && !in_array($validated['contentType'], $allowed, true)) {
            return response()->json(['ok' => false, 'error' => 'Unsupported content type'], 415);
        }

        $key         = $validated['key'] ?? ('uploads/' . Str::uuid()->toString());
        $contentType = $validated['contentType'] ?? 'application/octet-stream';

        try {
            $res = $this->s3()->createMultipartUpload([
                'Bucket'      => config('filesystems.disks.s3.bucket'),
                'Key'         => $key,
                'ContentType' => $contentType,
            ]);

            return response()->json([
                'ok'       => true,
                'bucket'   => config('filesystems.disks.s3.bucket'),
                'key'      => $key,
                'uploadId' => $res['UploadId'],
            ]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/uploads/sign-part  { key, uploadId, partNumber }
    public function signPart(Request $request)
    {
        $data = $request->validate([
            'key'        => 'required|string',
            'uploadId'   => 'required|string',
            'partNumber' => 'required|integer|min:1',
        ]);

        try {
            $cmd = $this->s3()->getCommand('UploadPart', [
                'Bucket'     => config('filesystems.disks.s3.bucket'),
                'Key'        => $data['key'],
                'UploadId'   => $data['uploadId'],
                'PartNumber' => $data['partNumber'],
            ]);
            $req = $this->s3()->createPresignedRequest($cmd, '+20 minutes');
            return response()->json(['ok' => true, 'url' => (string) $req->getUri()]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/uploads/complete  { key, uploadId, parts:[{ETag,PartNumber}] }
    public function complete(Request $request)
    {
        $data = $request->validate([
            'key'      => 'required|string',
            'uploadId' => 'required|string',
            'parts'    => 'required|array|min:1',
            'parts.*.ETag'       => 'required|string',
            'parts.*.PartNumber' => 'required|integer|min:1',
        ]);

        try {
            $res = $this->s3()->completeMultipartUpload([
                'Bucket'   => config('filesystems.disks.s3.bucket'),
                'Key'      => $data['key'],
                'UploadId' => $data['uploadId'],
                'MultipartUpload' => [
                    'Parts' => array_map(static fn ($p) => [
                        'ETag'       => $p['ETag'],
                        'PartNumber' => (int) $p['PartNumber'],
                    ], $data['parts']),
                ],
            ]);

            return response()->json([
                'ok'       => true,
                'location' => $res['Location'] ?? null,
                'etag'     => $res['ETag'] ?? null,
            ]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }

    // POST /api/uploads/abort  { key, uploadId }
    public function abort(Request $request)
    {
        $data = $request->validate([
            'key'      => 'required|string',
            'uploadId' => 'required|string',
        ]);

        try {
            $this->s3()->abortMultipartUpload([
                'Bucket'   => config('filesystems.disks.s3.bucket'),
                'Key'      => $data['key'],
                'UploadId' => $data['uploadId'],
            ]);
            return response()->json(['ok' => true]);
        } catch (AwsException $e) {
            return response()->json(['ok' => false, 'error' => $e->getAwsErrorMessage() ?: $e->getMessage()], 500);
        }
    }
}
