import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/style";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);

  // Thêm state cho trang hiện tại và số lượng sản phẩm mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // Tính toán tổng số trang dựa vào số lượng sản phẩm
  const totalPages = Math.ceil(
    allProducts && allProducts.length / productsPerPage
  );

  // Tính toán chỉ số bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = currentPage * productsPerPage;
  console.log(startIndex);

  // Lấy danh sách sản phẩm cho trang hiện tại
  const currentProducts =
    allProducts && allProducts.slice(startIndex, endIndex);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Tất cả sản phẩm</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {currentProducts && currentProducts.length !== 0 && (
            <>
              {currentProducts.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </>
          )}
        </div>
        {/* Nút phân trang */}
        <div className="flex justify-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`mx-2 ${
                index + 1 === currentPage ? "text-blue-600" : "text-gray-600"
              }  p-2 text-[15px]`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
