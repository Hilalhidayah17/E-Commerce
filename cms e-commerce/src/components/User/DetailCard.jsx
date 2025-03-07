import React, { useContext, useEffect, useState } from "react";
import SwiperImgDetailPage from "./SwiperImgDetailPage";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getProductByIdThunk,
  setLoading,
} from "../../store/productSlice";
import { useParams } from "react-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { GlobalContext } from "../../utils/ReactContext";
import Swal from "sweetalert2";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

const DetailCard = () => {
  const dispatch = useDispatch();
  const { productById, loading } = useSelector((state) => state.product);
  const { id } = useParams();
  const { login } = useContext(GlobalContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const totalProduct =
    productById.price - (productById.price * productById.discount) / 100;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const increaseQty = () => setQuantity(quantity + 1);
  const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleToCart = async () => {
    dispatch(setLoading(true));
    if (!selectedSize) {
      toast.warn("Please select a size first!");
      return;
    }

    const cartRef = collection(db, "cart");

    // Cek apakah produk sudah ada di cart berdasarkan userId, id produk, dan ukuran
    const q = query(
      cartRef,
      where("userId", "==", login?.uid),
      where("name", "==", productById.name),
      where("sizes", "==", selectedSize)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Produk sudah ada, update quantity-nya
      const docSnap = querySnapshot.docs[0];
      const existingData = docSnap.data();
      const updatedQuantity = existingData.quantity + quantity; // Tambah quantity

      // Update Firestore
      await setDoc(doc(db, "cart", docSnap.id), {
        ...existingData,
        quantity: updatedQuantity,
      });

      // Update Redux state
      dispatch(addToCart({ ...existingData, quantity: updatedQuantity }));
    } else {
      // Produk belum ada, tambahkan baru
      const newCartItem = {
        ...productById,
        userId: login?.uid,
        sizes: selectedSize,
        quantity: quantity,
      };

      await addDoc(cartRef, newCartItem);
      dispatch(setLoading(false));
    }

    Swal.fire({
      title: "Success!",
      text: "Item added to cart",
      icon: "success",
    });
  };

  useEffect(() => {
    dispatch(getProductByIdThunk(id));
  }, [dispatch, id]);

  return (
    <>
      <div className="pt-20 px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gambar Produk */}
        <div className="w-full">
          <SwiperImgDetailPage images={productById.images} />
        </div>

        {/* Detail Produk */}
        <div className="w-full space-y-6">
          <h1 className="text-3xl font-semibold font-proxima-bold">
            {productById.name}
          </h1>

          {productById.discount > 0 && (
            <>
              <span className="text-md text-gray-500 line-through">
                Rp {productById?.price?.toLocaleString("id-ID")}
              </span>
              <span className="bg-red-500 text-white text-md font-bold px-2 py-1 rounded-md ml-4">
                -{productById?.discount}%
              </span>
              <p className="text-3xl font-semibold font-proxima-regular mt-5">
                Rp {totalProduct.toLocaleString("id-ID")}
              </p>
            </>
          )}

          {/* Pilih Ukuran */}
          <div>
            <h2 className="text-sm font-bold tracking-wider font-proxima-regular mt-6 md:mt-9 mb-3">
              Size
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {(productById?.sizes || []).map((size, i) => (
                <div
                  key={i}
                  className={`border text-center px-3 py-2 cursor-pointer ${
                    selectedSize === size ? "bg-red-600 text-white" : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Pilih Quantity */}
          <div>
            <h2 className="font-proxima-regular mt-6 md:mt-9 mb-3 text-sm font-bold tracking-wider">
              Quantity
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={decreaseQty}
                className="border px-4 py-2 cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={increaseQty}
                className="border px-4 py-2 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Tombol Add to Cart */}
          <div className="flex flex-col space-y-3">
            <button
              className="border border-red-600 text-red-600 hover:text-white hover:bg-red-600 duration-300 px-5 py-3 font-semibold cursor-pointer"
              onClick={handleToCart}
            >
              {loading ? (
                <div className="flex justify-center">
                  <LoaderCircle size={24} className="animate-spin text-white" />
                </div>
              ) : (
                <p>ADD TO CART</p>
              )}
            </button>
          </div>
        </div>
      </div>

      <hr className="my-8" />

      {/* Deskripsi Produk */}
      <div className="px-4 md:px-8 pb-18">
        <h2 className="text-2xl md:text-3xl font-semibold mb-5 mt-4 font-proxima-bold">
          {productById.name} - Product Details
        </h2>
        <p className="text-sm/relaxed font-medium font-proxima-regular text-[#303030]">
          {productById.description}
        </p>
      </div>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default DetailCard;
