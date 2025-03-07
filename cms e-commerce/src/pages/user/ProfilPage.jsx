import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../utils/ReactContext";
import axios from "axios";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const ProfilPage = () => {
  const { login, userData, setLoading } = useContext(GlobalContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    images: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      setUser({ ...userData, name: userData.firstName });
    }
  }, []);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Handle perubahan input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle unggah gambar
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "testingcloud");

      try {
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dyrcbophn/image/upload",
          formData
        );

        setUser((prev) => ({
          ...prev,
          images: data.secure_url, // Simpan URL gambar di state
        }));

        setAvatarPreview(data.secure_url); // Perbarui tampilan gambar
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await updateDoc(doc(db, "users", login.uid), user);
    toast.success("Profile updated successfully!");

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto  px-6 pt-22 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-2">My Profile</h2>
      <p className="text-gray-600 mb-6">
        Manage your profile information to control, protect, and secure your
        account.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Kolom Kanan (Upload Gambar) */}
        <div className="flex flex-col items-center justify-center">
          <div className="border border-dashed border-gray-400 rounded-md w-24 h-24 flex items-center justify-center">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-400">96 x 96</span>
            )}
          </div>

          <label className="mt-3">
            <input
              type="file"
              className="hidden"
              name="images"
              onChange={handleImageChange}
            />
            <span className="cursor-pointer px-3 py-2 bg-gray-300 text-gray-700 rounded-md text-sm">
              Upload Profile Picture
            </span>
          </label>
        </div>

        {/* Tombol Save */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilPage;
