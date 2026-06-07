/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  baseRatio: number; // Multiply by this to get the base unit
  description: string;
  isTraditional: boolean;
}

export type UnitCategory = 'berat' | 'keluasan' | 'isi_padu' | 'panjang' | 'emas';

export interface CategoryInfo {
  id: UnitCategory;
  name: string;
  symbol: string;
  baseUnit: string;
  description: string;
  units: Unit[];
}

export const conversionData: Record<UnitCategory, CategoryInfo> = {
  berat: {
    id: 'berat',
    name: 'Berat (Weight / Jisim)',
    symbol: 'kg',
    baseUnit: 'g', // Keep base unit in grams to preserve precision for small traditional units
    description: 'Tukarkan unit berat tradisional Melayu (kati, pikul, tahil) kepada unit standard moden (kg, g, lb).',
    units: [
      { id: 'hoon', name: 'Hoon', symbol: 'hoon', baseRatio: 0.378, description: '1 Hoon = 10 Sec = 0.378 g. Sangat kecil, digunakan untuk ubat/pustaka tradisional.', isTraditional: true },
      { id: 'chee', name: 'Chee', symbol: 'chee', baseRatio: 3.78, description: '1 Chee = 10 Hoon = 3.78 g.', isTraditional: true },
      { id: 'tahil', name: 'Tahil', symbol: 'tahil', baseRatio: 37.799, description: '1 Tahil = 10 Chee = 37.799 g (biasanya dibulatkan ke 37.8 g).', isTraditional: true },
      { id: 'kati', name: 'Kati', symbol: 'kati', baseRatio: 604.79, description: '1 Kati = 16 Tahil = 604.79 g (kira-kira 0.6 kg). Digunakan untuk menimbang barangan runcit dahulu.', isTraditional: true },
      { id: 'pikul', name: 'Pikul', symbol: 'pikul', baseRatio: 60479.0, description: '1 Pikul = 100 Kati = 60.479 kg. Tradisi mengangkat beban pikul di bahu.', isTraditional: true },
      { id: 'koyan_b', name: 'Koyan (Berat)', symbol: 'koyan (berat)', baseRatio: 2419160.0, description: '1 Koyan = 40 Pikul = 2,419.16 kg (kira-kira 2.4 tan).', isTraditional: true },
      { id: 'g', name: 'Gram', symbol: 'g', baseRatio: 1.0, description: 'Unit metrik SI asas untuk jisim kecil.', isTraditional: false },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', baseRatio: 1000.0, description: 'Unit metrik SI standard untuk jisim.', isTraditional: false },
      { id: 'lb', name: 'Pound', symbol: 'lb', baseRatio: 453.59237, description: 'Unit imperial British.', isTraditional: false },
      { id: 'oz', name: 'Ounce', symbol: 'oz', baseRatio: 28.349523, description: 'Unit imperial British untuk berat ringan.', isTraditional: false }
    ]
  },
  keluasan: {
    id: 'keluasan',
    name: 'Keluasan Tanah (Area)',
    symbol: 'm²',
    baseUnit: 'kp', // Base unit in kaki persegi (square feet)
    description: 'Tukarkan unit tanah tradisional seperti Relung, Lelong, dan Jemba (terutamanya di Kedah/Kedah Utara) kepada unit moden (ekar, hektar, meter persegi).',
    units: [
      { id: 'jemba_persegi', name: 'Jemba Persegi', symbol: 'jemba²', baseRatio: 64.0, description: '1 Jemba Persegi = 8 kaki x 8 kaki = 64 kp. Ruang petak tanah asas.', isTraditional: true },
      { id: 'lelong', name: 'Lelong', symbol: 'lelong', baseRatio: 7680.0, description: '1 Lelong = 120 Jemba Persegi = 7,680 kp (iaitu 1/4 Relung Kedah).', isTraditional: true },
      { id: 'relung_kedah', name: 'Relung Kedah/Utara', symbol: 'relung (Kedah)', baseRatio: 30720.0, description: '1 Relung Kedah = 480 Jemba Persegi = 30,720 kp (~0.28 Hektar). Digunakan meluas untuk sawah padi.', isTraditional: true },
      { id: 'relung_penang', name: 'Relung Pulau Pinang', symbol: 'relung (PP)', baseRatio: 24000.0, description: '1 Relung Pulau Pinang / Negeri Selat = 24,000 kp (~0.55 Ekar).', isTraditional: true },
      { id: 'kaki_persegi', name: 'Kaki Persegi (Sq Ft)', symbol: 'kp / sq ft', baseRatio: 1.0, description: 'Unit ukuran keluasan hartanah moden di Malaysia.', isTraditional: false },
      { id: 'meter_persegi', name: 'Meter Persegi (m²)', symbol: 'm²', baseRatio: 10.76391, description: 'Unit keluasan metrik SI rasmi.', isTraditional: false },
      { id: 'ekar', name: 'Ekar (Acre)', symbol: 'ekar', baseRatio: 43560.0, description: '1 Ekar = 43,560 kp. Digunakan meluas untuk tanah pertanian.', isTraditional: false },
      { id: 'hektar', name: 'Hektar (Hectare)', symbol: 'hektar', baseRatio: 107639.1, description: '1 Hektar = 10,000 m² = 107,639.1 kp.', isTraditional: false }
    ]
  },
  isi_padu: {
    id: 'isi_padu',
    name: 'Sukat Basah / Kering (Volume)',
    symbol: 'L',
    baseUnit: 'liter', // Base unit in liters
    description: 'Tukarkan unit sukat isi padu beras/bijirin tradisional Melayu (gantang, cupak, leng, kepul) kepada liter dan mililiter.',
    units: [
      { id: 'kepul', name: 'Kepul', symbol: 'kepul', baseRatio: 0.28413, description: '1 Kepul = 1/4 Cupak = 0.284 Liter (kira-kira 1 cawan limpah).', isTraditional: true },
      { id: 'leng', name: 'Leng', symbol: 'leng', baseRatio: 0.56826, description: '1 Leng = 1/2 Cupak = 2 Kepul = 0.568 Liter.', isTraditional: true },
      { id: 'cupak', name: 'Cupak', symbol: 'cupak', baseRatio: 1.13652, description: '1 Cupak = 4 Kepul = 1.136 Liter. Sukat makanan kering seperti beras basah.', isTraditional: true },
      { id: 'gantang', name: 'Gantang', symbol: 'gantang', baseRatio: 4.54609, description: '1 Gantang = 4 Cupak = 4.546 Liter (bersamaan gelen imperial). Digunakan untuk sukatan zakat fitrah.', isTraditional: true },
      { id: 'koyan_v', name: 'Koyan (Isi Padu/Beras)', symbol: 'koyan (isi padu)', baseRatio: 3636.872, description: '1 Koyan = 800 Gantang = 3,636.87 Liter.', isTraditional: true },
      { id: 'liter', name: 'Liter', symbol: 'L', baseRatio: 1.0, description: 'Unit standard SI untuk isi padu cecair dan kering.', isTraditional: false },
      { id: 'mililiter', name: 'Mililiter', symbol: 'mL', baseRatio: 0.001, description: 'Sesuai untuk cecair berskala kecil.', isTraditional: false },
      { id: 'cawan', name: 'Cawan (Cup)', symbol: 'cawan', baseRatio: 0.25, description: 'Unit cawan masakan standard (250 ml).', isTraditional: false },
      { id: 'gallon_us', name: 'Gelen (US Gallon)', symbol: 'gal (US)', baseRatio: 3.78541, description: 'Unit gelen Amerika Syarikat.', isTraditional: false }
    ]
  },
  panjang: {
    id: 'panjang',
    name: 'Ukuran Panjang & Tubuh (Length)',
    symbol: 'm',
    baseUnit: 'meter', // Base unit in meters
    description: 'Tukarkan unit ukuran panjang tradisional berdasarkan anggota tubuh (jengkal, hasta, depa) kepada unit moden.',
    units: [
      { id: 'jengkal', name: 'Jengkal', symbol: 'jengkal', baseRatio: 0.2286, description: 'Lebar antara hujung ibu jari dengan hujung jari kelingking yang diregangkan (kira-kira 9 inci).', isTraditional: true },
      { id: 'hasta', name: 'Hasta', symbol: 'hasta', baseRatio: 0.4572, description: 'Panjang dari siku hingga ke hujung jari hantu (2 jengkal / kira-kira 18 inci).', isTraditional: true },
      { id: 'ela', name: 'Ela (Yard)', symbol: 'ela', baseRatio: 0.9144, description: 'Panjang dari pangkal bahu hingga ke hujung jari (2 hasta / 36 inci).', isTraditional: true },
      { id: 'depa', name: 'Depa', symbol: 'depa', baseRatio: 1.8288, description: 'Panjang rentangan kedua-dua belah tangan dari hujung jari kiri ke hujung jari kanan (4 hasta / 2 ela / 6 kaki).', isTraditional: true },
      { id: 'jemba_panjang', name: 'Jemba (Panjang)', symbol: 'jemba', baseRatio: 3.6576, description: '1 Jemba Panjang = 2 Depa = 12 kaki (3.6576 meter).', isTraditional: true },
      { id: 'rantai', name: 'Rantai (Chain)', symbol: 'rantai', baseRatio: 20.1168, description: '1 Rantai = 22 Ela = 66 Kaki. Digunakan meluas dalam pelan tanah lama.', isTraditional: true },
      { id: 'batu', name: 'Batu (Batu Lama / Mile)', symbol: 'batu', baseRatio: 1609.344, description: '1 Batu Tradisi (seperti batu penanda jalan darat) = 1.609 km.', isTraditional: true },
      { id: 'inci', name: 'Inci (Inch)', symbol: 'in', baseRatio: 0.0254, description: 'Unit kecil standard Imperial.', isTraditional: false },
      { id: 'kaki', name: 'Kaki (Feet)', symbol: 'ft', baseRatio: 0.3048, description: '1 kaki = 12 inci.', isTraditional: false },
      { id: 'cm', name: 'Sentimeter (cm)', symbol: 'cm', baseRatio: 0.01, description: 'Unit metrik kecil.', isTraditional: false },
      { id: 'meter', name: 'Meter (m)', symbol: 'm', baseRatio: 1.0, description: 'Unit panjang asas sistem SI.', isTraditional: false },
      { id: 'km', name: 'Kilometer (km)', symbol: 'km', baseRatio: 1000.0, description: 'Unit panjang jarak jauh metrik.', isTraditional: false }
    ]
  },
  emas: {
    id: 'emas',
    name: 'Emas Tradisional (Gold Weight)',
    symbol: 'mayam',
    baseUnit: 'gram', // Base unit in grams
    description: 'Tukarkan unit timbangan emas tradisional Kelantan, Terengganu dan Pantai Timur (Mayam, Bungkal) kepada Gram dan Troy Ounce.',
    units: [
      { id: 'mayam', name: 'Mayam (Emas Kelantan)', symbol: 'mayam', baseRatio: 3.375, description: '1 Mayam = 3.375 gram. Sangat sinonim dengan jual beli emas perhiasan tradisional.', isTraditional: true },
      { id: 'bungkal', name: 'Bungkal (Emas)', symbol: 'bungkal', baseRatio: 40.5, description: '1 Bungkal = 12 Mayam = 40.5 gram. Biasanya digunakan untuk ketul emas dan jongkong lama.', isTraditional: true },
      { id: 'gram', name: 'Gram (g)', symbol: 'g', baseRatio: 1.0, description: 'Unit timbangan emas moden yang digunakan oleh kedai emas utama.', isTraditional: false },
      { id: 'troy_ounce', name: 'Troy Ounce (oz t)', symbol: 'oz t', baseRatio: 31.1034768, description: 'Unit standard komoditi emas antarabangsa (1 oz t ≈ 31.1 g).', isTraditional: false }
    ]
  }
};

