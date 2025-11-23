import React from 'react';
import { FamilyMember } from '../types';

interface DashboardProps {
  treeData: FamilyMember;
  onNavigate: (view: 'tree' | 'home') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ treeData, onNavigate }) => {
  // Recursively count members
  const countMembers = (node: FamilyMember): number => {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => count += countMembers(child));
    }
    return count;
  };

  // Recursively calculate depth
  const getGenerations = (node: FamilyMember): number => {
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getGenerations));
  };

  const totalMembers = countMembers(treeData);
  const generations = getGenerations(treeData);
  // Extract surname (assuming first char of root name is surname for Chinese names usually)
  const surname = treeData.name.charAt(0);

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-xl md:flex md:items-center md:justify-between">
          <div className="relative z-10 md:max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{surname}氏家族 · 数智族谱</h2>
            <p className="text-indigo-100 text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
              通过数字化方式记录家族脉络，让每一位成员的故事得以流传。薪火相传，生生不息。
            </p>
            <div className="mt-8 hidden md:block">
               <button 
                onClick={() => onNavigate('tree')}
                className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-0.5"
              >
                进入族谱图谱 →
              </button>
            </div>
          </div>
          
          {/* Mobile Button */}
          <button 
            onClick={() => onNavigate('tree')}
            className="mt-6 w-full md:hidden px-5 py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold shadow hover:bg-indigo-50 transition active:scale-95"
          >
            查看族谱图
          </button>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-56 md:h-56 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">家族成员</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1">{totalMembers}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
             <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">家族世代</span>
             <span className="text-3xl font-extrabold text-slate-800 mt-1">{generations}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition cursor-not-allowed opacity-60">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">家族分支</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1">1</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition cursor-not-allowed opacity-60">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">珍贵照片</span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1">4</span>
          </div>
        </div>

        {/* Feature Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 px-1 pt-2 mb-3">家族功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-indigo-100 transition group cursor-pointer">
               <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-110 transition">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               </div>
               <div>
                 <div className="font-bold text-slate-800 text-lg">家族大事记</div>
                 <div className="text-sm text-slate-500 mt-1">记录家族重要时刻与历史事件，传承家族记忆。</div>
               </div>
               <div className="ml-auto text-slate-300">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-indigo-100 transition group cursor-pointer">
               <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0 group-hover:scale-110 transition">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
               </div>
               <div>
                 <div className="font-bold text-slate-800 text-lg">AI 传记生成</div>
                 <div className="text-sm text-slate-500 mt-1">利用人工智能技术，为家族成员自动撰写生平故事。</div>
               </div>
               <div className="ml-auto text-slate-300">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;