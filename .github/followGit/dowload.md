
-- chỉ dùng cho lần đầu tiên clone prj về máy
git clone https://github.com/WallkerTan/team8-wareflow.git
cd team8-wareflow
git checkout dev
git checkout -b ten-nhanh-cua-minh   # chỗ này là mng tạo nhánh của mình , ví dụ: git checkout -b (tan,linh,nguyen,trang)

cd frontend
npm install
npm run dev

cd backend
.\gradlew build