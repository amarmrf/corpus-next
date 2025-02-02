import React from 'react';
import { arabicNumber } from '../arabic/arabic-number'

type Props = {
  verseNumber: number;
  className?: string;
}

export const EndOfVerse: React.FC<Props> = ({ verseNumber, className }) => {
  return (
    <div className={`font-verse-end text-3xl sm:text-4xl text-brown ${className || ''}`}>
      {arabicNumber(verseNumber)}
    </div>
  )
}