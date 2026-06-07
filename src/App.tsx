/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, Scale, HeartHandshake, ShoppingBag, Award, HelpCircle, Landmark, BookOpen } from 'lucide-react';
import Calculator from './components/Calculator';
import UnitConverter from './components/UnitConverter';
import ZakatCalculator from './components/ZakatCalculator';
import KampungEstimator from './components/KampungEstimator';
import FaraidSimple from './components/FaraidSimple';

type TabId = 'converter' | 'calculator' | 'zakat' | 'kampung' | 'faraid';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('converter');
  const [showTrivia, setShowTrivia] = useState<boolean>(true);

  const tabList = [
    { id: 'converter', name: 'Penukar Unit Tradisi', desc: ' Kati, Pikul, Relung, Mayam, Cupak', icon: Scale },
    { id: 'calculator', name: 'Kalkulator Saintifik', desc: 'Asas & Fungsi Saintifik Lengkap', icon: CalcIcon },
    { id: 'zakat', name: 'Zakat & Fidyah', desc: 'Fitrah Beras, Gantang & Mud', icon: HeartHandshake },
    { id: 'kampung', name: 'Sukatan Kampung', desc: 'Bilik Pisang, Ikat Petai, Kodi Kain', icon: ShoppingBag },
    { id: 'faraid', name: 'Kiraan Faraid', desc: 'Simulasi Pusaka Tradisional', icon: Award }
  ] as const;

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'converter':
        return <UnitConverter />;
      case 'calculator':
        return <Calculator />;
      case 'zakat':
        return <ZakatCalculator />;
      case 'kampung':
        return <KampungEstimator />;
      case 'faraid':
        return <FaraidSimple />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-400" id="app_root">
      {/* Upper Navigation Banner */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/10">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-2">
                Kalkulator & Penukar Tradisional Malaysia
              </h1>
              <p className="text-xs text-slate-400">Warisan sukat timbang klasik bertemu teknologi pengiraan moden</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/80 p-2 rounded-xl border border-slate-900">
            <span className="text-slate-500">KEMAS KINI:</span>
            <span className="text-amber-400 font-semibold">JUN 2026</span>
          </div>
        </div>
      </header>

      {/* Main Content Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Dynamic educational trivia notice ticker */}
        {showTrivia && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl"
            id="trivia_banner"
          >
            <div className="flex gap-3">
              <div className="text-amber-400 p-2 bg-amber-500/10 rounded-xl shrink-0 h-fit self-start">
                <BookOpen size={16} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono font-bold text-amber-300">INFO MINDA (MALAYSIAN MATH HISTORY):</span>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Sistem ukuran tradisional Malaysia seperti <strong>Kati</strong>, <strong>Pikul</strong>, dan <strong>Gantang</strong> diwarisi sejak zaman Kesultanan Melayu Melaka. Sukat ini diharmonisasikan di Negeri-Negeri Selat pada kurun ke-19 sebelum sistem Metrik (SI) diperkenalkan sepenuhnya di Malaysia pada tahun 1970-an.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTrivia(false)}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-mono font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800 shrink-0 cursor-pointer"
            >
              TUTUP INFO
            </button>
          </motion.div>
        )}

        {/* Tab Selection Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs Selectors */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="text-[10px] text-slate-500 font-mono font-bold tracking-widest pl-1">
              PUNCI UTAMA (FEATURES):
            </div>
            
            <div className="flex flex-col gap-2 bg-slate-900/30 p-2.5 rounded-3xl border border-slate-900" id="tabs_sidebar">
              {tabList.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all relative group cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border border-slate-800 text-white shadow-lg shadow-black/20'
                        : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                    id={`sidebar_tab_${tab.id}`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 transition-colors relative z-10 ${
                      isActive ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'bg-slate-900/80 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-sans font-bold text-xs">{tab.name}</span>
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate mt-0.5">
                        {tab.desc}
                      </span>
                    </div>

                    {/* Left amber indicator tag */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-1 top-4 bottom-4 w-[3px] bg-amber-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick conversion formulas references box */}
            <div className="bg-slate-900/30 rounded-3xl p-5 border border-slate-900 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-bold">
                <Landmark size={14} className="text-amber-400" />
                <span>FORMULA RINGKAS TRADISI:</span>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-2.5 leading-relaxed font-sans list-inside list-disc pl-1 border-t border-slate-900 pt-2.5">
                <li><strong className="text-slate-300">1 Pikul</strong> = 100 Kati = 60.479 kg</li>
                <li><strong className="text-slate-300">1 Kati</strong> = 16 Tahil = 604.79 gram</li>
                <li><strong className="text-slate-300">1 Relung Kedah</strong> = 480 Jemba² = 30,720 kp</li>
                <li><strong className="text-slate-300">1 Gantang</strong> = 4 Cupak = 4.546 Liter</li>
                <li><strong className="text-slate-300">1 Mayam Emas</strong> = 3.375 gram</li>
                <li><strong className="text-slate-300">1 Kodi</strong> = 20 Helai (Borong)</li>
              </ul>
            </div>
          </div>

          {/* Active Work Area Panel */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              id="active_tab_wrapper"
            >
              {renderActiveComponent()}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer information section */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/40 text-center text-[11px] text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Hak Cipta Terpelihara &copy; 2026. Aplikasi Kalkulator Converter Tradisional Malaysia.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400">Pendidikan Matematik Warisan</span>
            <span className="hover:text-slate-400">JAKIM &amp; JUPEM Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
