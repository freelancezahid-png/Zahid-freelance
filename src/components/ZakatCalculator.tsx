/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { zakatStateRates } from '../types';
import { Landmark, Sparkles, HelpCircle, HeartHandshake, BookOpen } from 'lucide-react';

export default function ZakatCalculator() {
  const [selectedState, setSelectedState] = useState<string>('Kedah');
  const [familyCount, setFamilyCount] = useState<number>(1);
  const [riceType, setRiceType] = useState<'normal' | 'fragrant' | 'premium'>('normal');

  // Fidyah states
  const [fidyahDays, setFidyahDays] = useState<number>(1);
  const [multiplierRate, setMultiplierRate] = useState<number>(1); // default fidyah multiplier (normal, double, triple depending on years delayed)

  // Find rate details based on selected state
  const stateRateInfo = zakatStateRates.find(r => r.state === selectedState) || zakatStateRates[0];

  // Get current rate per person
  const getRatePerPerson = () => {
    switch (riceType) {
      case 'fragrant':
        return stateRateInfo.rateFragrant;
      case 'premium':
        return stateRateInfo.ratePremium;
      case 'normal':
      default:
        return stateRateInfo.rateNormal;
    }
  };

  const ratePerPerson = getRatePerPerson();
  const totalFitrahRM = familyCount * ratePerPerson;

  // Modern Zakat fitrah calculation in Malaysia is based on 1 Gantang Baghdad of rice per person.
  // Standardized weight conversion: 1 Gantang baghdad = approx 2.6 kg (or 2.76 kg) of staple food (rice).
  // Some state fatwas use 2.7 kg, and others use 2.6 kg. Let's showcase both beautifully.
  const totalRiceKg = familyCount * 2.6;
  const totalCupak = familyCount * 4; // 1 Gantang = 4 Cupak

  // Fidyah calculations:
  // In Malaysia, Fidyah is calculated as 1 Mud (Cupak) of rice per missed fast day.
  // Weight conversion of 1 Mud/Cupak = approx 650g - 675g of rice. Standard Islamic rate is 675g (or 1/4 of Gantang ~0.65 kg).
  // Cost: Standard rate in Malaysia is RM 2.00 (or equivalent value, usually RM 2.00 - 4.00) depending on state consensus per day.
  // Traditionally 1 Cupak of rice per day.
  const fidyahRatePerDayRM = 2.00; // Standard modern rate in states like Selangor/Kedah is RM 2.00 / RM 4.00 per day
  const totalFidyahRM = fidyahDays * fidyahRatePerDayRM * multiplierRate;
  const totalFidyahRiceKg = fidyahDays * 0.675 * multiplierRate;
  const totalFidyahCupak = fidyahDays * multiplierRate;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 hover:border-amber-500/20 transition-all duration-300" id="zakat_calculator">
      {/* Tab Header title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <HeartHandshake size={20} />
        </div>
        <div>
          <h2 className="font-sans font-bold text-lg text-white">Kira Zakat Fitrah & Fidyah</h2>
          <p className="text-xs text-slate-400 font-sans">Kiraan bersandarkan nilai sukat Syarak tradisi (Gantang dan Cupak beras).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit 1: Zakat Fitrah */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">BAHAGIAN A • ZAKAT FITRAH</span>
            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">Tahunan</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Negeri */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-mono font-semibold">NEGERI DI MALAYSIA:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs font-sans focus:outline-none transition-colors cursor-pointer"
                id="zakat_state_selector"
              >
                {zakatStateRates.map(r => (
                  <option key={r.state} value={r.state}>{r.state}</option>
                ))}
              </select>
            </div>

            {/* Bilangan tanggungan */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-mono font-semibold">BILANGAN TANGGUNGAN (ORANG):</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFamilyCount(Math.max(1, familyCount - 1))}
                  className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={familyCount}
                  onChange={(e) => setFamilyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-center text-white text-sm font-mono focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setFamilyCount(familyCount + 1)}
                  className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rice Grade Options */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-[11px] text-slate-400 font-mono font-semibold">JENIS BERAS YANG DIMAKAN:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setRiceType('normal')}
                  className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                    riceType === 'normal'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  Biasa (RM{stateRateInfo.rateNormal.toFixed(2)})
                </button>
                <button
                  onClick={() => setRiceType('fragrant')}
                  className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                    riceType === 'fragrant'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  Wangi (RM{stateRateInfo.rateFragrant.toFixed(2)})
                </button>
                <button
                  onClick={() => setRiceType('premium')}
                  className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                    riceType === 'premium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  Basmati (RM{stateRateInfo.ratePremium.toFixed(2)})
                </button>
              </div>
            </div>
          </div>

          {/* Results Fitrah */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-slate-400 text-xs font-sans">Kadar per orang:</span>
              <span className="font-mono text-amber-400 font-semibold text-sm">RM {ratePerPerson.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs font-sans">Jumlah bayaran Zakat:</span>
              <span className="font-mono text-amber-400 font-bold text-xl">RM {totalFitrahRM.toFixed(2)}</span>
            </div>

            {/* Show Syarak traditional equivalents */}
            <div className="mt-2 pt-2 border-t border-slate-900/60 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Persamaan Sukatan Syarak:</span>
                <span className="font-mono text-amber-300 font-semibold">{familyCount} Gantang Baghdad</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Bersamaan isi padu Cupak:</span>
                <span className="font-mono">{totalCupak} Cupak</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Timbangan berat beras kasar:</span>
                <span className="font-mono">~ {totalRiceKg.toFixed(1)} kg beras</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unit 2: Fidyah Haji/Puasa */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-500 tracking-wider">BAHAGIAN B • FIDYAH PUASA</span>
            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">Terlepas Puasa</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Bilangan hari */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-mono font-semibold">BILANGAN HARI TINGGAL:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFidyahDays(Math.max(1, fidyahDays - 1))}
                  className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={fidyahDays}
                  onChange={(e) => setFidyahDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-center text-white text-sm font-mono focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setFidyahDays(fidyahDays + 1)}
                  className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Gandaan Fidyah (tahun tertunggak) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-mono font-semibold flex items-center gap-1">
                <span>BILANGAN TAHUN TERTUNGGAK (GANDAAN):</span>
                <div className="group relative">
                  <HelpCircle size={12} className="text-slate-500 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-5 hidden group-hover:block bg-slate-950 text-slate-300 text-[9px] font-sans p-2 rounded-lg border border-slate-800 w-48 shadow-lg z-10 leading-relaxed">
                    Di sesetengah negeri (seperti Selangor, Melaka, Johor), fidyah digandakan mengikut tahun yang telah ditinggalkan. Di sebahagian negeri lain pula tiada gandaan.
                  </div>
                </div>
              </label>
              <select
                value={multiplierRate}
                onChange={(e) => setMultiplierRate(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs font-sans focus:outline-none transition-colors cursor-pointer"
                id="fidyah_multiplier_selector"
              >
                <option value={1}>Gandaan Biasa / Tiada Gandaan (1x ganda)</option>
                <option value={2}>Tertunggak 2 Tahun (2x ganda)</option>
                <option value={3}>Tertunggak 3 Tahun (3x ganda)</option>
                <option value={4}>Tertunggak 4 Tahun (4x ganda)</option>
                <option value={5}>Tertunggak 5 Tahun (5x ganda)</option>
              </select>
            </div>
          </div>

          {/* Results Fidyah */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-slate-400 text-xs font-sans">Kadar asas sehari (Negara):</span>
              <span className="font-mono text-amber-500 font-semibold text-sm">RM {fidyahRatePerDayRM.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs font-sans">Jumlah bayaran Fidyah:</span>
              <span className="font-mono text-amber-500 font-bold text-xl">RM {totalFidyahRM.toFixed(2)}</span>
            </div>

            {/* Show mud/cupak equivalents */}
            <div className="mt-2 pt-2 border-t border-slate-900/60 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Sukat Syarak (Mud/Cupak):</span>
                <span className="font-mono text-amber-400 font-semibold">{totalFidyahCupak} Cupak (Cupak/Mud)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Timbangan beras denda:</span>
                <span className="font-mono">~ {totalFidyahRiceKg.toFixed(3)} kg beras</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Bilangan Gantang:</span>
                <span className="font-mono">~ {(totalFidyahCupak / 4).toFixed(2)} Gantang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hadith / Legal source reference */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex gap-3 text-[11px] text-slate-400 leading-relaxed font-sans">
        <BookOpen size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-300 font-mono">SANDARAN SYARAK (REFERENCE):</span>
          <p>
            Kandungan beras Zakat dikira mengikut standard <strong>Satu Sa&apos; (atau 1 Gantang Baghdad)</strong> yang bersamaan dengan 4 Mud (4 Cupak). Berat 1 Sa&apos; dianggarkan oleh JAKIM bernilai 2.6kg hingga 2.7kg bagi beras ruji di Malaysia. Fidyah dikira berasaskan berat <strong>1 Mud (1 Cupak)</strong> beras sehari iaitu dianggarkan seberat 675g.
          </p>
        </div>
      </div>
    </div>
  );
}
