/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { kampungData, KampungItem } from '../types';
import { ShoppingBag, ChevronRight, HelpCircle } from 'lucide-react';

export default function KampungEstimator() {
  const [selectedItemId, setSelectedItemId] = useState<string>('pisang');
  const [sourceValue, setSourceValue] = useState<number>(1);
  const [selectedSubUnitIdx, setSelectedSubUnitIdx] = useState<number>(0);

  // Find active item configuration
  const activeItem = kampungData.find(item => item.id === selectedItemId) || kampungData[0];

  // Selected subunit ratio
  const activeSubUnit = activeItem.subUnits[selectedSubUnitIdx] || activeItem.subUnits[0];

  // Convert source value into "Biji" / base pieces
  const totalBaseUnits = sourceValue * activeSubUnit.ratio;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 hover:border-amber-500/20 transition-all duration-300" id="kampung_estimator">
      {/* Header title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h2 className="font-sans font-bold text-lg text-white">Sukatan Kampung & Borong</h2>
          <p className="text-xs text-slate-400 font-sans">Kalkulator dinamik untuk jualan borong tradisi seperti pisang sesikat, petai sa-ikat, dan kain sakodi.</p>
        </div>
      </div>

      {/* Select Kampung item class */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="kampung_item_tabs">
        {kampungData.map((item) => {
          const isActive = selectedItemId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItemId(item.id);
                setSourceValue(1);
                setSelectedSubUnitIdx(0);
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-md ring-1 ring-amber-500/10'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800/80 hover:bg-slate-950 hover:text-slate-200'
              }`}
              id={`kampung_tab_${item.id}`}
            >
              <span className="font-sans font-semibold text-xs tracking-wide">
                {item.name.split(' (')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input section with details card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start" id="kampung_estimator_form">
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col gap-3">
            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase">PENGIRAAN PANTAS KAMPUNG:</span>
            
            {/* Input fields */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">MUTU/KUANTITI:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceValue(Math.max(1, sourceValue - 1))}
                    className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={sourceValue}
                    onChange={(e) => setSourceValue(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-center text-white text-sm font-mono focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSourceValue(sourceValue + 1)}
                    className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Choose Unit of Source Item */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">PILIH UNIT SUMBER:</label>
                <select
                  value={selectedSubUnitIdx}
                  onChange={(e) => setSelectedSubUnitIdx(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-200 text-xs font-sans focus:outline-none transition-colors cursor-pointer"
                >
                  {activeItem.subUnits.map((sub, idx) => (
                    <option key={idx} value={idx}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/10 border border-amber-900/20 rounded-2xl p-4 flex gap-3 text-amber-400 text-xs relative overflow-hidden">
            <HelpCircle size={16} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 font-sans">
              <span className="font-semibold text-amber-300 font-mono">TIPS PERINTIS:</span>
              <p className="text-slate-300 leading-relaxed">{activeItem.description}</p>
            </div>
          </div>
        </div>

        {/* Realtime Conversions display */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">PECAHAN UNIT BANCI (KAMPUNG & MODEN):</span>
          
          <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4 flex flex-col gap-3">
            {activeItem.subUnits.map((sub, idx) => {
              // Convert overall base pieces back into this subunit quantity
              const convertedQty = totalBaseUnits / sub.ratio;
              const formattedQty = Number(convertedQty.toFixed(2));
              
              return (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-200 font-sans">{sub.name}</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{sub.detail}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <ChevronRight size={12} className="text-amber-500" />
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {formattedQty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
