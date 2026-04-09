import { History, RotateCcw, User, Clock } from 'lucide-react'
import type { PromptVersion } from '../../services/ApiService'
import { ApiService } from '../../services/ApiService'
import { useEffect, useState } from 'react'

interface VersionHistoryProps {
  templateId: number;
  onRestore: (content: string) => void;
}

const VersionHistory = ({ templateId, onRestore }: VersionHistoryProps) => {
  const [history, setHistory] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getHistory(templateId);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) fetchHistory();
  }, [templateId]);

  const handleRestore = async (versionId: number) => {
    if (!window.confirm('Deseja restaurar esta versão? Alterações não salvas serão perdidas.')) return;
    try {
      const { content } = await ApiService.restoreVersion(templateId, versionId);
      onRestore(content);
      fetchHistory(); // Refresh history to see restoration record
    } catch (err) {
      alert('Erro ao restaurar versão');
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-zinc-900 border-l border-stone-200 dark:border-zinc-800 w-80 shrink-0">
      <div className="p-4 border-b border-stone-200 dark:border-zinc-800 flex items-center gap-2 font-semibold text-sm">
        <History size={16} />
        Histórico de Versões
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading ? (
          <div className="flex justify-center p-8 text-muted-foreground animate-pulse text-xs">Carregando histórico...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground opacity-60">Nenhuma versão encontrada.</div>
        ) : (
          history.map((v) => (
            <div key={v.id} className="p-3 bg-white dark:bg-zinc-800 rounded-md border border-stone-200 dark:border-zinc-700 shadow-sm space-y-2 group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <User size={10} /> {v.userName}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock size={10} /> {new Date(v.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <button 
                  onClick={() => handleRestore(v.id)}
                  className="p-1 px-2 text-[10px] font-bold bg-secondary hover:bg-stone-200 dark:hover:bg-zinc-700 rounded transition-colors flex items-center gap-1"
                  title="Restaurar esta versão"
                >
                  <RotateCcw size={10} /> RESTAURAR
                </button>
              </div>
              {v.changeSummary && (
                <p className="text-[11px] text-foreground/80 leading-relaxed italic border-l-2 border-stone-200 dark:border-zinc-700 pl-2">
                  "{v.changeSummary}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
