import React from 'react';
import { Activity, Droplet, Sun, Eye } from 'lucide-react';

export default function Metrics({ data }) {
  if (!data) return null;

  const metrics = [
    { name: 'Noise', value: data.noise.noise_score, icon: Activity, color: 'bg-red-400', text: 'text-red-600' },
    { name: 'Blur', value: data.blur.blur_score, icon: Droplet, color: 'bg-blue-400', text: 'text-blue-600' },
    { name: 'Lighting', value: data.lighting.lighting_score, icon: Sun, color: 'bg-yellow-400', text: 'text-yellow-600' },
    { name: 'Detail', value: data.detail.detail_score, icon: Eye, color: 'bg-emerald-400', text: 'text-emerald-600' },
  ];

  return (
    <div className="bg-white/40 p-6 rounded-2xl border border-secondary shadow-lg">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Quality Breakdown
      </h3>
      
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${metric.color} bg-opacity-20`}>
                  <metric.icon className={`w-5 h-5 ${metric.text}`} />
                </div>
                <span className="font-bold text-lg text-foreground/80">{metric.name}</span>
              </div>
              <span className={`font-black text-xl ${metric.text}`}>{metric.value}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-4 overflow-hidden border border-secondary/20 shadow-inner">
              <div 
                className={`h-full ${metric.color} transition-all duration-1000 ease-out rounded-full shadow-sm`} 
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
