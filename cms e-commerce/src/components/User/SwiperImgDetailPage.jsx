import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const SwiperImgDetailPage = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#303030",
          "--swiper-pagination-color": "#303030",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full h-[380px] object-contain "
      >
        {(images || []).map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} className="mx-auto w-80" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mt-2 w-full h-fit border-t"
      >
        {(images || []).map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} className="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperImgDetailPage;
