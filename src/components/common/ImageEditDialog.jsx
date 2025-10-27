// src/components/farmer/ImageEditDialog.jsx
import React, { useState } from "react";
import api from "../../Router/api";

const MAX_IMAGES = 5;

const ImageEditDialog = ({ productId, token, product, onUpdate, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState(""); // status feedback
  const [error, setError] = useState(""); // validation errors
  const [loading, setLoading] = useState(false);

  // 🔹 Handle file selection
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);

    // Combine current selections with new ones
    const totalImages =
      (product.imageUrls?.length || 0) + selectedFiles.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      setError(
        `❌ You can only have up to ${MAX_IMAGES} images (including existing ones).`
      );
      e.target.value = ""; // reset input
      return;
    }

    setError("");
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // reset input so user can select again later
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
      }, 1500);
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
      setStatus("✅ Image removed successfully!");
      setTimeout(() => setStatus(""), 1500);
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

  // 🔹 Count total images (existing + new)
  const totalImages = (product.imageUrls?.length || 0) + selectedFiles.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Edit Product Images
        </h2>

        {/* File input */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select multiple images (Max {MAX_IMAGES} total):
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="border p-2 rounded-lg w-full mb-3"
        />

        {/* Validation Error */}
        {error && (
          <div className="text-red-600 text-sm text-center font-medium mb-3">
            {error}
          </div>
        )}

        {/* Selected File Count */}
        {selectedFiles.length > 0 && (
          <div className="text-sm text-gray-700 mb-3 text-center">
            Selected: {selectedFiles.length} file
            {selectedFiles.length > 1 ? "s" : ""} | Total after upload:{" "}
            {totalImages}/{MAX_IMAGES}
          </div>
        )}

        {/* Preview Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-md overflow-hidden border"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => handleRemoveSelected(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-1"
                  title="Remove from selection"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleImageUpload}
            disabled={loading || selectedFiles.length === 0}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg shadow disabled:opacity-50 flex items-center gap-2"
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
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`text-center text-sm font-medium mb-3 ${
              status.includes("✅")
                ? "text-green-700"
                : status.includes("❌")
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            {status}
          </div>
        )}

        {/* Existing Images */}
        <h3 className="text-md font-semibold text-gray-800 mt-3 mb-2">
          Existing Images ({product.imageUrls?.length || 0}/{MAX_IMAGES}):
        </h3>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {product.imageUrls?.map((url, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-md overflow-hidden border"
            >
              <img
                src={url}
                alt={`Product ${idx}`}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => handleImageRemove(url)}
                disabled={loading}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-1 shadow"
                title="Delete from server"
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
  