export interface KampungItem {
  id: string;
  name: string;
  description: string;
  subUnits: {
    name: string;
    ratio: number; // Ratio relative to single unit
    detail: string;
  }[];
}

export const kampungData: KampungItem[] = [
  {
    id: 'pisang',
    name: 'Pisang (Tandan, Sikat, Biji)',
    description: 'Cara tradisional mengira buah pisang dari pokok ke pasar.',
    subUnits: [
      { name: 'Tandan (Bunch)', ratio: 120, detail: '1 Tandan mengandungi purata 8 sikat (sikat/sisir) atau kira-kira 120 biji.' },
      { name: 'Sikat / Sisir (Comb)', ratio: 15, detail: '1 Sikat atau sisir mengandungi sekitar 12 - 18 biji (purata 15 biji).' },
      { name: 'Biji (Single Banana)', ratio: 1, detail: 'Sebutir buah pisang individu.' }
    ]
  },
  {
    id: 'pakaian',
    name: 'Kain & Pakaian (Kodi, Helai)',
    description: 'Piawaian borong kain Batik, Songket, Kain Pelikat, dan baju tradisional.',
    subUnits: [
      { name: 'Kodi', ratio: 20, detail: '1 Kodi mengandungi 20 helai pakaian/kain. Digunakan meluas dalam industri borong tekstil kelantan.' },
      { name: 'Sedarzen (Dozen)', ratio: 12, detail: '1 Dozen mengandungi 12 helai.' },
      { name: 'Helai (Piece)', ratio: 1, detail: 'Sehelai kain atau sepasang baju.' }
    ]
  },
  {
    id: 'petai',
    name: 'Petai (Ikat, Papan)',
    description: 'Pengiraan hasil hutan kegemaran ramai iaitu papan petai segar.',
    subUnits: [
      { name: 'Ikat (Bundle)', ratio: 100, detail: '1 Ikat petai tradisi biasanya mengandungi 100 papan (atau 10 berkas kecil x 10 papan).' },
      { name: 'Berkas Kecil', ratio: 10, detail: '1 Berkas kecil mengandungi 10 papan petai.' },
      { name: 'Papan (Single Pod)', ratio: 1, detail: 'Satu lereng/papan petai berserta biji di dalamnya.' }
    ]
  },
  {
    id: 'durian',
    name: 'Durian (Longgok, Biji, Pangsa)',
    description: 'Ukuran jualan durian kampung di tepi jalan raya.',
    subUnits: [
      { name: 'Longgok (Pile)', ratio: 5, detail: '1 Longgok durian kampung biasanya mengandungi 3 - 5 biji buah durian saiz sederhana.' },
      { name: 'Biji (Whole Fruit)', ratio: 1, detail: 'Sebiji buah durian utuh.' },
      { name: 'Pangsa / Ulas (Lobe)', ratio: 0.2, detail: 'Purata sebiji durian mengandungi 5 pangsa ulas emas di dalamnya (1 biji ≈ 5 pangsa).' }
    ]
  },
  {
    id: 'kelapa',
    name: 'Kelapa Muda (Tali, Biji)',
    description: 'Sistem jualan borong buah kelapa kelapa muda/kelapa parut.',
    subUnits: [
      { name: 'Tali (Bundle)', ratio: 10, detail: '1 Tali jalinan buah kelapa biasanya mengandungi 10 biji kelapa yang diikat gantung sekali.' },
      { name: 'Biji (Single Coconut)', ratio: 1, detail: 'Sebiji buah kelapa.' }
    ]
  }
];

