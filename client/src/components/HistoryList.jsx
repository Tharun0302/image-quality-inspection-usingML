import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import { Clock, CheckCircle2, Activity } from 'lucide-react';

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-foreground/50 bg-white/20 rounded-3xl border border-secondary border-dashed p-10 text-center min-h-[400px] shadow-sm">
        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-secondary/30">
          <Clock className="w-10 h-10 text-secondary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground/70 mb-2">No History Found</h3>
        <p className="max-w-xs text-sm font-medium">Any images you analyze will appear here for you to review later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        Recent Analyses
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} className="bg-white/40 p-5 rounded-2xl border border-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:border-accent group">
            <div className="relative h-48 mb-4 rounded-xl overflow-hidden border border-secondary/50 bg-white/50">
              <img 
                src={`http://localhost:8000/static/uploads/${item.id}.png`} 
                alt={item.filename} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-secondary shadow-md flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase text-foreground/80 tracking-widest">Score</span>
                <span className="text-sm font-black text-primary">{item.analysis.overall_score}</span>
              </div>
              {item.enhanced && (
                <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-400">
                   <CheckCircle2 className="w-4 h-4 text-white" />
                   <span className="text-xs font-bold uppercase text-white tracking-widest">Enhanced</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold truncate text-foreground pr-2" title={item.filename}>{item.filename}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-foreground/60 font-medium mb-4">
              <Clock className="w-4 h-4" />
              {new Date(item.timestamp).toLocaleString()}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-secondary/40">
              <div className="bg-white/60 p-2 rounded-lg text-center shadow-sm">
                <span className="block text-xs uppercase tracking-widest font-bold text-foreground/50 mb-1">Noise</span>
                <span className="text-red-500 font-bold">{item.analysis.metrics.noise.noise_score}%</span>
              </div>
              <div className="bg-white/60 p-2 rounded-lg text-center shadow-sm">
                <span className="block text-xs uppercase tracking-widest font-bold text-foreground/50 mb-1">Blur</span>
                <span className="text-blue-500 font-bold">{item.analysis.metrics.blur.blur_score}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
