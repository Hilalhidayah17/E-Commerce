import React, { useEffect, useState } from "react";
import axios from "axios";
import { Hourglass, LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProductByIdThunk } from "../../store/productSlice";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const FormProduct = ({ productData, setProductData }) => {
  const {
    name,
    price,
    category,
    description,
    images,
    sizes,
    gender,
    star,
    discount,
  } = productData;
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [error, setError] = useState({
    name: false,
    price: false,
    category: false,
    images: false,
    desription: false,
    sizes: false,
    gender: false,
  });
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { productById, loading } = useSelector((state) => state.product);
  const { id } = useParams();
  const size = [
    `US 1`,
    `US 2`,
    `US 3`,
    `US 3.5`,
    `US 4`,
    `US 4.5`,
    `US 5`,
    `US 5.5`,
    `US 6`,
    `US 6.5`,
    `US 7 `,
    `US 7.5 `,
    `US 8`,
    `US 8.5`,
    `US 9`,
    `US 9.5`,
    `US 10`,
    `US 10.5`,
    `US 11`,
    `US 11.5`,
    `US 12`,
    `US 13`,
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Upload Multiple Images ke Cloudinary
  const handleAddImages = async (e) => {
    try {
      setLoadingUpload(true);
      const files = Array.from(e.target.files);

      if (files.length === 0) {
        setLoadingUpload(false);
        return;
      }

      const formDataArray = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "testingcloud");
        return formData;
      });

      // Upload semua file ke Cloudinary
      const uploadPromises = formDataArray.map((formData) =>
        axios.post(
          "https://api.cloudinary.com/v1_1/dyrcbophn/image/upload",
          formData
        )
      );

      const responses = await Promise.all(uploadPromises);

      // Ambil URL hasil upload & perbarui state
      const uploadedUrls = responses.map((res) => res.data.url);

      setProductData((prev) => ({ ...prev, images: uploadedUrls }));
      setPreviewImg(uploadedUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoadingUpload(false);
    }
  };

  // Handle Tambah Produk
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !price ||
      !category ||
      !images ||
      !description ||
      !sizes ||
      !gender
    ) {
      setError({
        name: !name,
        price: !price,
        category: !category,
        images: !images,
        desription: !description,
        gender: !gender,
        sizes: !sizes,
      });
      toast.error("Something wrong. Please Check your input field");
      return;
    }
    if (!name || name.length < 6) {
      setError((prev) => ({ ...prev, name: true }));
      return;
    }

    dispatch(
      addProduct({
        timestamp: new Date().toISOString(),
        name: productData.name,
        category: productData.category,
        description: productData.description,
        price: Number(productData.price),
        gender: productData.gender,
        sizes: productData.sizes,
        images: productData.images,
        star: productData.star,
        discount: discount,
      })
    );
    navigate(`/admin`);
  };

  // Handle Edit Produk
  const handleEditProduct = async (e) => {
    e.preventDefault();
    dispatch(
      editProductByIdThunk({
        productId: id,
        updatedProduct: {
          timestamp: new Date().toISOString(),
          name: name,
          category: category,
          price: Number(price),
          description: description,
          gender: gender,
          sizes: sizes,
          images: images,
          star: star,
          discount: discount,
        },
      })
    );
    navigate(`/admin`);
  };
  // handle hapus produk
  const handleDeleteImage = (imageUrl) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));

    // Update juga state previewImg supaya langsung hilang dari UI
    setPreviewImg((prev) => prev.filter((img) => img !== imageUrl));
  };

  useEffect(() => {
    if (id && productById) {
      setProductData({
        name: productById.name || "",
        price: productById.price || "",
        category: productById.category || "",
        description: productById.description || "",
        images: productById.images || [],
        sizes: productById.sizes || [],
        gender: productById.gender || "",
        star: productById.star || "",
        discount: productById.discount || "",
      });
    }
  }, [id, productById, loading]);

  return (
    <div className="w-full  px-20  shadow-md   gap-28 overflow-y-visible py-5 rounded-md text-white">
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">
          {id ? "Edit Product" : "Add New Product"}
        </h2>
        <form className="space-y-4">
          <div className="border p-4 rounded-md space-y-4 text-white">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${error.name ? "border-red-500" : "border-gray-600"}`}
                placeholder="Enter product name"
                required
              />
              <p className="text-sm text-white ">
                Do not exceed 20 characters when entering the product name
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                className={`w-full  p-2 border rounded ${error.price ? "border-red-500" : "border-gray-600"}`}
              />
              <p className="text-sm text-white ">
                Do not exceed 100 characters when entering the product
                description
              </p>
            </div>
          </div>

          <div className="border p-4 rounded-md space-y-3">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className={`w-full p-2 border rounded ${error.category ? "border-red-500" : "border-gray-600"}`}
              value={productData.category}
              name="category"
              onChange={handleChange}
            >
              <option className="text-black"></option>
              <option value="Lifestyle" className="text-black">
                Lifestyle
              </option>
              <option value="Running" className="text-black">
                Running
              </option>
              <option value="Basketball" className="text-black">
                Basketball
              </option>
            </select>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              className={`w-full p-2 border rounded ${error.category ? "border-red-500" : "border-gray-600"}`}
              value={productData.gender}
              name="gender"
              onChange={handleChange}
              required
            >
              <option className="text-black"></option>
              <option value="Women" className="text-black">
                Women
              </option>
              <option value="Men" className="text-black">
                Men
              </option>
              <option value="Unisex" className="text-black">
                Unisex
              </option>
            </select>
            <label htmlFor="star">Priority</label>
            <select
              name="star"
              id="star"
              onChange={handleChange}
              value={productData.star}
              className="w-full p-2 border rounded text-white"
            >
              <option className="text-black"></option>
              <option value={false} className="text-black">
                Ordinary Product
              </option>
              <option value={true} className="text-black">
                Recommended Product
              </option>
            </select>
          </div>

          <div className="border p-4 rounded-md">
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <ul className="grid grid-cols-6 text-[12px] font-semibold text-white">
              {size.map((item, i) => (
                <li key={i} className="flex">
                  <input
                    type="checkbox"
                    id={item}
                    name="sizes"
                    checked={
                      Array.isArray(productData.sizes) &&
                      productData.sizes.includes(item)
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setProductData((prev) => ({
                        ...prev,
                        sizes: isChecked
                          ? [...prev.sizes, item] // Tambahkan jika dicentang
                          : prev.sizes.filter((size) => size !== item), // Hapus jika tidak dicentang
                      }));
                    }}
                  />
                  <label className="ml-2 " htmlFor={item}>
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="border p-4 rounded-md">
            <label className="block text-sm font-medium mb-2">Price (Rp)</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${error.price ? "border-red-500" : "border-gray-600"}`}
              placeholder="Enter price"
            />
            <label className="block text-sm font-medium mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={productData.discount}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${error.price ? "border-red-500" : "border-gray-600"}`}
              placeholder="Enter Discount"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {previewImg?.length > 0 &&
              previewImg.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item}
                    alt="Preview"
                    className="w-36 h-36 object-cover rounded-md"
                  />
                  {/* Tombol Hapus */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteImage(item);
                    }}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>

          {/* Image Upload Multiple */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Images * (Max: 6)
            </label>
            <div className="relative inline-block bg-slate-600 text-white px-3 py-1 rounded-md">
              <input
                type="file"
                multiple
                onChange={handleAddImages}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                disabled={previewImg?.length >= 6}
              />
              Choose Files
            </div>
            {loadingUpload && <Hourglass className="animate-wiggle ml-2" />}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={id ? handleEditProduct : handleAddProduct}
          >
            {id ? "Edit Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormProduct;
