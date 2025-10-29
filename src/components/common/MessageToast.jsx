import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiClock,
} from "react-icons/fi";

const icons = {
  success: <FiCheckCircle className="text-green-700 text-xl" />,
  error: <FiXCircle className="text-red-700 text-xl" />,
  warning: <FiAlertTriangle className="text-yellow-700 text-xl" />,
  info: <FiInfo className="text-blue-700 text-xl" />,
  processing: <FiClock className="text-purple-700 text-xl" />,
};

const bgColors = {
  success: "bg-green-100 border-green-500",
  error: "bg-red-100 border-red-500",
  warning: "bg-yellow-100 border-yellow-500",
  info: "bg-blue-100 border-blue-500",
  processing: "bg-purple-100 border-purple-500",
};

const MessageToast = ({
  show,
  onClose,
  message,
  status = "info",
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  const icon = icons[status] || icons.info;
  const bgClass = bgColors[status] || bgColors.info;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-6 left-[62%] transform -translate-x-1/2 z-[10050]"
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 border rounded-xl shadow-lg ${bgClass} backdrop-blur-md`}
          >
            {icon}
            <span className="text-sm text-gray-900 font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageToast;
