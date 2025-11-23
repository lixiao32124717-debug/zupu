import React, { useState, useCallback } from 'react';
import FamilyTree from './components/FamilyTree';
import MemberDetail from './components/MemberDetail';
import AddMemberModal from './components/AddMemberModal';
import Dashboard from './components/Dashboard';
import { FamilyMember } from './types';
import { INITIAL_DATA } from './constants';

// Simple ID generator
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const App: React.FC = () => {
  const [treeData, setTreeData] = useState<FamilyMember>(INITIAL_DATA);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddingChildTo, setIsAddingChildTo] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'tree'>('home');

  // Helper to find parent of a node
  const findParent = (root: FamilyMember, targetId: string): FamilyMember | null => {
    if (!root.children) return null;
    for (const child of root.children) {
      if (child.id === targetId) return root;
      const found = findParent(child, targetId);
      if (found) return found;
    }
    return null;
  };

  const handleAddChild = useCallback((parentId: string) => {
    setIsAddingChildTo(parentId);
  }, []);

  const handleAddSibling = useCallback((memberId: string) => {
    if (treeData.id === memberId) {
      alert("根节点无法添加兄弟姐妹");
      return;
    }
    const parent = findParent(treeData, memberId);
    if (parent) {
      setIsAddingChildTo(parent.id);
    }
  }, [treeData]);

  const saveNewChild = (newMemberData: Omit<FamilyMember, 'id' | 'children'>) => {
    if (!isAddingChildTo) return;

    const newChild: FamilyMember = {
      id: generateId(),
      ...newMemberData,
      children: []
    };

    const updateTree = (node: FamilyMember): FamilyMember => {
      if (node.id === isAddingChildTo) {
        return {
          ...node,
          children: node.children ? [...node.children, newChild] : [newChild]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateTree)
        };
      }
      return node;
    };

    setTreeData(prev => updateTree(prev));
    setIsAddingChildTo(null);
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    const updateRecursive = (node: FamilyMember): FamilyMember => {
      if (node.id === updatedMember.id) {
        // Preserve children from the tree structure, update other fields from the form
        return { ...updatedMember, children: node.children };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    setTreeData(prev => updateRecursive(prev));
    setSelectedMember(updatedMember);
  };

  const handleDeleteMember = (memberId: string) => {
    // 1. Handle Root Deletion
    if (memberId === treeData.id) {
      if (window.confirm("您正在删除族谱的根节点（祖先）。\n这将清空整个族谱并创建一个新的。\n确定继续吗？")) {
         handleCreateNewTree();
      }
      return;
    }

    // 2. Confirmation
    if (!window.confirm("确定要删除此成员吗？\n警告：该成员的所有后代也将被一并删除！此操作无法撤销。")) {
      return;
    }

    // 3. Recursive Deletion Logic
    setTreeData(prevData => {
      // Helper function that returns a new node structure with the target removed
      const deleteRecursive = (node: FamilyMember): FamilyMember => {
        // If node has no children, just return it
        if (!node.children || node.children.length === 0) {
          return node;
        }

        // Try to filter out the target from current children
        const filteredChildren = node.children.filter(child => child.id !== memberId);

        // If length changed, it means we found the target in this node's children
        if (filteredChildren.length !== node.children.length) {
          return { ...node, children: filteredChildren };
        }

        // If not found here, recurse into each child
        return {
          ...node,
          children: node.children.map(deleteRecursive)
        };
      };

      return deleteRecursive(prevData);
    });

    // 4. Close the modal immediately
    setSelectedMember(null);
  };

  const handleCreateNewTree = () => {
    const newRoot: FamilyMember = {
      id: generateId(),
      name: '祖先',
      gender: 'male',
      birthDate: new Date().getFullYear().toString(),
      children: []
    };
    setTreeData(newRoot);
    setSelectedMember(null);
  };

  const handleSortChildren = (parentId: string) => {
    const sortRecursive = (node: FamilyMember): FamilyMember => {
      if (node.id === parentId && node.children) {
        return {
          ...node,
          children: [...node.children].sort((a, b) => 
            parseInt(a.birthDate || '0') - parseInt(b.birthDate || '0')
          )
        };
      }
      if (node.children) {
        return { ...node, children: node.children.map(sortRecursive) };
      }
      return node;
    };
    setTreeData(prev => sortRecursive(prev));
  };

  // Nav Item Component
  const NavItem = ({ view, icon, label }: { view: 'home' | 'tree', icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${currentView === view 
          ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Desktop Sidebar (Visible on MD+) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 z-30 shadow-sm">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            族
          </div>
          <h1 className="text-lg font-bold text-slate-800">传世家谱</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            view="home" 
            label="家族概览" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <NavItem 
            view="tree" 
            label="族谱图谱" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleCreateNewTree}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
          >
            <span>+ 新建族谱</span>
          </button>
          <div className="mt-4 text-xs text-center text-slate-400">
             © 2024 GenealogyGenius
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col relative h-full w-full">
        
        {/* Mobile Header (Hidden on MD+) */}
        <header className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              族
            </div>
            <h1 className="text-lg font-bold text-slate-800">传世家谱</h1>
          </div>
          {currentView === 'tree' && (
             <button 
              onClick={handleCreateNewTree}
              className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 active:bg-slate-300 transition"
            >
              新建
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-slate-50">
          {currentView === 'home' ? (
            <Dashboard treeData={treeData} onNavigate={setCurrentView} />
          ) : (
            <FamilyTree 
              data={treeData} 
              onNodeClick={setSelectedMember} 
            />
          )}
        </main>

        {/* Mobile Bottom Navigation (Hidden on MD+) */}
        <nav className="md:hidden h-16 bg-white border-t border-slate-200 flex shrink-0 z-20 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 active:bg-slate-50 transition ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">主页</span>
          </button>
          <button 
            onClick={() => setCurrentView('tree')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 active:bg-slate-50 transition ${currentView === 'tree' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <span className="text-[10px] font-medium">族谱图</span>
          </button>
        </nav>
      </div>

      {/* Slide-over Detail Panel */}
      <MemberDetail 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)}
        onAddChild={handleAddChild}
        onAddSibling={handleAddSibling}
        onUpdate={handleUpdateMember}
        onDelete={handleDeleteMember}
        onSortChildren={() => selectedMember && handleSortChildren(selectedMember.id)}
      />

      {/* Add Member Modal */}
      {isAddingChildTo && (
        <AddMemberModal 
          parentId={isAddingChildTo}
          onSave={saveNewChild}
          onCancel={() => setIsAddingChildTo(null)}
        />
      )}
    </div>
  );
};

export default App;