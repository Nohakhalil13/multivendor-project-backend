import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api'; 
import api from '../api';

import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Star,
  Minus,
  Plus,
  Share2,
  CheckCircle2
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);

  const [isFavorite, setIsFavorite] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  //  جلب المنتج
  useEffect(() => {
    if (!product) {
      getProducts().then((allProducts) => {
        const found = allProducts.find((p) => p._id === id);
        setProduct(found);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    const foundInWishlist = favorites.find((item) => item._id === id);
    if (foundInWishlist) setIsFavorite(true);

    window.scrollTo(0, 0);
  }, [id, product]);

  //  Wishlist
  const toggleWishlist = () => {
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (isFavorite) {
      favorites = favorites.filter((item) => item._id !== product._id);
      setIsFavorite(false);
    } else {
      favorites.push(product);
      setIsFavorite(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(favorites));
  };

  //  Share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
        setTimeout(() => setShareStatus(null), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //  Add to Cart (DATABASE)
  const handleAddToCart = async () => {
    try {
      await api.post("/cart", {
        productId: product._id,
        quantity: quantity,
      });

      alert("Added to cart 🛒");
      navigate("/cart"); // optional
    } catch (error) {
      console.error("Add To Cart Error:", error.response?.data);
      alert("Error adding to cart ");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Product Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-white pt-32 pb-20" dir="ltr">
      <div className="container mx-auto px-6 max-w-[1300px]">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[500px] object-contain"
            />

            {/* Share */}
            <button onClick={handleShare}>
              {shareStatus === 'copied' ? <CheckCircle2 /> : <Share2 />}
            </button>

            {/* Wishlist */}
            <button onClick={toggleWishlist}>
              <Heart fill={isFavorite ? "red" : "none"} />
            </button>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p>{product.description}</p>

            <div className="text-2xl font-bold">
              EGP {product.price}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus />
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity(q => q + 1)}>
                <Plus />
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 rounded-xl"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;