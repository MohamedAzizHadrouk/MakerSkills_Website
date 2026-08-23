import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  BookOpen,
  Quote,
  Mail,
  User,
  Phone,
  CreditCard,
  MapPin,
  Truck,
  Calendar,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { productService } from "../../admin/products/services/product.service";
import { Product } from "../../admin/products/types/product";
import { Course } from "../../../types";
import { useStore } from "../../../stores/useStore";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import axios from "axios";
import { routes, getEntitySlug } from "../../../shared/routes";
import { useCanonicalSlugRedirect } from "../../../shared/useCanonicalSlugRedirect";
import { PageMeta } from "../../../shared/PageMeta";

const ShopProductDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme, courses } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [withFormation, setWithFormation] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<null | { type: 'success' | 'error', message: string }>(null);

  useCanonicalSlugRedirect(slug, product?.slug, routes.product);

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Order form state
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    deliveryMethod: "on-site",
    notes: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (slug) {
          const data = await productService.getProduct(slug);
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const images = product?.images
    ? product.images.map((img) => getImageUrl(img))
    : [];
  const relatedFormations = courses
    .filter((course) => course.featured)
    .slice(0, 3);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote request:", quoteForm);
    alert("Votre demande de devis a été envoyée avec succès!");
    setShowQuoteModal(false);
    setQuoteForm({ fullName: "", email: "", phone: "", message: "" });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      ...orderForm,
      items: [product?._id],
      productName: product?.name,
      quantity,
      unitPrice: product?.price,
      totalPrice: product?.price || 0,
      orderDate: new Date().toISOString(),
      withFormation,
    };

    axios
      .post((import.meta.env.VITE_API_URL ?? "http://localhost:3020") + "/orders", orderData)
      .then((data) => {
        setOrderForm({
          fullName: "",
          email: "",
          phoneNumber: "",
          address: "",
          deliveryMethod: "on-site",
          notes: "",
        });
        setShowOrderModal(false);
        setOrderFeedback({ type: 'success', message: "Votre commande a été envoyée avec succès ! Nous vous contacterons bientôt." });
        setTimeout(() => setOrderFeedback(null), 3000);
      })
      .catch((err) => {
        setShowOrderModal(false);
        setOrderFeedback({ type: 'error', message: "Une erreur est survenue lors de l'envoi de votre commande." });
        setTimeout(() => setOrderFeedback(null), 3000);
        console.error(err);
      });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const getTotalPrice = () => {
    return (product?.price || 0) * quantity;
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p
              className={`mt-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Chargement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto  px-4 py-20">
          <div className="text-center">
            <h1
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Produit introuvable
            </h1>
            <Link
              to="/shop"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <PageMeta
        title={product.name}
        description={product.description}
        canonicalPath={routes.product(getEntitySlug(product))}
      />
      {/* Toast Feedback */}
      {orderFeedback && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border ${orderFeedback.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}` }>
            {orderFeedback.type === 'success' ? (
              <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 animate-pulse" />
            )}
            <div>
              <span className={`block text-base font-semibold mb-1 ${orderFeedback.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{orderFeedback.message}</span>
              <span className="block text-xs text-gray-500">Vous allez recevoir un email de confirmation.</span>
            </div>
            <button onClick={() => setOrderFeedback(null)} className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}
      {/* Breadcrumb */}
      <section className="pt-20 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/shop")}
            className={`flex items-center text-sm ${
              theme === "dark"
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors duration-300`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la boutique
          </button>
        </div>
      </section>

      {/* Special Offer Section - déplacée en haut */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div
            className={`rounded-3xl p-8 md:p-12 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-orange-50 to-orange-100"
            }`}
          >
            <div className="text-center mb-8">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Offre spéciale : Produit + Formation
              </h2>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Économisez en combinant ce produit avec une formation adaptée
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {product.events && product.events.length > 0 && (
                <div className="p-6 rounded-2xl border border-orange-200 bg-orange-50 dark:bg-gray-800">
                  <h4 className="text-lg font-bold mb-2 text-orange-500">Formation incluse :</h4>
                  <div className="mb-2 font-medium text-gray-900 dark:text-white">
                    {typeof product.events[0] === "string" ? "Formation" : product.events[0].name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {typeof product.events[0] !== "string" && product.events[0].description
                      ? product.events[0].description
                      : "Formation liée à ce produit"}
                  </div>
                  <div className="mt-2 text-orange-500 font-bold">
                   Sur demande 
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                {images.length > 0 ? (
                  <div className="relative group">
                    <img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-96 object-contain rounded-2xl shadow-lg cursor-pointer bg-white"
                      onClick={() => setLightboxIndex(selectedImageIndex)}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-full h-96 rounded-2xl shadow-lg flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <Package
                      className={`h-16 w-16 ${
                        theme === "dark" ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                )}

                {/* Video Play Button */}
                {product.video && (
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                  >
                    <Play className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-orange-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-orange-500">
                    {product.price}DT
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span
                      className={`text-sm ml-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      (4.9) · 128 avis
                    </span>
                  </div>
                </div>

                {product.description && (
                  <div
                    className={`prose max-w-none mb-8 ${
                      theme === "dark" ? "prose-invert" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Quantité:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseQuantity}
                    className={`p-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className={`px-4 py-2 font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className={`p-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Total: {getTotalPrice()}DT
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Commander maintenant</span>
                </button>

               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Formations Section */}
      {product.events && product.events.length > 0 && (
        <section
          className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Formations liées
              </h2>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Découvrez nos formations en lien avec ce produit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.events.map((event, index) => (
                <motion.div
                  key={typeof event === "string" ? event : event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Formation
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {typeof event === "string" ? event : event.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {typeof event !== "string" && event.description
                        ? event.description
                        : "Formation liée à ce produit"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">
                        {typeof event !== "string" && event.price
                          ? `${event.price}DT`
                          : "Sur demande"}
                      </span>
                      <Link
                        to={routes.formation(
                          typeof event === "string"
                            ? event
                            : getEntitySlug(event as { _id: string; slug?: string })
                        )}
                        className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                      >
                        En savoir plus →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowOrderModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Commander le produit
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div
              className={`p-4 rounded-lg mb-6 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <h4
                className={`font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Récapitulatif de commande
              </h4>
              <div className="flex items-center space-x-4">
                <img
                  src={images[0] || ""}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h5
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h5>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Quantité: {quantity} × {product.price}DT
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-500">
                    {getTotalPrice()}DT
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Checkbox formation */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="withFormation"
                  checked={withFormation}
                  onChange={e => setWithFormation(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="withFormation" className={`ml-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Je veux le produit avec formation
                </label>
              </div>
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nom complet *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={orderForm.fullName}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, fullName: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={orderForm.email}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, email: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={orderForm.phoneNumber}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mode de livraison
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="on-site"
                      checked={orderForm.deliveryMethod === "on-site"}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          deliveryMethod: e.target.value,
                        })
                      }
                      className="text-orange-500"
                    />
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      Sur site
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="home"
                      checked={orderForm.deliveryMethod === "home"}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          deliveryMethod: e.target.value,
                        })
                      }
                      className="text-orange-500"
                    />
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      Livraison à domicile
                    </span>
                  </label>
                </div>
              </div>
              {/* Delivery Address */}
              {orderForm.deliveryMethod == "home" && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Adresse de livraison *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={orderForm.address}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, address: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Adresse complète"
                    />
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Instructions spéciales (optionnel)
                </label>
                <textarea
                  value={orderForm.notes}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  placeholder="Instructions de livraison, commentaires..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-300"
              >
                Confirmer la commande -{" "}
                {getTotalPrice() +
                  (orderForm.deliveryMethod === "express" ? 15 : 0)}
                DT
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowQuoteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-md rounded-2xl p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Demander un devis
              </h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={quoteForm.fullName}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, fullName: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, email: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, phone: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Message (optionnel)
                </label>
                <textarea
                  value={quoteForm.message}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, message: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-orange-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  placeholder="Détails supplémentaires sur votre demande..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Envoyer la demande
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Video Modal */}
      {showVideoModal && product.video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <video
              src={getImageUrl(product.video)}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-black"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Image Lightbox */}
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={images[lightboxIndex]}
              alt={`${product.name} ${lightboxIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-white"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % images.length)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ShopProductDetailPage;
