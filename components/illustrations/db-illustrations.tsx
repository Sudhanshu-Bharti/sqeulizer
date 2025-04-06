import React from "react";

export const DatabaseIllustration = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g className="animate-float">
      <path
        d="M200 50C270 50 320 65 320 80C320 95 270 110 200 110C130 110 80 95 80 80C80 65 130 50 200 50Z"
        className="fill-slate-800 stroke-slate-600"
        strokeWidth="2"
      />
      <path
        d="M320 80V240C320 255 270 270 200 270C130 270 80 255 80 240V80"
        className="stroke-slate-600"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M320 160C320 175 270 190 200 190C130 190 80 175 80 160"
        className="stroke-slate-600 stroke-dasharray-2"
        strokeWidth="2"
      />
      <g className="animate-pulse">
        <circle cx="180" cy="75" r="4" className="fill-emerald-500" />
        <circle cx="200" cy="75" r="4" className="fill-blue-500" />
        <circle cx="220" cy="75" r="4" className="fill-purple-500" />
      </g>
    </g>
  </svg>
);

export const SchemaIllustration = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g className="animate-float">
      <rect
        x="120"
        y="60"
        width="160"
        height="60"
        rx="4"
        className="fill-slate-800 stroke-slate-600"
        strokeWidth="2"
      />
      <rect
        x="40"
        y="180"
        width="140"
        height="60"
        rx="4"
        className="fill-slate-800 stroke-slate-600"
        strokeWidth="2"
      />
      <rect
        x="220"
        y="180"
        width="140"
        height="60"
        rx="4"
        className="fill-slate-800 stroke-slate-600"
        strokeWidth="2"
      />
      <path
        d="M200 120L120 180M200 120L280 180"
        className="stroke-slate-600"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g className="animate-pulse-slow">
        <circle cx="180" cy="90" r="3" className="fill-emerald-500" />
        <circle cx="200" cy="90" r="3" className="fill-blue-500" />
        <circle cx="220" cy="90" r="3" className="fill-purple-500" />
      </g>
    </g>
  </svg>
);

export const CollaborationIllustration = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g className="animate-float">
      <circle
        cx="200"
        cy="150"
        r="80"
        className="fill-slate-800/50 stroke-slate-600"
        strokeWidth="2"
      />
      <g className="animate-orbit">
        <circle
          cx="200"
          cy="70"
          r="20"
          className="fill-blue-500/20 stroke-blue-400"
          strokeWidth="2"
        />
        <circle
          cx="280"
          cy="190"
          r="20"
          className="fill-purple-500/20 stroke-purple-400"
          strokeWidth="2"
        />
        <circle
          cx="120"
          cy="190"
          r="20"
          className="fill-emerald-500/20 stroke-emerald-400"
          strokeWidth="2"
        />
      </g>
    </g>
  </svg>
);
