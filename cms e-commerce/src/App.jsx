import Navbar from "./components/User/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import banner1 from "./assets/Banner/Header_Desktop.jpg";
import banner2 from "./assets/Banner/Banner_2.jpg";
import banner3 from "./assets/Banner/Banner3.jpg";
import bannerMobile from "./assets/Banner/bannerMobile.jpg";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/pagination";
import CardItem from "./components/User/CardItem";
import "swiper/css";
import "swiper/css/navigation";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Footer from "./components/User/Footer";
import { Link } from "react-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { setLoading } from "./store/productSlice";

function App() {
  const { loading } = useSelector((state) => state.product);
  const [recommendedProduct, setRecommendedProduct] = useState([]);
  const dispatch = useDispatch();

  const q = query(collection(db, "products"), where("star", "==", "true"));
  const mobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const dataRecommen = async () => {
    dispatch(setLoading(true));
    const querySnapshot = await getDocs(q);

    let item = [];
    querySnapshot.forEach((doc) => {
      item.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setRecommendedProduct(item);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    dataRecommen();
  }, [dispatch]);

  return (
    <div className="md:min-h-screen flex flex-col">
      <main>
        <div>
          <Swiper
            key={recommendedProduct.id}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            spaceBetween={50}
            slidesPerView={1}
            className="mt-16 md:mt-0"
          >
            <SwiperSlide>
              <Link to={"/all"}>
                <img
                  src={mobile ? bannerMobile : banner1}
                  alt="banner"
                  className="w-full h-[full] md:h-[390px] object-bottom object-cover mt-10 md:mt-14"
                />
              </Link>
            </SwiperSlide>
            {mobile ? null : (
              <>
                <SwiperSlide>
                  <Link to={"/all"}>
                    <img
                      src={banner2}
                      alt="banner"
                      className="w-full  md:h-[390px] object-cover mt-10 md:mt-16"
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to={"/all"}>
                    <img
                      src={banner3}
                      alt="banner"
                      className="w-full h-[300px] md:h-[390px] object-bottom object-cover mt-10 md:mt-16"
                    />
                  </Link>
                </SwiperSlide>
              </>
            )}
          </Swiper>
        </div>

        <div className="block w-full bg-slate-200 py-5">
          <h2 className="tracking-wide text-center text-xl md:text-2xl font-semibold my-4 md:my-5 font-proxima-bold">
            RECOMMENDED FOR YOU
          </h2>
          <Link to={"/All"}>
            <h3 className="text-right mr-10.5 font-proxima-regular font-semibold cursor-pointer">
              Browse All
            </h3>
          </Link>

          {loading ? (
            <div className="min-h-screen flex justify-center items-center">
              <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
            </div>
          ) : (
            <div className="flex justify-center gap-x-2 md:gap-x-3 my-2 px-4 md:px-10">
              <Swiper
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: {
                    slidesPerView:
                      recommendedProduct.length < 4
                        ? recommendedProduct.length
                        : 4,
                  },
                }}
                spaceBetween={30}
                loop={true}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
              >
                {recommendedProduct.map((item, i) => (
                  <SwiperSlide key={i}>
                    <Link to={`/${item.id}`}>
                      <CardItem productData={item} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-[#343131]">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
