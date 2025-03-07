import React from "react";
import "swiper/css";
import "swiper/css/pagination";

const CardItem = ({ productData }) => {
  const { name, price, category, images, discount } = productData;
  const totalProduct = price - (price * discount) / 100;

  return (
    <div className="space-y-4 bg-white rounded-xs  hover:border h-[430px]">
      <div className=" mt-2.5 ">
        <div className="w-52 pb-2 mx-auto">
          {images.length > 0 ? (
            <img src={images[0]} alt="ini" />
          ) : (
            <h2 className="text-black text-center">No Image Selected</h2>
          )}
        </div>
        <hr className="text-gray-300 w-[95%] mx-auto" />
      </div>
      <div className="px-4">
        <p className="text-[14px] font-medium text-[#222]">
          {name || "Product Name"}
        </p>
        <p className="text-sm font-semibold text-gray-700">{category}</p>
      </div>
      {/* Price */}
      <div className="flex items-center gap-2 mt-2 px-4.5">
        {discount > 0 && (
          <>
            <span className="text-sm text-gray-500 line-through">
              Rp {price.toLocaleString("id-ID")}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          </>
        )}
      </div>

      <p className="text-xl font-bold text-red-600 px-4.5">
        Rp {totalProduct.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default CardItem;
