import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function ComparisonSlider({ original, enhanced }) {
  if (!original || !enhanced) return null;

  return (
    <div className="w-full h-auto rounded-2xl overflow-hidden border border-accent shadow-xl relative bg-white/40 p-2">
      <div className="absolute top-6 left-6 right-6 z-10 hidden sm:flex justify-between pointer-events-none">
        <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow border border-secondary uppercase tracking-widest">Original</span>
        <span className="bg-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow border border-primary uppercase tracking-widest">Enhanced</span>
      </div>
      <ReactCompareSlider
        boundsPadding={0}
        itemOne={<ReactCompareSliderImage src={original} alt="Original Image" className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-md" />}
        itemTwo={<ReactCompareSliderImage src={enhanced} alt="Enhanced Image" className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-md" />}
        className="w-full h-auto max-h-[70vh]"
      />
    </div>
  );
}
