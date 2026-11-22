
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getAllProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.product
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  const featuredProducts = products.slice(0, 6);
  const bannerProducts = products.slice(0, 3);
  const nextSlide = () => {
    if (bannerProducts.length === 0) return;

    setCurrentSlide((prev) =>
      (prev + 1) % bannerProducts.length
    );
  };

  const prevSlide = () => {
    if (bannerProducts.length === 0) return;

    setCurrentSlide((prev) =>
      (prev - 1 + bannerProducts.length) %
      bannerProducts.length
    );
  };

  const bannerProduct = bannerProducts[currentSlide];

  if (loading) {
    return (
      <div className="home-page">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-box">
          <p>Không thể tải sản phẩm: {error}</p>

          <button
            type="button"
            onClick={() => dispatch(getAllProducts())}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {bannerProduct && (
        <section className="hero-banner">
          <button
            type="button"
            className="slider-btn"
            onClick={prevSlide}
          >
            ❮
          </button>
          <div className="hero-image">
            <img
              src={bannerProduct.image}
              alt={bannerProduct.name}
            />
          </div>
          <div className="hero-content">
            <h1>{bannerProduct.name}</h1>

            <p>
              {bannerProduct.shortDescription ||
                "Discover our latest collection"}
            </p>

            <Link
              to={`/detail/${bannerProduct.id}`}
              className="hero-buy-btn"
            >
              Buy Now
            </Link>
          </div>
          <button
            type="button"
            className="slider-btn"
            onClick={nextSlide}
          >
            ❯
          </button>

        </section>
      )}
      <section className="feature-section">

        <h2 className="section-title">
          Product Feature
        </h2>

        {products.length === 0 ? (
          <p>Chưa có sản phẩm.</p>
        ) : (
          <div className="product-grid">

            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Home;
