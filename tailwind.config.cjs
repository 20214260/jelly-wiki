// tailwind.config.cjs
module.exports = {
  // Tailwind v3+ 는 JIT 기본값이라 mode 생략 가능
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // ✅ 동적 클래스를 확실히 포함시킴
    "text-spaceBlue",
    "text-neonPurple",
    "text-brightCyan",
    "text-glowPink",
  ],
  theme: {
    extend: {
      colors: {
        spaceBlue: "#5dade2",
        neonPurple: "#bb8fce",
        brightCyan: "#48c9b0",
        glowPink: "#f1948a",
      },
    },
  },
  plugins: [],
};