export interface ZakatStateRate {
  state: string;
  rateNormal: number;    // RM for normal rice grade
  rateFragrant: number;  // RM for fragrant/Basmati grade
  ratePremium: number;   // RM for premium basmati/etc
}

// Custom simulated Zakat fitrah rate reference in Malaysia
export const zakatStateRates: ZakatStateRate[] = [
  { state: 'Kedah', rateNormal: 7.00, rateFragrant: 14.50, ratePremium: 21.00 },
  { state: 'Pulau Pinang', rateNormal: 7.00, rateFragrant: 13.00, ratePremium: 20.00 },
  { state: 'Perlis', rateNormal: 7.00, rateFragrant: 10.00, ratePremium: 15.00 },
  { state: 'Kelantan', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Terengganu', rateNormal: 8.00, rateFragrant: 15.00, ratePremium: 22.00 },
  { state: 'Pahang', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Perak', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Selangor', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Wilayah Persekutuan (KL/Putrajaya)', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Negeri Sembilan', rateNormal: 7.00, rateFragrant: 10.00, ratePremium: 21.00 },
  { state: 'Melaka', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 },
  { state: 'Johor', rateNormal: 7.00, rateFragrant: 10.00, ratePremium: 20.00 },
  { state: 'Sabah', rateNormal: 7.00, rateFragrant: 10.00, ratePremium: 15.00 },
  { state: 'Sarawak', rateNormal: 7.00, rateFragrant: 14.00, ratePremium: 21.00 }
];
