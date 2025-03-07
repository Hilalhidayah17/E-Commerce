import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import ProducTable from "../../components/admin/ProducTable";
import HeadDashboard from "../../components/admin/HeadDashboard";

import { useDispatch, useSelector } from "react-redux";
import { readProductsThunk, setParams } from "../../store/productSlice";

const DashboardAdmin = () => {
  const [sortedproducts, setSortedProducts] = useState([]);

  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    params,
    totalPage,
  } = useSelector((state) => state.product);

  const handlePage = (page) => {
    if (page >= 1 && page <= totalPage) {
      dispatch(setParams({ currentPage: page }));
    }
  };

  // fungsi sorting berdasarkan harga  Produk
  function sortedProductsByPrice(sort) {
    const sortedProducts = [...products].sort((a, b) => {
      if (sort === `asc`) return a.price - b.price;
      if (sort === `desc`) return b.price - a.price;
    });
    setSortedProducts(sortedProducts);
  }

  useEffect(() => {
    dispatch(readProductsThunk(params));
  }, [params]);

  // mencegah flashing
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <main className="w-full h-screen px-12">
        <HeadDashboard sortFunc={sortedProductsByPrice} />
        <ProducTable
          products={sortedproducts.length > 0 ? sortedproducts : products}
        />
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            onClick={() => handlePage(params.currentPage - 1)}
          >
            Prev
          </button>

          <span className="font-semibold text-lg">
            page {params.currentPage} of {totalPage}
          </span>

          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            onClick={() => handlePage(params.currentPage + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
};

export default DashboardAdmin;
