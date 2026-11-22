
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Kiểm tra người dùng đã đăng nhập chưa
  const token = localStorage.getItem("accessToken");

  // Chưa đăng nhập thì chuyển về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập thì cho phép truy cập
  return <Outlet />;
}

export default ProtectedRoute;
