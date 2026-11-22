
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  getProductById,
} from "../redux/slices/productSlice";

import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    productDetail,
    products,
    detailLoading,
    detailError,
  } = useSelector((state) => state.product);

  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Gọi API chi tiết sản phẩm
  useEffect(() => {
    dispatch(getProductById(id));
    setSize(null);
    setQuantity(1);
  }, [dispatch, id]);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (size === null) {
      alert("Vui lòng chọn size giày");
      return;
    }

    dispatch(
      addToCart({
        id: productDetail.id,
        name: productDetail.name,
        image: productDetail.image,
        price: productDetail.price,
        size: size,
        quantity: quantity,
      })
    );

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  if (detailLoading) {
    return <p>Đang tải sản phẩm...</p>;
  }

  if (detailError) {
    return <p>{detailError}</p>;
  }

  if (!productDetail) {
    return <p>Không tìm thấy sản phẩm.</p>;
  }

  // Ưu tiên danh sách liên quan từ API chi tiết.
  // Nếu không có, dùng sản phẩm khác trong Store.
  const relatedProducts = (
    productDetail.relatedProducts?.length
      ? productDetail.relatedProducts
      : products.filter(
          (item) => item.id !== productDetail.id
        )
  ).slice(0, 6);

  return (
    <div className="detail-page">

      <div className="detail-container">

        {/* Ảnh giày */}
        <div className="detail-image">
          <img
            src={productDetail.image}
            alt={productDetail.name}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="detail-info">

          <h2>{productDetail.name}</h2>

          <p>{productDetail.description}</p>

          <h3 className="available-size">
            Available size
          </h3>

          {/* Chọn size */}
          <div className="size-list">
            {productDetail.size?.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  size === item ? "size-btn active" : "size-btn"
                }
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Giá */}
          <h3 className="detail-price">
            {productDetail.price}$
          </h3>

          {/* Số lượng */}
          <div className="quantity-control">
            <button
              type="button"
              onClick={() =>
                setQuantity((prev) => prev + 1)
              }
            >
              +
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((prev) =>
                  Math.max(1, prev - 1)
                )
              }
            >
              -
            </button>
          </div>

          {/* Thêm vào giỏ hàng */}
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>

        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <section className="related-section">
        <h2>Related Product</h2>

        <div className="product-grid">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Detail;
