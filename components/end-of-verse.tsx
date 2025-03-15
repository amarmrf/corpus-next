import React from 'react';
import { arabicNumber } from '../arabic/arabic-number'

type Props = {
  verseNumber: number;
  className?: string;
  mode?: 'reader' | 'detail';
}

export const EndOfVerse: React.FC<Props> = ({ verseNumber, className, mode = 'detail' }) => {
  // Use different size classes based on mode
  const sizeClasses = mode === 'reader' 
    ? 'text-3xl sm:text-4xl md:text-5xl' 
    : 'text-4xl sm:text-5xl md:text-6xl';
    
  // Adjust positioning based on mode
  const positionClasses = mode === 'reader'
    ? 'pb-0 -mt-1.5'
    : 'pb-8';
    
  return (
    <div className={`font-verse-end ${sizeClasses} text-brown flex items-center justify-center ${positionClasses} ${className || ''}`}>
      {arabicNumber(verseNumber)}
    </div>
  )
}