import React, { useState } from 'react';
import { X, Save, FileText, Type, LayoutGrid } from 'lucide-react';
import { usePromptStore } from '../../store/usePromptStore';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, content: string) => Promise<void>;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { projects, selectedProjectId } = usePromptStore();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(name.trim(), content.trim());
      setName('');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <FileText size={18} />
            </div>
            <h2 className="text-sm font-bold tracking-tight">Novo Template de Prompt</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-zinc-800/50 rounded-xl border border-stone-100 dark:border-zinc-800 mb-2">
            <LayoutGrid size={16} className="text-primary" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground leading-none mb-1 opacity-60">Projeto Destino</p>
              <p className="text-xs font-bold text-foreground">{currentProject?.name || 'Nenhum projeto selecionado'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Type size={12} /> Nome do Template
            </label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Refatoração de Código, Email Formal..."
              className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText size={12} /> Corpo do Prompt
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva o conteúdo inicial do prompt aqui. Você pode usar {{variáveis}}..."
              rows={8}
              className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-mono leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground opacity-70">
              Dica: Você poderá formatar o texto usando o editor rico após a criação.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={14} /> Criar Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
