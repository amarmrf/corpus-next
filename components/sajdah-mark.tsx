import React from 'react';

type Props = {
  className?: string;
}

export const SajdahMark: React.FC<Props> = ({ className }) => (
  <div className={`font-sans text-4xl sm:text-5xl text-brown ${className || ''}`}>۩</div>
)