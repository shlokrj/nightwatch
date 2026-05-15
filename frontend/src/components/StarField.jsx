import { useEffect, useRef } from "react";

const NUM_STARS = 320;
const NUM_BRIGHT = 18;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Generate stars once
    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: randomBetween(0.4, 1.1),
      baseAlpha: randomBetween(0.4, 0.9),
      speed: randomBetween(0.0003, 0.0012),
      offset: Math.random() * Math.PI * 2,
    }));

    // A few larger, brighter accent stars
    const brightStars = Array.from({ length: NUM_BRIGHT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: randomBetween(1.2, 2.2),
      baseAlpha: randomBetween(0.6, 1.0),
      speed: randomBetween(0.0004, 0.001),
      offset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep space gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#04050e");
      grad.addColorStop(0.5, "#070a18");
      grad.addColorStop(1, "#04050e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw regular stars
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.offset));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      // Draw bright accent stars with a soft glow
      for (const s of brightStars) {
        const alpha = s.baseAlpha * (0.7 + 0.3 * Math.sin(t * s.speed * 1000 + s.offset));
        const glow = ctx.createRadialGradient(s.x * w, s.y * h, 0, s.x * w, s.y * h, s.r * 5);
        glow.addColorStop(0, `rgba(200, 220, 255, ${alpha})`);
        glow.addColorStop(1, "rgba(200, 220, 255, 0)");
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
        ctx.fill();
      }

      t += 16;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
