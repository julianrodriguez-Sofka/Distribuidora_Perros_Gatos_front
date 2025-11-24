import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.css';

const SwiperCarousel = ({ images = [], height }) => {
  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <Swiper
      className="swiper-carousel-container"
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      loop={images.length > 1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      navigation
      pagination={{ clickable: true }}
      style={height ? { width: '100%', height } : undefined}
    >
      {images.map((item, idx) => (
        <SwiperSlide key={item.id || idx}>
          {item.enlaceUrl ? (
            <a href={item.enlaceUrl} aria-label={`Promoción ${idx + 1}`}>
              <img
                  src={item.imagenUrl}
                  alt={`Promoción ${idx + 1}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
            </a>
          ) : (
            <img
              src={item.imagenUrl}
              alt={`Promoción ${idx + 1}`}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
