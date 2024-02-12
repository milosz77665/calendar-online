import React from "react";

const MinusIcon = ({ size = 34, color = "var(--white)", className, title }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {title && <title>{title}</title>}
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default MinusIcon;
