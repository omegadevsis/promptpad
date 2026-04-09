import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, 
  Heading1, Heading2,
  Undo, Redo, Eraser, Download,
  Copy, Palette, Highlighter, History, Save
} from 'lucide-react'
import { ExportService } from '../../services/ExportService'
import { usePromptStore } from '../../store/usePromptStore'
import { ApiService } from '../../services/ApiService'

interface ToolbarProps {
  editor: Editor | null;
  activePanel: 'variables' | 'history';
  onSetActivePanel: (panel: 'variables' | 'history') => void;
}

const Toolbar = ({ editor, activePanel, onSetActivePanel }: ToolbarProps) => {
  const { content, selectedTemplateId } = usePromptStore()

  if (!editor) {
    return null
  }

  const handleCopyClean = () => {
    const cleanPrompt = ExportService.stripHtml(content)
    navigator.clipboard.writeText(cleanPrompt)
  }

  const handleExportTxt = () => {
    const cleanPrompt = ExportService.stripHtml(content)
    ExportService.exportToTxt(cleanPrompt)
  }

  const handleExportJson = () => {
    ExportService.exportToJson({
      content: content,
      cleanPrompt: ExportService.stripHtml(content),
      timestamp: Date.now()
    })
  }

  const handleSaveVersion = async () => {
    if (typeof selectedTemplateId !== 'number') {
      alert('Selecione um template antes de salvar uma versão.');
      return;
    }
    const summary = window.prompt('Resumo das alterações:', 'Ajustes no prompt');
    if (summary === null) return;

    try {
      await ApiService.saveNewVersion(selectedTemplateId, content, summary);
      alert('Versão salva com sucesso!');
    } catch (err) {
      alert('Erro ao salvar versão');
    }
  }

  const toggleHeading = (level: 1 | 2) => {
    editor.chain().focus().toggleHeading({ level: level as any }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-stone-200 dark:border-zinc-800 sticky top-0 z-30 backdrop-blur-sm">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1.5 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-30" title="Desfazer">
          <Undo size={18} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1.5 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-30" title="Refazer">
          <Redo size={18} />
        </button>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Negrito">
          <Bold size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Itálico">
          <Italic size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Sublinhado">
          <Underline size={18} />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => toggleHeading(1)} className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Título 1">
          <Heading1 size={18} />
        </button>
        <button onClick={() => toggleHeading(2)} className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Título 2">
          <Heading2 size={18} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Alinhar à Esquerda">
          <AlignLeft size={18} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Centralizar">
          <AlignCenter size={18} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Alinhar à Direita">
          <AlignRight size={18} />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Lista com Marcadores">
          <List size={18} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Lista Numerada">
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Color & Highlight */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button onClick={() => editor.chain().focus().setColor('#2563eb').run()} className="p-1.5 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded transition-colors" title="Cor do Texto">
          <Palette size={18} className="text-blue-600" />
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffec3d' }).run()} className={`p-1.5 rounded transition-colors ${editor.isActive('highlight') ? 'bg-yellow-200 text-black' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`} title="Destaque">
          <Highlighter size={18} />
        </button>
      </div>

      {/* Toggle Panels */}
      <div className="flex items-center gap-0.5 px-2 border-r border-stone-300 dark:border-zinc-700">
        <button 
          onClick={() => onSetActivePanel(activePanel === 'variables' ? 'history' : 'variables')} 
          className={`p-1.5 rounded transition-colors ${activePanel === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-stone-200 dark:hover:bg-zinc-700'}`}
          title={activePanel === 'history' ? "Ver Variáveis" : "Ver Histórico"}
        >
          <History size={18} />
        </button>
      </div>

      {/* AI Special Actions */}
      <div className="flex items-center gap-1 pl-2 ml-auto">
        <button 
          onClick={handleSaveVersion}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-all shadow-sm"
          title="Salvar Versão (Histórico)"
        >
          <Save size={14} /> Versionar
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-stone-300 dark:hover:bg-zinc-600 rounded-md transition-all border border-stone-300 dark:border-zinc-700">
          <Eraser size={14} /> Limpar Formatação
        </button>
        <button onClick={handleCopyClean} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all shadow-sm">
          <Copy size={14} /> Copiar Prompt
        </button>
        <div className="flex items-center bg-white dark:bg-zinc-900 rounded-md border border-stone-300 dark:border-zinc-700 overflow-hidden">
          <button onClick={handleExportTxt} className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 border-r border-stone-300 dark:border-zinc-700" title="Exportar .txt">
            <Download size={16} />
          </button>
          <button onClick={handleExportJson} className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 font-mono text-[10px] font-bold" title="Exportar .json">
            JSON
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
