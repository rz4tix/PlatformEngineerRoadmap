import React from 'react';
import { MonthlyMilestone, WeeklyReview, DailyTopic } from '../types';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, BookOpen, Terminal, Presentation, ShieldAlert, Cpu, FileText } from 'lucide-react';

interface MainContentProps {
  selection: { type: 'month' | 'week' | 'day'; data: any } | null;
}

export function MainContent({ selection }: MainContentProps) {
  if (!selection) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a] text-slate-500 text-xs uppercase tracking-widest font-bold">
        <p>Select a topic from the sidebar.</p>
      </div>
    );
  }

  const { type, data } = selection;

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f172a] text-slate-300 p-6 scrollbar-hide">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
           key={`${type}-${data.month || data.week || data.day}`}
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.2 }}
           className="flex flex-col gap-6"
        >
          {type === 'day' && <DayView day={data as DailyTopic} />}
          {type === 'week' && <WeekView week={data as WeeklyReview} />}
          {type === 'month' && <MonthView month={data as MonthlyMilestone} />}
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, className = "" }: { title: string, icon?: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-slate-900/50 p-4 rounded border border-slate-700/50 flex flex-col shadow-inner ${className}`}>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
        {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
        {title}
      </h3>
      <div className="text-xs space-y-1.5 flex-1">
        {children}
      </div>
    </div>
  );
}

function DayView({ day }: { day: DailyTopic }) {
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full gap-6 pb-12">
      <section className="bg-[#1e293b] rounded-lg border border-slate-700 p-5 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Phase 0{day.day < 10 ? '1' : Math.floor(day.day/10) + 1} &nbsp;|&nbsp; Day {day.day < 10 ? `0${day.day}` : day.day}</span>
            <h2 className="text-xl font-bold text-white mt-1.5 tracking-tight">{day.title}</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-500 block font-bold tracking-widest">Est. Effort</span>
            <span className="text-sm text-white font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">6.5 Hours</span>
          </div>
        </div>
        <p className="text-xs text-indigo-300 mb-4 font-semibold">{day.topic}</p>
        <p className="text-xs text-slate-300 leading-relaxed mb-6 whitespace-pre-line border-l-2 border-slate-700 pl-4">{day.theory}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Learning Objectives" icon={<CheckCircle2 size={14} />}>
            <ul className="space-y-2">
              {day.objectives.map((obj, i) => (
                <li key={i} className="flex gap-2 items-start"><span className="text-indigo-500 text-sm leading-none">•</span> <span className="text-slate-300">{obj}</span></li>
              ))}
            </ul>
          </Section>
          
          <Section title="Practical Tasks" icon={<Terminal size={14} />}>
             <ul className="space-y-2">
              {day.practicalTasks.map((task, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-emerald-500 text-sm leading-none">□</span> 
                  <span className="text-slate-300">{task}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </section>

      <section className="bg-[#1e293b] rounded-lg border border-slate-700 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
           <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
             <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
             Simulation & Debugging Lab
           </h3>
           <span className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded uppercase tracking-widest font-bold">CRITICAL</span>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 text-xs text-slate-300 space-y-4 md:pr-5 md:border-r border-slate-700">
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Live Exercise</h4>
              {day.debuggingExercises.map((d, i) => <p key={i} className="italic bg-emerald-500/10 p-3 rounded border-l-2 border-emerald-500 text-slate-200 leading-relaxed">"{d}"</p>)}
            </div>
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Commands Context</h4>
              <div className="bg-black/60 p-3 font-mono text-[11px] text-indigo-400 rounded border border-slate-800 space-y-1.5 shadow-inner">
                {day.commands.map((cmd, i) => <div key={i}>$ {cmd}</div>)}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-3 shrink-0">
             <div className="p-3 bg-slate-800/80 rounded border border-slate-700 shadow-sm">
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Common Mistakes</p>
               <ul className="text-[11px] text-rose-300/90 space-y-1.5 list-disc pl-3">
                 {day.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
               </ul>
             </div>
             <div className="p-3 bg-slate-800/80 rounded border border-slate-700 shadow-sm">
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Deliverable</p>
               <ul className="text-[11px] text-indigo-300 space-y-1.5 list-disc pl-3">
                 {day.deliverables.map((d, i) => <li key={i}>{d}</li>)}
               </ul>
             </div>
             <div className="p-3 bg-indigo-900/20 rounded border border-indigo-500/30">
               <p className="text-[10px] text-indigo-400 uppercase font-bold mb-2 tracking-widest">Production Mindset</p>
               <p className="text-[11px] text-slate-300 italic leading-relaxed text-balance">"{day.productionMindset}"</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WeekView({ week }: { week: WeeklyReview }) {
  return (
    <section className="bg-[#1e293b] rounded-lg border border-slate-700 p-6 shadow-xl space-y-6 max-w-4xl mx-auto w-full">
      <div className="border-b border-slate-700 pb-4">
        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest mb-3">
          Week {week.week} Review
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{week.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Weekly Project" icon={<Terminal size={14} />} className="bg-indigo-900/10 border-indigo-500/20">
            <p className="text-slate-300 leading-relaxed text-xs">{week.miniProject}</p>
        </Section>
        
        <Section title="Incident Simulation" icon={<ShieldAlert size={14} />} className="bg-rose-900/10 border-rose-500/20">
             <p className="text-rose-300/90 leading-relaxed text-xs italic font-medium">"{week.incidentSimulation}"</p>
        </Section>
      </div>

       <Section title="Design & Architecture" icon={<BookOpen size={14} />}>
            <p className="text-slate-300 leading-relaxed text-xs">{week.architectureReview}</p>
      </Section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Knowledge Review" icon={<CheckCircle2 size={14} />}>
            <ul className="space-y-1.5">
                {week.knowledgeReview.map((k, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs"><span className="text-slate-600 font-bold">•</span> <span className="text-slate-300">{k}</span></li>
                ))}
            </ul>
        </Section>

        <Section title="Documentation" icon={<FileText size={14} />}>
             <p className="text-slate-300 leading-relaxed text-xs">{week.documentationAssignment}</p>
        </Section>
      </div>
    </section>
  );
}

function MonthView({ month }: { month: MonthlyMilestone }) {
  return (
    <section className="bg-[#1e293b] rounded-lg border border-slate-700 p-6 shadow-xl space-y-6 max-w-4xl mx-auto w-full">
      <div className="border-b border-slate-700 pb-5">
        <div className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest mb-3">
          Month {month.month} Milestone
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{month.title}</h1>
        <p className="text-sm text-slate-400 mt-2.5 leading-relaxed max-w-3xl border-l-2 border-slate-700 pl-4">{month.description}</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-5 shadow-inner">
         <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center">
             <Presentation size={16} className="mr-2" /> Large Production Project
         </h3>
         <p className="text-emerald-100/90 text-sm leading-relaxed">{month.largeProject}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Section title="Platform Review">
              <p className="text-slate-300 text-xs leading-relaxed">{month.platformReview}</p>
          </Section>
           <Section title="Security Review">
              <p className="text-slate-300 text-xs leading-relaxed">{month.securityReview}</p>
          </Section>
           <Section title="Reliability Review">
              <p className="text-slate-300 text-xs leading-relaxed">{month.reliabilityReview}</p>
          </Section>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-5">
         <h3 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center">
             <CheckCircle2 size={16} className="mr-2" /> Final Assessment
         </h3>
         <p className="text-indigo-100/90 text-[13px] leading-relaxed">{month.finalAssessment}</p>
      </div>
    </section>
  );
}
