import { Search } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { readProductsThunk, setParams } from "../../store/productSlice";
import { useDispatch } from "react-redux";

const HeadDashboard = ({ sortFunc }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const handleSearch = () => {
    dispatch(setParams({ query }));
    dispatch(readProductsThunk({ ...params, query }));
  };
  return (
    <div className="flex flex-col md:flex-row justify-between mx-7 gap-4 my-4">
      <h1 className="text-center md:text-left font-semibold">
        Order Catalogue
      </h1>
      <div className="flex justify-center">
        <select
          onChange={(e) => sortFunc(e.target.value)}
          className="border p-1 rounded "
        >
          <option value="default">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <div className="flex justify-center items-center gap-2 ">
        <div className="relative flex-grow">
          <Search
            className="absolute lg:right-3 md:right-2 lg:top-1 cursor-pointer"
            size={24}
            onClick={handleSearch}
          />
          <input
            type="text"
            className="border-gray-400 rounded-sm px-2 py-1 mr-2 border w-full md:w-auto"
            placeholder="Search Product"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Link to={`/admin/add`}>
          <button className="bg-purple-900 text-white px-3 md:py-1 rounded-md cursor-pointer">
            Add New
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HeadDashboard;
