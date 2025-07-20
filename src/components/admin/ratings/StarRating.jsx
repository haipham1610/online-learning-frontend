// src/components/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
    score,
    interactive = false,
    onStarClick = null,
    showText = true,
    size = 'medium'
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6'
    };

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClasses[size]} ${star <= score
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } ${interactive
                            ? 'cursor-pointer hover:text-yellow-400 hover:fill-yellow-400 transition-colors'
                            : ''
                        }`}
                    onClick={() => interactive && onStarClick && onStarClick(star)}
                />
            ))}
            {showText && (
                <span className="ml-2 text-sm text-gray-600">({score}/5)</span>
            )}
        </div>
    );
};

export default StarRating;