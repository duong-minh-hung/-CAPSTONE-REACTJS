
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Kiểm tra form
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Gọi API đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await axios.post(
        "https://apistore.cybersoft.edu.vn/api/Users/signin",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const data = result.data.content;
      const token = data?.accessToken;

      if (!token) {
        throw new Error("API không trả về accessToken");
      }

      // Lưu thông tin cho Cart và Profile
      localStorage.setItem("accessToken", token);
      localStorage.setItem(
        "userEmail",
        data.email || formData.email.trim()
      );

      setMessage("Đăng nhập thành công!");

      // Chuyển về Home
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      <form
        className="login-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Email */}
        <div className="login-field">
          <label htmlFor="login-email">Email</label>

          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <span className="login-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="login-field">
          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <span className="login-error">
              {errors.password}
            </span>
          )}
        </div>

        {/* Nút Login */}
        <div className="login-actions">
          <Link to="/register">
            Register now?
          </Link>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </div>

        {/* Facebook Login */}
        <button
          type="button"
          className="facebook-login-btn"
          onClick={() =>
            setMessage(
              "Đăng nhập Facebook cần cấu hình Meta App ID."
            )
          }
        >
          Continue with Facebook
        </button>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
