// src/EarthScene.tsx
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as d3 from "d3-geo"; // ✅ three-geojson-geometry 대신 d3-geo 사용

interface EarthSceneProps {
  onHover: (country: string | null, position?: THREE.Vector3) => void; // ✅ 위치까지 전달
}

export default function EarthScene({ onHover }: EarthSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const geoDataRef = useRef<any>(null);
  const highlightRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    // 📷 카메라
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);

    // 💡 조명
    const ambient = new THREE.AmbientLight(0x404040, 1.3);
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(5, 2, 5);
    scene.add(ambient, directional);

    // 🌌 배경 (별)
    const starTexture = new THREE.TextureLoader().load("/starfield.jpg");
    starTexture.wrapS = THREE.RepeatWrapping;
    starTexture.wrapT = THREE.RepeatWrapping;
    starTexture.repeat.set(4, 4);
    starTexture.magFilter = THREE.LinearFilter;
    starTexture.minFilter = THREE.LinearMipmapLinearFilter;
    const starsGeo = new THREE.SphereGeometry(90, 64, 64);
    const starsMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(starsGeo, starsMat));

    // 🌠 렌더러
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "auto";
    mount.appendChild(renderer.domElement);

    // ✅ anisotropy
    starTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    starTexture.needsUpdate = true;

    // 🌍 텍스처 로드
    const loader = new THREE.TextureLoader();
    const dayMap = loader.load("/8k_earth_daymap.jpg");
    const nightMap = loader.load("/8k_earth_nightmap.jpg");
    const bumpMap = loader.load("/elev_bump_16k.jpg");
    const specMap = loader.load("/8k_earth_specular_map.jpg");
    const cloudsMap = loader.load("/fair_clouds_8k.jpg");

    // 🪨 지구 본체
    const earthGeo = new THREE.SphereGeometry(1, 128, 128);
    const earthMat = new THREE.MeshPhongMaterial({
      map: dayMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specMap,
      specular: new THREE.Color("gray"),
      shininess: 15,
      emissiveMap: nightMap,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.7,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // ☁️ 구름층
    const cloudGeo = new THREE.SphereGeometry(1.01, 128, 128);
    const cloudMat = new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.5,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    // 🌀 컨트롤러
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.4;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;

    // 🗺️ GeoJSON 로드
    fetch("/geojson/selected_countries.json")
      .then((res) => res.json())
      .then((data) => (geoDataRef.current = data));

    // 🎯 Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ✨ 하이라이트 그룹
    const highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 1,
      depthTest: false,
      toneMapped: false,
    });
    const highlightGroup = new THREE.Group();
    scene.add(highlightGroup);
    highlightRef.current = highlightGroup;

    // 🔆 윤곽선 업데이트 함수
    function updateHighlight(feature: any) {
      while (highlightGroup.children.length > 0)
        highlightGroup.remove(highlightGroup.children[0]);
      if (!feature || !feature.geometry) return;

      let polygons: number[][][] = [];
      if (feature.geometry.type === "Polygon")
        polygons = feature.geometry.coordinates;
      else if (feature.geometry.type === "MultiPolygon")
        polygons = feature.geometry.coordinates.flat();
      else return;

      const scale = 1.002;
      for (const ring of polygons) {
        const points: THREE.Vector3[] = [];
        for (const [lon, lat] of ring) {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (-lon) * (Math.PI / 180);
          const x = Math.sin(phi) * Math.cos(theta) * scale;
          const y = Math.cos(phi) * scale;
          const z = Math.sin(phi) * Math.sin(theta) * scale;
          points.push(new THREE.Vector3(x, y, z));
        }
        if (points.length > 1) {
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geo, highlightMaterial);
          highlightGroup.add(line);
        }
      }
    }

    // 🖱️ 마우스 이동 시 국가 감지
    function onMouseMove(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(earth);

      if (intersects.length > 0 && geoDataRef.current) {
        const local = intersects[0].point.clone();
        earth.worldToLocal(local);
        local.normalize();

        const lat = THREE.MathUtils.radToDeg(Math.asin(local.y));
        let lon = THREE.MathUtils.radToDeg(Math.atan2(-local.z, local.x));
        if (lon > 180) lon -= 360;
        if (lon < -180) lon += 360;

        const country = findCountry(lat, lon, geoDataRef.current);

        if (country) {
          const matched = geoDataRef.current.features.find(
            (f: any) => f.properties.ADMIN === country
          );
          if (matched) {
            updateHighlight(matched);

            // ✅ 중심 좌표 계산 추가
            const centroid = d3.geoCentroid(matched); // [lon, lat]
            const phi = (90 - centroid[1]) * (Math.PI / 180);
            const theta = (-centroid[0]) * (Math.PI / 180);
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);
            const worldPos = new THREE.Vector3(x, y, z);

            onHover(country, worldPos); // ✅ 나라 이름 + 위치 전달
          }
        } else {
          onHover(null);
          while (highlightGroup.children.length > 0)
            highlightGroup.remove(highlightGroup.children[0]);
        }
      } else {
        onHover(null);
        while (highlightGroup.children.length > 0)
          highlightGroup.remove(highlightGroup.children[0]);
      }
    }

    window.addEventListener("mousemove", onMouseMove);

    // 🔁 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.0008;
      clouds.rotation.y += 0.0012;
      highlightGroup.rotation.y += 0.0008;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 🔄 창 크기 변경
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // 🧹 정리
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, [onHover]);

  // 📍 위도·경도로 나라 찾기 (d3-geo)
  function findCountry(lat: number, lon: number, geoData: any): string | null {
    const point: [number, number] = [lon, lat];
    for (const feature of geoData.features) {
      if (d3.geoContains(feature, point)) return feature.properties.ADMIN;
    }
    return null;
  }

  // 🧭 JSX 출력
  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0, // ✅ 가장 뒤
      }}
    />
  );
}
