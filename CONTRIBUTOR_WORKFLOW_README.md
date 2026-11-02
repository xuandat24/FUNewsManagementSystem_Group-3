# Contributor / Author workflow - Actor 1

## Based on the existing project
- Backend: Spring Boot / SQL Server, existing JWT `AuthInterceptor` and `@RequireRole`.
- Frontend: React + React Bootstrap, existing login and `localStorage` JWT.
- Current database roles: **Admin = 1**, **Staff = 2**. This feature treats **Staff as Contributor** (no new role).
- Full Editor approval/publish flow is **not** included; Admin (role 1) has one minimal "request changes" API to complete the Contributor exercise.

## Workflow
`DRAFT -> PENDING_REVIEW -> CHANGES_REQUESTED -> PENDING_REVIEW`

1. Contributor (role 2) signs in and opens **Bài viết của tôi** at `/contributor/my-articles`.
2. **Tạo bản nháp**: title required; other fields can be completed later. New article is `DRAFT` and `NewsStatus=false`.
3. **Sửa**: allowed only on articles owned by the current account in `DRAFT` or `CHANGES_REQUESTED`.
4. **Submit for Review**: requires headline, content, and active category. Status becomes `PENDING_REVIEW` and editing is locked at the API level.
5. Admin/Editor (role 1) can use Swagger to send **request-changes** feedback for a pending article.
6. Contributor sees the feedback and status `CHANGES_REQUESTED`, edits, then presses **Revise & Resubmit**. The old feedback is cleared on resubmission.
7. Contributor cannot change workflow state or publish through the request JSON or old CRUD endpoints.

Legacy articles retain status `PUBLISHED`. Customer public APIs only return articles with `NewsStatus=true`, active category **and** `WorkflowStatus=PUBLISHED` (null is also treated as published for pre-migration legacy data).

## Update SQL Server safely
Use **database/ContributorWorkflowMigration.sql** on your *existing* `FUNMS_Group3` database.
It only adds `WorkflowStatus` and `ReviewFeedback` if absent, then sets existing NULL statuses to `PUBLISHED`.

**Do not rerun** `database/FUNMS-Query.sql` on a database with valuable data: that bootstrap script drops the entire database.

`spring.jpa.hibernate.ddl-auto=update` may add the columns on startup in development, but the migration gives old records their explicit `PUBLISHED` value.

## Endpoints

| Method | URL | Role | Purpose |
|---|---|---|---|
| GET | `/api/v1/contributor/articles` | 2 | My Articles only |
| GET | `/api/v1/contributor/articles/{id}` | 2 | Own detail |
| POST | `/api/v1/contributor/articles` | 2 | Create DRAFT |
| PUT | `/api/v1/contributor/articles/{id}` | 2 | Update own editable article |
| POST | `/api/v1/contributor/articles/{id}/submit` | 2 | Submit / Resubmit |
| POST | `/api/v1/editor/articles/{id}/request-changes` | 1 | Minimal Editor feedback |

The old `/api/v1/news` staff list/detail and CRUD write endpoints are now **Admin-only**. Existing public GET and dropdown category/tag endpoints remain available.

**Draft JSON** (author ID and status are NOT accepted from client):
```json
{
  "newsTitle": "Thông báo lịch học mới",
  "headline": "Lịch học tháng 11",
  "newsContent": "Nội dung đầy đủ ...",
  "newsSource": "Phòng Đào tạo",
  "categoryId": 1,
  "tagIds": [1, 2]
}
```

**Editor feedback JSON**:
```json
{ "feedback": "Bổ sung nguồn thông tin và kiểm tra ngày tháng." }
```

Test in Swagger: `http://localhost:8080/swagger-ui/index.html`. Sign in at `POST /api/v1/auth/login` and send JWT as `Authorization: Bearer <token>` when testing protected APIs.

## Manual checks
1. Staff A creates a draft. It is visible in Staff A's list but not on public home page.
2. Staff B cannot read/update/submit Staff A's article (404).
3. A draft with only a title saves; submitting it reports missing content/category.
4. Submitting a complete draft moves to `PENDING_REVIEW`; trying to PUT it returns an error.
5. Using the old POST/PUT `/api/v1/news` with a Staff token returns 403; no self-publish.
6. Admin sends feedback through request-changes; Staff A sees `CHANGES_REQUESTED` plus message.
7. Staff A edits then resubmits; new status is `PENDING_REVIEW` and feedback is cleared.
8. Old published articles still appear on public home; pending/draft/changes requested do not.

## Commands
Backend (from `funms-api-manage/funms-manage-api`): `mvnw.cmd spring-boot:run`

Frontend (from `funms-frontend/fu-news-management`): `npm install`, then `npm run dev`

Remember to configure a valid SQL Server connection. The initial SQL bootstrap contains demo credentials; this feature does not modify authentication password handling.
