
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  isFavoriteProduct,
  toggleFavorite,
} from "../services/favoriteStorage";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(
    () => isFavoriteProduct(product.id)
  );

  useEffect(() => {
    const updateFavorite = () => {
      setIsFavorite(isFavoriteProduct(product.id));
    };

    updateFavorite();

    window.addEventListener(
      "favoritesUpdated",
      updateFavorite
    );

    return () => {
      window.removeEventListener(
        "favoritesUpdated",
        updateFavorite
      );
    };
  }, [product.id]);

  const handleFavorite = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const newState = toggleFavorite(product);
    setIsFavorite(newState);
  };

  return (
    <div className="product-card">
      <button
        type="button"
        className="favorite-btn"
        onClick={handleFavorite}
        aria-label={
          isFavorite
            ? "Bỏ yêu thích sản phẩm"
            : "Yêu thích sản phẩm"
        }
        aria-pressed={isFavorite}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <Link to={`/detail/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>
          {product.shortDescription ||
            "Sản phẩm giày thời trang"}
        </p>
      </div>

      <div className="product-bottom">
        <Link
          to={`/detail/${product.id}`}
          className="buy-btn"
        >
          Buy Now
        </Link>

        <span className="product-price">
          {product.price}$
        </span>
      </div>
    </div>
  );
}

export default ProductCard;
