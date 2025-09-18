// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

// Types (adjust to your actual API shapes)
export type Project = {
  id: number;
  title: string;
  client_name?: string;
  budget?: number;
  status?: string;
  files?: ProjectFile[];
  milestones?: Milestone[];
  progress?: number;
  due_date?: string;
  // ...add fields you return
};

export type ProjectFile = {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
  phase?: string;
};

export type _FileRecord = {
  id: number;
  milestone_id: number;
  name: string;
  content_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
};

export type CreateUploadInput = {
  filename: string;
  contentType: string;
  size: number;
};

export type UploadUrlResponse = {
  uploadUrl: string;
  fileId: number;
};

export type Milestone = {
  id: number;
  name: string;
  status: string;
  completed: boolean;
};

export type Message = {
  id: number;
  project_id: number;
  sender_id: number;
  sender_name: string;
  sender_type: string;
  text: string;
  created_at: string;
  status?: string;
  mentions?: string[];
};

export type CreateProjectInput = {
  title: string;
  client_name?: string;
  budget?: number;
  // ...other fields from your form
};

export type CreateMessageInput = {
  project_id: number;
  text: string;
};

// Milestones object with file upload helpers
export const Milestones = {
  // Milestone status actions
  claim: (id: number | string) =>
    http(`/api/milestones/${id}/claim`, { method: "PATCH" }),
  deliver: (id: number | string, payload?: unknown) =>
    http(`/api/milestones/${id}/deliver`, {
      method: "PATCH",
      body: payload ? JSON.stringify(payload) : undefined,
    }),
  approve: (id: number | string) =>
    http(`/api/milestones/${id}/approve`, { method: "PATCH" }),
  requestRevision: (id: number | string, notes?: string) =>
    http(`/api/milestones/${id}/revision`, {
      method: "PATCH",
      body: notes ? JSON.stringify({ notes }) : undefined,
    }),
  reopen: (id: number | string) =>
    http(`/api/milestones/${id}/reopen`, { method: "PATCH" }),
    
  // File management
  listFiles: (milestoneId: number | string) => 
    http<_FileRecord[]>(`/api/milestones/${milestoneId}/files`),
  
  deleteFile: (milestoneId: number | string, fileId: number | string) =>
    http<void>(`/api/milestones/${milestoneId}/files/${fileId}`, { method: "DELETE" }),
  
  createUpload: (milestoneId: number | string, input: CreateUploadInput) =>
    http<UploadUrlResponse>(`/api/milestones/${milestoneId}/files`, { 
      method: "POST", 
      body: JSON.stringify(input) 
    }),
  
  completeUpload: (milestoneId: number | string, fileId: number | string) =>
    http<_FileRecord>(`/api/milestones/${milestoneId}/files/${fileId}/complete`, { method: "POST" }),
};

export const api = {
  // Projects
  listProjects: () => http<Project[]>("/api/projects"),
  listByClient: () => http<Project[]>("/api/projects/client"),
  getProject: (id: number | string) => http<Project>(`/api/projects/${id}`),
  createProject: (input: CreateProjectInput) =>
    http<Project>("/api/projects", { method: "POST", body: JSON.stringify(input) }),
    
  // Messages
  listMessages: (projectId: number | string) => 
    http<Message[]>(`/api/projects/${projectId}/messages`),
  createMessage: (input: CreateMessageInput) =>
    http<Message>("/api/messages", { method: "POST", body: JSON.stringify(input) }),

  // Milestones actions (legacy - use Milestones object instead)
  claimMilestone: (id: number | string) => Milestones.claim(id),
  deliverMilestone: (id: number | string, payload?: unknown) => Milestones.deliver(id, payload),
  approveMilestone: (id: number | string) => Milestones.approve(id),
  requestRevision: (id: number | string, notes?: string) => Milestones.requestRevision(id, notes),
  reopenMilestone: (id: number | string) => Milestones.reopen(id),
};
