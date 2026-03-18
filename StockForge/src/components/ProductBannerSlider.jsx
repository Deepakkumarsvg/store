import { useState, useEffect } from 'react';
import { Box, IconButton, Container } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import '../css/banner-slider.css';

const banners = [
  {
    id: 1,
    type: 'noodles',
    image: '/banners/noodles-banner.jpg',
    title: 'NOODLES',
    subtitle: 'For Every Mood!',
    description: 'Hakka • Instant • Rice • Multigrain',
    fallbackGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #f8b500 100%)',
    emoji: '🍜'
  },
  {
    id: 2,
    type: 'pickles',
    image: '/banners/pickles-banner.jpg',
    title: 'PICKLES',
    subtitle: 'Sabse Best!',
    description: 'Mango • Mixed Vegetable • Sweet Lime • Chilli',
    fallbackGradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 25%, #ff8b94 50%, #ffaaa5 75%, #ffd3a5 100%)',
    emoji: '🥒'
  }
];

const ProductBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleImageError = (bannerId) => {
    setImageErrors(prev => ({ ...prev, [bannerId]: true }));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <Box className="banner-slider-section">
      <Container maxWidth="lg">
        <Box
          className="banner-slider-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Slider Content */}
          <Box className="banner-slider-track">
            {banners.map((banner, index) => (
              <Box
                key={banner.id}
                className={`banner-slide banner-slide-${banner.type} ${index === currentSlide ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`
                }}
              >
                {/* Banner Image */}
                {!imageErrors[banner.id] ? (
                  <img
                    src={banner.image}
                    alt={`${banner.title} - ${banner.subtitle}`}
                    className="banner-image"
                    onError={() => handleImageError(banner.id)}
                    loading="lazy"
                  />
                ) : (
                  /* Fallback gradient background if image fails to load */
                  <Box
                    className="banner-fallback"
                    style={{ background: banner.fallbackGradient }}
                  >
                    <Box className="banner-content-wrapper">
                      <Box className="banner-emoji">{banner.emoji}</Box>
                      <Box className="banner-text-content">
                        <h2 className="banner-main-title">{banner.title}</h2>
                        <p className="banner-main-subtitle">{banner.subtitle}</p>
                        <p className="banner-description">{banner.description}</p>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Brand overlay - always visible */}
                <Box className="banner-brand-overlay">
                  <p className="banner-brand-text">Classic गृह उद्योग</p>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Navigation Controls */}
          <IconButton
            className="banner-nav-btn banner-prev-btn"
            onClick={prevSlide}
            aria-label="Previous banner"
          >
            <ArrowBack />
          </IconButton>

          <IconButton
            className="banner-nav-btn banner-next-btn"
            onClick={nextSlide}
            aria-label="Next banner"
          >
            <ArrowForward />
          </IconButton>

          {/* Dots Indicator */}
          <Box className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductBannerSlider;