import { useRef } from "react";

import HomeHero from "./HomeHero";
import HomeSliderSection from "./HomeSliderSection";
import HomeChoice from "./HomeChoice";
import HomeReviews from "./HomeReviews";
import HomeAdvantages from "./HomeAdvantages";
import HomeVideo from "./HomeVideo";
import HomeBlog from "./HomeBlog";
import HomeInstagram from "./HomeInstagram";

import { arrBestsellers } from "../../data/bestsellers.js";
import { arrTrends } from "../../data/trends.js";
import { dataStatic } from "../../data/databaseProducts";

export default function Home() {
  const productsData = dataStatic.products.data;

  const productsRef = useRef(null);

  const bestsellers = productsData.filter((elem) =>
    arrBestsellers.includes(Number(elem.id))
  );
  const trends = productsData.filter((elem) =>
    arrTrends.includes(Number(elem.id))
  );

  function handleProductScroll() {
    productsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main>
      <HomeHero handleProductScroll={handleProductScroll} />
      <HomeSliderSection
        heading="What's trending"
        subheading="These are the items that are trending recently."
        array={trends}
        ref={productsRef}
      />
      <HomeChoice />
      <HomeReviews />
      <HomeVideo />
      <HomeSliderSection
        heading="BestSellers"
        subheading="These are the items that are best seller."
        array={bestsellers}
      />
      <HomeBlog />
      <HomeAdvantages />
      <HomeInstagram />
    </main>
  );
}
