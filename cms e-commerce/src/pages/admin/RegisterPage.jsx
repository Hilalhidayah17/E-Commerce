import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, db, provider } from "../../config/firebase";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { GlobalContext } from "../../utils/ReactContext";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setIsName] = useState({ firstName: "", lastName: "" });
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [role, setRole] = ["user"];
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
  });
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(GlobalContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name.firstName || !name.lastName) {
      setErrors({
        email: !email,
        password: !password,
        firstName: !name.firstName,
        lastName: !name.lastName,
      });

      return;
    }
    try {
      setIsLoadingSignUp(true);
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        firstName: name.firstName,
        lastName: name.lastName,
        email: email,
        role: role,
      });

      toast.success("success");
      navigate("/admin/login");
    } catch (error) {
      switch (error.code) {
        case `auth/weak-password`:
          toast.error(
            "weak password, Password should be at least 6 characters (auth/weak-password)."
          );
          break;
        case `auth/missing-password`:
          alert("fill pass");
          break;
        case `auth/email-already-in-use`:
          alert("email already in use");
          break;
        case `auth/invalid-email`:
          alert("invalid email");
          break;
        case `auth/missing-email`:
          alert("fill the email");
          break;

        default:
          break;
      }
    } finally {
      setIsLoadingSignUp(false);
    }
  };

  const handleSignWithGoogle = async (e) => {
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
        role: role,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

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
    <div>
      <ToastContainer />
      <div className=" min-h-screen items-center  flex justify-center align-middle bg-black ">
        <div className="relative">
          <div className="bg-gray-700 rounded-xl absolute inset-0 blur-xs"></div>
          <div className=" bg-black/80 p-8 rounded-2xl  drop-shadow-md text-white relative w-[500px] backdrop-blur-3xl">
            <h1 className="text-center font-medium text-lg">Register Page</h1>
            <form>
              <div className="flex flex-col space-y-4">
                <div className="flex gap-10 my-4">
                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      placeholder="FirstName"
                      required
                      className={`border p-2 rounded-md ${
                        errors.firstName ? "border-red-500" : "border-gray-600"
                      }`}
                      onChange={(e) => {
                        setIsName((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, firstName: false }));
                      }}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        Must fill this input
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-3">
                    <input
                      type="text"
                      id="Last Name"
                      placeholder="Last Name"
                      required
                      className={`border p-2 rounded-md ${
                        errors.lastName ? "border-red-500" : "border-gray-600"
                      }`}
                      onChange={(e) => {
                        setIsName((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, lastName: false }));
                      }}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        Must fill this input
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full ">
                  <div className="flex flex-col space-y-3">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      className={`border p-2 rounded-md ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      }`}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: false }));
                      }}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        Must fill this input
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <input
                    type="password"
                    id="Password"
                    placeholder="Enter Password"
                    required
                    className={`border p-2 rounded-md ${
                      errors.password ? "border-red-500" : "border-gray-600"
                    }`}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: false }));
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">Must fill this input</p>
                  )}
                </div>
                <button
                  className="cursor-pointer bg-blue-500 hover:bg-blue-800 text-white rounded-lg py-1 flex justify-center"
                  onClick={handleSignUp}
                >
                  {isLoadingSignUp ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    `Create Account`
                  )}
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-b border-gray-400"></div>
                  <span className="px-3 text-gray-300 text-sm">
                    or register with
                  </span>
                  <div className="flex-grow border-b border-gray-400"></div>
                </div>

                <div className="flex bg-white hover:bg-white/80 text-black rounded-md py-1 align-middle justify-center ">
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
                        onClick={handleSignWithGoogle}
                      >
                        Sign-in With Google
                      </button>
                    </>
                  )}
                </div>
                <p className="text-center">
                  Already have an account?{" "}
                  <span className="underline hover:text-blue-600">
                    <a href="/admin/login">Sign-In Here</a>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
