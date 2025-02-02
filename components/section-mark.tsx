import React from 'react';

type Props = {
  className?: string;
}

export const SectionMark: React.FC<Props> = ({ className }) => (
  <div className={`font-arabic text-3xl sm:text-4xl text-brown ${className || ''}`}>۞</div>
)