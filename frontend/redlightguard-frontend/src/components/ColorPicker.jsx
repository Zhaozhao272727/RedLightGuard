import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../styles/colors';
import '../styles/ColorPicker.css'; // ✨ 引入樣式檔！

const ColorPicker = () => {
  const { changeTheme } = useTheme();

  const colorOptions = [
    { name: '粉', color: colors.pink },
    { name: '橘', color: colors.orange },
    { name: '黃', color: colors.yellow },
    { name: '綠', color: colors.green },
    { name: '淡藍', color: colors.lightBlue },
    { name: '紫', color: colors.lavender },
    { name: '灰', color: colors.gray },
  ];

  return (
    <div className="color-picker-container">
      {colorOptions.map(({ name, color }, index) => (
        <div
          key={index}
          className="color-ball"
          title={name}
          style={{ background: color.background }} // 🌈 使用 colors 設定的漸變色
          onClick={() => changeTheme(color.background, color.button)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
