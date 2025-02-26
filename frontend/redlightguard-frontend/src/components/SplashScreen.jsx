import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000); // 4 秒後跳轉

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <motion.div
        className="star"
        initial={{ scale: 0 }}
        animate={{ scale: 1.5, rotate: 360 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.h1
        className="title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        RedLightGuard ✨
      </motion.h1>
    </div>
  );
};

export default SplashScreen;
