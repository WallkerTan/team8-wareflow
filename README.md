# team8-wareflow

Hệ thống quản lý kho hàng (warehouse management) - Spring Boot backend + React/Vite frontend + MySQL 8.

## Tài liệu

| File | Nội dung |
|---|---|
| [DOCKER.md](./DOCKER.md) | Hướng dẫn chạy bằng Docker Compose (build, run, xử lý sự cố) |
| [docs/CI_CD.md](./docs/CI_CD.md) | Hướng dẫn quy trình CI/CD GitHub Actions & triển khai GHCR |
| [.github/followGit/dowload.md](./.github/followGit/dowload.md) | Quy trình clone / push / pull Git |
| [docs/project/task.md](./docs/project/task.md) | Phân công nhiệm vụ |

## Chạy nhanh bằng Docker

```bash
docker compose up -d --build
docker compose ps
```

- Web: http://localhost:5173
- API: http://localhost:8081
- MySQL: `localhost:3307` - root / `30063008` - db `wareflow`

Tài khoản seed sẵn: `admin@wareflow.com` / `Admin@123` (ADMIN) - `owner@wareflow.com` / `Owner@123` (WAREHOUSE_OWNER)

Chi tiết đầy đủ xem [DOCKER.md](./DOCKER.md).
