import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy số lượng giỏ hàng
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Kiểm tra trạng thái đăng nhập khi chuyển trang
  const isLoggedIn = Boolean(
    localStorage.getItem("accessToken")
  );

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");

    dispatch(clearCart());

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">

        <Link to="/" className="header-logo">
          CyberSoft Shop
        </Link>

        <nav className="header-nav">
          <Link to="/">Home</Link>

          <Link to="/search">Search</Link>

          <Link to="/carts">
            Carts ({cartCount})
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
