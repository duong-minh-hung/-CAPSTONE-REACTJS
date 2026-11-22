
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import orderBy from "lodash/orderBy";

import { getAllProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Search() {
  const dispatch = useDispatch();

  // Lấy danh sách sản phẩm từ Redux
  const { products, loading, error } = useSelector(
    (state) => state.product
  );

  // Từ khóa người dùng nhập
  const [keyword, setKeyword] = useState("");

  // Từ khóa sau khi nhấn SEARCH
  const [searchKeyword, setSearchKeyword] = useState("");

  // Sắp xếp giá
  const [sortPrice, setSortPrice] = useState("desc");

  // Gọi API lấy danh sách sản phẩm
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, products.length]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword.trim());
  };

  // Lọc theo tên sản phẩm
  const filteredProducts = products.filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(searchKeyword.toLowerCase())
  );

  // Sắp xếp giá bằng Lodash
  const sortedProducts = orderBy(
    filteredProducts,
    [(product) => Number(product.price)],
    [sortPrice]
  );

  return (
    <div className="search-page">

      {/* FORM TÌM KIẾM */}
      <form
        className="search-form"
        onSubmit={handleSearch}
      >
        <label htmlFor="search-input">
          Search
        </label>

        <div className="search-input-group">
          <input
            id="search-input"
            type="text"
            placeholder="product name ..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

          <button type="submit">
            SEARCH
          </button>
        </div>
      </form>

      {/* TIÊU ĐỀ KẾT QUẢ */}
      <h2 className="search-title">
        Search result
      </h2>

      {/* SẮP XẾP GIÁ */}
      <div className="search-filter">
        <label htmlFor="sort-price">
          Price
        </label>

        <select
          id="sort-price"
          value={sortPrice}
          onChange={(e) =>
            setSortPrice(e.target.value)
          }
        >
          <option value="desc">
            Decrease
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : error ? (
        <div>
          <p>Không thể tải sản phẩm: {error}</p>
          <button
            type="button"
            onClick={() => dispatch(getAllProducts())}
          >
            Thử lại
          </button>
        </div>
      ) : sortedProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm.</p>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Search;
