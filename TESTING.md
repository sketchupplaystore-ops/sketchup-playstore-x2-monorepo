# SketchUp Playstore Testing Guide

This document provides a checklist for verifying key functionality in the SketchUp Playstore application.

## Core Workflow Verification

### Admin Dashboard
- [ ] Admin can create a new project
  - Fill out the project form with name, client, budget
  - Click "Post Project"
  - Verify the project appears in the "All Projects" list after refresh
  - Verify project details are correct

### Designer Dashboard
- [ ] Designer can see available projects
  - Navigate to the Designer dashboard
  - Verify newly created projects appear in "Available Projects" section
  - Check that project details match what was created

- [ ] Designer can claim milestones
  - Find a project in "Available Projects"
  - Click "Select Project" on a milestone (Archicad, SketchUp, or Rendering)
  - Verify the project moves to "My Active Projects" section
  - Verify the claimed milestone is now assigned to the designer

### File Upload & Management
- [ ] Designer can upload files to a milestone
  - Navigate to a claimed project in "My Active Projects"
  - Drag & drop a file or click to browse in the appropriate milestone section
  - Verify upload progress is displayed during upload
  - Verify the file appears in the list after upload completes
  - Verify file name and size are displayed correctly

- [ ] File links work correctly
  - Click the download button next to an uploaded file
  - Verify the file opens/downloads from the Wasabi URL
  - Verify the content is correct

- [ ] File deletion works
  - Click the delete button for an uploaded file
  - Confirm the deletion
  - Verify the file is removed from the list
  - Verify the UI returns to the upload state

### Client Dashboard
- [ ] Client can see their projects
  - Log in as a client
  - Verify all projects for this client are displayed
  - Verify project details are correct

- [ ] Progress indicators update correctly
  - Check that project progress bars reflect the percentage of completed milestones
  - When a designer marks a milestone as complete, verify the progress updates

- [ ] Client can view uploaded files
  - Navigate to a project with uploaded files
  - Verify files are displayed with correct names and sizes
  - Verify preview images are displayed for image files
  - Verify file download links work correctly

### Free Downloads Page
- [ ] Categories load from external source
  - Navigate to the Free Downloads page
  - Verify categories (Hardscape, Outdoor Furniture, Plants, etc.) load from www.sketchupplaystore.com
  - Verify category images display correctly

- [ ] Model links work correctly
  - Click on a category
  - Verify it links to the correct URL at www.sketchupplaystore.com/models/[slug]
  - Verify the linked page loads properly

## API Integration Tests
- [ ] API endpoints respond with correct data
  - Projects.list() returns all projects
  - Projects.listByClient() returns only client's projects
  - Milestones.listFiles() returns files for a specific milestone
  - File uploads complete all three steps (createUpload, putPresigned, completeUpload)

## Cross-Browser Testing
- [ ] Verify core functionality in:
  - Chrome
  - Firefox
  - Safari
  - Edge

## Notes
- For file uploads, test with various file types and sizes
- Verify error states are handled gracefully (network errors, invalid files)
- Check that React Query invalidation works properly after mutations
