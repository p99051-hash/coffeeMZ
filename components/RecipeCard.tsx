
import React from 'react';
import { BrewingRecipe } from '../types';

export const RecipeCard: React.FC<{ recipe: BrewingRecipe }> = ({ recipe }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '粉量', value: `${recipe.powderWeight}g` },
          { label: '比例', value: recipe.waterRatio },
          { label: '研磨', value: recipe.grindSize },
          { label: '水溫', value: `${recipe.temperature}°C` }
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 retro-border-sm retro-shadow-sm text-center">
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">{s.label}</p>
            <p className="text-xl font-black serif">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 retro-border retro-shadow">
        <h3 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-8">Brewing Protocol</h3>
        <div className="space-y-8">
          {recipe.steps.map((step, i) => (
            <div key={i} className="flex gap-6 border-b border-black/10 pb-6 last:border-0">
              <div className="w-16 h-16 flex-none bg-black text-white flex items-center justify-center font-black text-lg retro-border-sm">{step.time}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-black serif">{step.action}</h4>
                  <span className="bg-[#d97706] text-white px-2 py-0.5 text-[10px] font-bold retro-border-sm">{step.waterAmount}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{step.technique}</p>
              </div>
            </div>
          ))}
        </div>
        {recipe.notes && (
          <div className="mt-8 p-6 bg-gray-50 border-2 border-black border-dashed font-serif italic text-lg opacity-80">
            " {recipe.notes} "
          </div>
        )}
      </div>
    </div>
  );
};
