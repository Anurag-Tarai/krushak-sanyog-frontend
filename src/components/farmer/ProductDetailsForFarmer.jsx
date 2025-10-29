import React, { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Edit, Image as ImageIcon, Package } from "lucide-react";
import api from "../../Router/api";
import LocationMap from "../map/LocationMap";
import "leaflet/dist/leaflet.css";
import MessageToast from "../common/MessageToast";

const UpdateProductForm = React.lazy(() =>
  import("../product/UpdateProductForm")
);
const ImageSlider = React.lazy(() => import("../common/ImageSlider"));
const ImageEditDialog = React.lazy(() => import("../common/ImageEditDialog"));

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-800/60 rounded-md ${className}`} />
);

const ProductDetailsForFarmer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [product, setProduct] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    status: "info",
  });

  // Centralized Toast handler
  const showToast = (message, status = "info") => {
    setToast({ show: true, message, status });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/v1/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          setProduct(res.data);
          setUpdatedQuantity(res.data.availableQuantity ?? "");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, token]);

  const handleQuantityUpdate = () => {
    showToast("Inventory update feature is under development.", "info");
  };

  const toggleAvailability = async () => {
    try {
      const updated = { ...product, available: !product.available };
      const res = await api.put(`/api/v1/products/${productId}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data);
      showToast(
        updated.available
          ? "Product is now marked as Available ✅"
          : "Product marked as Sold Out",
        "success"
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      showToast("Failed to update product status. Try again.", "error");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.36 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070707] via-[#0e0e0f] to-[#141416] text-gray-200 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-0">
        {/* 🟢 UPDATE PRODUCT MODAL */}
        <AnimatePresence>
          {showUpdateModal && product && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl rounded-2xl overflow-auto bg-gray-900/80 border border-gray-800 shadow-2xl"
              >
                <Suspense
                  fallback={<div className="p-6 text-gray-400">Loading...</div>}
                >
                  <UpdateProductForm
                    product={product}
                    onUpdate={(u) => {
                      setProduct(u);
                      setShowUpdateModal(false);
                    }}
                    onClose={() => setShowUpdateModal(false)}
                  />
                </Suspense>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🟣 IMAGE EDIT MODAL */}
        <AnimatePresence>
          {showImageDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl rounded-2xl overflow-auto bg-gray-900/80 border border-gray-800 shadow-2xl"
              >
                <Suspense
                  fallback={<div className="p-6 text-gray-400">Loading...</div>}
                >
                  <ImageEditDialog
                    productId={productId}
                    token={token}
                    product={product}
                    onUpdate={(u) => setProduct(u)}
                    onClose={() => setShowImageDialog(false)}
                  />
                </Suspense>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌾 MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* LEFT PANEL — scrollable content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 h-[85vh] overflow-y-auto custom-scrollbar p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60 shadow-[0_0_15px_rgba(255,255,255,0.04)] backdrop-blur-md relative"
          >
            {!product ? (
              <>
                <Skeleton className="h-[360px] w-full mb-6" />
                <Skeleton className="h-6 w-1/3 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="rounded-xl overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="w-full h-[360px] bg-gray-800 rounded-xl" />
                      }
                    >
                      <ImageSlider images={product.imageUrls || []} />
                    </Suspense>
                  </div>

                  {/* 🖼️ EDIT IMAGE BUTTON */}
                  <button
                    onClick={() => setShowImageDialog(true)}
                    className="absolute right-4 bottom-4 bg-gray-800/70 hover:bg-gray-800 text-gray-100 px-4 py-2 rounded-md border border-gray-700 flex items-center gap-2 text-sm"
                  >
                    <ImageIcon size={14} /> Edit Images
                  </button>
                </div>

                {/* 🧾 PRODUCT INFO */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-100 flex items-center gap-2">
                      {product.name}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.available
                            ? "bg-green-700/30 text-green-300"
                            : "bg-red-700/30 text-red-300"
                        }`}
                      >
                        {product.available ? "Available" : "Sold Out"}
                      </span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                      {product.category}
                    </p>
                    <p className="mt-4 text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* 📊 STATS */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-lg">
                      <Package className="text-gray-300" />
                      <div>
                        <div className="text-xs text-gray-400">Available</div>
                        <div className="text-gray-100 font-medium">
                          {product.availableQuantity ?? product.quantity ?? 0} kg
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-lg">
                      <MapPin className="text-gray-300" />
                      <div>
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="text-gray-100 font-medium">
                          {product.address || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ⚙️ CONTROL PANEL */}
                  <div className="mt-8 w-full bg-gray-900/50 backdrop-blur-md border border-gray-800/60 rounded-2xl p-5 shadow-[0_0_15px_rgba(255,255,255,0.04)]">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                      Manage Product
                    </h3>

                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 flex-wrap">
                      <div className="flex-1 min-w-[220px]">
                        <label className="block text-xs text-gray-400 mb-2">
                          Inventory (kg)
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={updatedQuantity}
                            onChange={(e) => setUpdatedQuantity(e.target.value)}
                            className="flex-1 bg-gray-800/80 border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600"
                          />
                          <button
                            onClick={handleQuantityUpdate}
                            className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700 transition-all whitespace-nowrap"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowUpdateModal(true)}
                        className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 flex items-center gap-2 transition-all"
                      >
                        <Edit size={15} /> Edit Product
                      </button>

                      <button
                        onClick={toggleAvailability}
                        className={`px-6 py-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                          product.available
                            ? "bg-green-800/70 hover:bg-green-700/60 border-green-600/60 text-gray-100 shadow-[0_0_10px_rgba(34,197,94,0.25)] hover:shadow-[0_0_14px_rgba(34,197,94,0.35)]"
                            : "bg-red-800/70 hover:bg-red-700/60 border-red-600/60 text-gray-100 shadow-[0_0_10px_rgba(239,68,68,0.25)] hover:shadow-[0_0_14px_rgba(239,68,68,0.35)]"
                        }`}
                      >
                        {product.available
                          ? "Set as Sold Out"
                          : "Set as Available"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* RIGHT PANEL — scrollable */}
          <div className="space-y-6 h-[85vh] overflow-y-auto custom-scrollbar pr-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60 shadow backdrop-blur-md"
            >
              <h3 className="text-sm font-semibold text-gray-100 mb-3">
                COMMENT SECTION
              </h3>
              <div className="bg-gray-800/40 border border-gray-800 rounded-lg h-64 flex items-center justify-center text-gray-400">
                💬 Comment feature coming soon...
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  disabled
                  className="flex-1 bg-gray-800 border border-gray-800 rounded-md px-3 py-2 text-gray-400 cursor-not-allowed"
                />
                <button className="px-3 py-2 rounded-md bg-gray-800/30 text-gray-400 cursor-not-allowed">
                  <Send />
                </button>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800/60 shadow relative z-10 backdrop-blur-md"
            >
              <h3 className="text-sm font-semibold text-gray-100 mb-3">
                Product Location
              </h3>
              <div className="rounded-lg overflow-hidden border border-gray-800 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <div className="w-full h-64 relative">
                  <LocationMap
                    latitude={product?.latitude}
                    longitude={product?.longitude}
                  />

                  {product?.latitude && product?.longitude && (
                    <>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${product.latitude},${product.longitude}`,
                            "_blank"
                          )
                        }
                        className="absolute top-3 right-3 z-[1000] bg-gray-800/80 hover:bg-gray-700 text-gray-100 text-xs px-3 py-1.5 rounded-md border border-gray-700 shadow-md backdrop-blur-sm transition-all flex items-center gap-1"
                      >
                        <MapPin size={12} /> View on Google Maps
                      </button>

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${product.latitude}, ${product.longitude}`
                          )
                        }
                        className="absolute bottom-3 right-3 z-[1000] bg-gray-800/80 hover:bg-gray-700 text-gray-100 text-xs px-3 py-1.5 rounded-md border border-gray-700 shadow-md backdrop-blur-sm transition-all"
                      >
                        Copy Coords
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/farmer/dashboard")}
                className="text-sm text-gray-300 hover:text-gray-100"
              >
                ← Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast */}
      <MessageToast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        status={toast.status}
      />

      {/* Custom Scrollbar */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(34,197,94,0.4);
            border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(34,197,94,0.6);
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(24,24,24,0.3);
          }
        `}
      </style>
    </div>
  );
};

export default ProductDetailsForFarmer;
