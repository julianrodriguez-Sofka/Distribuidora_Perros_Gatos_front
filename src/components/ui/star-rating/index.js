import React, { useState } from 'react';
import './style.css';

/**
 * StarRating Component
 * Sistema de calificación con estrellas visualmente atractivo
 * 
 * @param {number} rating - Calificación actual (0-5)
 * @param {number} totalRatings - Total de calificaciones
 * @param {boolean} interactive - Si permite calificar (interactivo)
 * @param {function} onRate - Callback al calificar (rating) => void
 * @param {string} size - Tamaño: 'small', 'medium', 'large'
 * @param {boolean} showCount - Mostrar contador de calificaciones
 */
export const StarRating = ({
  rating = 0,
  totalRatings = 0,
  interactive = false,
  onRate,
  size = 'medium',
  showCount = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handleStarClick = async (starValue) => {
    if (!interactive || !onRate || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRate(starValue);
    } catch (error) {
      console.error('Error al calificar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (interactive && !isSubmitting) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating star-rating--${size}`}>
      <div 
        className={`star-rating__stars ${interactive ? 'star-rating__stars--interactive' : ''}`}
        onMouseLeave={handleMouseLeave}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`${rating} de 5 estrellas${totalRatings > 0 ? ` (${totalRatings} calificaciones)` : ''}`}
      >
        {stars.map((star) => {
          const filled = displayRating >= star;
          const partialFill = displayRating > star - 1 && displayRating < star;
          const fillPercentage = partialFill ? ((displayRating - (star - 1)) * 100) : (filled ? 100 : 0);

          return (
            <button
              key={star}
              type="button"
              className={`star-rating__star ${filled ? 'star-rating__star--filled' : ''} ${partialFill ? 'star-rating__star--partial' : ''}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              disabled={!interactive || isSubmitting}
              aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
              role={interactive ? 'radio' : 'presentation'}
              aria-checked={interactive ? rating === star : undefined}
            >
              <svg
                className="star-rating__star-svg"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`star-gradient-${star}`}>
                    <stop offset={`${fillPercentage}%`} stopColor="currentColor" />
                    <stop offset={`${fillPercentage}%`} stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill={`url(#star-gradient-${star})`}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {showCount && totalRatings > 0 && (
        <span className="star-rating__count">
          ({totalRatings})
        </span>
      )}

      {interactive && hoverRating > 0 && (
        <span className="star-rating__label">
          {hoverRating === 1 && 'Muy malo'}
          {hoverRating === 2 && 'Malo'}
          {hoverRating === 3 && 'Regular'}
          {hoverRating === 4 && 'Bueno'}
          {hoverRating === 5 && 'Excelente'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
