import { EditorContent, Editor } from '@tiptap/react'

interface EditorAreaProps {
  editor: Editor | null
}

const EditorArea = ({ editor }: EditorAreaProps) => {
  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-sm text-muted-foreground font-medium">Carregando editor...</span>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 shadow-sm border border-stone-200 dark:border-zinc-800 rounded-md overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 scroll-smooth" id="editor-container">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[11in] shadow-2xl p-12 border dark:border-zinc-800">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default EditorArea
