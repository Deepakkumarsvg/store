import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const theme = createTheme({
  palette: {
    primary: { main: "#C8281A" },
    secondary: { main: "#F5A623" },
  },
  typography: { fontFamily: "'Poppins', sans-serif" },
});

// ─── Slide Data with real Unsplash images ─────────────────────────────────────
const slides = [
  {
    id: 0,
    brand: "Classic Griha Udyog",
    tagline: ["Sabse", "Best!"],
    subtitle: "Homemade Taste • Every Time",
    category: "PICKLES",
    accentColor: "#F5A623",
    accentDark: "#c47d0a",
    gradFrom: "#3D0C00",
    gradMid: "#8B2000",
    gradTo: "#C8281A",
    heroImg: "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=1400&q=90&auto=format&fit=crop",
    products: [
      {
        name: "Mango Pickle",
        color: "#F5A623",
        img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Mixed Vegetable",
        color: "#E85D04",
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Sweet Lime Pickle",
        color: "#FFD60A",
        img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Chilli Pickle",
        color: "#FF3B30",
        img: "https://images.unsplash.com/photo-1583224994559-3ecfb9d4bf7d?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Mango Chunda",
        color: "#FB8500",
        img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Garlic Pickle",
        color: "#E9C46A",
        img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80&auto=format&fit=crop",
      },
    ],
    badge: "🫙 Handcrafted",
    cta: "Explore Pickles",
  },
  {
    id: 1,
    brand: "Classic Griha Udyog",
    tagline: ["Noodles", "Every Mood!"],
    subtitle: "Quick • Tasty • Ready to Cook",
    category: "NOODLES",
    accentColor: "#FFD700",
    accentDark: "#c9a800",
    gradFrom: "#0A0A0A",
    gradMid: "#6B0000",
    gradTo: "#C8281A",
    heroImg: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1400&q=90&auto=format&fit=crop",
    products: [
      {
        name: "Hakka Noodles",
        color: "#4CAF50",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Instant Noodles",
        color: "#FF9800",
        img: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Rice Noodles",
        color: "#E0C8A0",
        img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Multigrain Noodles",
        color: "#A0856A",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&auto=format&fit=crop",
      },
    ],
    badge: "🍜 Ready to Cook",
    cta: "Explore Noodles",
  },
  {
    id: 2,
    brand: "Classic Griha Udyog",
    tagline: ["Pure Desi", "Ghee!"],
    subtitle: "A2 Milk • Bilona Method • Small Batches",
    category: "DAIRY",
    accentColor: "#FFF3B0",
    accentDark: "#e0c800",
    gradFrom: "#1a0e00",
    gradMid: "#6B4400",
    gradTo: "#C48A00",
    heroImg: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=1400&q=90&auto=format&fit=crop",
    products: [
      {
        name: "Gir Cow Ghee",
        color: "#FFF3B0",
        img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Peanut Chutney",
        color: "#D4A574",
        img: "https://images.unsplash.com/photo-1596791051880-a20e5bb7a8ab?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Methi Mathri",
        color: "#C8A96E",
        img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80&auto=format&fit=crop",
      },
      {
        name: "Imli Chutney",
        color: "#C97A3A",
        img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80&auto=format&fit=crop",
      },
    ],
    badge: "🥛 Pure A2",
    cta: "Explore Dairy",
  },
];

const tickerItems = [
  "🥭 Mango Pickle", "🍜 Hakka Noodles", "🧄 Garlic Pickle",
  "⚡ Instant Noodles", "🌶️ Chilli Pickle", "🥛 Gir Cow Ghee",
  "🍋 Sweet Lime Pickle", "🌾 Multigrain Noodles", "🫙 Homemade Taste",
  "✅ Sabse Best", "🏆 Premium Quality", "🚚 Pan India Delivery",
];

