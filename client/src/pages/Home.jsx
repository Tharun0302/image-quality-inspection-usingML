import React, { useState } from 'react';
import Upload from '../components/Upload';
import ImagePreview from '../components/ImagePreview';
import Metrics from '../components/Metrics';
import ScoreCard from '../components/ScoreCard';
import ComparisonSlider from '../components/ComparisonSlider';
import HistoryList from '../components/HistoryList';
import { analyzeImage, enhanceImage } from '../services/api';
import { Activity, Wand2, Download, AlertCircle, RefreshCw, Hexagon } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingEnhance, setLoadingEnhance] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('analyzer'); // analyzer | history

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
    setAnalysis(null);
    setEnhancedUrl(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoadingAnalyze(true);
    setError(null);
    try {
      const data = await analyzeImage(file);
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze the image. Check the backend server.');
      console.error(err);
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleEnhance = async () => {
    if (!file) return;
    setLoadingEnhance(true);
    setError(null);
    try {
      const imageId = analysis && analysis.id ? analysis.id : null;
      const data = await enhanceImage(file, imageId);
      setEnhancedUrl(data.enhanced_url);
    } catch (err) {
      setError('Failed to enhance the image. Check the backend server.');
      console.error(err);
    } finally {
      setLoadingEnhance(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileUrl(null);
    setAnalysis(null);
    setEnhancedUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-secondary/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-md border border-accent">
              <Hexagon className="text-white w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Siltstone Inspector</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-secondary/20 p-1 rounded-xl border border-secondary/40">
            <button 
              onClick={() => setView('analyzer')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'analyzer' ? 'bg-white shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Analyze
            </button>
            <button 
              onClick={() => setView('history')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === 'history' ? 'bg-white shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
            >
              History
            </button>
          </div>

          {file && view === 'analyzer' && (
            <button onClick={handleReset} className="text-sm font-bold flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/20 border border-transparent hover:border-secondary/40">
              <RefreshCw className="w-4 h-4" /> Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'history' ? (
          <HistoryList />
        ) : !file ? (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black tracking-tight mb-4 text-foreground">Analyze & Enhance</h2>
              <p className="text-lg text-foreground/70 font-medium">
                Upload any photo to automatically calculate its quality score and use our AI models to enhance clarity and sharpness.
              </p>
            </div>
            <Upload onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-3 text-red-800 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/20 p-2 rounded-3xl border border-secondary shadow-xl">
                   {enhancedUrl ? (
                     <div className="rounded-2xl overflow-hidden relative">
                       <ComparisonSlider original={fileUrl} enhanced={enhancedUrl} />
                     </div>
                   ) : (
                     <ImagePreview file={file} previewUrl={fileUrl} />
                   )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={loadingAnalyze || analysis}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-md border
                      ${analysis 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default' 
                        : 'bg-white hover:bg-white/80 text-foreground border-secondary disabled:opacity-50'}`}
                  >
                    {loadingAnalyze ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-foreground"></span>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        {analysis ? 'Analysis Complete' : 'Analyze Image'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleEnhance}
                    disabled={loadingEnhance || enhancedUrl}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg border
                      ${enhancedUrl 
                        ? 'bg-secondary/40 text-foreground/60 border-secondary cursor-default shadow-none' 
                        : 'bg-primary hover:bg-primary-hover text-white border-primary disabled:opacity-50 hover:shadow-xl'}`}
                  >
                    {loadingEnhance ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        {enhancedUrl ? 'Enhancement Applied' : 'AI Enhance Image'}
                      </>
                    )}
                  </button>
                </div>

                {enhancedUrl && (
                  <div className="flex justify-center pt-2">
                    <a 
                      href={enhancedUrl} 
                      download={`enhanced_${file.name}`}
                      className="group flex items-center gap-3 text-white px-8 py-4 rounded-full bg-accent hover:bg-accent/90 transition-all duration-300 font-bold shadow-lg hover:shadow-xl border border-accent"
                    >
                      <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                      Download Enhanced Image
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {analysis ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <ScoreCard score={analysis.overall_score} />
                    <Metrics data={analysis.metrics} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-foreground/50 bg-white/20 rounded-3xl border border-secondary border-dashed p-10 text-center min-h-[400px] shadow-sm">
                    <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-secondary/30">
                      <Activity className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground/70 mb-2">No Analysis Data Yet</h3>
                    <p className="max-w-xs text-sm font-medium">Click the "Analyze Image" button to generate a detailed quality report.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
