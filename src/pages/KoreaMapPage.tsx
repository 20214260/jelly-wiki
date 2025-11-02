import { useEffect, useRef, useState } from "react"; 
import * as d3 from "d3";
import { geoPath, geoMercator, type GeoPermissibleObjects } from "d3-geo";
import krData from "../assets/maps/kr.json";
import { motion, AnimatePresence } from "framer-motion";
import LiquidAICharacter from "../components/LiquidAICharacter";

export default function KoreaMapPage() {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showSpeech, setShowSpeech] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 800;
    const height = 700;

    const projection = geoMercator()
      .center([128, 36])
      .scale(6000)
      .translate([width / 2 + 200, height / 2 + 50]);

    const path = geoPath(projection);
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    svg
      .selectAll("path")
      .data(krData.features as GeoPermissibleObjects[])
      .join("path")
      .attr("d", path)
      .attr("fill", (d: any) =>
        hovered === d.properties.name ? "#7cc28a" : "#90b78a"
      )
      .attr("stroke", "#2f3d2f")
      .attr("stroke-width", 1.3)
      .style("cursor", "pointer")
      .on("mouseover", (_event, d: any) => {
        setHovered(d.properties.name);
        if (d.properties.name === "South Jeolla") setShowSpeech(true);
      })
      .on("mouseout", () => {
        setHovered(null);
        setShowSpeech(false);
      });
  }, [hovered]);

  const isJeolla = hovered === "South Jeolla";

  return (
    <div className="relative w-screen h-screen flex justify-between items-center px-[6%] overflow-hidden">

      {/* 🌌 우주 배경 (성능 가벼움) */}
      {/* 🌌 우주 배경 */}
<div className="absolute inset-0 -z-10 overflow-hidden bg-[#01010a]">

  {/* 🪐 움직이는 성운 그라데이션 (깊이감) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(80,120,255,0.25),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(150,80,255,0.18),transparent_70%)] animate-[nebula_40s_linear_infinite] blur-[200px] opacity-70" />
  <style>{`
    @keyframes nebula {
      0% { transform: translate(0,0) scale(1); }
      50% { transform: translate(3%, -2%) scale(1.05); }
      100% { transform: translate(0,0) scale(1); }
    }
  `}</style>

  {/* 🌠 은하 그라데이션 (기존 유지) */}
  <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px]
                  bg-[radial-gradient(circle_at_center,_rgba(60,90,200,0.45),_transparent_70%)]
                  blur-[200px]" />
  <div className="absolute bottom-[-15%] right-[-10%] w-[1000px] h-[1000px]
                  bg-[radial-gradient(circle_at_center,_rgba(130,90,255,0.35),_transparent_75%)]
                  blur-[220px]" />
  <div className="absolute top-[50%] left-[50%] w-[900px] h-[900px]
                  -translate-x-1/2 -translate-y-1/2
                  bg-[radial-gradient(circle_at_center,_rgba(80,120,255,0.25),_transparent_80%)]
                  blur-[180px]" />

  {/* ✨ 별 패턴 1 (빠른 반짝임) */}
  <div className="absolute inset-0">
    {[...Array(120)].map((_, i) => (
      <div
        key={`s1-${i}`}
        className="absolute bg-white rounded-full opacity-70 animate-[twinkle_4s_infinite]"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 1.8 + 0.4}px`,
          height: `${Math.random() * 1.8 + 0.4}px`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>

  {/* ✨ 별 패턴 2 (느린 반짝임, 입체감 강화) */}
  <div className="absolute inset-0 opacity-70">
    {[...Array(60)].map((_, i) => (
      <div
        key={`s2-${i}`}
        className="absolute bg-[#b5d2ff] rounded-full animate-[slowTwinkle_9s_infinite]"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 0.8}px`,
          height: `${Math.random() * 3 + 0.8}px`,
          opacity: Math.random() * 0.4 + 0.3,
          animationDelay: `${Math.random() * 9}s`,
        }}
      />
    ))}
  </div>

  {/* 💫 은하 필름 (느리게 회전) */}
  <div className="absolute top-[30%] left-[40%] w-[900px] h-[900px] 
                  bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_80%)]
                  rounded-full blur-[200px] animate-[rotateGalaxy_120s_linear_infinite]" />

  <style>{`
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    @keyframes slowTwinkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.05); }
    }
    @keyframes rotateGalaxy {
      0% { transform: rotate(0deg) scale(1); }
      100% { transform: rotate(360deg) scale(1); }
    }
  `}</style>
