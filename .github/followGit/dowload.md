1. Lần đầu clone project về máy
git clone https://github.com/WallkerTan/team8-wareflow.git

cd team8-wareflow
git checkout dev
git checkout -b (tan,linh,trang,nguyen)

cd frontend
npm install
npm run dev

cd backend
.\gradlew build


mỗi ngày đều đẩy code lên git (cách push)
    git status
    git branch
    git add .
    git commit -m "21-10"

    git push -u origin (tan,linh,trang,nguyen) -> dành cho lần đầu tiên push
    git push origin (tan,linh,trang,nguyen)

sáng lấy code mới từ git về (cách pull)
    git status
    git fetch origin
    git merge origin/dev