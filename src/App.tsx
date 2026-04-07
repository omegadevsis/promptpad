import { useEffect, useState, useCallback } from 'react'
import { Monitor, Moon, Sun, Cpu, AlignJustify } from 'lucide-react'
import { usePromptStore } from './store/usePromptStore'
import EditorArea from './components/editor/EditorArea'
import Toolbar from './components/editor/Toolbar'
import TemplateSidebar from './components/sidebar/TemplateSidebar'
import VariablePanel from './components/panels/VariablePanel'
import VersionHistory from './components/panels/VersionHistory'
import { TokenCounter } from './utils/tokenCounter'
import { ExportService } from './services/ExportService'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import Placeholder from '@tiptap/extension-placeholder'

const App = () => {
  const { isDarkMode, toggleDarkMode, content, setContent, fetchTemplates, selectedTemplateId } = usePromptStore()
  const [stats, setStats] = useState({ chars: 0, tokens: 0 })
  const [activePanel, setActivePanel] = useState<'variables' | 'history'>('variables')
  const [isOnline, setIsOnline] = useState(false)

  // Status check effect
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:5128/api/templates');
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // Initial fetch from backend
  useEffect(() => {
    if (isOnline) {
      fetchTemplates()
    }
  }, [fetchTemplates, isOnline])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Escreva seu prompt de IA aqui...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[500px] w-full max-w-none transition-colors duration-200',
      },
    },
  })

  // Sink store content to editor if it changes (e.g., template selection or restoration)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    const cleanContent = ExportService.stripHtml(content)
    setStats({
      chars: cleanContent.length,
      tokens: TokenCounter.estimateTokens(cleanContent)
    })
  }, [content])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleRestore = useCallback((newContent: string) => {
    setContent(newContent);
    // Switch back to variables panel after successful restore
    setActivePanel('variables');
  }, [setContent]);

  return (
    <div className="flex h-screen bg-stone-200 dark:bg-zinc-950 text-foreground overflow-hidden font-sans">
      <TemplateSidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 border-x border-stone-300 dark:border-zinc-800 shadow-sm relative z-10 transition-colors">
        
        <header className="h-12 border-b border-stone-200 dark:border-zinc-800 flex items-center px-4 justify-between bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
              <Cpu size={18} />
            </div>
            <h1 className="text-sm font-bold tracking-tight">PromptPad <span className="text-xs font-normal text-muted-foreground ml-1">v1.1</span></h1>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleDarkMode}
              className="p-1.5 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-lg transition-all"
              title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-zinc-600" />}
            </button>
          </div>
        </header>

        <Toolbar 
          editor={editor} 
          activePanel={activePanel} 
          onSetActivePanel={setActivePanel} 
        />

        <main className="flex-1 overflow-hidden">
          <EditorArea editor={editor} />
        </main>

        <footer className="h-8 border-t border-stone-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 flex items-center justify-between text-[11px] font-medium text-muted-foreground select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <AlignJustify size={12} /> {stats.chars} caracteres
            </span>
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full dark:text-primary">
              <Cpu size={12} /> {stats.tokens} tokens estimados
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1 opacity-60">
               <Monitor size={12} /> {isOnline ? 'Banco de Dados Conectado' : 'Servidor Offline'}
             </span>
             <span className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
          </div>
        </footer>
      </div>

      {activePanel === 'variables' ? (
        <VariablePanel />
      ) : (
        typeof selectedTemplateId === 'number' && (
          <VersionHistory templateId={selectedTemplateId} onRestore={handleRestore} />
        )
      )}
    </div>
  )
}

export default App
