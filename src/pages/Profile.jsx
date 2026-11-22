
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import FavoriteList from "../components/FavoriteList";

import {
  getProfile,
  updateProfile,
} from "../redux/slices/profileSlice";

function Profile() {
  const dispatch = useDispatch();

  const { user, loading, updating, error } = useSelector(
    (state) => state.profile
  );

  const token = localStorage.getItem("accessToken");

  const [activeTab, setActiveTab] = useState("orders");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    gender: true,
  });

  // Lấy thông tin tài khoản
  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);

  // Đưa dữ liệu API vào form
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        password: "",
        gender: user.gender ?? true,
      });
    }
  }, [user]);

  // Thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cập nhật thông tin tài khoản
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.email.trim() ||
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const data = {
      email: formData.email.trim(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
    };

    // Chỉ gửi password nếu có nhập
    if (formData.password.trim()) {
      data.password = formData.password;
    }

    try {
      await dispatch(updateProfile(data)).unwrap();

      await dispatch(getProfile()).unwrap();

      setMessage("Cập nhật thành công!");
    } catch (err) {
      setMessage(
        typeof err === "string"
          ? err
          : "Cập nhật thất bại"
      );
    }
  };

  // Chưa đăng nhập thì chuyển về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !user) {
    return (
      <p className="profile-status">
        Đang tải Profile...
      </p>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-status">
        <p>{error}</p>

        <button
          type="button"
          onClick={() => dispatch(getProfile())}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Lịch sử đơn hàng từ API
  const orders = Array.isArray(user.ordersHistory)
    ? user.ordersHistory
    : [];

  return (
    <div className="profile-page">

      {/* ===== TIÊU ĐỀ ===== */}
      <h2 className="profile-title">
        Profile
      </h2>

      {/* ===== THÔNG TIN TÀI KHOẢN ===== */}
      <form
        className="profile-form"
        onSubmit={handleUpdate}
      >

        {/* Avatar */}
        <div className="profile-avatar">
          <img
            src={
              user.avatar ||
              "https://ui-avatars.com/api/?name=User"
            }
            alt="Avatar"
          />
        </div>

        {/* Cột Email và Phone */}
        <div className="profile-fields">

          <div className="profile-field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Cột Name, Password, Gender */}
        <div className="profile-fields">

          <div className="profile-field">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Nhập nếu muốn cập nhật"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="profile-gender">
            <span>Gender</span>

            <label>
              <input
                type="radio"
                name="gender"
                checked={formData.gender === true}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: true,
                  }))
                }
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                checked={formData.gender === false}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: false,
                  }))
                }
              />
              Female
            </label>
          </div>

          {/* Update */}
          <button
            type="submit"
            className="profile-update-btn"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </button>

        </div>

      </form>

      {/* Thông báo cập nhật */}
      {message && (
        <p className="profile-message">
          {message}
        </p>
      )}

      {/* ===== TABS ===== */}
      <div className="profile-tabs">

        <button
          type="button"
          className={
            activeTab === "orders" ? "active" : ""
          }
          onClick={() => setActiveTab("orders")}
        >
          Order history
        </button>

        <button
          type="button"
          className={
            activeTab === "favorites" ? "active" : ""
          }
          onClick={() => setActiveTab("favorites")}
        >
          Favourite
        </button>

      </div>

      {/* ===== ORDER HISTORY ===== */}
      {activeTab === "orders" && (
        <div className="profile-orders">

          {orders.length === 0 ? (
            <p>Chưa có lịch sử đơn hàng.</p>
          ) : (
            orders.map((order, index) => (
              <div
                className="profile-order"
                key={order.id ?? index}
              >

                <p className="order-date">
                  Orders have been placed on{" "}
                  {order.date || ""}
                </p>

                <div className="profile-table-wrapper">
                  <table className="profile-table">

                    <thead>
                      <tr>
                        <th>id</th>
                        <th>img</th>
                        <th>name</th>
                        <th>price</th>
                        <th>quantity</th>
                        <th>total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(order.orderDetail || []).map(
                        (item, i) => (
                          <tr key={i}>

                            <td>
                              {item.id ?? item.productId}
                            </td>

                            <td>
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={
                                    item.name || "Product"
                                  }
                                />
                              )}
                            </td>

                            <td>
                              {item.name || "Product"}
                            </td>

                            <td>
                              {item.price ?? 0}$
                            </td>

                            <td>
                              {item.quantity}
                            </td>

                            <td>
                              {(item.price ?? 0) *
                                (item.quantity ?? 0)}$
                            </td>

                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>

              </div>
            ))
          )}

        </div>
      )}

      {/* ===== FAVOURITE ===== */}
      {activeTab === "favorites" && (
        <div className="profile-favorites">
          <FavoriteList />
        </div>
      )}

    </div>
  );
}

export default Profile;
