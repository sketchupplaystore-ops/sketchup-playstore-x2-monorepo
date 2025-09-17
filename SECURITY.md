# Security Policy

- Never commit secrets. Use `.env` and GitHub Actions secrets.
- Rotate Wasabi and DB credentials every 90 days.
- CORS: only `https://web.sketchupplaystore.com`.
- Rate limit auth and upload endpoints.
- Validate file types server‑side. Use presigned URLs for uploads.
- Report vulnerabilities privately to the owner.
