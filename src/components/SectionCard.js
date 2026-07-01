import React from 'react';
import './sectionCard.css';

function SectionCard({ children }) {
  return (
    <div className='section-card'>
      {children}
    </div>
  );
}

export default SectionCard;
