# Hướng dẫn chạy bằng Docker

Tài liệu này mô tả cách chạy dự án **team8-wareflow** (Spring Boot backend + React/Vite frontend + MySQL) bằng Docker Compose.

---

## 1. Yêu cầu trước khi bắt đầu

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Docker Desktop | 26.0+ | Bắt buộc — bao gồm Docker Engine + Compose v2 |
| Docker Compose | v2 (`docker compose`, không phải `docker-compose`) | Kiểm tra bằng `docker compose version` |
| RAM khả dụng | tối thiểu 4GB | Backend build Gradle + frontend build Vite |
| Ổ đĩa | ~3GB | 2 image (~480MB) + dependency cache |

Kiểm tra môi trường:

```bash
docker --version
docker compose version
```

> **Lưu ý:** dự án chạy 3 container với các cổng `5173` (web), `8081` (API), `3307` (MySQL). Hãy chắc chắn các cổng này còn trống trước khi bắt đầu.

---

## 2. Cấu trúc thư mục liên quan

```
team8-wareflow/
├── docker-compose.yml          # Định nghĩa 3 service: db, backend, frontend
├── backend/
│   ├── Dockerfile              # Multi-stage: JDK 21 build -> JRE 21 runtime
│   ├── .dockerignore
│   ├── build.gradle
│   └── src/
└── frontend/
    ├── Dockerfile              # Multi-stage: Node 22 build -> Nginx runtime
    ├── .dockerignore
    ├── nginx.conf              # Nginx serve static + proxy /api -> backend:8081
    └── src/
```

---

## 3. Chạy lần đầu

### Bước 1 — Clone repo

```bash
git clone https://github.com/WallkerTan/team8-wareflow.git
cd team8-wareflow
git checkout dev
```

### Bước 2 — Build image + khởi động

```bash
docker compose up -d --build
```

Lần build đầu tiên sẽ mất **khoảng 4–6 phút** vì phải tải base image (~380MB) và cài dependency Maven/Gradle + npm. Các lần sau nhanh hơn nhiều nhờ Docker cache.

### Bước 3 — Theo dõi trạng thái

```bash
docker compose ps
```

Kết quả mong đợi (cả 3 đều `healthy`):

```
NAME                IMAGE                        STATUS                   PORTS
wareflow-backend    team8-wareflow-backend       Up (healthy)            0.0.0.0:8081->8081/tcp
wareflow-db         mysql:8.4                    Up (healthy)            0.0.0.0:3307->3306/tcp
wareflow-frontend   team8-wareflow-frontend      Up (healthy)            0.0.0.0:5173->80/tcp
```

### Bước 4 — Xem log

```bash
# Log tất cả service
docker compose logs -f

# Log riêng backend
docker compose logs -f backend

# 30 dòng gần nhất của backend
docker compose logs backend --tail 30
```

### Bước 5 — Kiểm tra hoạt động

```bash
# Frontend trả về HTTP 200
curl -I http://localhost:5173/

# Health check backend
curl http://localhost:8081/actuator/health
# -> {"status":"UP"}

# Đăng nhập qua nginx proxy
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wareflow.com","password":"Admin@123"}'
```

---

## 4. Truy cập

| Dịch vụ | Địa chỉ | Thông tin đăng nhập |
|---|---|---|
| **Web (frontend)** | http://localhost:5173 | — |
| **API (trực tiếp)** | http://localhost:8081 | — |
| **API (qua proxy)** | http://localhost:5173/api | — |
| **MySQL** | localhost:3307 | user `root` / pass `30063008` / db `wareflow` |

### Tài khoản seed sẵn

| Email | Mật khẩu | Vai trò |
|---|---|---|
| `admin@wareflow.com` | `Admin@123` | ADMIN |
| `owner@wareflow.com` | `Owner@123` | WAREHOUSE_OWNER |

---

## 5. Các lệnh quản lý thường dùng

### Xem trạng thái & log

```bash
docker compose ps                    # trạng thái container
docker compose logs -f               # log realtime
docker compose logs backend --tail 50
```

### Dừng / khởi động lại

