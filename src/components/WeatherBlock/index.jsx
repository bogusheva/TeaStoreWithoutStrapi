import { useState, useEffect } from "react";
import axios from "axios";

import { quotesArray } from "../../data/quotes.js";
import { dataStatic } from "../../data/databaseProducts.js";

import WeatherDescription from "../WeatherDescription";
import ProductCard from "../ProductCard";
import Mug from "../../assets/images/advantage2.svg";

export default function WeatherBlock() {
  const productsArray = dataStatic.products.data;
  const [city, setCity] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("Find out what we have for you...");
  const [productId, setProductId] = useState("1");
  const [product, setProduct] = useState(
    productsArray.find((item) => item.id === productId)
  );
  const [dataWeather, setDataWeather] = useState({
    temperature: null,
    description: "",
    humidity: null,
    wind: null,
    icon: "",
    city: "",
  });

  const [cartData, setCartData] = useState([]);
  const [favoriteData, setFavoriteData] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  console.log(isFavorite);

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

  useEffect(() => {
    if (favoriteData.find((item) => item.id === productId)) {
      setIsFavorite(true);
    }
  }, [favoriteData, productId]);

  useEffect(() => {
    const productChosen = productsArray.find(
      (item) => item.id === String(productId)
    );
    setProduct(productChosen);
  }, [productId, isLoaded, productsArray]);

  function handleChangeCity(event) {
    event.preventDefault();
    setCity(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const apiKey = process.env.REACT_APP_API_KEY;
    let units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    axios.get(url).then(showData);
    setCity("");
  }

  function showData(response) {
    setDataWeather({
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: Math.round(response.data.main.humidity),
      wind: response.data.wind.speed,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      city: response.data.name,
    });
    switch (response.data.weather[0].description) {
      case "rainy":
        setQuote(quotesArray[0]);
        setProductId(Math.round(Math.random() * 8));
        break;
      case "few clouds":
        setQuote(quotesArray[1]);
        setProductId(Math.round(Math.random() * 8 + 8));
        break;
      case "scattered clouds":
        setQuote(quotesArray[2]);
        setProductId(Math.round(Math.random() * 8 + 16));
        break;
      case "overcast clouds":
        setQuote(quotesArray[3]);
        setProductId(Math.round(Math.random() * 8 + 24));
        break;
      case "clear sky":
        setQuote(quotesArray[4]);
        setProductId(Math.round(Math.random() * 8 + 32));
        break;
      default:
        setQuote(quotesArray[5]);
        setProductId(Math.round(Math.random() * 40));
        break;
    }
    setIsLoaded(true);
  }

  return (
    <div className="weather-choice-container">
      <div className="weather-block-container">
        <h3>
          {!isLoaded
            ? "Enter your city and we'll choose tea for your weather"
            : `The weather in ${dataWeather.city}`}
        </h3>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder={"enter a city..."}
            onChange={handleChangeCity}
            value={city}
            className="search-input"
          />
          <input type="submit" value="Search" className="button" />
        </form>
        {isLoaded ? (
          <WeatherDescription data={dataWeather} />
        ) : (
          <div className="weather-description-block">
            <div className="mug-icon">
              <img src={Mug} alt="surprise" />
            </div>
          </div>
        )}
        <blockquote>
          <h3>{quote}</h3>
        </blockquote>
      </div>
      <div className="surprise-item-container">
        <div className="item-container">
          {product && isLoaded ? (
            <ProductCard
              key={product.id}
              url={product.attributes.img.data[0].attributes.url}
              id={product.id}
              title={product.attributes.title}
              price={product.attributes.price}
              link={`/shop/product${product.id}`}
              cartData={cartData}
              setCartData={setCartData}
              setFavoriteData={setFavoriteData}
              favoriteData={favoriteData}
            />
          ) : (
            <div className="mug-icon">
              <img src={Mug} alt="surprise" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
