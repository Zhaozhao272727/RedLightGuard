import { useEffect } from "react";
import "../styles/ToastMessage.css";

const ToastMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 秒後自動消失

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-message ${type}`}>
      {message}
    </div>
  );
};

export default ToastMessage;
