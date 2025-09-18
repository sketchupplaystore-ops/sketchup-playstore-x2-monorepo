import { test, expect } from "@playwright/test";

test.describe("SketchUp Playstore E2E flow", () => {
  test("Admin creates project → Designer claims → Client views → Free downloads page", async ({ page }) => {
    // 1. Admin Dashboard
    await page.goto("http://localhost:3000/admin");
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();

    // Post a new project
    await page.getByRole("button", { name: "Post Project" }).click();
    await page.fill('input[name="title"]', "E2E Test Project");
    await page.fill('input[name="client"]', "Test Client");
    await page.fill('input[name="dueDate"]', "2025-12-31");
    await page.getByRole("button", { name: "Create" }).click();

    // Verify project shows up
    await expect(page.getByText("E2E Test Project")).toBeVisible();

    // 2. Designer Dashboard
    await page.goto("http://localhost:3000/designer");
    await expect(page.getByRole("heading", { name: "Designer Dashboard" })).toBeVisible();

    // Claim project
    await page.getByText("E2E Test Project").click();
    await page.getByRole("button", { name: "Claim Project" }).click();

    // Check active projects
    await expect(page.getByText("My Active Projects")).toBeVisible();
    await expect(page.getByText("E2E Test Project")).toBeVisible();

    // 3. Client Dashboard
    await page.goto("http://localhost:3000/client");
    await expect(page.getByRole("heading", { name: "Client Dashboard" })).toBeVisible();

    // Verify client sees project
    await expect(page.getByText("E2E Test Project")).toBeVisible();

    // 4. Free Downloads page
    await page.goto("http://localhost:3000/free-downloads");
    await expect(page.getByRole("heading", { name: /Download free/i })).toBeVisible();

    // Categories load
    await expect(page.getByText("Hardscape")).toBeVisible();
    await expect(page.getByText("Outdoor Furniture")).toBeVisible();
    await expect(page.getByText("Plants & Shrubs")).toBeVisible();
    await expect(page.getByText("Textures")).toBeVisible();
  });
});
