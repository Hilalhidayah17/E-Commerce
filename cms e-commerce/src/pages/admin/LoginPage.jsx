import React, { useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { Eye, EyeClosed, LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { GlobalContext } from "../../utils/ReactContext";
import { doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  // State untuk validasi
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const { isAuthenticated, loading } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Cek apakah input kosong
    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });

      return;
    }

    try {
      setShowToast(false);
      setIsLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      toast.success("Login success");
      navigate("/admin");
    } catch (error) {
      setShowToast(true);
      console.log(error.code);
      switch (error.code) {
        case `auth/invalid-email`:
          toast.error(`Please fill a valid Email/Password`);
          return;
        case `auth/invalid-credential`:
          toast.error(`Invalid Email/Password`);
          return;

        default:
          toast.error("Something went wrong!");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingGoogle(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        firstName: auth.currentUser.displayName.split(" ")[0],
        lastName: auth.currentUser.displayName.split(" ")[1],
        email: auth.currentUser.email,
        image: auth.currentUser.photoURL,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  function toggleShowPassword(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(`/`);
    } else {
      return;
    }
  }, [loading]);

  // mencegah flashing
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-black px-4">
      {showToast ? <ToastContainer /> : ""}
      <div className="relative w-full max-w-[90%] md:w-[400px]">
        <div className="bg-gray-700 rounded-xl absolute inset-0 blur-xs"></div>
        <div className="bg-black/80 p-8 rounded-2xl text-white relative">
          <h1 className="text-center font-medium">Login Page</h1>
          <form>
            <div className="flex flex-col space-y-3">
              <label htmlFor="Email" className="font-medium">
                Email
              </label>
              <input
                type="email"
                id="Email"
                placeholder="johndoe@gmail.com"
                className={`border p-2 rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } w-full`}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: false }));
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Must fill this input</p>
              )}

              <label htmlFor="Password" className="font-medium">
                Password
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-3 cursor-pointer"
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
                <input
                  type={showPassword ? "password" : "text"}
                  id="Password"
                  placeholder="******"
                  className={`border p-2 rounded-md w-full ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: false }));
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">Must fill this input</p>
              )}

              <button
                className="bg-blue-500 hover:bg-blue-800 text-white rounded-md py-2 flex justify-center"
                onClick={handleLogin}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Login"
                )}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-b border-gray-400"></div>
                <span className="px-3 text-gray-300 text-sm">
                  or register with
                </span>
                <div className="flex-grow border-b border-gray-400"></div>
              </div>

              <div className="flex bg-white hover:bg-white/80 text-black rounded-md py-2 justify-center">
                {isLoadingGoogle ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <img
                      src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                      alt="google-icon"
                      className="w-7 object-contain"
                    />
                    <button
                      className="cursor-pointer"
                      onClick={handleLoginGoogle}
                    >
                      Sign-in With Google
                    </button>
                  </>
                )}
              </div>

              <p className="text-center">
                Don't have an account?{" "}
                <span className="underline hover:text-blue-600">
                  <a href="/admin/register">Register Here</a>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
