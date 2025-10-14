import React from "react";

export interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fillColor?: string;
  accentColor?: string;
  isDark?: boolean; // New prop to determine which logo to use
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  width = "160px",
  height = "auto",
  fillColor = "currentColor",
  accentColor = "#FFFFFF",
  isDark = false,
}) => {
  // Determine which logo to use based on dark mode or background
  const logoSrc = false
    ? "https://garbrix.com/intelivoucher/assets/images/logo_fill_white.png"
    : "https://garbrix.com/intelivoucher/assets/images/logo_fill.png";

  return (
    <img
      src={logoSrc}
      alt="InteliVoucher"
      className={className}
      style={{
        width: width,
        height: height,
        objectFit: "contain",
      }}
    />
  );
};

export default Logo;
