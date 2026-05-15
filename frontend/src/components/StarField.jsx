import { useEffect, useRef } from "react";

const STAR_LAYERS = [
  { count: 760, radius: [0.22, 0.72], alpha: [0.14, 0.56], speed: [0.04, 0.12] },
  { count: 230, radius: [0.62, 1.18], alpha: [0.28, 0.82], speed: [0.08, 0.18] },
  { count: 46, radius: [1.15, 2.08], alpha: [0.52, 1], speed: [0.1, 0.22], glow: true },
];
const DUST_COUNT = 520;

function createRandom(seed) {
  let value = seed;

  return function random() {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function randomBetween(random, min, max) {
  return min + random() * (max - min);
}

function makeStars() {
  const random = createRandom(20260515);

  return STAR_LAYERS.flatMap((layer, layerIndex) =>
    Array.from({ length: layer.count }, () => ({
      x: random(),
      y: random(),
      r: randomBetween(random, layer.radius[0], layer.radius[1]),
      baseAlpha: randomBetween(random, layer.alpha[0], layer.alpha[1]),
      speed: randomBetween(random, layer.speed[0], layer.speed[1]),
      offset: random() * Math.PI * 2,
      hue: randomBetween(random, 42, 56),
      layer: layerIndex,
      glow: Boolean(layer.glow),
      drift: randomBetween(random, 0.18, 0.62),
    }))
  );
}

function makeDust() {
  const random = createRandom(918273);

  return Array.from({ length: DUST_COUNT }, () => {
    const path = randomBetween(random, -0.08, 1.08);
    const spread = randomBetween(random, -0.18, 0.18);

    return {
      x: path + spread * 0.44,
      y: 0.8 - path * 0.52 + spread,
      r: randomBetween(random, 0.18, 0.82),
      alpha: randomBetween(random, 0.025, 0.11),
      tone: random(),
    };
  }).filter((p) => p.x > -0.08 && p.x < 1.08 && p.y > -0.08 && p.y < 1.08);
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = makeStars();
    const dust = makeDust();
    let animId;
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(now) {
      const seconds = now / 1000;
      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, width, height);
      sky.addColorStop(0, "#010207");
      sky.addColorStop(0.32, "#061018");
      sky.addColorStop(0.68, "#08070f");
      sky.addColorStop(1, "#010207");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const point of dust) {
        const alpha = point.alpha * (0.76 + 0.24 * Math.sin(seconds * 0.28 + point.x * 9));
        const blush = point.tone > 0.74;
        ctx.fillStyle = blush
          ? `rgba(213, 138, 195, ${alpha * 0.42})`
          : `rgba(244, 210, 142, ${alpha * 0.78})`;
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, point.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const driftX = Math.sin(seconds * s.drift + s.offset) * (s.layer + 1) * 0.55;
        const driftY = Math.cos(seconds * s.drift * 0.72 + s.offset) * (s.layer + 1) * 0.32;
        const x = s.x * width + driftX;
        const y = s.y * height + driftY;
        const alpha = s.baseAlpha * (0.72 + 0.28 * Math.sin(seconds * s.speed + s.offset));

        if (s.glow) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, s.r * 7);
          glow.addColorStop(0, `rgba(255, 242, 199, ${alpha * 0.33})`);
          glow.addColorStop(0.42, `rgba(233, 163, 107, ${alpha * 0.1})`);
          glow.addColorStop(1, "rgba(233, 163, 107, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(248, 243, 231, ${alpha * 0.24})`;
          ctx.lineWidth = 0.42;
          ctx.beginPath();
          ctx.moveTo(x - s.r * 4.4, y);
          ctx.lineTo(x + s.r * 4.4, y);
          ctx.moveTo(x, y - s.r * 3.4);
          ctx.lineTo(x, y + s.r * 3.4);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 45%, 88%, ${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.78);
      vignette.addColorStop(0, "rgba(2, 3, 10, 0)");
      vignette.addColorStop(0.68, "rgba(2, 3, 10, 0.25)");
      vignette.addColorStop(1, "rgba(2, 3, 10, 0.82)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}
