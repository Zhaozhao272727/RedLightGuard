import React from "react";
import "../styles/InputField.css"; // 確保有引入

const InputField = ({ placeholder, value, onChange, type = "text" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field"
    />
  );
};

export default InputField;
