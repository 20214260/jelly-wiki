import KoreaMapPage from "./pages/KoreaMapPage"; // ✅ 한국 지도 페이지 임포트

export default function App() {
  return (
    <div className="w-screen h-screen">
      {/* 지금은 지구 대신 한국 페이지 테스트 */}
      <KoreaMapPage />
    </div>
  );
}
