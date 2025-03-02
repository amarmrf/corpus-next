import React from 'react';
import { arabicNumber } from '../arabic/arabic-number'

type Props = {
  verseNumber: number;
  className?: string;
}

export const EndOfVerse: React.FC<Props> = ({ verseNumber, className }) => {
  return (
    <div className={`font-verse-end text-4xl sm:text-5xl md:text-6xl text-brown flex items-center justify-center pb-8 ${className || ''}`}>
      {arabicNumber(verseNumber)}
    </div>
  )
}