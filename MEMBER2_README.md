# Member 2 - News Article Management + Customer Home

## Pham vi
- Staff: /staff/news - hien danh sach, tim kiem, loc danh muc, them/sua trong Modal, xoa co confirm.
- Customer: / - chi bai NewsStatus=1, Category.IsActive=1; /news/:id de doc chi tiet.
- BE: API News Article, dung cac entity NewsArticle, Category, Tag, SystemAccount hien co.

## Cach chay
1. Khoi dong SQL Server; tao database voi script `database/FUNMS-Query.sql` **CHI tren database demo moi**. Script XOA database cu neu da co!
2. Cap nhat `funms-api-manage/funms-manage-api/src/main/resources/application.properties`: username/password SQL Server cua ban (hoac dung env theo cau hinh sau khi team thong nhat).
3. Backend: mo `funms-api-manage/funms-manage-api`, chay `mvnw.cmd spring-boot:run` tren Windows (hoac `./mvnw spring-boot:run` tren Linux/macOS). Java 21, SQL Server port 1433.
4. Frontend: mo `funms-frontend/fu-news-management`; `npm install` -> `npm run dev`; truy cap http://localhost:5173.
5. Swagger: http://localhost:8080/swagger-ui/index.html.

## API
- GET /api/v1/news?keyword=&categoryId= : Staff liet ke ca active va inactive
- GET /api/v1/news/{id} : Staff lay chi tiet
- POST /api/v1/news : them (201)
- PUT /api/v1/news/{id} : sua
- DELETE /api/v1/news/{id} : xoa (204)
- GET /api/v1/news/public : Customer chi xem active
- GET /api/v1/news/public/{id} : Customer xem chi tiet active
- GET /api/v1/news/categories, /authors, /tags : du lieu dropdown

Body mau:
```json
{"newsTitle":"Thong bao moi","headline":"Tom tat thong bao","newsContent":"Noi dung bai viet","newsSource":"Phong dao tao","categoryId":1,"createdById":2,"newsStatus":true,"tagIds":[1,2]}
```
`createdById` hien tai la ID Staff (AccountRole=2) duoc chon tu dropdown. Khi sua, truong nay dai dien Staff dang sua, khong thay doi createdBy cu.

## Quan trong truoc khi deploy
- DAY CHI LA DEMO CHUA CO XAC THUC / PHAN QUYEN. Cac endpoint staff POST/PUT/DELETE KHONG duoc bao ve. KHONG deploy cong khai truoc khi Member Login thuc hien Spring Security (session/JWT), phan quyen Staff/Admin, va lay ID nhan vien tu dang nhap (khong nhan `createdById` tuy y tu client).
- React routes la routes demo; neu thanh vien khac lam layout/login thi ghep 3 routes vao router chung, KHONG thay the App cua ho.
- API hien loc Java cho don gian; khi dataset lon, chuyen sang JPQL + Pageable.
- Khong bao gom upload anh, rich-text editor, approval workflow, analytics (de bai khong bat buoc).
- Can test voi SQL Server thuc te sau khi cau hinh database.
