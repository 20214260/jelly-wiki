// src/App.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import EarthScene from "./EarthScene";

export default function App() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // 🌍 떠다닐 이미지 목록
  const floatingImages = [
    { src: "/texts/한국.png", alt: "Korea" },
    { src: "/texts/일본.png", alt: "Japan" },
    { src: "/texts/미국.png", alt: "United States" },
    { src: "/texts/중국.png", alt: "China" },
    { src: "/texts/인도.png", alt: "India" },
    { src: "/texts/독일.png", alt: "Germany" },
    { src: "/texts/프랑스.png", alt: "France" },
    { src: "/texts/영국.png", alt: "United Kingdom" },
    { src: "/texts/캐나다.png", alt: "Canada" },
    { src: "/texts/호주.png", alt: "Australia" },
  ];

  // 🌠 랜덤 위치
  const randomPos = () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 🌍 3D 지구 */}
      <EarthScene onHover={setHoveredCountry} />

      {/* 🪐 상단 배너 */}
      <img
        src="/uiAssets/title_banner.png"
        alt="세상 대학교의 꿀팁을 모아서"
        className="
          absolute top-[5%] left-1/2
          -translate-x-1/2 
          w-[65%] max-w-[900px]
          z-20 pointer-events-none select-none
        "
      />

      {/* 🌌 떠다니는 이미지들 */}
      {floatingImages.map((item, i) => (
        <motion.img
          key={i}
          src={item.src}
          alt={item.alt}
          initial={randomPos()}
          animate={{
            y: [0, 30, 0],
            x: [0, Math.random() * 60 - 30, 0],
            rotate: [0, Math.random() * 10 - 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute w-[110px] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] opacity-90 pointer-events-none select-none"
        />
      ))}
    </div>
  );
}
