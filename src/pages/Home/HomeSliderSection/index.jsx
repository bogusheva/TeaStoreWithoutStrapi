import { useState, useEffect, forwardRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Navigation } from "swiper";

import ProductCard from "../../../components/ProductCard";
import Button from "../../../components/Button";

const HomeSliderSection = forwardRef(({ heading, subheading, array }, ref) => {
  const [cartData, setCartData] = useState([]);
  const [favoriteData, setFavoriteData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCartData(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("favorite")) {
      setFavoriteData(JSON.parse(localStorage.getItem("favorite")));
    }
  }, []);

  const productsBlock = array.map((item) => (
    <SwiperSlide key={item.id}>
      <ProductCard
        key={item.id}
        url={item.attributes.img.data[0].attributes.url}
        id={item.id}
        title={item.attributes.title}
        price={item.attributes.price}
        link={`/shop/product${item.id}`}
        cartData={cartData}
        setCartData={setCartData}
        setFavoriteData={setFavoriteData}
        favoriteData={favoriteData}
      />
    </SwiperSlide>
  ));

  return (
    <section className="home-slider-section">
      <h2 className="home-section-heading">
        {heading} <span className="home-section-subheading">{subheading}</span>
      </h2>
      <Swiper
        ref={ref}
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          270: {
            slidesPerView: 1,
          },
          415: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper slider-container"
      >
        {productsBlock}
      </Swiper>
      <Button className="button black" />
    </section>
  );
});
export default HomeSliderSection;