```bash
docker compose stop                 # dừng, giữ container
docker compose start                # khởi động lại container đã dừng
docker compose restart              # restart tất cả
docker compose down                 # xoá container + network (GIỮ volume DB)
docker compose down -v              # xoá cả volume DB -> reset dữ liệu hoàn toàn
```

### Build lại sau khi sửa code

```bash
# Chỉ rebuild backend
docker compose build backend
docker compose up -d backend

# Chỉ rebuild frontend
docker compose build frontend
docker compose up -d frontend

# Rebuild tất cả
docker compose up -d --build
```

### Xem log MySQL

```bash
docker compose logs -f db
```

### Truy cập shell vào container

```bash
docker compose exec backend sh        # shell backend
docker compose exec db mysql -uroot -p30063008 wareflow
```

### Liệt kê image đã build

```bash
docker images --filter "reference=team8-wareflow*"
```

### Dọn dẹp (cẩn thận — xoá image dangling)

```bash
docker image prune -f
docker compose down --rmi local     # xoá image build local
```

---

## 6. Truy cập MySQL từ máy local

### Dùng MySQL Workbench / DBeaver / DataGrip

| Trường | Giá trị |
|---|---|
| Host | `localhost` |
| Port | `3307` |
| User | `root` |
| Password | `30063008` |
| Database | `wareflow` |

### Dùng dòng lệnh

```bash
docker compose exec db mysql -uroot -p30063008 wareflow
```

### Xem danh sách bảng

```bash
docker compose exec -T db mysql -uroot -p30063008 -e "USE wareflow; SHOW TABLES;"
```

Kết quả:

```
categories
issue_items
issues
products
receipt_items
receipts
shipment_logs
shipments
suppliers
users
```

---

## 7. Cấu hình qua biến môi trường

Tất cả biến dưới đây đều có **giá trị mặc định** trong `docker-compose.yml`. Muốn ghi đè, tạo file `.env` ở thư mục gốc:

```env
DB_PASSWORD=30063008
JWT_SECRET=doi-chuoi-nay-ne-toi-thieu-256-bit
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SEED_ENABLED=true
SEED_ADMIN_EMAIL=admin@wareflow.com
SEED_ADMIN_PASSWORD=Admin@123
SEED_OWNER_EMAIL=owner@wareflow.com
SEED_OWNER_PASSWORD=Owner@123
```

> ⚠️ **Cảnh báo:** `JWT_SECRET` mặc định chỉ dùng cho môi trường dev. Khi triển khai production **bắt buộc** phải đổi thành chuỗi ngẫu nhiên dài và không commit file `.env` lên git.

---

## 8. Kiểm tra & xử lý sự cố

### Container không lên hoặc báo `unhealthy`

```bash
docker compose ps
docker compose logs backend --tail 50
```

### Xem chi tiết healthcheck

```bash
docker inspect wareflow-backend --format '{{json .State.Health}}'
docker inspect wareflow-frontend --format '{{json .State.Health}}'
```

### Lỗi "ports are not available"

Cổng đã bị tiến trình khác chiếm. Trên Windows, kiểm tra:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen
```

Đổi cổng trong `docker-compose.yml` (nhớ sửa cả `CORS_ALLOWED_ORIGINS` cho khớp):

```yaml
ports:
  - "3000:80"     # frontend
```

### Lỗi kết nối database

```bash
# DB chưa sẵn sàng
docker compose logs db --tail 30

# Restart backend sau khi DB healthy
docker compose restart backend
```

### Xoá sạch và build lại từ đầu

```bash
docker compose down -v --rmi local
docker compose up -d --build
```

### Reset database (giữ image)

```bash
docker compose down -v
docker compose up -d
```

---

## 9. Ghi chú về kiến trúc

### Multi-stage build

Cả 2 `Dockerfile` đều dùng multi-stage build để image cuối cùng chỉ chứa runtime cần thiết:

- **Backend**: `eclipse-temurin:21-jdk` (build) → `eclipse-temurin:21-jre-alpine` (runtime, chạy bằng user non-root `spring`)
- **Frontend**: `node:22-alpine` (build Vite) → `nginx:1.27-alpine` (runtime, serve static)

### Nginx reverse proxy

File `frontend/nginx.conf` làm 3 việc:

1. Serve static assets từ `/usr/share/nginx/html`
2. Cache dài hạn (1 năm) cho `/assets/` vì tên file có hash
3. Proxy `/api/` → `http://backend:8081` (service name trong Docker network), nên frontend gọi API qua cùng origin `/api` — không bị vấn đề CORS khi dùng web

