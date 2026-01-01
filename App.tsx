
import React, { useState, useRef } from 'react';
import { CoffeeParams, BrewingRecipe, RoastLevel, ProcessMethod } from './types';
import { generateRecipe, analyzeBeans } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { RecipeCard } from './components/RecipeCard';

const App: React.FC = () => {
  const [params, setParams] = useState<CoffeeParams>({
    origin: '', process: ProcessMethod.WASHED, roast: RoastLevel.LIGHT, targetVolume: 240, dripper: 'V60'
  });
  const [recipe, setRecipe] = useState<BrewingRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await analyzeBeans(base64);
        setParams(p => ({ ...p, origin: res.origin, roast: res.roast, process: res.process }));
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("辨識失敗，請手動確認。");
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!params.origin) return alert('請先辨識或輸入產區');
    setLoading(true);
    setError(null);
    try {
      const res = await generateRecipe(params);
      setRecipe(res);
      setTimeout(() => document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err: any) {
      setError(err.message || "生成配方失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <header className="py-20 text-center">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4">COFFEE 123</h1>
        <p className="text-xl md:text-2xl serif italic opacity-70">三步沖出大師級咖啡</p>
      </header>

      <main className="space-y-20">
        <section className="bg-white retro-border retro-shadow p-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-12 rounded-full bg-[#d97706] text-white flex items-center justify-center font-black text-2xl retro-border-sm">1</span>
            <h2 className="text-2xl font-black uppercase tracking-widest">拍照辨識</h2>
          </div>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleScan} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzing}
            className="px-10 py-5 bg-black text-white font-black retro-border hover:-translate-y-1 transition-transform disabled:opacity-50"
          >
            {analyzing ? 'AI 分析中...' : '📸 掃描咖啡豆'}
          </button>
        </section>

        <section id="step-2">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-2xl retro-border-sm">2</span>
            <h2 className="text-3xl font-black uppercase">確認參數</h2>
          </div>
          <InputSection params={params} onChange={u => setParams(p => ({...p, ...u}))} />
          {error && <div className="mt-4 p-4 bg-red-50 text-red-600 font-bold border-2 border-red-600">{error}</div>}
          <div className="mt-10 flex justify-center">
            <button onClick={handleGenerate} disabled={loading} className="px-16 py-6 bg-black text-white text-xl font-black retro-border retro-shadow hover:bg-gray-900">
              {loading ? '計算中...' : '生成沖煮配方'}
            </button>
          </div>
        </section>

        {recipe && (
          <section id="step-3">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-2xl retro-border-sm">3</span>
              <h2 className="text-3xl font-black uppercase">開始沖煮</h2>
            </div>
            <RecipeCard recipe={recipe} />
          </section>
        )}
      </main>
      <footer className="mt-20 pt-10 border-t-2 border-black text-center font-black text-xs opacity-40 uppercase tracking-[0.4em]">
        Coffee 123 / Precision Brewing AI
      </footer>
    </div>
  );
};

export default App;
