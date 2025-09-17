const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://s3.us-central-1.wasabisys.com/www-sketchupplaystore"

export function getCdnUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${CDN_BASE_URL}/${cleanPath}`
}

export function getModelThumbnailUrl(modelId: string, filename?: string): string {
  const thumbnailName = filename || `${modelId}-thumb.jpg`
  return getCdnUrl(`models/thumbnails/${thumbnailName}`)
}

export function getModelDownloadUrl(modelId: string, filename: string): string {
  return getCdnUrl(`models/files/${modelId}/${filename}`)
}

export { CDN_BASE_URL }
