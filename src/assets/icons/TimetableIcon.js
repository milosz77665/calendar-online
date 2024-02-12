import React from "react";

const TimetableIcon = ({ size = 34, color = "var(--white)", onClick, className, title }) => (
  <svg
    onClick={onClick}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="1.652 0.755 23.624 23.736"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {title && <title>{title}</title>}
    <rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none" />
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      id="svg_1"
      style={{
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
        strokeDasharray: "53",
        strokeDashoffset: "-5px",
      }}
      transform="matrix(-0.999984, 0.005659, -0.005659, -0.999984, 0.000002, 0)"
    />
    <line x1="16" y1="2" x2="16" y2="6" id="svg_2" />
    <line x1="8" y1="2" x2="8" y2="6" id="svg_3" />
    <line x1="3" y1="10" x2="21" y2="10" id="svg_4" />
    <rect
      x="5.122448444366455"
      y="12.142855904996395"
      width="2.4897964000701904"
      height="2.4897964000701904"
      rx="0.5"
      ry="0.5"
      strokeWidth=".5"
      id="svg_12"
    />
    <rect
      x="8.877551555633545"
      y="12.142855904996395"
      width="2.4897964000701904"
      height="2.4897964000701904"
      rx="0.5"
      ry="0.5"
      strokeWidth=".5"
      id="svg_7"
    />
    <rect
      x="5.122448533773422"
      y="16.632651820778847"
      width="2.4897964000701904"
      height="2.4897964000701904"
      rx="0.5"
      ry="0.5"
      strokeWidth=".5"
      id="svg_38"
    />
    <rect
      x="8.877551645040512"
      y="16.632651820778847"
      width="2.4897964000701904"
      height="2.4897964000701904"
      rx="0.5"
      ry="0.5"
      strokeWidth=".5"
      id="svg_39"
    />
    <g transform="matrix(1, 0, 0, 1, -5.543912, -13.43333)">
      <circle cx="23.865" cy="31.066" r="5.735" style={{ strokeDashoffset: "1px" }} />
      <polyline
        points="23.865 27.625 23.865 31.066 26.16 32.214"
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%", strokeDashoffset: "1px" }}
      />
    </g>
  </svg>
);

export default TimetableIcon;
