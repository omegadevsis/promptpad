import React, { useState, useEffect } from 'react';
import { LayoutGrid, ChevronDown, Plus, FolderPlus, Check, Trash2, Folder } from 'lucide-react';
import { usePromptStore } from '../../store/usePromptStore';
import { useAuthStore } from '../../store/useAuthStore';

const ProjectSelector: React.FC = () => {
  const { projects, selectedProjectId, setSelectedProjectId, fetchProjects, createProject } = usePromptStore();
  const { token, isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  useEffect(() => {
    if (isLoggedIn && token) {
        fetchProjects();
    }
  }, [isLoggedIn, token]);

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createProject(newProjectName);
    setNewProjectName('');
    setIsCreating(false);
  };

  return (
    <div className="relative font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded-xl transition-all active:scale-95 group border border-transparent hover:border-stone-300 dark:hover:border-zinc-600"
      >
        <LayoutGrid size={16} className="text-primary" />
        <div className="text-left max-w-[150px]">
          <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground leading-none mb-1 opacity-60">Projeto Ativo</p>
          <p className="text-xs font-bold truncate">{currentProject?.name || 'Selecionar Projeto'}</p>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-stone-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Meus Projetos</span>
              <button 
                onClick={() => setIsCreating(true)}
                className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                title="Novo Projeto"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all group ${
                    selectedProjectId === project.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-stone-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Folder size={16} className={selectedProjectId === project.id ? 'text-primary' : 'text-muted-foreground'} />
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-tight">{project.name}</p>
                      {project.description && <p className="text-[10px] text-muted-foreground line-clamp-1">{project.description}</p>}
                    </div>
                  </div>
                  {selectedProjectId === project.id && <Check size={14} className="text-primary" />}
                </button>
              ))}
              {projects.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-xs italic">Nenhum projeto encontrado</div>
              )}
            </div>

            {isCreating && (
              <div className="p-3 border-t border-stone-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/50 animate-in slide-in-from-bottom-2">
                <form onSubmit={handleCreate} className="space-y-2">
                  <input 
                    autoFocus
                    placeholder="Nome do projeto..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 px-3 py-1.5 border border-stone-200 dark:border-zinc-700 rounded-lg text-[10px] font-bold uppercase hover:bg-stone-100 dark:hover:bg-zinc-700"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold uppercase hover:opacity-90"
                    >
                      Criar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSelector;
