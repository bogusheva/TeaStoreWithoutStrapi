import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getAverageRating } from "../../functions/index";

import AuthContext from "../../context/AuthContext";
import ReviewCard from "../ReviewCard";
import { dataStatic } from "../../data/databaseProducts";

export default function ProductCardBig() {
  const { id } = useParams();
  const productId = id.slice(7);
  const product = dataStatic.products.data.find(
    (item) => item.id === productId
  ).attributes;

  const navigate = useNavigate();
  const [photoNumber, setPhotoNumber] = useState(0);
  const [numReviewsToShow, setNumReviewsToShow] = useState(3);

  const [cartData, setCartData] = useState([]);
  const [favoriteData, setFavoriteData] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);

  const { isLogged } = useContext(AuthContext);

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

  function handleGoBack() {
    navigate(-1); // повернення на попередню сторінку
  }

  function toggle(number) {
    setPhotoNumber(number);
  }

  function handleShowMoreReviews() {
    setNumReviewsToShow(numReviewsToShow + 3);
  }

  function addToCart() {
    const cartItem = {
      id: productId,
      img: product.img.data[0].attributes.url,
      title: product.title,
      quantity: 1,
      price: product.price,
    };

    if (!cartData.find((item) => item.id === productId)) {
      setCartData((prevState) => [...prevState, cartItem]);
      setIsFavorite(false);
      localStorage.setItem("cart", JSON.stringify([...cartData, cartItem]));
    }
  }

  function addToFavorites() {
    if (localStorage.getItem("favorite")) {
      setFavoriteData(JSON.parse(localStorage.getItem("favorite")));
    }
    const favoriteItem = {
      id: productId,
      img: product.img.data[0].attributes.url,
      title: product.title,
      price: product.price,
    };

    if (!favoriteData.find((item) => item.id === productId)) {
      setFavoriteData((prevState) => [...prevState, favoriteItem]);
      setIsFavorite(true);
      localStorage.setItem(
        "favorite",
        JSON.stringify([...favoriteData, favoriteItem])
      );
    } else {
      const newFavoriteData = favoriteData.filter(
        (item) => item.id !== productId
      );
      setIsFavorite(false);
      setFavoriteData(newFavoriteData);
      localStorage.setItem("favorite", JSON.stringify(newFavoriteData));
    }
  }

  return (
    <section className="product-item-page">
      <div className="item-container">
        <div className="item-slider-container">
          <ul className="small-images-container">
            {product.img.data.map((image, index) => (
              <li key={index} onClick={() => toggle(index)}>
                <img src={image.attributes.url} key={image.id} alt={image.id} />
              </li>
            ))}
          </ul>
          <div className="main-photo-container">
            <img
              src={product.img.data[photoNumber].attributes.url}
              alt={`product ${photoNumber + 1}`}
            />
            {isLogged && (
              <div className="heart-container" onClick={addToFavorites}>
                {isFavorite ? (
                  <span className="icon-heart"></span>
                ) : (
                  <span className="icon-heart-broken"></span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="item-description-container">
          <div className="item-main-container">
            <h4>Caffeine: {product.caffeine}</h4>
            <h2>{product.title}</h2>
            <h4>TASTING NOTES: {product.flavor}</h4>
            <p>{product.description}</p>
            <h5>ingredients: {product.ingredients}</h5>
            <h5>origin: {product.origin}</h5>
            <p className="stars-container">
              <span>{getAverageRating(product.review.data)}</span>
              <span>({product.review.data.length})</span>
            </p>
            {isLogged && (
              <span className="button" onClick={addToCart}>
                add to cart <b>$ {product.price.toFixed(2)}</b>
              </span>
            )}
            <span className="button-left" onClick={handleGoBack}>
              <span className="icon-arrow-left"></span>
            </span>
          </div>
          <div className="item-additional-container">
            <h4>Steeping Instructions</h4>
            <div className="instructions-container">
              <div className="instruction-card">
                <span className="icon-droplet"></span>
                <p>
                  <span className="not-mobile-view">
                    WATER&nbsp;TEMPERATURE{" "}
                  </span>
                  {product.temperature}F
                </p>
              </div>
              <div className="instruction-card">
                <span className="icon-hour-glass"></span>
                <p>
                  <span className="not-mobile-view">STEEP&nbsp;TIME </span>
                  {product.steepTime}
                </p>
              </div>
              <div className="instruction-card">
                <span className="icon-mug"></span>
                <p>
                  <span className="not-mobile-view">SERVING&nbsp;SIZE </span>
                  {product.servingSize}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="reviews-container">
        <h3>Latest reviews</h3>
        <div className="reviews-block">
          {product.review.data.slice(0, numReviewsToShow).map((review) => (
            <ReviewCard
              key={review.id}
              text={review.attributes.text}
              rating={review.attributes.rating}
              name={review.attributes.name}
            />
          ))}
        </div>
        <div>
          {numReviewsToShow < product.review.data.length && (
            <span className="button" onClick={handleShowMoreReviews}>
              more reviews
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
