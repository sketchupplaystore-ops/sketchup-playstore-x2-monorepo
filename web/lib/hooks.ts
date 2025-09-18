import { useQuery } from "@tanstack/react-query";
import { Milestones, type _FileRecord } from "@/lib/api";

/**
 * Custom hook to fetch milestone files
 * 
 * @param milestoneId - The milestone ID to fetch files for
 * @returns Query result with files data, loading state, and error state
 */
export function useMilestoneFiles(milestoneId: number | string | null | undefined) {
  return useQuery({
    queryKey: ["milestoneFiles", milestoneId],
    queryFn: () => (milestoneId ? Milestones.listFiles(milestoneId) : Promise.resolve([])),
    enabled: !!milestoneId,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Helper function to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

/**
 * Helper function to determine file type from content type
 */
export function getFileType(contentType: string): string {
  if (contentType.includes('image')) return 'image';
  if (contentType.includes('pdf')) return 'pdf';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'excel';
  if (contentType.includes('video')) return 'video';
  if (contentType.includes('sketchup') || contentType.includes('skp')) return 'sketchup';
  return 'document';
}
