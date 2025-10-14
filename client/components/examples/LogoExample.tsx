import React from "react";
import { Logo } from "@/components/Logo";

export const LogoExample: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-6">Logo Component Examples</h2>

      {/* Default logo */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Default Logo</h3>
        <div className="p-4 bg-white border rounded-lg">
          <Logo width="200px" height="50px" />
        </div>
      </div>

      {/* Blue/Purple gradient style */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Blue/Purple Gradient Style</h3>
        <div className="p-4 bg-white border rounded-lg">
          <Logo
            width="200px"
            height="50px"
            fillColor="url(#blueGradient)"
            accentColor="#ffffff"
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Dark theme style */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Dark Theme Style</h3>
        <div className="p-4 bg-slate-800 border rounded-lg">
          <Logo
            width="200px"
            height="50px"
            fillColor="#ffffff"
            accentColor="#1e293b"
          />
        </div>
      </div>

      {/* Custom colors */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Colors</h3>
        <div className="p-4 bg-gray-50 border rounded-lg">
          <Logo
            width="200px"
            height="50px"
            fillColor="#dc2626"
            accentColor="#fef2f2"
          />
        </div>
      </div>

      {/* Small size */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small Size</h3>
        <div className="p-4 bg-white border rounded-lg">
          <Logo
            width="120px"
            height="30px"
            fillColor="#059669"
            accentColor="#ffffff"
          />
        </div>
      </div>

      {/* Large size */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <div className="p-4 bg-white border rounded-lg">
          <Logo
            width="320px"
            height="80px"
            fillColor="#7c3aed"
            accentColor="#f3f4f6"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoExample;
