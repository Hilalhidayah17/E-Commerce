import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteProductThunk,
  readProductsThunk,
} from "../../store/productSlice";
import { Link } from "react-router";
import Swal from "sweetalert2";

const ProducTable = ({ products }) => {
  const dispatch = useDispatch();

  const handleDelete = async (productId) => {
    dispatch(deleteProductThunk(productId));
    dispatch(readProductsThunk());
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-red-500 text-white text-sm uppercase font-semibold tracking-wide">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Discount (%)</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-100 transition duration-200 text-center"
              >
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-700">
                  {product?.name}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <img
                      src={product.images[0]}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded-md shadow"
                    />
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{product?.category}</td>
                <td className="py-3 px-4 font-bold text-green-600">
                  Rp {product?.price.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4 font-bold text-red-500">
                  {product?.discount == 0 ? "-" : `${product?.discount}%`}
                </td>
                <td className="py-3 px-4 space-x-2 flex justify-center">
                  <Link to={`/admin/edit/${product.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-md shadow">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-md shadow"
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDelete(product?.id);
                          Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                          });
                        }
                      });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-6 text-center text-gray-500">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProducTable;
