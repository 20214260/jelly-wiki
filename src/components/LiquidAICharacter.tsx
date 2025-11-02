import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LiquidAICharacter() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // 👁 마우스 방향 추적
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="relative w-60 h-80 flex items-center justify-center select-none"
      animate={{
        y: [0, -6, 0],
        scale: [1, 1.02, 0.98, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* 몸통 (젤리 본체) */}
      <motion.div
        className="absolute inset-0 rounded-[60%_60%_52%_52%/70%_70%_42%_46%]
                   bg-gradient-to-b from-indigo-300 to-purple-400 shadow-2xl"
        animate={{
          scaleY: [1, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 얼굴 */}
      <div className="relative w-[70%] h-[65%] flex flex-col items-center justify-center z-10 -translate-y-10">
        {/* 👁 눈 */}
        <div className="flex justify-between w-[60%] mb-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="relative bg-white rounded-full overflow-hidden shadow-md"
              style={{
                width: "28px",
                height: "28px",
              }}
            >
              <motion.div
                className="absolute bg-black rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 10,
                }}
              />
            </div>
          ))}
        </div>

        {/* 👄 입 */}
        <motion.div
          className="bg-black/60 rounded-full"
          style={{
            width: "36px",
            height: "6px",
          }}
          animate={{
            scaleY: [1, 0.6, 1],
            borderRadius: ["30%", "50%", "30%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 💧하이라이트 */}
      <div className="absolute top-8 left-8 w-12 h-12 bg-white/25 rounded-full blur-xl" />
      <div className="absolute bottom-6 right-6 w-10 h-10 bg-purple-200/20 rounded-full blur-lg" />

      {/* 🧑‍🚀 우주복 헬멧 */}
      <div
        className="absolute top-[-20px] left-1/2 -translate-x-1/2 
             w-[92%] h-[60%] 
             rounded-t-full border-t-[5px] border-x-[5px]
             border-[#b4c8ff]/60 bg-gradient-to-b 
             from-white/20 to-transparent 
             shadow-[0_0_25px_rgba(150,200,255,0.3)]
             backdrop-blur-[3px]"
      />

      {/* ✨ 헬멧 반사광 */}
      <div className="absolute top-2 left-[25%] w-[100px] h-[60px]
             bg-white/25 rounded-full blur-[25px] opacity-60" />

      {/* 🪐 우주복 테두리 (넥링) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 
                   w-[70%] h-[20px] rounded-full
                   bg-gradient-to-r from-[#22316d] via-[#4f62a9] to-[#22316d]
                   shadow-[0_4px_20px_rgba(50,100,200,0.4)]"
      >
        <div className="absolute inset-0 rounded-full border-t border-[#8baaff]/40" />
      </div>

      {/* 🌌 작게 떠다니는 반사 입자 (가벼운 우주 느낌) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/40 rounded-full blur-[2px]"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
}
