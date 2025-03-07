import React, { useEffect, useState } from "react";

import { readProductsThunk, setParams } from "../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import CardItem from "../../components/User/CardItem";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Link } from "react-router";

const AllPage = () => {
  const {
    products = [],
    params,
    totalPage,
    loading,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const handlePage = (page) => {
    if (page >= 1 && page <= totalPage) {
      dispatch(setParams({ currentPage: page }));
    }
  };

  useEffect(() => {
    dispatch(readProductsThunk(params));
  }, [dispatch, params, params.currentPage]);

  const sizes = [
    "US 1",
    "US 2",
    "US 3",
    "US 3.5",
    "US 4",
    "US 4.5",
    "US 5",
    "US 5.5",
    "US 6",
    "US 6.5",
    "US 7",
    "US 7.5",
    "US 8",
    "US 8.5",
    "US 9",
    "US 9.5",
    "US 10",
    "US 10.5",
    "US 11",
    "US 11.5",
    "US 12",
    "US 13",
  ];

  const handleSortPrice = (sortPrice) => {
    dispatch(setParams({ ...params, sortPrice }));
  };

  const handleCheckBoxChange = (e, filterKey) => {
    const { value, checked } = e.target;

    const updatedFilter = checked
      ? [...params[filterKey], value]
      : params[filterKey].filter((item) => item !== value);

    dispatch(setParams({ ...params, [filterKey]: updatedFilter }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen gap-10 px-4 md:px-8">
        {/* Sidebar (Filter) */}
        <aside className="mt-20 w-full md:w-1/4">
          <details className="md:hidden border p-3 mb-4">
            <summary className="text-lg font-semibold cursor-pointer">
              FILTER
            </summary>
            <div className="mt-2 space-y-4">
              {/* Filter Size */}
              <div>
                <h3 className="text-sm tracking-wide">SIZE</h3>
                <hr />
                <div className="h-[200px] overflow-auto">
                  <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                    {sizes.map((item, i) => (
                      <li key={i} className="flex">
                        <input
                          type="checkbox"
                          value={item}
                          onChange={(e) =>
                            handleCheckBoxChange(e, "sizeFilter")
                          }
                        />
                        <label className="ml-2">{item}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Filter Gender */}
              <div>
                <h3 className="text-sm tracking-wide">GENDER</h3>
                <hr />
                <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                  {["Women", "Men", "Unisex"].map((gender) => (
                    <li key={gender} className="flex">
                      <input
                        type="checkbox"
                        value={gender}
                        onChange={(e) =>
                          handleCheckBoxChange(e, "genderFilter")
                        }
                      />
                      <label className="ml-2">{gender}</label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter Activity */}
              <div>
                <h3 className="text-sm tracking-wide">ACTIVITY</h3>
                <hr />
                <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                  {["Lifestyle", "Running", "Basketball"].map((type) => (
                    <li key={type} className="flex">
                      <input
                        type="checkbox"
                        value={type}
                        onChange={(e) => handleCheckBoxChange(e, "typeFilter")}
                      />
                      <label className="ml-2">{type}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <div className="hidden md:block">
            <h2 className="font-normal text-3xl">FILTER</h2>
            <div className="mt-4">
              <h3 className="text-sm tracking-wide">SIZE</h3>
              <hr />
              <div className="h-[300px] overflow-auto">
                <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                  {sizes.map((item, i) => (
                    <li key={i} className="flex">
                      <input
                        type="checkbox"
                        value={item}
                        onChange={(e) => handleCheckBoxChange(e, "sizeFilter")}
                      />
                      <label className="ml-2">{item}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="text-sm tracking-wide">GENDER</h3>
              <hr />
              <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                {["Women", "Men", "Unisex"].map((gender) => (
                  <li key={gender} className="flex">
                    <input
                      type="checkbox"
                      value={gender}
                      onChange={(e) => handleCheckBoxChange(e, "genderFilter")}
                    />
                    <label className="ml-2">{gender}</label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity Filter */}
            <div>
              <h3 className="text-sm tracking-wide">ACTIVITY</h3>
              <hr />
              <ul className="px-3 text-sm font-semibold text-gray-500 space-y-2 py-4">
                {["Lifestyle", "Running", "Basketball"].map((type) => (
                  <li key={type} className="flex">
                    <input
                      type="checkbox"
                      value={type}
                      onChange={(e) => handleCheckBoxChange(e, "typeFilter")}
                    />
                    <label className="ml-2">{type}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="mt-[5.5rem] w-full">
          {/* Header Results & Sorting */}
          <div className="flex flex-col md:flex-row justify-between px-4 md:px-8 space-y-3 md:space-y-0">
            <h2 className="font-semibold text-xl md:text-2xl text-gray-500 tracking-wider">
              Results: {products.length}
            </h2>
            <select
              className="border border-gray-400 p-1"
              onChange={(e) => handleSortPrice(e.target.value)}
            >
              <option value="">Default</option>
              <option value="desc">Price: High to Low</option>
              <option value="asc">Price: Low to High</option>
            </select>
          </div>
          <hr className="mt-6" />

          {/* Product Grid */}
          {loading ? (
            <div className="min-h-screen flex justify-center items-center">
              <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
              {products.map((item) => (
                <Link to={`/${item.id}`}>
                  <CardItem key={item.id} productData={item} />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div>
            <ul className="flex gap-3 justify-center">
              <li
                className={`border px-3 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 ${
                  params.currentPage == 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handlePage(params.currentPage - 1)}
              >
                <ArrowLeft size={24} />
              </li>
              {Array.from({ length: totalPage }).map((_, i) => (
                <li
                  key={i}
                  className={`border px-4 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 cursor-pointer ${
                    params.currentPage === i + 1 ? "bg-red-500 text-white" : ""
                  }`}
                  onClick={() => handlePage(i + 1)}
                >
                  {i + 1}
                </li>
              ))}
              <li
                className={`border px-3 py-2 border-red-500 text-red-500 hover:text-white hover:bg-red-500 ${
                  params.currentPage == totalPage
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handlePage(params.currentPage + 1)}
              >
                <ArrowRight size={24} />
              </li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default AllPage;
