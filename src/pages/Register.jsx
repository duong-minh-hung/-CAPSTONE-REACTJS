
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
    gender: true,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu khi người dùng nhập
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Kiểm tra dữ liệu form
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Vui lòng xác nhận mật khẩu";
    } else if (
      formData.passwordConfirm !== formData.password
    ) {
      newErrors.passwordConfirm = "Mật khẩu không khớp";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Gọi API đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      const { email, password, name, phone, gender } =
        formData;

      const result = await axios.post(
        "https://apistore.cybersoft.edu.vn/api/Users/signup",
        {
          email,
          password,
          name,
          phone,
          gender,
        }
      );

      if (
        result.data.statusCode >= 200 &&
        result.data.statusCode < 300
      ) {
        setMessage("Đăng ký tài khoản thành công!");

        setFormData({
          email: "",
          password: "",
          passwordConfirm: "",
          name: "",
          phone: "",
          gender: true,
        });

        setErrors({});
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>

      <form
        className="register-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Cột bên trái */}
        <div className="register-column">
          <div className="register-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="register-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="register-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="register-error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="register-field">
            <label>Password confirm</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="password confirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
            {errors.passwordConfirm && (
              <span className="register-error">
                {errors.passwordConfirm}
              </span>
            )}
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="register-column">
          <div className="register-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="register-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="register-field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="register-error">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="register-gender">
            <label>Gender</label>

            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === true}
                onChange={() =>
                  setFormData({
                    ...formData,
                    gender: true,
                  })
                }
              />
              Male
            </label>

            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === false}
                onChange={() =>
                  setFormData({
                    ...formData,
                    gender: false,
                  })
                }
              />
              Female
            </label>
          </div>

          <div className="register-submit">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </form>

      {message && (
        <p className="register-message">{message}</p>
      )}

      <p className="register-login-link">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
