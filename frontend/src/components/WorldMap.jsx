import { useEffect, useRef } from "react";

export default function WorldMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    const dots = [
      { x: 0.38, y: 0.42, color: "#3ddc84", pulse: true, label: "IOR" },
      { x: 0.72, y: 0.48, color: "#e0a83a", pulse: false, label: "ME" },
    ];

    function drawGrid(w, h) {
      ctx.strokeStyle = "rgba(40,55,65,0.4)";
      ctx.lineWidth = 0.5;
      const cols = 24, rows = 12;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo((i / cols) * w, 0);
        ctx.lineTo((i / cols) * w, h);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, (j / rows) * h);
        ctx.lineTo(w, (j / rows) * h);
        ctx.stroke();
      }
    }

    // eslint-disable-next-line no-unused-vars
    function drawContinent(ctx, path, w, h) {
      ctx.save();
      ctx.scale(w, h);
      ctx.beginPath();
      const p = new Path2D(path);
      ctx.fillStyle = "rgba(45,60,55,0.7)";
      ctx.fill(p);
      ctx.strokeStyle = "rgba(80,110,90,0.5)";
      ctx.lineWidth = 0.5 / w;
      ctx.stroke(p);
      ctx.restore();
    }

    function drawLandmasses(w, h) {
      // Simplified world landmasses as rough shapes
      ctx.save();
      // North America
      ctx.beginPath();
      ctx.fillStyle = "rgba(40,60,52,0.8)";
      ctx.strokeStyle = "rgba(70,100,80,0.6)";
      ctx.lineWidth = 1;
      const na = [
        [0.05,0.12],[0.25,0.08],[0.30,0.15],[0.28,0.22],[0.22,0.30],
        [0.18,0.50],[0.14,0.58],[0.10,0.52],[0.06,0.40],[0.04,0.25]
      ];
      ctx.beginPath();
      na.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // South America
      const sa = [
        [0.18,0.52],[0.26,0.50],[0.28,0.58],[0.26,0.72],[0.22,0.82],
        [0.18,0.88],[0.15,0.80],[0.14,0.68],[0.15,0.58]
      ];
      ctx.beginPath();
      sa.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Europe
      const eu = [
        [0.42,0.10],[0.52,0.08],[0.56,0.14],[0.54,0.22],[0.48,0.28],
        [0.44,0.24],[0.42,0.18]
      ];
      ctx.beginPath();
      eu.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Africa
      const af = [
        [0.44,0.28],[0.54,0.26],[0.58,0.34],[0.58,0.50],[0.54,0.64],
        [0.50,0.70],[0.46,0.64],[0.42,0.50],[0.42,0.36]
      ];
      ctx.beginPath();
      af.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Asia
      const as_ = [
        [0.54,0.08],[0.80,0.06],[0.88,0.10],[0.90,0.20],[0.86,0.32],
        [0.80,0.38],[0.74,0.42],[0.68,0.40],[0.62,0.36],[0.56,0.30],
        [0.54,0.22],[0.54,0.14]
      ];
      ctx.beginPath();
      as_.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Australia
      const au = [
        [0.80,0.56],[0.92,0.54],[0.96,0.60],[0.94,0.70],[0.88,0.74],
        [0.80,0.72],[0.76,0.66],[0.78,0.60]
      ];
      ctx.beginPath();
      au.forEach(([x,y],i) => i===0 ? ctx.moveTo(x*w,y*h) : ctx.lineTo(x*w,y*h));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.restore();
    }

    function drawDot(dot, w, h, t) {
      const x = dot.x * w, y = dot.y * h;
      if (dot.pulse) {
        const r = 12 + Math.sin(t * 0.08) * 6;
        const alpha = 0.2 + Math.sin(t * 0.08) * 0.15;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61,220,132,${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(61,220,132,0.3)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
    }

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0a1018");
      grad.addColorStop(1, "#080c12");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      drawGrid(w, h);
      drawLandmasses(w, h);

      // Equator line
      ctx.strokeStyle = "rgba(200,146,42,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.46);
      ctx.lineTo(w, h * 0.46);
      ctx.stroke();
      ctx.setLineDash([]);

      dots.forEach(d => drawDot(d, w, h, t));

      // Scan line
      const scanY = ((t * 1.2) % h);
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, "rgba(61,220,132,0)");
      scanGrad.addColorStop(0.5, "rgba(61,220,132,0.04)");
      scanGrad.addColorStop(1, "rgba(61,220,132,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, w, 60);

      t++;
      animFrame = requestAnimationFrame(draw);
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.globe}>🌐</span>
          <span style={styles.title}>GLOBAL MARITIME & LAND DOMAIN</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>LOW THREAT</span>
          <span style={styles.statusDotOrange} />
          <span style={styles.statusText}>ACTIVE MONITORING</span>
        </div>
      </div>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
}

const styles = {
  wrapper: {
    flex: 1,
    background: "#0a0f14",
    border: "1px solid #1a1e22",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #1a1e22",
    background: "rgba(10,15,20,0.8)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  globe: {
    fontSize: "14px",
  },
  title: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "#8a8880",
    letterSpacing: "2px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3ddc84",
    boxShadow: "0 0 6px #3ddc84",
  },
  statusDotOrange: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#e0a83a",
    boxShadow: "0 0 6px #e0a83a",
  },
  statusText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#6a6865",
    letterSpacing: "1px",
    marginRight: "8px",
  },
  canvas: {
    flex: 1,
    width: "100%",
    display: "block",
  },
};