import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { curriculum } from './data/index';

export default function App() {
  const [selection, setSelection] = useState<{ type: 'month' | 'week' | 'day'; data: any } | null>({
    type: 'month',
    data: curriculum.months[0]
  });

  const selectedId = selection 
    ? selection.type === 'month' 
      ? `m-${selection.data.month}`
      : selection.type === 'week'
        ? `w-${selection.data.week}`
        : `d-${selection.data.day}`
    : null;

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden">
      <Sidebar 
        roadmap={curriculum} 
        onSelect={setSelection} 
        selectedId={selectedId}
      />
      <main className="flex-1 flex flex-col min-w-0">
          <header className="h-12 border-b border-slate-700 bg-[#1e293b] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 tracking-wider">PROGRESS:</span>
                <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-indigo-500"></div>
                </div>
                <span className="text-indigo-400 font-mono">120/150</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-700 text-white text-[10px] uppercase font-bold tracking-wider rounded border border-slate-600 hover:bg-slate-600 transition-colors">Documentation</button>
              <button className="px-3 py-1 bg-indigo-600 text-white text-[10px] uppercase tracking-wider rounded border border-indigo-500 hover:bg-indigo-500 font-bold transition-colors">Launch Sandbox</button>
            </div>
          </header>
          <MainContent selection={selection} />
          <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-6 justify-between shrink-0">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Platform Engineering Certification Path</div>
            <div className="flex gap-4 text-[10px] font-mono text-indigo-500">
              <span>LATENCY: 12ms</span>
              <span>IDP_SYNC: OK</span>
              <span>KUBECONFIG: LOADED</span>
            </div>
          </footer>
      </main>
    </div>
  );
}
