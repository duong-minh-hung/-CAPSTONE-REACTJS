
import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import { getFavorites } from "../services/favoriteStorage";

function FavoriteList() {
  const [favorites, setFavorites] = useState(
    () => getFavorites()
  );

  useEffect(() => {
    const updateFavorites = () => {
      setFavorites(getFavorites());
    };

    updateFavorites();

    window.addEventListener(
      "favoritesUpdated",
      updateFavorites
    );

    return () => {
      window.removeEventListener(
        "favoritesUpdated",
        updateFavorites
      );
    };
  }, []);

  if (favorites.length === 0) {
    return <p>Chưa có sản phẩm yêu thích.</p>;
  }

  return (
    <div className="product-grid">
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default FavoriteList;
