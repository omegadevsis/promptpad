import { EditorContent, Editor } from '@tiptap/react'
import { Folder } from 'lucide-react'
import { usePromptStore } from '../../store/usePromptStore'

interface EditorAreaProps {
  editor: Editor | null
}

const EditorArea = ({ editor }: EditorAreaProps) => {
  const { templates, projects, selectedTemplateId } = usePromptStore()

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-sm text-muted-foreground font-medium">Carregando editor...</span>
      </div>
    )
  }

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
  const project = projects.find(p => p.id === selectedTemplate?.projectId)

  return (
    <div className="flex-1 bg-stone-100 dark:bg-zinc-950/50 shadow-sm border border-stone-200 dark:border-zinc-800 rounded-md flex flex-col relative overflow-hidden min-h-0 h-full">
      {/* Project Banner Indicator */}
      {selectedTemplate && (
        <div className="px-4 py-2 bg-white dark:bg-zinc-900 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-2">
                <Folder size={14} className="text-primary opacity-70" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projeto:</span>
                <span className="text-[11px] font-bold text-foreground">{project?.name || 'Sem Projeto'}</span>
            </div>
            <div className="text-[10px] font-medium text-muted-foreground opacity-50 italic">
                Sincronizado na nuvem
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-scroll w-full scroll-smooth custom-scrollbar min-h-0" id="editor-container">
        <div className="max-w-4xl mx-auto my-8 bg-white dark:bg-zinc-900 min-h-[11in] shadow-2xl p-12 border border-stone-200 dark:border-zinc-800 transition-all duration-300">
          <EditorContent editor={editor} className="tiptap-content" />
        </div>
        <div className="h-64" /> {/* Spacer for extra scroll room at bottom */}
      </div>
    </div>
  )
}

export default EditorArea
