"use client";
import React from 'react';

// This component creates soft gradients at the top and bottom of a section
// to naturally fade animated backgrounds without using sticky maskImage.
export const FadeOverlay = () => {
  return (
    <>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '5vh',
          zIndex: 5,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, var(--background) 0%, transparent 100%)'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '5vh',
          zIndex: 5,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)'
        }}
      />
    </>
  );
};

export default FadeOverlay;
