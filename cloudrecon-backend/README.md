# CloudRecon AI backend (Java 25, Spring Boot 3.5)

REST API for the CloudRecon React frontend: JWT login, image upload, cloud removal jobs, results, history and dashboard stats.

## Run
```
mvn spring-boot:run          # http://localhost:8080
```
Requires JDK 25 and Maven (or copy `mvnw`, `mvnw.cmd` and `.mvn` from another project and use `.\mvnw.cmd`).
Then start the frontend: `npm install && npm run dev` (http://localhost:5173).

Demo user (created on first start): `researcher@cloudrecon.ai` / `demo123`.

## Endpoints (all except /auth need `Authorization: Bearer <token>`)
| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/login | `{email,password}` → `{token,email,name}` |
| POST | /api/auth/register | `{name,email,password}` |
| POST | /api/images/upload | multipart `file` → job |
| POST | /api/analysis/start | `{imageId}` → starts processing |
| GET | /api/analysis/{id} | status and stage (1 to 4) |
| GET | /api/results/{id} | metrics |
| GET | /api/results/{id}/{input\|mask\|output} | PNG (accepts `?token=`) |
| GET | /api/results/{id}/download | reconstructed PNG as attachment |
| GET | /api/history | the user's jobs |
