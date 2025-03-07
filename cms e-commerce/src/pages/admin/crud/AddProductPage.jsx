import React, { useState } from "react";
import FormProduct from "../../../components/admin/FormProduct";
import CardItem from "../../../components/User/CardItem";

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: [],
    gender: "",
    images: [],
    Star: false,
    discount: "",
  });

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 min-h-screen">
      <div className="w-full md:w-2/3 border-b md:border-r border-t border-white text-white px-4 py-5">
        <FormProduct
          productData={productData}
          setProductData={setProductData}
        />
      </div>

      <div className="w-1/4 md:flex-1 mt-2 md:mt-0 px-4 py-5 border-t md:border-l border-white text-white">
        <h1>Preview</h1>
        <CardItem productData={productData} />
      </div>
    </div>
  );
};

export default AddProductPage;