// ─── Auto-advancing progress bar ─────────────────────────────────────────────
const ProgressBar = ({ active, duration, accentColor }) => (
  <Box sx={{
    height: 3, flex: 1,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 2, overflow: "hidden",
  }}>
    <Box sx={{
      height: "100%",
      background: accentColor,
      borderRadius: 2,
      width: active ? "100%" : "0%",
      transition: active ? `width ${duration}ms linear` : "none",
      boxShadow: `0 0 6px ${accentColor}`,
    }} />
  </Box>
);

export default function AnimatedBanner() {
  const SLIDE_DURATION = 6000;
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [direction, setDirection] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [productIdx, setProductIdx] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [imgLoaded, setImgLoaded] = useState({});
  const [hovered, setHovered] = useState(false);
  const slideTimerRef = useRef(null);
  const prodTimerRef = useRef(null);
  const slide = slides[activeSlide];

  const navigate = useCallback((dir) => {
    if (transitioning) return;
    const next = (activeSlide + dir + slides.length) % slides.length;
    setDirection(dir);
    setPrevSlide(activeSlide);
    setTransitioning(true);
    setTimeout(() => {
      setActiveSlide(next);
      setProductIdx(0);
      setProgressKey((k) => k + 1);
      setTransitioning(false);
      setPrevSlide(null);
    }, 650);
  }, [activeSlide, transitioning]);

  const goToSlide = useCallback((idx) => {
    if (transitioning || idx === activeSlide) return;
    navigate(idx > activeSlide ? 1 : -1);
  }, [activeSlide, transitioning, navigate]);

  useEffect(() => {
    if (hovered) { clearInterval(slideTimerRef.current); return; }
    slideTimerRef.current = setInterval(() => navigate(1), SLIDE_DURATION);
    return () => clearInterval(slideTimerRef.current);
  }, [activeSlide, hovered, navigate]);

  useEffect(() => {
    clearInterval(prodTimerRef.current);
    prodTimerRef.current = setInterval(() => {
      setProductIdx((p) => (p + 1) % slides[activeSlide].products.length);
    }, 1400);
    return () => clearInterval(prodTimerRef.current);
  }, [activeSlide]);

  const handleImgLoad = (id) => setImgLoaded((p) => ({ ...p, [id]: true }));

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&family=Baloo+2:wght@700;800;900&family=Rajdhani:wght@600;700&display=swap');

        @keyframes slideEnterRight { from{transform:translateX(100%);opacity:0}  to{transform:translateX(0);opacity:1} }
        @keyframes slideEnterLeft  { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes slideExitLeft   { from{transform:translateX(0);opacity:1}  to{transform:translateX(-100%);opacity:0} }
        @keyframes slideExitRight  { from{transform:translateX(0);opacity:1}  to{transform:translateX(100%);opacity:0}  }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeScale { from{opacity:0;transform:scale(.75) rotate(-6deg)} to{opacity:1;transform:scale(1) rotate(0)} }
        @keyframes floatBob  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.04)} }
        @keyframes shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes ringPulse { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.1;transform:scale(1.22)} }
        @keyframes ctaGlow   { 0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.3)} 50%{box-shadow:0 8px 32px rgba(245,166,35,.45)} }
        @keyframes badgePop  { from{transform:scale(.5) rotate(-15deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes kenBurns  { from{transform:scale(1) translate(0,0)} to{transform:scale(1.08) translate(-1%,-1%)} }
        @keyframes imgReveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0 0 0)} }

        .slide-enter-fwd  { animation: slideEnterRight .65s cubic-bezier(.4,0,.2,1) forwards }
        .slide-enter-back { animation: slideEnterLeft  .65s cubic-bezier(.4,0,.2,1) forwards }
        .slide-exit-fwd   { animation: slideExitLeft   .65s cubic-bezier(.4,0,.2,1) forwards }
        .slide-exit-back  { animation: slideExitRight  .65s cubic-bezier(.4,0,.2,1) forwards }
        .hero-kb          { animation: kenBurns ${SLIDE_DURATION}ms ease-in-out both }
        .float-bob        { animation: floatBob 3.5s ease-in-out infinite }
        .ring-pulse       { animation: ringPulse 3s ease-in-out infinite }
        .prod-img-enter   { animation: imgReveal .5s ease forwards, floatBob 3.5s .5s ease-in-out infinite }
      `}</style>

      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{ width: "100%", position: "relative", fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ── SLIDER TRACK ────────────────────────────────────────────────── */}
        <Box sx={{
          position: "relative",
          width: "100%",
          height: { xs: 320, sm: 420, md: 500 },
          overflow: "hidden",
          borderRadius: { xs: 0, md: "5px" },
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
          {[
            { s: slides[activeSlide], isPrev: false },
            ...(prevSlide !== null ? [{ s: slides[prevSlide], isPrev: true }] : []),
          ].map(({ s, isPrev }) => (
            <Box
              key={s.id}
              className={
                isPrev
                  ? direction === 1 ? "slide-exit-fwd" : "slide-exit-back"
                  : transitioning
                    ? direction === 1 ? "slide-enter-fwd" : "slide-enter-back"
                    : ""
              }
              sx={{ position: "absolute", inset: 0, zIndex: isPrev ? 1 : 2, overflow: "hidden" }}
            >
              {/* Hero background image + Ken Burns */}
              <Box
                component="img"
                src={s.heroImg}
                alt={s.category}
                className="hero-kb"
                onLoad={() => handleImgLoad(`hero-${s.id}`)}
                sx={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center",
                  opacity: imgLoaded[`hero-${s.id}`] ? 1 : 0,
                  transition: "opacity .6s ease",
                }}
              />

              {/* Overlay layers */}
              <Box sx={{
                position: "absolute", inset: 0,
                background: `linear-gradient(105deg, ${s.gradFrom}F2 0%, ${s.gradMid}CC 45%, ${s.gradTo}88 68%, transparent 100%)`,
              }} />
              <Box sx={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)",
              }} />

              {/* Decorative rings */}
              {[180, 280, 380].map((sz, ri) => (
                <Box key={ri} className="ring-pulse" sx={{
                  position: "absolute",
                  right: { xs: -sz / 3, md: -sz / 4 },
                  top: { xs: -sz / 3, md: -sz / 4 },
                  width: sz, height: sz,
                  borderRadius: "50%",
                  border: `1.5px solid ${s.accentColor}`,
                  opacity: 0.18,
                  animationDelay: `${ri * 0.9}s`,
                }} />
              ))}

              {/* Category + badge (top-left) */}
              <Box sx={{
                position: "absolute",
                top: { xs: 12, md: 22 }, left: { xs: 14, md: 28 },
                zIndex: 10, display: "flex", flexDirection: "column", gap: 0.8,
              }}>
                <Box sx={{
                  display: "inline-flex", alignItems: "center",
                  background: "rgba(0,0,0,0.6)",
                  border: `1.5px solid ${s.accentColor}55`,
                  backdropFilter: "blur(12px)",
                  borderRadius: "10px", px: { xs: 1.2, md: 1.8 }, py: 0.5,
                }}>
                  <Typography sx={{
                    color: s.accentColor, fontWeight: 700,
                    fontSize: { xs: "0.6rem", md: "0.7rem" },
                    letterSpacing: 2.5, fontFamily: "'Rajdhani', sans-serif",
                    textTransform: "uppercase",
                  }}>
                    {s.category}
                  </Typography>
                </Box>
                <Box sx={{
                  background: s.accentColor, borderRadius: "8px",
                  px: 1.2, py: 0.35,
                  display: "inline-flex", alignItems: "center",
                  width: "fit-content",
                  animation: "badgePop .5s .25s ease both",
                }}>
                  <Typography sx={{
                    color: "#111", fontWeight: 800,
                    fontSize: { xs: "0.58rem", md: "0.65rem" }, letterSpacing: 0.3,
                  }}>
                    {s.badge}
                  </Typography>
                </Box>
              </Box>

              {/* ── Content row ── */}
              <Box sx={{
                position: "absolute", inset: 0, zIndex: 5,
                display: "flex", alignItems: "center",
                px: { xs: 2, sm: 4, md: 5 }, pt: { xs: 7, md: 9 },
              }}>
                {/* LEFT — text */}
                <Box sx={{
                  flex: "0 0 auto",
                  maxWidth: { xs: "52%", sm: "46%", md: "42%" },
                  animation: "fadeUp .6s .1s ease both",
                }}>
                  <Typography sx={{
                    fontFamily: "'Rajdhani', sans-serif",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: { xs: "0.6rem", md: "0.75rem" },
                    letterSpacing: 3, fontWeight: 600,
                    mb: 0.4, textTransform: "uppercase",
                    animation: "fadeUp .5s ease both",
                  }}>
                    {s.brand}
                  </Typography>

                  <Typography sx={{
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 900,
                    fontSize: { xs: "1.75rem", sm: "2.3rem", md: "3.1rem" },
                    lineHeight: 1.05,
                    color: "#fff",
                    textShadow: "0 4px 24px rgba(0,0,0,0.6)",
                    animation: "fadeUp .6s .15s ease both",
                    mb: 0.5,
                  }}>
                    {s.tagline[0]}{" "}
                    <Box component="span" sx={{
                      color: s.accentColor,
                      textShadow: `0 0 28px ${s.accentColor}88`,
                    }}>
                      {s.tagline[1]}
                    </Box>
                  </Typography>

                  <Typography sx={{
                    color: "rgba(255,255,255,0.68)",
                    fontSize: { xs: "0.68rem", md: "0.85rem" },
                    fontWeight: 500, mb: { xs: 2, md: 2.5 },
                    letterSpacing: 0.4,
                    animation: "fadeUp .6s .25s ease both",
                  }}>
                    {s.subtitle}
                  </Typography>

                  <Box sx={{
                    display: "inline-flex", alignItems: "center", gap: 1,
                    background: `linear-gradient(135deg, ${s.accentColor} 0%, ${s.accentDark} 100%)`,
                    color: "#111", borderRadius: "28px",
                    px: { xs: 1.8, md: 2.8 }, py: { xs: 0.8, md: 1.1 },
                    fontWeight: 800, fontSize: { xs: "0.7rem", md: "0.83rem" },
                    cursor: "pointer", letterSpacing: 0.4,
                    userSelect: "none",
                    animation: "fadeUp .6s .35s ease both, ctaGlow 2.2s 1s ease-in-out infinite",
                    border: `2px solid ${s.accentColor}`,
                    transition: "all .25s ease",
                    "&:hover": { filter: "brightness(1.1)", transform: "translateY(-2px) scale(1.03)" },
                  }}>
                    🛒 {s.cta}
                  </Box>

                  {/* Slide progress bars */}
                  <Box sx={{ display: "flex", gap: 0.8, mt: { xs: 1.8, md: 2.5 }, maxWidth: 180 }}>
                    {slides.map((_, si) => (
                      <ProgressBar
                        key={`${si}-${progressKey}`}
                        active={si === activeSlide && !hovered}
                        duration={SLIDE_DURATION}
                        accentColor={si === activeSlide ? s.accentColor : "rgba(255,255,255,0.35)"}
                      />
                    ))}
                  </Box>
                </Box>

                {/* RIGHT — product showcase */}
                <Box sx={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: { xs: 1, md: 1.5 },
                  animation: "fadeUp .7s .2s ease both",
                }}>
                  {/* Product circle image */}
                  <Box sx={{ position: "relative" }}>
                    <Box className="ring-pulse" sx={{
                      position: "absolute", inset: -14,
                      borderRadius: "50%",
                      border: `2px solid ${s.accentColor}55`,
                    }} />
                    <Box className="ring-pulse" sx={{
                      position: "absolute", inset: -28,
                      borderRadius: "50%",
                      border: `1px solid ${s.accentColor}28`,
                      animationDelay: ".5s",
                    }} />
                    <Box
                      key={`${activeSlide}-${productIdx}`}
                      className="prod-img-enter"
                      component="img"
                      src={s.products[productIdx].img}
                      alt={s.products[productIdx].name}
                      onLoad={() => handleImgLoad(`prod-${activeSlide}-${productIdx}`)}
                      sx={{
                        width: { xs: 110, sm: 140, md: 168 },
                        height: { xs: 110, sm: 140, md: 168 },
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: `3.5px solid ${s.products[productIdx].color}cc`,
                        boxShadow: `0 14px 44px rgba(0,0,0,0.55), 0 0 0 6px ${s.products[productIdx].color}22`,
                        display: "block",
                      }}
                    />
                    {/* Counter badge */}
                    <Box sx={{
                      position: "absolute", bottom: 4, right: 4,
                      background: s.accentColor, color: "#111",
                      borderRadius: "50%",
                      width: { xs: 22, md: 28 }, height: { xs: 22, md: 28 },
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: { xs: "0.58rem", md: "0.68rem" },
                      border: "2px solid rgba(0,0,0,0.25)",
                      animation: "badgePop .4s ease",
                    }}>
                      {productIdx + 1}/{s.products.length}
                    </Box>
                  </Box>

                  {/* Product name */}
                  <Box
                    key={`pname-${productIdx}-${activeSlide}`}
                    sx={{
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(14px)",
                      border: `1.5px solid ${s.products[productIdx].color}88`,
                      borderRadius: "12px",
                      px: { xs: 1.5, md: 2.5 }, py: 0.6,
                      animation: "fadeScale .35s ease",
                    }}
                  >
                    <Typography sx={{
                      color: s.products[productIdx].color,
                      fontWeight: 800,
                      fontSize: { xs: "0.72rem", md: "0.92rem" },
                      textAlign: "center",
                      fontFamily: "'Baloo 2', cursive",
                    }}>
                      {s.products[productIdx].name}
                    </Typography>
                  </Box>

                  {/* Thumbnail row */}
                  <Box sx={{
                    display: "flex", gap: { xs: 0.5, md: 0.7 },
                    flexWrap: "wrap", justifyContent: "center",
                    maxWidth: { xs: 190, md: 250 },
                  }}>
                    {s.products.map((p, pi) => (
                      <Box
                        key={pi}
                        onClick={() => setProductIdx(pi)}
                        sx={{
                          width: { xs: 26, md: 34 }, height: { xs: 26, md: 34 },
                          borderRadius: "50%", overflow: "hidden",
                          border: pi === productIdx
                            ? `2.5px solid ${p.color}`
                            : "2px solid rgba(255,255,255,0.22)",
                          cursor: "pointer",
                          transition: "all .25s ease",
                          boxShadow: pi === productIdx ? `0 0 12px ${p.color}99` : "none",
                          transform: pi === productIdx ? "scale(1.18)" : "scale(1)",
                          "&:hover": { transform: "scale(1.22)", borderColor: p.color },
                        }}
                      >
                        <Box
                          component="img"
                          src={p.img}
                          alt={p.name}
                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Bottom shimmer bar */}
              <Box sx={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 5, zIndex: 8,
                background: `linear-gradient(90deg,transparent,${s.accentColor},${s.accentColor}dd,${s.accentColor},transparent)`,
                backgroundSize: "600px 5px",
                animation: "shimmer 2.2s linear infinite",
              }} />
            </Box>
          ))}

          {/* ── Nav arrows ── */}
          {[
            { dir: -1, Icon: ArrowBackIosNewIcon, pos: { left: { xs: 8, md: 16 } } },
            { dir: 1,  Icon: ArrowForwardIosIcon, pos: { right: { xs: 8, md: 16 } } },
          ].map(({ dir, Icon, pos }) => (
            <IconButton
              key={dir}
              onClick={() => navigate(dir)}
              sx={{
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                zIndex: 20, ...pos,
                width: { xs: 34, md: 44 }, height: { xs: 34, md: 44 },
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                border: `1.5px solid ${slide.accentColor}44`,
                color: "#1a1a1a",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "all .25s ease",
                "&:hover": {
                  background: slide.accentColor,
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: `0 8px 28px ${slide.accentColor}55`,
                },
              }}
            >
              <Icon sx={{ fontSize: { xs: "0.8rem", md: "0.95rem" } }} />
            </IconButton>
          ))}

          {/* ── Dot indicators ── */}
          <Box sx={{
            position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 1, zIndex: 15,
          }}>
            {slides.map((_, si) => (
              <Box key={si} onClick={() => goToSlide(si)} sx={{
                width: si === activeSlide ? 28 : 10, height: 10,
                borderRadius: 5, cursor: "pointer",
                background: si === activeSlide ? slide.accentColor : "rgba(255,255,255,0.35)",
                border: `1.5px solid ${si === activeSlide ? slide.accentColor : "rgba(255,255,255,0.25)"}`,
                transition: "all .35s ease",
                boxShadow: si === activeSlide ? `0 0 10px ${slide.accentColor}` : "none",
                "&:hover": { background: slide.accentColor, opacity: 0.9 },
              }} />
            ))}
          </Box>
        </Box>

        {/* ── TICKER ──────────────────────────────────────────────────────── */}
        <Box sx={{
          width: "100%",
          background: `linear-gradient(90deg, ${slide.gradFrom}F5, ${slide.gradMid}E8, ${slide.gradFrom}F5)`,
          borderTop: `2px solid ${slide.accentColor}44`,
          borderBottom: `2px solid ${slide.accentColor}22`,
          py: 1.1, overflow: "hidden",
          transition: "background .6s ease",
        }}>
          <Box sx={{
            display: "flex", gap: 5,
            animation: "marquee 22s linear infinite",
            width: "max-content",
          }}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <Typography key={i} sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: { xs: "0.7rem", md: "0.78rem" },
                fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.4,
                display: "flex", alignItems: "center",
              }}>
                {item}
                <Box component="span" sx={{ color: slide.accentColor, mx: 1.5, fontSize: "0.55rem" }}>◆</Box>
              </Typography>
            ))}
          </Box>
        </Box>

        {/* ── PRODUCT CHIP STRIP ───────────────────────────────────────────── */}
        <Box sx={{
          display: "flex", gap: 0.8, flexWrap: "wrap",
          justifyContent: "center", mt: 1.5, px: 2,
        }}>
          {slide.products.map((p, pi) => (
            <Chip
              key={pi}
              label={p.name}
              size="small"
              onClick={() => setProductIdx(pi)}
              avatar={
                <Box
                  component="img"
                  src={p.img}
                  alt={p.name}
                  sx={{
                    width: 22, height: 22, borderRadius: "50%",
                    objectFit: "cover",
                    border: `1.5px solid ${p.color}`,
                  }}
                />
              }
              sx={{
                background: pi === productIdx ? `${p.color}33` : "rgba(255,255,255,0.07)",
                color: pi === productIdx ? p.color : "rgba(255,255,255,0.55)",
                border: `1.5px solid ${pi === productIdx ? p.color : "rgba(255,255,255,0.14)"}`,
                fontWeight: 700, fontSize: "0.7rem",
                backdropFilter: "blur(8px)",
                cursor: "pointer", transition: "all .25s ease",
                boxShadow: pi === productIdx ? `0 4px 16px ${p.color}44` : "none",
                "& .MuiChip-avatar": { width: 20, height: 20 },
                "&:hover": {
                  background: `${p.color}44`, color: p.color,
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${p.color}44`,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}