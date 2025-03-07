import React, { useEffect, useState } from "react";
import FormProduct from "../../../components/admin/FormProduct";
import { Link, useParams } from "react-router";
import CardItem from "../../../components/User/CardItem";
import { useDispatch, useSelector } from "react-redux";
import { getProductByIdThunk } from "../../../store/productSlice";
import { LoaderCircle } from "lucide-react";

const EditProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: [],
    gender: "",
    images: [],
    Star: false,
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(getProductByIdThunk(id));
    }
  }, [dispatch, id]);

  // Loader saat Redux sedang mengambil data
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row bg-gray-900 min-h-screen">
      <div className="w-full md:w-2/3 border-b md:border-r border-t border-white text-white px-4 py-5">
        <FormProduct
          productData={productData}
          setProductData={setProductData}
        />
      </div>

      <div className="w-1/4 md:flex-1 mt-2 md:mt-0 px-4 py-5 border-t md:border-l border-white text-white">
        <CardItem productData={productData} />
      </div>
    </div>
  );
};

export default EditProduct;