</div>


      {/* 🧭 왼쪽 영역 */}
      <div className="flex flex-col justify-start w-[420px] h-full pt-10 relative">
        <h1 className="text-[#85a8ff] text-[36px] font-extrabold mb-2 tracking-wide">
          MAP INFOGRAPHIC
        </h1>
        <div className="w-[90%] h-[2px] bg-[#85a8ff] mb-6" />

        {/* 💬 캐릭터 말풍선 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isJeolla ? "jeolla" : "nation"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute top-[120px] left-[10px] w-[350px] z-20"
          >
            <div
              className="relative bg-gradient-to-br from-[#1e2747ee] to-[#2a3458ee]
                         border border-[#5b6aa833] rounded-[26px]
                         shadow-[0_8px_25px_rgba(20,40,90,0.4)]
                         px-7 py-5 backdrop-blur-sm hover:shadow-[0_12px_40px_rgba(70,90,200,0.35)]
                         transition-all duration-300"
            >
              {isJeolla ? (
                <>
                  <h2 className="text-[21px] font-extrabold text-[#f0f4ff] mb-2 tracking-tight">
                    자 여기는 전남!
                  </h2>
                  <p className="text-[15px] text-[#dfe7ff] mb-4">
                    이곳의 주요 도시는 아래와 같아 🌿
                  </p>
                  <div className="flex gap-3">
                    {[
                      { src: "/uiAssets/yeosu.jpg", alt: "여수" },
                      { src: "/uiAssets/suncheon.jpg", alt: "순천" },
                      { src: "/uiAssets/gwangyang.jpg", alt: "광양" },
                    ].map((city) => (
                      <div
                        key={city.alt}
                        className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg
                                   transition-all duration-300 group"
                      >
                        <img
                          src={city.src}
                          alt={city.alt}
                          className="w-[90px] h-[70px] object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[12px] text-center py-[2px]">
                          {city.alt}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-[21px] font-extrabold text-[#f3f6ff] mb-3 tracking-tight">
                    전국의 대학을 탐험해볼까?
                  </h2>
                  <p className="text-[15px] text-[#dee6ff] leading-relaxed mb-2">
                    한국 곳곳에는 개성 있는 대학교들이 있어요.  
                    어떤 곳은 <span className="font-semibold text-[#9fc3ff]">예술과 인문학</span>,  
                    또 어떤 곳은 <span className="font-semibold text-[#7fffd4]">과학과 공학</span>으로 유명하죠!
                  </p>
                  <p className="text-[14px] text-[#cbd8ff] leading-relaxed mb-3">
                    각 지역을 클릭하거나 마우스를 올리면  
                    그 지역의 대표 대학 정보를 볼 수 있어요.
                  </p>
                  <div className="mt-3 text-center">
                    <p className="text-[14.5px] font-medium text-[#b5caff] italic">
                      “자, 이제 어디부터 가볼까?” 🎓
                    </p>
                  </div>
                </>
              )}
              {/* 💬 말풍선 꼬리 */}
              <div
                className="absolute bottom-[-16px] left-[90px] w-0 h-0
                border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent
                border-t-[20px] border-t-[#1e2747ee] drop-shadow-sm"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 캐릭터 */}
        <div className="absolute top-[350px] left-[20px] w-[350px] z-20">
          <LiquidAICharacter />
        </div>
      </div>

      {/* 🗺 지도 및 hover 요소 */}
      <div className="flex-1 flex justify-center relative">
        <svg ref={mapRef} width={800} height={700}></svg>

        <AnimatePresence>
          {isJeolla && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute"
              style={{
                top: "60%",
                left: "54%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <div
                className="relative bg-[#ffffffee] border border-gray-300 
                           rounded-2xl shadow-lg px-4 py-3 w-[210px]
                           text-gray-800 backdrop-blur-sm"
              >
                <h3 className="text-[15px] font-bold text-[#1c1c1c] leading-tight mb-[4px]">
                  국립순천대학교{" "}
                  <span className="text-[#2e70ff] font-semibold">꿀팁 보기!</span>
                </h3>
                <p className="text-[12px] text-gray-600 leading-snug">
                  나머지 대학은 추후 <br />
                  추가될 예정입니다...
                </p>
                <div
                  className="absolute left-[40%] bottom-[-10px] w-0 h-0
                             border-l-[8px] border-l-transparent 
                             border-r-[8px] border-r-transparent
                             border-t-[10px] border-t-[#ffffffee] drop-shadow-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💬 오른쪽 패널 (기존 그대로 유지됨) */}
      <motion.div
        key={isJeolla ? "jeollaPanel" : "nationPanel"}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-[32%] top-[30%]
                   bg-gradient-to-br from-[#ffffffbb] to-[#f0f4ff99]
                   backdrop-blur-[8px]
                   border border-[#e3e6f0]
                   rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]
                   w-[420px] p-6 text-gray-900
                   before:content-[''] before:absolute
                   before:w-0 before:h-0
                   before:border-l-[18px] before:border-l-transparent
                   before:border-r-[18px] before:border-r-transparent
                   before:border-t-[26px] before:border-t-[#ffffffbb]
                   before:bottom-[-25px] before:left-[100px]
                   before:rotate-[20deg]"
      >
        {/* 기존 내용 100% 유지 */}
        {isJeolla ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-bold text-[#ffffff]">
                전라남도 대학교 보기!
              </h2>
              <span className="text-sm text-gray-300">Beta</span>
            </div>

            <div className="bg-[#ffffff88] rounded-xl p-4 shadow-sm mb-5">
              <p className="text-[15px] leading-relaxed mb-1 text-gray-900">
                현재 전라남도에서 서비스 되는 학교는{" "}
                <span className="font-semibold text-[#2e70ff]">
                  국립순천대학교
                </span>{" "}
                입니다.
              </p>
              <p className="text-[14px] text-gray-700">
                안정적 교육환경과 지역 상생을 바탕으로 성장 중이에요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#e6ecff] rounded-xl p-3 text-center">
                <p className="text-sm text-[#3c5fd7] font-semibold">학생 수</p>
                <p className="text-lg font-bold">12,340명</p>
              </div>
              <div className="bg-[#e8f8f1] rounded-xl p-3 text-center">
                <p className="text-sm text-[#2ea97a] font-semibold">교직원</p>
                <p className="text-lg font-bold">730명</p>
              </div>
            </div>

            <p className="text-[14px] text-gray-800 mb-3 leading-relaxed">
              순천대학교는 순천시 중심부에 위치하며 농업·환경·AI 분야에 강점을
              가지고 있습니다. 최근에는 친환경 캠퍼스 구축과 지역 혁신 프로젝트를
              추진 중이에요.
            </p>

            <a
              href="https://www.scnu.ac.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-4 bg-[#3c5fd7] hover:bg-[#324ec2]
                         text-white text-center font-semibold py-3 rounded-xl
                         transition-all shadow-sm"
            >
              순천대 공식 홈페이지 바로가기
            </a>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-bold text-[#ffffff]">
                전국 대학교 살펴보기
              </h2>
              <span className="text-sm text-gray-300">Beta</span>
            </div>

            <div className="bg-[#ffffff99] rounded-xl p-4 shadow-sm mb-5">
              <p className="text-[15px] leading-relaxed mb-1 text-gray-900">
                한국에는 400개 이상의 대학이 있어요.  
                각 지역마다 특색 있는 교육철학과 캠퍼스 문화가 자리 잡고 있죠.
              </p>
              <p className="text-[14px] text-gray-700">
                예를 들어, 서울은 융합 연구 중심, 강원은 자연 속 배움,  
                경상도는 산업 기술 혁신 중심으로 발전하고 있어요.
              </p>
            </div>

            <div className="bg-[#1c2b47]/30 rounded-xl p-4 shadow-sm mb-5">
              <p className="text-[14px] text-[#a2c0ff] font-semibold mb-2">
                🎓 지금은 베타 버전이에요.
              </p>
              <p className="text-[13px] text-gray-300 leading-relaxed">
                앞으로 각 지역을 클릭하면 대학별 강점, 학과 소개,  
                지역 협력 프로젝트 등 다양한 정보를 볼 수 있도록 업데이트될 예정이에요.
              </p>
            </div>

            <p className="text-[14px] text-gray-200 mb-3 leading-relaxed">
              지도 위를 천천히 둘러보며,  
              한국의 다양한 교육 이야기를 발견해보세요.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
