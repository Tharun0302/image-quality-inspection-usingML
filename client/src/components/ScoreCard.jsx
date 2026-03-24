import React from 'react';

export default function ScoreCard({ score }) {
  let qualityCategory = "";
  let colorClass = "";

  if (score >= 90) { qualityCategory = "Excellent"; colorClass = "text-emerald-500 stroke-emerald-500"; }
  else if (score >= 70) { qualityCategory = "Good"; colorClass = "text-blue-500 stroke-blue-500"; }
  else if (score >= 50) { qualityCategory = "Average"; colorClass = "text-yellow-600 stroke-yellow-500"; }
  else if (score >= 30) { qualityCategory = "Poor"; colorClass = "text-orange-500 stroke-orange-500"; }
  else { qualityCategory = "Very Poor"; colorClass = "text-red-500 stroke-red-500"; }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white/40 p-6 rounded-2xl border border-secondary flex flex-col items-center justify-between text-center shadow-lg h-full min-h-[350px]">
      <h3 className="text-xl font-bold mb-2 w-full text-left flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Final Score
      </h3>
      
      <div className="relative flex items-center justify-center flex-grow w-full py-6">
        <svg className="transform -rotate-90 w-56 h-56 drop-shadow-md">
          <circle
            cx="112"
            cy="112"
            r={radius}
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            className="text-secondary/40"
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClass.split(' ')[1]} transition-all duration-1500 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-7xl font-black ${colorClass.split(' ')[0]} tracking-tighter`}>{score}</span>
          <span className="text-base mt-1 uppercase tracking-widest opacity-60 font-bold">/ 100</span>
        </div>
      </div>
      
      <div className="px-8 py-4 w-full rounded-xl bg-white/60 border border-secondary/60 mt-2 flex justify-between items-center shadow-sm">
        <span className="text-sm uppercase tracking-wider font-bold opacity-70">Category</span>
        <span className={`text-2xl font-black tracking-wide ${colorClass.split(' ')[0]}`}>{qualityCategory}</span>
      </div>
    </div>
  );
}
