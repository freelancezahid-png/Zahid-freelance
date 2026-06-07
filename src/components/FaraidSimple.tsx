/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Landmark, Scale, HelpCircle, FileText } from 'lucide-react';

export default function FaraidSimple() {
  const [estateValue, setEstateValue] = useState<number>(100000);
  const [spouseType, setSpouseType] = useState<'none' | 'husband' | 'wife'>('wife');
  const [sonsCount, setSonsCount] = useState<number>(1);
  const [daughtersCount, setDaughtersCount] = useState<number>(2);
  const [hasFather, setHasFather] = useState<boolean>(true);
  const [hasMother, setHasMother] = useState<boolean>(true);

  // Simple Faraid Division Logic (Shafi'i school baseline)
  const calculateDistribution = () => {
    // Total estate
    const total = isNaN(estateValue) || estateValue < 0 ? 0 : estateValue;

    // Output array
    const parts: { name: string; shareStr: string; shareValue: number; percent: number; description: string }[] = [];

    let remainingPart = 1.0;
    const hasChildren = (sonsCount + daughtersCount) > 0;

    // 1. Mother's portion
    let motherShare = 0;
    if (hasMother) {
      if (hasChildren) {
        motherShare = 1 / 6; // 1/6 if there are children
      } else {
        motherShare = 1 / 3; // 1/3 if no children
      }
      remainingPart -= motherShare;
    }

    // 2. Father's portion
    let fatherShare = 0;
    if (hasFather) {
      // Base portion for father
      if (hasChildren) {
        fatherShare = 1 / 6;
      } else {
        fatherShare = 1 / 6; // Will get absolute residue as Asabah later if no son
      }
      remainingPart -= fatherShare;
    }

    // 3. Husband or Wife portion
    let spouseShare = 0;
    if (spouseType === 'husband') {
      if (hasChildren) {
        spouseShare = 1 / 4;
      } else {
        spouseShare = 1 / 2;
      }
      remainingPart -= spouseShare;
    } else if (spouseType === 'wife') {
      if (hasChildren) {
        spouseShare = 1 / 8;
      } else {
        spouseShare = 1 / 4;
      }
      remainingPart -= spouseShare;
    }

    // If remainingPart becomes negative due to math limits, we normalize it (Aul reduction, but lets keep it basic)
    if (remainingPart < 0) {
      remainingPart = 0;
    }

    // Add designated fixed heirs (Ashab al-Furud)
    if (hasMother && motherShare > 0) {
      parts.push({
        name: 'Ibu (Deceased Mother)',
        shareStr: hasChildren ? '1/6' : '1/3',
        shareValue: total * motherShare,
        percent: motherShare * 100,
        description: hasChildren ? 'Mendapat 1/6 kerana ada waris keturunan (anak).' : 'Mendapat 1/3 kerana tiada waris anak.'
      });
    }

    if (hasFather && fatherShare > 0) {
      // If no children or only daughters, Father can acting as Asabah too.
      // For simplicity in a basic widget, we calculate base 1/6.
      parts.push({
        name: 'Bapa (Deceased Father)',
        shareStr: '1/6',
        shareValue: total * fatherShare,
        percent: fatherShare * 100,
        description: 'Mendapat fardhu 1/6 berserta potensi baki (Asabah).'
      });
    }

    if (spouseType === 'husband') {
      parts.push({
        name: 'Suami (Deceased Husband)',
        shareStr: hasChildren ? '1/4' : '1/2',
        shareValue: total * spouseShare,
        percent: spouseShare * 100,
        description: hasChildren ? 'Mendapat 1/4 suami disebabkan ada anak.' : 'Mendapat 1/2 suami disebabkan tiada anak.'
      });
    } else if (spouseType === 'wife') {
      parts.push({
        name: 'Isteri (Deceased Wife)',
        shareStr: hasChildren ? '1/8' : '1/4',
        shareValue: total * spouseShare,
        percent: spouseShare * 100,
        description: hasChildren ? 'Mendapat 1/8 berkongsi kerana ada anak.' : 'Mendapat 1/4 berkongsi kerana tiada anak.'
      });
    }

    // 4. Children portion (Asabah Bil Ghair)
    // Residual allocation to boys and girls at a 2:1 ratio.
    const totalKidsCount = sonsCount + daughtersCount;
    if (totalKidsCount > 0) {
      // Sons get double portion. Total shares factor:
      const sharesFactor = (sonsCount * 2) + daughtersCount;
      const childResidualPool = remainingPart;

      if (sonsCount > 0) {
        const singleSonShare = (childResidualPool / sharesFactor) * 2;
        parts.push({
          name: `Anak Lelaki (${sonsCount} orang)`,
          shareStr: `${sonsCount} x Asabah (Nisbah 2)`,
          shareValue: total * singleSonShare * sonsCount,
          percent: singleSonShare * sonsCount * 100,
          description: `Mendapat baki pusaka (Asabah). Setiap anak lelaki mendapat RM ${ (total * singleSonShare).toLocaleString('ms-MY', { maximumFractionDigits: 2 }) } (dua kali ganda anak perempuan).`
        });
      }

      if (daughtersCount > 0) {
        const singleDaughterShare = (childResidualPool / sharesFactor);
        parts.push({
          name: `Anak Perempuan (${daughtersCount} orang)`,
          shareStr: `${daughtersCount} x Asabah (Nisbah 1)`,
          shareValue: total * singleDaughterShare * daughtersCount,
          percent: singleDaughterShare * daughtersCount * 100,
          description: `Mendapat baki pusaka (Asabah). Setiap anak perempuan mendapat RM ${ (total * singleDaughterShare).toLocaleString('ms-MY', { maximumFractionDigits: 2 }) }.`
        });
      }
    } else {
      // If no children, residue represents baitulmal or extra father's portion
      if (remainingPart > 0) {
        const residueTarget = hasFather ? 'Ditambah ke Bapa (Asabah)' : 'Baitulmal / Waris Ashab lain';
        parts.push({
          name: residueTarget,
          shareStr: 'Residue (Baki)',
          shareValue: total * remainingPart,
          percent: remainingPart * 100,
          description: 'Baki baki pusaka diserahkan kepada waris lelaki terdekat (Asabah) atau disalurkan kepada baitulmal.'
        });
      }
    }

    return parts;
  };

  const distribution = calculateDistribution();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 hover:border-amber-500/20 transition-all duration-300" id="faraid_calculator">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <Scale size={20} />
        </div>
        <div>
          <h2 className="font-sans font-bold text-lg text-white">Kira Faraid Tradisional</h2>
          <p className="text-xs text-slate-400 font-sans">Simulasi ringkas pengagihan harta pusaka mengikut Hukum Syarak di Malaysia (Mazhab Syafi&apos;i).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-4">
          <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">MASUKKAN ANGGOTA WARIS:</span>

          {/* Nilai Harta */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-mono font-semibold">NILAI HARTANAH/HARTA (RM):</label>
            <input
              type="number"
              value={estateValue}
              onChange={(e) => setEstateValue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none"
              placeholder="0"
            />
          </div>

          {/* Pasangan yang ditinggalkan */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-mono font-semibold">PASANGAN YANG DITINGGALKAN:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSpouseType('none')}
                className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                  spouseType === 'none'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                }`}
              >
                Tiada
              </button>
              <button
                onClick={() => setSpouseType('husband')}
                className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                  spouseType === 'husband'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                }`}
              >
                Suami (Husband)
              </button>
              <button
                onClick={() => setSpouseType('wife')}
                className={`p-2 rounded-xl text-[10px] font-sans font-semibold border transition-all truncate cursor-pointer ${
                  spouseType === 'wife'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-slate-200'
                }`}
              >
                Isteri (Wife)
              </button>
            </div>
          </div>

          {/* Ibu Bapa */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-mono font-semibold">IBU DAN BAPA DECEASED:</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 px-3 bg-slate-950/80 border border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMother}
                  onChange={(e) => setHasMother(e.target.checked)}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span className="text-slate-300 text-xs font-sans">Ada Ibu</span>
              </label>
              <label className="flex items-center gap-2 p-2 px-3 bg-slate-950/80 border border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFather}
                  onChange={(e) => setHasFather(e.target.checked)}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span className="text-slate-300 text-xs font-sans">Ada Bapa</span>
              </label>
            </div>
          </div>

          {/* Anak-anak */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-mono font-medium">ANAK LELAKI:</label>
              <input
                type="number"
                min="0"
                value={sonsCount}
                onChange={(e) => setSonsCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white font-mono text-xs text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-mono font-medium">ANAK PEREMPUAN:</label>
              <input
                type="number"
                min="0"
                value={daughtersCount}
                onChange={(e) => setDaughtersCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white font-mono text-xs text-center"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">ANGGARAN PEMBAHAGIAN FARAID:</span>

          <div className="flex flex-col gap-3 flex-1">
            {distribution.map((d, index) => (
              <div key={index} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-sans font-bold text-xs text-slate-200">{d.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{d.shareStr}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-400 font-semibold text-sm">
                      RM {d.shareValue.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="text-[9px] font-mono text-slate-500">
                      ≈ {d.percent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1 pt-1 border-t border-slate-900 border-dashed">
                  {d.description}
                </p>
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-500/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traditional disclaimer */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex gap-3 text-[11px] text-slate-400 leading-relaxed font-sans">
        <FileText size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-300 font-mono">PEMBERITAHUAN SYARIAH (LEGAL NOTICE):</span>
          <p>
            Alat ini adalah untuk simulasi pendidikan sahaja berdasarkan nisbah standard Syafi&apos;i Faraid (anak lelaki mendapat 2 nisbah berbanding anak perempuan 1 nisbah, isteri mendapat 1/8 atau 1/4, bapa mendapat 1/6, dan ibu mendapat 1/6 atau 1/3). Pembahagian rasmi sebenar pusaka mestilah disahkan oleh Mahkamah Tinggi Syariah atau Unit Pembahagian Pusaka Kecil (Pejabat Tanah).
          </p>
        </div>
      </div>
    </div>
  );
}
