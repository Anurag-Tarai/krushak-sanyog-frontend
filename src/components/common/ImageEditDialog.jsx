// src/components/farmer/ImageEditDialog.jsx
import React, { useState } from "react";
import api from "../../Router/api";

const MAX_IMAGES = 5;

const ImageEditDialog = ({ productId, token, product, onUpdate, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle file selection
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalImages =
      (product.imageUrls?.length || 0) + selectedFiles.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      setError(`❌ Max ${MAX_IMAGES} images allowed (including existing ones).`);
      e.target.value = "";
      return;
    }

    setError("");
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // 🔹 Upload New Images
  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    setError("");
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      setStatus("⏳ Uploading images... Please wait.");

      const response = await api.post(
        `/api/v1/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data);
      setStatus("✅ Images uploaded successfully!");
      setSelectedFiles([]);
      setTimeout(() => {
        setStatus("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error uploading images:", error);
      setStatus("❌ Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Remove existing image (from server)
  const handleImageRemove = async (imageUrl) => {
    try {
      setLoading(true);
      setStatus("⏳ Removing image... Please wait.");

      const encodedUrl = encodeURIComponent(imageUrl);
      const response = await api.delete(
        `/api/v1/products/${productId}/images?imageUrl=${encodedUrl}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onUpdate(response.data);
      setStatus("⛔ Image removed successfully!");
    
      setSelectedFiles([]);
      setTimeout(() => {
        setStatus("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error removing image:", error);
      setStatus("❌ Failed to remove image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Remove file before upload (locally)
  const handleRemoveSelected = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalImages = (product.imageUrls?.length || 0) + selectedFiles.length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-6">
      <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-2xl w-full max-w-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-green-400 mb-5 text-center tracking-wide">
          Edit Product Images
        </h2>

        {/* File input */}
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select multiple images (Max {MAX_IMAGES} total)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-600 file:text-white file:hover:bg-green-500"
        />

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm text-center font-medium mt-2">
            {error}
          </div>
        )}

        {/* Selected File Count */}
        {selectedFiles.length > 0 && (
          <div className="text-sm text-gray-400 mt-3 text-center">
            Selected: {selectedFiles.length} | Total after upload:{" "}
            {totalImages}/{MAX_IMAGES}
          </div>
        )}

        {/* Preview Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3 my-4">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 shadow-md group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-full group-hover:opacity-80 transition"
                />
                <button
                  onClick={() => handleRemoveSelected(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded px-1"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleImageUpload}
            disabled={loading || selectedFiles.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Processing...
              </>
            ) : (
              "Upload"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`text-center text-sm font-medium mt-4 ${
              status.includes("✅")
                ? "text-green-400"
                : status.includes("❌")
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {status}
          </div>
        )}

        {/* Existing Images */}
        <h3 className="text-md font-semibold text-gray-300 mt-6 mb-2">
          Existing Images ({product.imageUrls?.length || 0}/{MAX_IMAGES})
        </h3>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {product.imageUrls?.map((url, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 shadow-md group"
            >
              <img
                src={url}
                alt={`Product ${idx}`}
                className="object-cover w-full h-full group-hover:opacity-80 transition"
              />
              <button
                onClick={() => handleImageRemove(url)}
                disabled={loading}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded px-1 shadow"
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageEditDialog;
