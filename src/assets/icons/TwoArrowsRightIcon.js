import React from "react";
const TwoArrowsRightIcon = ({ size = 34, color = "var(--white)", onClick, className, title }) => (
  <svg
    onClick={onClick}
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
    <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
  </svg>
);
export default TwoArrowsRightIcon;
