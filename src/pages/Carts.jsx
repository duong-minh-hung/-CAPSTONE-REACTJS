
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";

function Carts() {
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const [selectedItems, setSelectedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Chọn sản phẩm để đặt hàng
  const getItemKey = (item) => `${item.id}-${item.size}`;

  const handleSelect = (item) => {
    const key = getItemKey(item);

    setSelectedItems((prev) =>
      prev.includes(key)
        ? prev.filter((value) => value !== key)
        : [...prev, key]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map(getItemKey));
    } else {
      setSelectedItems([]);
    }
  };

  const selectedProducts = cartItems.filter((item) =>
    selectedItems.includes(getItemKey(item))
  );

  const total = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Gửi đơn hàng lên API
  const handleSubmitOrder = async () => {
    if (selectedProducts.length === 0) {
      setMessage("Vui lòng chọn sản phẩm để đặt hàng.");
      return;
    }

    // Sẽ được lưu khi hoàn thành trang Login
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      setMessage("Vui lòng đăng nhập trước khi đặt hàng.");
      return;
    }

    const orderDetail = selectedProducts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      setSubmitting(true);
      setMessage("");

      const result = await axios.post(
        "https://apistore.cybersoft.edu.vn/api/Users/order",
        {
          orderDetail,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        result.data.statusCode >= 200 &&
        result.data.statusCode < 300
      ) {
        // Xóa sản phẩm đã đặt khỏi giỏ hàng
        selectedProducts.forEach((item) => {
          dispatch(
            removeFromCart({
              id: item.id,
              size: item.size,
            })
          );
        });

        setSelectedItems([]);
        setMessage("Đặt hàng thành công!");
      } else {
        setMessage("Không thể đặt hàng.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Đặt hàng thất bại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="carts-page">
      <h2>Carts</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn đang trống.</p>
          <Link to="/">Tiếp tục mua hàng</Link>
        </div>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        cartItems.length > 0 &&
                        cartItems.every((item) =>
                          selectedItems.includes(getItemKey(item))
                        )
                      }
                      onChange={(e) =>
                        handleSelectAll(e.target.checked)
                      }
                    />
                  </th>
                  <th>id</th>
                  <th>img</th>
                  <th>name</th>
                  <th>price</th>
                  <th>quantity</th>
                  <th>total</th>
                  <th>action</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr key={getItemKey(item)}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(
                          getItemKey(item)
                        )}
                        onChange={() => handleSelect(item)}
                      />
                    </td>

                    <td>{item.id}</td>

                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-product-image"
                      />
                    </td>

                    <td>
                      {item.name}
                      <div>Size: {item.size}</div>
                    </td>

                    <td>{item.price}$</td>

                    <td>
                      <div className="cart-quantity">
                        <button
                          onClick={() =>
                            dispatch(
                              decreaseQuantity({
                                id: item.id,
                                size: item.size,
                              })
                            )
                          }
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            dispatch(
                              increaseQuantity({
                                id: item.id,
                                size: item.size,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      {item.price * item.quantity}$
                    </td>

                    <td>
                      <button
                        className="cart-delete-btn"
                        onClick={() => {
                          dispatch(
                            removeFromCart({
                              id: item.id,
                              size: item.size,
                            })
                          );
                        }}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-bottom">
            <h3>Total: {total}$</h3>

            <button
              className="submit-order-btn"
              onClick={handleSubmitOrder}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "SUBMIT ORDER"}
            </button>
          </div>

          {message && (
            <p className="cart-message">{message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Carts;
