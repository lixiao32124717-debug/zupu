import React, { useState } from 'react';
import { FamilyMember } from '../types';

interface AddMemberModalProps {
  parentId: string | null;
  onSave: (member: Omit<FamilyMember, 'id' | 'children'>) => void;
  onCancel: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ parentId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    birthPlace: '',
    occupation: '',
    partner: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-pop">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">添加新成员</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">姓名 *</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="例如: 张三"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">性别</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">出生年份</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                placeholder="1990"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">出生地</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              value={formData.birthPlace}
              onChange={e => setFormData({...formData, birthPlace: e.target.value})}
              placeholder="城市或省份"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">职业</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              value={formData.occupation}
              onChange={e => setFormData({...formData, occupation: e.target.value})}
              placeholder="工作或身份"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition shadow-md"
            >
              保存成员
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default AddMemberModal;