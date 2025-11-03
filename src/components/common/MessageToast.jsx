import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiClock,
} from "react-icons/fi";


const icons = {
  success: <FiCheckCircle className="text-white text-xl" />,
  error: <FiXCircle className="text-white text-xl" />,
  warning: <FiAlertTriangle className="text-white text-xl" />,
  info: <FiInfo className="text-white text-xl" />,
  processing: <FiClock className="text-white text-xl" />,
};

const bgColors = {
  success: "bg-green-800/60 border-green-800",
  error: "bg-red-800/60 border-red-500",
  warning: "bg-yellow-800/60 border-yellow-500",
  info: "bg-blue-800/60 border-blue-800",
  processing: "bg-purple-800/60 border-purple-500",
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

  const toastContent = (
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
            <span className="text-sm text-white font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );

  return ReactDOM.createPortal(toastContent, document.body);
};

export default MessageToast;
