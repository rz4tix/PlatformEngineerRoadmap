import React, { useState } from 'react';
import { Roadmap, MonthlyMilestone, WeeklyReview, DailyTopic } from '../types';
import { cn } from '../lib/utils';
import { ChevronRight, ChevronDown, Calendar, Folder, FileText, LayoutDashboard, UserSquare2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  roadmap: Roadmap;
  onSelect: (item: { type: 'month' | 'week' | 'day'; data: any }) => void;
  selectedId: string | null;
}

export function Sidebar({ roadmap, onSelect, selectedId }: SidebarProps) {
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 1: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });

  const toggleMonth = (monthNum: number) => {
    setExpandedMonths(prev => ({ ...prev, [monthNum]: !prev[monthNum] }));
  };

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#1e293b] border-r border-slate-700 flex flex-col font-sans h-full">
      <div className="p-4 border-b border-slate-700 bg-[#1e293b]">
        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Staff Platform BootCamp
        </div>
        <h1 className="text-lg font-bold text-white leading-tight underline decoration-indigo-500">Enterprise Roadmap</h1>
        <p className="text-[10px] opacity-60 mt-1 uppercase tracking-wider text-slate-400">ON-PREM & AIR-GAPPED</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {roadmap.months.map((month) => (
          <div key={`m-${month.month}`} className="mb-2">
            <button
               onClick={() => toggleMonth(month.month)}
               className={cn(
                 "w-full flex items-center px-2 py-1.5 transition-colors text-[11px] font-bold text-left group border",
                 selectedId === `m-${month.month}` || (!selectedId && expandedMonths[month.month])
                   ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30 rounded" 
                   : "text-slate-400 hover:bg-slate-800 rounded hover:text-slate-300 border-transparent"
               )}
            >
              <div className="mr-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                {expandedMonths[month.month] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              <span className="truncate flex-1 py-0.5 uppercase tracking-wider">Month {month.month} Tracker</span>
            </button>

            <AnimatePresence>
              {expandedMonths[month.month] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-5 pt-1 space-y-0.5 border-l border-slate-700/50 ml-3">
                    <button
                      onClick={() => onSelect({ type: 'month', data: month })}
                      className={cn(
                        "w-full flex items-center pl-2 pr-2 py-1 transition-colors text-xs text-left",
                        selectedId === `m-${month.month}` 
                          ? "text-indigo-400 font-medium" 
                          : "text-slate-500 hover:bg-slate-800 rounded hover:text-slate-300"
                      )}
                    >
                      <LayoutDashboard size={12} className="mr-2 opacity-70" />
                      Monthly Overview
                    </button>
                    {month.weeks.map(week => (
                      <div key={`w-${week.week}`}>
                        <button
                          onClick={() => toggleWeek(week.week)}
                          className={cn(
                            "w-full flex items-center pl-2 pr-2 py-1 transition-colors text-xs text-left group mt-1",
                            selectedId === `w-${week.week}` 
                              ? "text-amber-400" 
                              : "text-slate-400 hover:bg-slate-800 rounded hover:text-slate-300"
                          )}
                        >
                          <div className="mr-1 text-slate-500">
                            {expandedWeeks[week.week] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </div>
                          <span className="truncate pr-1">Week {week.week}</span>
                        </button>

                         <AnimatePresence>
                          {expandedWeeks[week.week] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-0.5 mt-0.5 relative"
                            >
                              <button
                                onClick={() => onSelect({ type: 'week', data: week })}
                                className={cn(
                                  "w-full flex items-center pl-6 pr-2 py-1 transition-colors text-[11px] text-left",
                                  selectedId === `w-${week.week}` 
                                    ? "text-amber-400 font-medium" 
                                    : "text-slate-500 hover:bg-slate-800 rounded hover:text-slate-300"
                                )}
                              >
                                <Folder size={12} className="mr-2 opacity-70" />
                                Weekly Summary
                              </button>
                              {week.days.map(day => (
                                <button
                                  key={`d-${day.day}`}
                                  onClick={() => onSelect({ type: 'day', data: day })}
                                  className={cn(
                                    "w-full flex items-center pl-6 pr-2 py-1 transition-colors text-[10px] text-left uppercase tracking-wider font-semibold",
                                    selectedId === `d-${day.day}` 
                                      ? "text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500 pl-5.5" 
                                      : "text-slate-500 hover:text-slate-300 border-l-2 border-transparent"
                                  )}
                                >
                                  <span className="truncate flex-1 pr-1">Day {(day.day).toString().padStart(2, '0')}: {day.topic.split(' ').slice(0,2).join(' ')}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="p-3 bg-slate-900 border-t border-slate-700 shrink-0">
        <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Mentor status</div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center text-white font-bold"><UserSquare2 size={16} /></div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-300 font-medium leading-tight">Staff Eng. Advisor</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse"></span> Online for Review</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