### Thứ tự khởi động

`depends_on` với điều kiện `service_healthy` đảm bảo:

```
db (healthy)  →  backend (healthy)  →  frontend
```

### Healthcheck

| Service | Lệnh kiểm tra | Ghi chú |
|---|---|---|
| db | `mysqladmin ping` | — |
| backend | `wget http://127.0.0.1:8081/actuator/health` | Cần `spring-boot-starter-actuator`; endpoint này được `permitAll` trong `SecurityConfiguration` |
| frontend | `wget http://127.0.0.1/` | Dùng `127.0.0.1` thay vì `localhost` để tránh `wget` resolve ra IPv6 `[::1]` — nginx mặc định chỉ listen IPv4 |

---

## 10. Chạy song song với dev mode

Bạn có thể chạy frontend bằng Vite dev server (`npm run dev`, cổng 5173) và backend bằng Gradle (`./gradlew bootRun`, cổng 8081) mà **không cần** chạy Docker cho 2 service đó. Khi đó chỉ cần:

```bash
docker compose up -d db          # chỉ chạy MySQL
```

Lúc này backend chạy local sẽ kết nối vào MySQL qua `localhost:3307`.

### Profile `local` (khuyến nghị)

Repo có sẵn `backend/src/main/resources/application-local.properties` với các giá trị mặc định cho môi trường local:

| Setting | Mặc định (profile `local`) |
|---|---|
| `spring.datasource.url` | `jdbc:mysql://localhost:3307/wareflow` (MySQL trong Docker) |
| `app.cors.allowed-origins` | `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:4173` |

Chạy backend với profile này:

```bash
# macOS / Linux
./gradlew bootRun --args='--spring.profiles.active=local'

# Windows
.\gradlew.bat bootRun --args='--spring.profiles.active=local'
```

Trong IntelliJ IDEA: **Run → Edit Configurations → + → Spring Boot** →

- Main class: `com.example.backend.BackendApplication`
- Active profiles: `local`
- (nếu `JAVA_HOME` trỏ tới JDK 21 không tồn tại, sửa SDK trong **Project Structure → Project SDK**)

> **Lưu ý:** nếu bạn đã cài MySQL local ở cổng 3306 và muốn dùng nó, đừng bật profile `local` — hãy để `application.properties` mặc định (đang trỏ `localhost:3306`) hoặc override qua biến môi trường `DB_URL`.

### Xung đột cổng khi chạy Docker + dev mode cùng lúc

Nếu bạn vừa `docker compose up -d` vừa chạy backend bằng Gradle/IntelliJ, sẽ gặp:

```
Web server failed to start. Port 8081 was already in use.
```

**Nguyên nhân:** container `wareflow-backend` publish cổng `8081` ra host, nên tiến trình local không bind được.

Cách xử lý — dừng container backend/frontend, giữ lại MySQL:

```bash
docker compose stop backend frontend
docker compose ps          # chỉ còn wareflow-db
```

Hoặc đổi cổng publish của container trong `docker-compose.yml`:

```yaml
ports:
  - "8082:8081"    # container vẫn chạy ở 8081 bên trong
```

Sau khi dừng container, kiểm tra cổng đã free:

```powershell
Get-NetTCPConnection -LocalPort 8081 -State Listen
```

---

## 11. Workflow Git sau khi thêm Docker

Các file Docker đã được commit. Nếu bạn thay đổi thêm:

```bash
git add docker-compose.yml \
        backend/Dockerfile backend/.dockerignore \
        frontend/Dockerfile frontend/.dockerignore frontend/nginx.conf \
        backend/src/main/resources/application-local.properties

git commit -m "chore: update Docker setup"
git push origin <ten-branch>
```

> Nhớ thêm `.env` vào `.gitignore` để không lộ secret.
