/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { conversionData, UnitCategory, Unit, CategoryInfo } from '../types';
import { Scale, Maximize2, Compass, Ruler, Coins, Info, Copy, Check, Sparkles } from 'lucide-react';

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('berat');
  const [inputValue, setInputValue] = useState<string>('1');
  const [selectedSourceUnit, setSelectedSourceUnit] = useState<string>('');
  const [copiedUnitId, setCopiedUnitId] = useState<string | null>(null);

  // Get info for current active category
  const categoryInfo = useMemo<CategoryInfo>(() => {
    return conversionData[activeCategory];
  }, [activeCategory]);

  // Set default source unit when category changes
  useMemo(() => {
    const defaultUnit = categoryInfo.units.find(u => u.isTraditional)?.id || categoryInfo.units[0].id;
    setSelectedSourceUnit(defaultUnit);
  }, [activeCategory, categoryInfo]);

  // Calculate conversions based on selected input and source unit
  const conversions = useMemo(() => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return [];

    const sourceUnitObj = categoryInfo.units.find(u => u.id === selectedSourceUnit);
    if (!sourceUnitObj) return [];

    // Step 1: convert input to base value (grams, square feet, liters, meters, depending on category)
    const baseValue = numericValue * sourceUnitObj.baseRatio;

    // Step 2: convert from base value to other units
    return categoryInfo.units.map((unit) => {
      const convertedValue = baseValue / unit.baseRatio;
      
      // Determine elegant formatting representation
      let displayValue = '';
      if (convertedValue === 0) {
        displayValue = '0';
      } else if (convertedValue < 0.0001) {
        displayValue = convertedValue.toExponential(4);
      } else if (convertedValue % 1 === 0) {
        displayValue = convertedValue.toLocaleString('ms-MY');
      } else {
        // limit digits based on scale
        displayValue = Number(convertedValue.toFixed(6)).toLocaleString('ms-MY', {
          maximumFractionDigits: 6
        });
      }

      return {
        ...unit,
        value: convertedValue,
        displayValue,
      };
    });
  }, [inputValue, selectedSourceUnit, categoryInfo]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUnitId(id);
    setTimeout(() => setCopiedUnitId(null), 2000);
  };

  const getCategoryIcon = (category: UnitCategory) => {
    switch (category) {
      case 'berat':
        return <Scale size={18} />;
      case 'keluasan':
        return <Maximize2 size={18} />;
      case 'isi_padu':
        return <Compass size={18} />;
      case 'panjang':
        return <Ruler size={18} />;
      case 'emas':
        return <Coins size={18} />;
    }
  };

  // Fun presets for users to test traditional numbers
  const presetOptions: Record<UnitCategory, { label: string; value: string; unitId: string }[]> = {
    berat: [
      { label: '1 Kati (Beras runcit lama)', value: '1', unitId: 'kati' },
      { label: '1 Pikul (Beban tradisi bahu)', value: '1', unitId: 'pikul' },
      { label: '1 Tahil (Emas lama / gincu)', value: '1', unitId: 'tahil' },
      { label: '10 Hoon (Timbangan ubat)', value: '10', unitId: 'hoon' }
    ],
    keluasan: [
      { label: '1 Relung Kedah (Sawah padi)', value: '1', unitId: 'relung_kedah' },
      { label: '1 Lelong (Suku Relung)', value: '1', unitId: 'lelong' },
      { label: '1 Jemba (Kaki Tapak Rumah)', value: '1', unitId: 'jemba_persegi' },
      { label: '1 Ekar (Tanah modern)', value: '1', unitId: 'ekar' }
    ],
    isi_padu: [
      { label: '1 Gantang (Isi Padu Zakat)', value: '1', unitId: 'gantang' },
      { label: '1 Cupak (Suku Gantang)', value: '1', unitId: 'cupak' },
      { label: '1 Leng (Setengah Cupak)', value: '1', unitId: 'leng' },
      { label: '1 Kepul (Sifat beras genggam)', value: '1', unitId: 'kepul' }
    ],
    panjang: [
      { label: '1 Jengkal (Jari tangan)', value: '1', unitId: 'jengkal' },
      { label: '1 Hasta (Siku ke Jari)', value: '1', unitId: 'hasta' },
      { label: '1 Depa (Tangan didepa)', value: '1', unitId: 'depa' },
      { label: '1 Rantai (Sukat sempadan)', value: '1', unitId: 'rantai' }
    ],
    emas: [
      { label: '1 Mayam (Sebentuk Cincin Kelantan)', value: '1', unitId: 'mayam' },
      { label: '1 Bungkal (Jongkong lama Pantai Timur)', value: '1', unitId: 'bungkal' },
      { label: '20 Mayam (Gelang emas padu)', value: '20', unitId: 'mayam' }
    ]
  };

  const applyPreset = (value: string, unitId: string) => {
    setInputValue(value);
    setSelectedSourceUnit(unitId);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 hover:border-amber-500/20 transition-all duration-300" id="unit_converter">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2" id="category_tabs_container">
        {(Object.keys(conversionData) as UnitCategory[]).map((catId) => {
          const cat = conversionData[catId];
          const isActive = activeCategory === catId;
          return (
            <button
              key={catId}
              onClick={() => {
                setActiveCategory(catId);
                setInputValue('1');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-950 border border-slate-800/80'
              }`}
              id={`tab_btn_${catId}`}
            >
              {getCategoryIcon(catId)}
              <span>{cat.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Category Details Banner */}
      <div className="bg-amber-950/25 border border-amber-900/30 rounded-2xl p-4 flex gap-3 text-amber-400 text-xs shadow-inner">
        <Info size={18} className="shrink-0 mt-0.5 text-amber-400" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-amber-300 font-mono">INFO TRADISI:</span>
          <p className="text-slate-300 leading-relaxed font-sans">{categoryInfo.description}</p>
        </div>
      </div>

      {/* Main Converter Form Column */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="conversion_form_fields">
        {/* Input box */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-mono font-medium">MASUKKAN NILAI:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
            id="converter_input_val"
          />
        </div>

        {/* Source Unit Selector */}
        <div className="md:col-span-8 flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-mono font-medium">UNIT SUMBER:</label>
          <select
            value={selectedSourceUnit}
            onChange={(e) => setSelectedSourceUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3.5 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
            id="converter_source_unit"
          >
            {categoryInfo.units.map(u => (
              <option key={u.id} value={u.id} className="bg-slate-950 text-slate-200">
                {u.name} ({u.symbol}) {u.isTraditional ? '• Unit Tradisional' : '• Unit Moden'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets and shortcuts */}
      <div className="flex flex-col gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-semibold">
          <Sparkles size={13} className="text-amber-400" />
          <span>PILIHAN PANTAS (PRESETS UTAMA):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetOptions[activeCategory].map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset.value, preset.unitId)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-lg text-[11px] font-sans text-slate-300 hover:text-white transition-all cursor-pointer hover:bg-slate-950"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Output Lists */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono font-semibold text-slate-400">KEPUTUSAN PENUKARAN:</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="converter_outputs_grid">
          {conversions.map((conv) => {
            const isSelected = conv.id === selectedSourceUnit;
            return (
              <div
                key={conv.id}
                className={`p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                  isSelected
                    ? 'bg-slate-950 border-amber-500/40 ring-1 ring-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-950 hover:border-slate-700/80'
                }`}
                id={`result_box_${conv.id}`}
              >
                {/* Traditional / Modern Indicator */}
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                      {conv.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                      {conv.symbol.toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold ${
                    conv.isTraditional
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                  }`}>
                    {conv.isTraditional ? 'TRADISIONAL' : 'MODEN'}
                  </span>
                </div>

                {/* Conversion value display & actions */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="font-mono text-amber-400 font-bold text-lg select-all truncate">
                    {conv.displayValue}
                  </span>
                  
                  <button
                    onClick={() => handleCopy(conv.displayValue.replace(/[\s,]/g, ''), conv.id)}
                    className="p-1 px-2 hover:bg-slate-800 rounded text-slate-500 hover:text-amber-400 font-mono text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                    title="Salin nilai"
                    id={`copy_btn_${conv.id}`}
                  >
                    {copiedUnitId === conv.id ? (
                      <>
                        <Check size={12} className="text-amber-400" />
                        <span className="text-amber-400">DISALIN</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>SALIN</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Unit detailed description */}
                <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-900 pt-2 leading-relaxed h-10 overflow-y-auto custom-scrollbar font-sans">
                  {conv.description}
                </p>

                {/* Subtle visual gradient highlights */}
                {conv.isTraditional && (
                  <div className="absolute right-0 bottom-0 top-0 w-[4px] bg-amber-500/20" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
