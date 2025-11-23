import React, { useState, useRef, useEffect } from 'react';
import { FamilyMember } from '../types';
import { generateBiography } from '../services/geminiService';

interface MemberDetailProps {
  member: FamilyMember | null;
  onClose: () => void;
  onAddChild: (parentId: string) => void;
  onAddSibling: (memberId: string) => void;
  onUpdate: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
  onSortChildren: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ 
  member, 
  onClose, 
  onAddChild, 
  onAddSibling,
  onUpdate,
  onDelete,
  onSortChildren
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<FamilyMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setEditForm(member);
      setGeneratedBio(member.bio || null);
      setIsEditing(false);
    }
  }, [member]);

  if (!member || !editForm) return null;

  const handleGenerateBio = async () => {
    setLoading(true);
    const story = await generateBiography(member);
    setGeneratedBio(story);
    onUpdate({ ...member, bio: story }); // Save generated bio
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditForm(prev => prev ? { ...prev, photoUrl: result } : null);
        onUpdate({ ...member, photoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editForm) {
      onUpdate(editForm);
      setIsEditing(false);
    }
  };

  const handleChange = (field: keyof FamilyMember, value: string) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (member && member.id) {
      onDelete(member.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto transition-opacity backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="w-full max-w-md bg-white h-full shadow-2xl transform transition-transform pointer-events-auto flex flex-col overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="relative h-64 bg-slate-900 flex flex-col items-center justify-center shrink-0 text-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative group z-10">
            <div className="w-28 h-28 rounded-full bg-white p-1 mb-3 shadow-xl overflow-hidden relative">
              <img 
                src={editForm.photoUrl || `https://ui-avatars.com/api/?name=${editForm.name}&background=random`} 
                alt={editForm.name}
                className="w-full h-full rounded-full object-cover" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange} 
              />
            </div>
          </div>
          
          {isEditing ? (
            <input 
              className="text-2xl font-bold text-center bg-white/10 border-b border-white/30 outline-none rounded px-2 w-2/3"
              value={editForm.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          ) : (
            <h2 className="text-2xl font-bold">{member.name}</h2>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-indigo-200 text-sm">
             {isEditing ? (
               <input 
                 className="bg-white/10 border-b border-white/30 outline-none rounded px-1 w-20 text-center"
                 value={editForm.birthDate}
                 onChange={(e) => handleChange('birthDate', e.target.value)}
                 placeholder="出生年份"
               />
             ) : (
               <span>{member.birthDate}</span>
             )}
             <span>-</span>
             {isEditing ? (
                <input 
                 className="bg-white/10 border-b border-white/30 outline-none rounded px-1 w-20 text-center"
                 value={editForm.deathDate || ''}
                 onChange={(e) => handleChange('deathDate', e.target.value)}
                 placeholder="至今"
               />
             ) : (
               <span>{member.deathDate || '至今'}</span>
             )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Action Toolbar */}
          <div className="flex gap-2 pb-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-medium border transition ${isEditing ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               {isEditing ? '完成编辑' : '编辑资料'}
             </button>
             {isEditing && (
               <button 
                  onClick={handleSave}
                  className="flex-1 min-w-[60px] py-2 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition"
               >
                 保存
               </button>
             )}
             <button 
                onClick={onSortChildren}
                className="flex-1 min-w-[80px] py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
             >
               后代排序
             </button>
             <button 
                onClick={handleDeleteClick}
                className="flex-1 min-w-[60px] py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:bg-red-200 transition"
             >
               删除
             </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block uppercase tracking-wider mb-1">职业</span>
              {isEditing ? (
                <input 
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm"
                  value={editForm.occupation || ''}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                />
              ) : (
                <span className="font-medium text-slate-800">{member.occupation || '未知'}</span>
              )}
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block uppercase tracking-wider mb-1">出生地</span>
              {isEditing ? (
                 <input 
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm"
                  value={editForm.birthPlace || ''}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                />
              ) : (
                <span className="font-medium text-slate-800">{member.birthPlace || '未知'}</span>
              )}
            </div>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block uppercase tracking-wider mb-1">性别</span>
               {isEditing ? (
                 <select 
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm"
                  value={editForm.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              ) : (
                <span className="font-medium text-slate-800">{member.gender === 'male' ? '男' : '女'}</span>
              )}
            </div>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block uppercase tracking-wider mb-1">伴侣</span>
              {isEditing ? (
                 <input 
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm"
                  value={editForm.partner || ''}
                  onChange={(e) => handleChange('partner', e.target.value)}
                />
              ) : (
                <span className="font-medium text-slate-800">{member.partner || '-'}</span>
              )}
            </div>
          </div>

          {/* AI Bio Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                AI 生平传记
              </h3>
              {!loading && (
                <button 
                  onClick={handleGenerateBio}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full hover:bg-purple-200 transition"
                >
                  {generatedBio ? '重新生成' : '生成故事'}
                </button>
              )}
            </div>
            
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur flex items-center justify-center rounded-xl z-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}
              <div className="bg-purple-50 p-4 rounded-xl text-sm leading-relaxed text-slate-700 border border-purple-100 shadow-sm min-h-[100px] whitespace-pre-wrap">
                {generatedBio || <span className="text-slate-400 italic">暂无传记，点击上方按钮生成...</span>}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
           <button 
            onClick={() => {
              onAddSibling(member.id);
              onClose();
            }}
            className="w-full py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition active:scale-95"
          >
            添加兄弟姐妹
          </button>
          <button 
            onClick={() => {
              onAddChild(member.id);
              onClose();
            }}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition active:scale-95"
          >
            添加子女
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MemberDetail;