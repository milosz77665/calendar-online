import React from "react";

const SpinnerIcon = ({ size = 34, color = "var(--secondary)", className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 12 22 a 10 10 0 1 0 -10 -10 " />
  </svg>
);

export default SpinnerIcon;
