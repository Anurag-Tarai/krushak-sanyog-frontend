import React, { useState } from "react";

import MessageToast from "../common/MessageToast";

import { X } from "lucide-react";

import { createPortal } from "react-dom";

import api from "../../api/api";

import imageCompression from "browser-image-compression"; // ✅ Import compression

const MAX_IMAGES = 5;

const ImageEditDialog = ({ productId, token, product, onUpdate, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,

    message: "",

    status: "info",
  });

  // 🔹 Handle file selection & compression

  const handleFileSelect = async (e) => {
    const newFiles = Array.from(e.target.files);

    const totalImages =
      (product.imageUrls?.length || 0) + selectedFiles.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      setToast({
        show: true,

        message: `Max ${MAX_IMAGES} images allowed (including existing ones).`,

        status: "warning",
      });

      e.target.value = "";

      return;
    }

    try {
      const compressedFiles = [];

      for (const file of newFiles) {
        let finalFile = file;

        // Only compress if file size > 400KB

        if (file.size / 1024 > 400) {
          const options = {
            maxSizeMB: 0.4, // target ~400KB

            maxWidthOrHeight: 1024,

            useWebWorker: true,
          };

          finalFile = await imageCompression(file, options);

          console.log(
            `${file.name} - original: ${(file.size / 1024).toFixed(2)} KB`
          );

          console.log(
            `${file.name} - compressed: ${(finalFile.size / 1024).toFixed(
              2
            )} KB`
          );
        }

        compressedFiles.push(finalFile);
      }

      setSelectedFiles((prev) => [...prev, ...compressedFiles]);
    } catch (err) {
      console.error("Image compression error:", err);

      setToast({
        show: true,

        message: "Failed to compress some images.",

        status: "error",
      });
    }

    e.target.value = "";
  };

  // 🔹 Upload images

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setToast({
        show: true,

        message: "Please select at least one image.",

        status: "warning",
      });

      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);

      setToast({
        show: true,

        message: "⏳ Uploading images...",

        status: "processing",
      });

      const response = await api.post(
        `/api/v1/products/${productId}/images`,

        formData,

        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onUpdate(response.data);

      setSelectedFiles([]);

      setToast({
        show: true,

        message: "Images uploaded successfully!",

        status: "success",
      });
    } catch (error) {
      console.error("Error uploading images:", error);

      setToast({
        show: true,

        message: "Failed to upload images.",

        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Remove selected image locally

  const handleRemoveSelected = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Remove existing image from server

  const handleImageRemove = async (imageUrl) => {
    try {
      setLoading(true);

      setToast({
        show: true,

        message: "Removing image...",

        status: "processing",
      });

      const encodedUrl = encodeURIComponent(imageUrl);

      const response = await api.delete(
        `/api/v1/products/${productId}/images?imageUrl=${encodedUrl}`
      );

      onUpdate(response.data);

      setToast({
        show: true,

        message: "Image removed successfully!",

        status: "success",
      });
    } catch (error) {
      console.error("Error removing image:", error);

      setToast({
        show: true,

        message: "Failed to remove image.",

        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalImages = (product.imageUrls?.length || 0) + selectedFiles.length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-6">
      <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-2xl w-full max-w-lg border border-gray-800 relative">
        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 text-xl font-bold"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

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
          className="w-full text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg p-2

  

file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-green-600

  

file:text-white file:hover:bg-green-500"
        />

        {/* Selected File Count */}

        {selectedFiles.length > 0 && (
          <div className="text-sm text-gray-400 mt-3 text-center">
            Selected: {selectedFiles.length} | Total after upload: {totalImages}
            /{MAX_IMAGES}
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

        {/* Upload & Cancel Buttons */}

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

        {/* Message Toast */}

        {createPortal(
          <MessageToast
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            message={toast.message}
            status={toast.status}
          />,

          document.body
        )}
      </div>
    </div>
  );
};

export default ImageEditDialog;
