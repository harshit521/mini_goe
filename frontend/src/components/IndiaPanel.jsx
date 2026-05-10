import { useEffect, useRef, useState } from "react";

export default function IndiaPanel() {
  const canvasRef = useRef(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0, animFrame;

    // India outline – simplified polygon (normalized 0..1)
    const indiaPoints = [
      [0.38,0.02],[0.44,0.01],[0.52,0.03],[0.60,0.02],[0.68,0.05],
      [0.72,0.10],[0.75,0.16],[0.80,0.18],[0.84,0.24],[0.86,0.30],
      [0.82,0.36],[0.78,0.38],[0.82,0.44],[0.80,0.50],[0.76,0.54],
      [0.78,0.60],[0.74,0.66],[0.68,0.70],[0.62,0.78],[0.56,0.84],
      [0.50,0.90],[0.46,0.96],[0.42,0.90],[0.36,0.82],[0.30,0.74],
      [0.26,0.66],[0.24,0.58],[0.20,0.50],[0.22,0.44],[0.18,0.38],
      [0.20,0.30],[0.24,0.24],[0.22,0.18],[0.28,0.12],[0.32,0.06],
    ];

    // Heat zones (x, y, radius, intensity)
    const heatZones = [
      { x: 0.5, y: 0.22, r: 0.18, color: [220, 60, 40] },   // North – red
      { x: 0.55, y: 0.50, r: 0.14, color: [220, 120, 40] },  // Central – orange
      { x: 0.40, y: 0.65, r: 0.12, color: [200, 200, 40] },  // West – yellow
      { x: 0.60, y: 0.68, r: 0.10, color: [60, 200, 80] },   // East – green
      { x: 0.50, y: 0.80, r: 0.08, color: [40, 180, 80] },   // South – green
    ];

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Ocean background
      const bg = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, w*0.6);
      bg.addColorStop(0, "#0d1a20");
      bg.addColorStop(1, "#080e14");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Concentric rings on ocean
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, i * w * 0.12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(30,80,100,${0.08 - i*0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Clip to India shape
      ctx.save();
      ctx.beginPath();
      indiaPoints.forEach(([x, y], i) => {
        const px = x * w, py = y * h;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.clip();

      // Heat map inside India
      heatZones.forEach(({ x, y, r, color }) => {
        const cx = x * w, cy = y * h;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * w);
        const pulse = 0.85 + Math.sin(t * 0.04) * 0.15;
        grad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${0.85 * pulse})`);
        grad.addColorStop(0.6, `rgba(${color[0]},${color[1]},${color[2]},${0.3 * pulse})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.restore();

      // India border glow
      ctx.save();
      ctx.beginPath();
      indiaPoints.forEach(([x, y], i) => {
        const px = x * w, py = y * h;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(60,220,120,${0.5 + Math.sin(t * 0.03) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "#3ddc84";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

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
        <div>
          <span style={styles.label}>REGIONAL IMPACT ANALYTICS</span>
        </div>
        <div style={styles.liveSync}>
          <span style={styles.syncDot} />
          <span style={styles.syncText}>LIVE SYNC: 100%</span>
        </div>
      </div>

      <p style={styles.subtext}>
        Current effects of activities happening around world on India
      </p>

      <div style={styles.mapArea}>
        <canvas ref={canvasRef} style={styles.canvas} />

        <div style={styles.badges}>
          <div style={styles.badge}>
            <span style={styles.badgeLabel}>ECONOMIC:</span>
            <span style={{ ...styles.badgeValue, color: "#3ddc84" }}>+2.4%</span>
          </div>
          <div style={{ ...styles.badge, marginTop: "6px" }}>
            <span style={styles.badgeLabel}>SECURITY:</span>
            <span style={{ ...styles.badgeValue, color: "#e0a83a" }}>ADVISORY</span>
          </div>
        </div>
      </div>

      <div style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              ...styles.dot,
              background: i === slide ? "#c8922a" : "#2a2e32",
            }}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    flex: 1,
    background: "#0f1214",
    border: "1px solid #1a1e22",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px 0",
  },
  label: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: "#3ddc84",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  liveSync: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  syncDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#3ddc84",
    boxShadow: "0 0 4px #3ddc84",
  },
  syncText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#6a6865",
    letterSpacing: "0.5px",
  },
  subtext: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    color: "#8a8880",
    padding: "6px 16px 10px",
  },
  mapArea: {
    flex: 1,
    position: "relative",
    minHeight: "220px",
  },
  canvas: {
    width: "100%",
    height: "100%",
    display: "block",
    position: "absolute",
    top: 0, left: 0,
  },
  badges: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 2,
  },
  badge: {
    background: "rgba(10,12,14,0.85)",
    border: "1px solid #2a2e32",
    borderRadius: "3px",
    padding: "4px 8px",
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  badgeLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#6a6865",
    letterSpacing: "0.5px",
  },
  badgeValue: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  dots: {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
    padding: "10px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};