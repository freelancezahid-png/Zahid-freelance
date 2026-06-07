/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Delete, RotateCcw, HelpCircle, History, Landmark, Save } from 'lucide-react';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showScientific, setShowScientific] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);

  // Helper to handle standard button inputs
  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setExpression(expression + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleDecimal = () => {
    if (display === 'Error') return;
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
  };

  const backspace = () => {
    if (display === 'Error' || display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (display === '0' || display === 'Error') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  // Safe evaluation supporting basic and simple math functions
  const calculateResult = () => {
    const fullExpr = expression + display;
    if (!fullExpr || fullExpr.trim() === '') return;

    try {
      // Clean and sanitize expression for evaluation
      // Replace symbols to evaluate safely
      let sanitized = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Simple bracket balancer
      const openBrackets = (sanitized.match(/\(/g) || []).length;
      const closeBrackets = (sanitized.match(/\)/g) || []).length;
      if (openBrackets > closeBrackets) {
        sanitized += ')'.repeat(openBrackets - closeBrackets);
      }

      // Safe JS eval (under strict string boundaries, only calculating basic mathematical outputs)
      // Check for illegal patterns to prevent JS command injection
      if (/[a-zA-Z_]/.test(sanitized.replace(/Math\.[a-z0-9]+/g, ''))) {
        throw new Error('Input tidak sah');
      }

      // eslint-disable-next-line no-eval
      const resultValue = eval(sanitized);

      if (resultValue === Infinity || resultValue === -Infinity || isNaN(resultValue)) {
        throw new Error('Bahagi sifar / Nilai tidak sah');
      }

      const formattedResult = Number(Number(resultValue).toFixed(8)).toString(); // Max 8 decimals, strip trailing zeroes

      // Add to history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory(prev => [
        { expression: fullExpr, result: formattedResult, timestamp: timeStr },
        ...prev.slice(0, 19) // Keep last 20 calculations
      ]);

      setDisplay(formattedResult);
      setExpression('');
    } catch (err) {
      setDisplay('Error');
    }
  };

  // Handlers for Scientific operations
  const handleScientificFunc = (func: string) => {
    if (display === 'Error') return;
    if (func === 'pi') {
      setDisplay(Math.PI.toString());
    } else if (func === 'e') {
      setDisplay(Math.E.toString());
    } else {
      // For functions like sin, cos, tan, ln, log, sqrt, we append the bracket
      setExpression(expression + func + '(' + (display === '0' ? '' : display));
      setDisplay('0');
    }
  };

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => setDisplay(memory.toString());
  const memoryAdd = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) setMemory(prev => prev + val);
  };
  const memorySubtract = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) setMemory(prev => prev - val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-w-md mx-auto w-full flex flex-col gap-4 text-white hover:border-amber-500/20 transition-all duration-300" id="main_calculator">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
            <Landmark size={18} />
          </div>
          <span className="font-sans font-medium text-sm tracking-wide text-slate-300">Kalkulator Saintifik</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowScientific(!showScientific)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
              showScientific ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Sains / Asas"
            id="toggle_scientific_btn"
          >
            {showScientific ? 'SAINS' : 'ASAS'}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              showHistory ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Sejarah Kiraan"
            id="toggle_history_btn"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {/* Screen Display */}
      <div className="bg-slate-950 rounded-2xl p-4 flex flex-col justify-end items-end min-h-[100px] border border-slate-900 overflow-hidden relative" id="calc_screen">
        <div className="text-slate-500 text-xs font-mono text-right truncate w-full h-5 select-all">
          {expression || '\u00A0'}
        </div>
        <div className="text-right text-3xl font-mono text-amber-400 font-semibold tracking-wider select-all truncate w-full mt-1">
          {display}
        </div>
        
        {memory !== 0 && (
          <span className="absolute left-3 bottom-2 text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            M: {Number(memory.toFixed(4))}
          </span>
        )}
      </div>

      {/* Main Container - Conditional for History View */}
      {showHistory ? (
        <div className="h-64 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 p-3 select-none" id="calc_history_panel">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400">Sejarah Kiraan (20 terakhir)</span>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1"
                id="clear_history_btn"
              >
                <RotateCcw size={10} /> Padam Semua
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-600 font-mono text-xs p-4">
                <HelpCircle size={24} className="mb-2 text-slate-700" />
                Tiada rekod kiraan lagi.
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setDisplay(item.result);
                    setExpression('');
                    setShowHistory(false);
                  }}
                  className="p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer transition-all text-right text-xs"
                  title="Klik untuk ambil keputusan"
                >
                  <div className="text-[10px] text-slate-500 font-mono">{item.timestamp}</div>
                  <div className="text-slate-400 font-mono truncate">{item.expression}</div>
                  <div className="text-amber-400 font-mono font-medium truncate">={item.result}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 select-none" id="calc_buttons_grid">
          {/* Memory Row */}
          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={memoryClear} className="py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors" id="m_clear">MC</button>
            <button onClick={memoryRecall} className="py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors" id="m_recall">MR</button>
            <button onClick={memoryAdd} className="py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors" id="m_add">M+</button>
            <button onClick={memorySubtract} className="py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors" id="m_sub">M-</button>
          </div>

          {/* Scientific Overlay Row keys */}
          {showScientific && (
            <div className="grid grid-cols-4 gap-1.5 transition-all duration-300 border-b border-slate-800/60 pb-2">
              <button onClick={() => handleScientificFunc('sin')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">sin</button>
              <button onClick={() => handleScientificFunc('cos')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">cos</button>
              <button onClick={() => handleScientificFunc('tan')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">tan</button>
              <button onClick={() => handleOperator('^')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">x^y</button>

              <button onClick={() => handleScientificFunc('ln')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">ln</button>
              <button onClick={() => handleScientificFunc('log')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">log</button>
              <button onClick={() => handleScientificFunc('sqrt')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">√</button>
              <button onClick={() => handleDigit('(')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">(</button>

              <button onClick={() => handleDigit(')')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">)</button>
              <button onClick={() => handleScientificFunc('pi')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">π</button>
              <button onClick={() => handleScientificFunc('e')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">e</button>
              <button onClick={() => handleOperator('%')} className="py-2 bg-slate-800 hover:bg-amber-950/40 hover:text-amber-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer">%</button>
            </div>
          )}

          {/* Core Calculator Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Row 1 */}
            <button onClick={clearAll} className="py-3 bg-rose-950/40 hover:bg-rose-950/60 text-rose-400 rounded-2xl text-sm font-mono font-bold transition-all border border-rose-950/20 cursor-pointer" id="op_clear">C</button>
            <button onClick={() => handleDigit('(')} className={`py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-sm font-mono transition-all cursor-pointer ${showScientific ? 'opacity-40 pointer-events-none' : ''}`} id="op_bracket_open">(</button>
            <button onClick={() => handleDigit(')')} className={`py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-sm font-mono transition-all cursor-pointer ${showScientific ? 'opacity-40 pointer-events-none' : ''}`} id="op_bracket_close">)</button>
            <button onClick={backspace} className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-sm flex items-center justify-center transition-all cursor-pointer" id="op_backspace" title="Satu padam">
              <Delete size={18} />
            </button>

            {/* Row 2 */}
            <button onClick={() => handleDigit('7')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_7">7</button>
            <button onClick={() => handleDigit('8')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_8">8</button>
            <button onClick={() => handleDigit('9')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_9">9</button>
            <button onClick={() => handleOperator('÷')} className="py-3.5 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 rounded-2xl text-lg font-bold transition-all border border-amber-950/10 cursor-pointer" id="op_divide">÷</button>

            {/* Row 3 */}
            <button onClick={() => handleDigit('4')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_4">4</button>
            <button onClick={() => handleDigit('5')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_5">5</button>
            <button onClick={() => handleDigit('6')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_6">6</button>
            <button onClick={() => handleOperator('×')} className="py-3.5 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 rounded-2xl text-lg font-bold transition-all border border-amber-950/10 cursor-pointer" id="op_multiply">×</button>

            {/* Row 4 */}
            <button onClick={() => handleDigit('1')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_1">1</button>
            <button onClick={() => handleDigit('2')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_2">2</button>
            <button onClick={() => handleDigit('3')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_3">3</button>
            <button onClick={() => handleOperator('-')} className="py-3.5 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 rounded-2xl text-lg font-bold transition-all border border-amber-950/10 cursor-pointer" id="op_minus">-</button>

            {/* Row 5 */}
            <button onClick={handleToggleSign} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-300 rounded-2xl text-sm font-mono font-medium transition-all cursor-pointer" id="num_toggle_sign">±</button>
            <button onClick={() => handleDigit('0')} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-100 rounded-2xl text-lg font-mono font-medium transition-all cursor-pointer" id="num_0">0</button>
            <button onClick={handleDecimal} className="py-3.5 bg-slate-800/40 hover:bg-slate-800 text-slate-300 rounded-2xl text-lg font-mono font-bold transition-all cursor-pointer" id="num_decimal">.</button>
            <button onClick={() => handleOperator('+')} className="py-3.5 bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 rounded-2xl text-lg font-bold transition-all border border-amber-950/10 cursor-pointer" id="op_plus">+</button>
          </div>

          {/* Equal Button */}
          <button
            onClick={calculateResult}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 font-bold rounded-2xl text-slate-950 text-xl font-mono shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer mt-1 flex items-center justify-center gap-2"
            id="op_equal"
          >
            = KIRA
          </button>
        </div>
      )}

      {/* Traditional info highlight */}
      <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/50 flex flex-col gap-1 text-[11px] text-slate-400 font-sans">
        <span className="text-amber-400 font-medium font-mono">💡 Tips:</span>
        Kalkulator ini menyokong pengiraan perpuluhan tak terhingga. Keputusan boleh dimanfaatkan untuk nilai tukaran unit di sebelah!
      </div>
    </div>
  );
}
