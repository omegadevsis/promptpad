import { useEffect, useState, useCallback } from 'react'
import { Monitor, Moon, Sun, Cpu, AlignJustify, LogIn, Shield, Layout } from 'lucide-react'
import { usePromptStore } from './store/usePromptStore'
import EditorArea from './components/editor/EditorArea'
import Toolbar from './components/editor/Toolbar'
import TemplateSidebar from './components/sidebar/TemplateSidebar'
import VariablePanel from './components/panels/VariablePanel'
import VersionHistory from './components/panels/VersionHistory'
import { TokenCounter } from './utils/tokenCounter'
import { ExportService } from './services/ExportService'
import { useAuthStore } from './store/useAuthStore'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import RoleManagement from './components/admin/RoleManagement'
import UserManagement from './components/admin/UserManagement'

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
  const { isLoggedIn, user, logout } = useAuthStore()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [view, setView] = useState<'editor' | 'admin'>('editor')
  const [adminTab, setAdminTab] = useState<'roles' | 'users'>('roles')
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
    if (isOnline && isLoggedIn) {
      fetchTemplates()
    }
  }, [fetchTemplates, isOnline, isLoggedIn])

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

  // Update stats
  useEffect(() => {
    if (editor) {
      const text = editor.getText()
      setStats({
        chars: text.length,
        tokens: TokenCounter.estimateTokens(text)
      })
    }
  }, [content, editor])

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

  if (!isLoggedIn) {
    if (authMode === 'login') return <Login onToggleRegister={() => setAuthMode('register')} />
    return <Register onToggleLogin={() => setAuthMode('login')} />
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark' : ''} text-foreground bg-background font-sans`}>
      <TemplateSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <header className="h-14 border-b border-stone-200 dark:border-zinc-800 px-6 flex items-center justify-between shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Cpu size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">PromptPad</h1>
              <p className="text-[10px] text-muted-foreground font-medium opacity-60">PROMPT EDITOR V1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {user?.role === 'Admin' && (
                <button 
                  onClick={() => setView(view === 'editor' ? 'admin' : 'editor')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${view === 'admin' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground'}`}
                >
                  {view === 'admin' ? <Layout size={14} /> : <Shield size={14} />}
                  {view === 'admin' ? 'Voltar ao Editor' : 'Gerenciar Perfis'}
                </button>
             )}

             <div className="flex items-center gap-3 mx-2 px-3 py-1 bg-stone-100 dark:bg-zinc-800 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[11px] font-bold opacity-80">{user?.name} ({user?.role})</span>
                <button 
                  onClick={logout}
                  className="p-1 hover:text-red-500 transition-colors" 
                  title="Sair"
                >
                  <LogIn size={14} className="rotate-180" />
                </button>
             </div>

            <button 
              onClick={() => ExportService.exportToTxt(editor?.getText() || '')}
              className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-muted-foreground hover:text-foreground"
              title="Exportar TXT"
            >
              <AlignJustify size={20} />
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {view === 'admin' ? (
           <main className="flex-1 flex flex-col overflow-hidden bg-stone-50 dark:bg-zinc-950/50">
             <div className="bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 px-6 flex items-center gap-6">
                <button 
                  onClick={() => setAdminTab('roles')}
                  className={`py-3 text-xs font-bold transition-all border-b-2 ${adminTab === 'roles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Perfis e Permissões
                </button>
                <button 
                  onClick={() => setAdminTab('users')}
                  className={`py-3 text-xs font-bold transition-all border-b-2 ${adminTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Gestão de Usuários
                </button>
             </div>
             <div className="flex-1 overflow-auto">
               {adminTab === 'roles' ? <RoleManagement /> : <UserManagement />}
             </div>
           </main>
        ) : (
          <>
            <Toolbar 
              editor={editor} 
              activePanel={activePanel} 
              onSetActivePanel={setActivePanel} 
            />

            <main className="flex-1 overflow-hidden">
              <EditorArea editor={editor} />
            </main>
          </>
        )}

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

      <aside className="w-80 border-l border-stone-200 dark:border-zinc-800 flex flex-col shrink-0 bg-white dark:bg-zinc-950 transition-colors">
        {activePanel === 'variables' ? <VariablePanel /> : <VersionHistory templateId={selectedTemplateId!} onRestore={handleRestore} />}
      </aside>
    </div>
  )
}

export default App
