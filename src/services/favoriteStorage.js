
const getStorageKey = () => {
  const email = localStorage.getItem("userEmail");
  return `favorites_${email || "guest"}`;
};

// Lấy danh sách yêu thích
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(getStorageKey());
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Kiểm tra sản phẩm đã yêu thích
export const isFavoriteProduct = (id) => {
  return getFavorites().some(
    (item) => String(item.id) === String(id)
  );
};

// Thêm hoặc bỏ yêu thích
export const toggleFavorite = (product) => {
  const favorites = getFavorites();

  const exists = favorites.some(
    (item) => String(item.id) === String(product.id)
  );

  const updatedFavorites = exists
    ? favorites.filter(
        (item) => String(item.id) !== String(product.id)
      )
    : [...favorites, product];

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(updatedFavorites)
  );

  window.dispatchEvent(new Event("favoritesUpdated"));

  return !exists;
};
