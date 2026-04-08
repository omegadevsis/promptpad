import { Plus, Trash2, FileText, Search, Layout } from 'lucide-react'
import { usePromptStore } from '../../store/usePromptStore'
import { ApiService } from '../../services/ApiService'
import { useState } from 'react'
import CreateTemplateModal from '../modals/CreateTemplateModal'

const TemplateSidebar = () => {
  const { templates, selectedTemplateId, selectTemplate, fetchTemplates, selectedProjectId } = usePromptStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTemplates = templates.filter(t => 
    (t.projectId === selectedProjectId || !selectedProjectId) &&
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConfirmCreate = async (name: string, content: string) => {
    try {
      const newTemplate = await ApiService.createTemplate(name, content, selectedProjectId || undefined)
      await fetchTemplates()
      // Optional: auto-select the newly created template
      selectTemplate(newTemplate.id)
    } catch (err) {
      alert('Erro ao criar template')
      throw err
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!window.confirm('Excluir este template do servidor?')) return

    try {
      await ApiService.deleteTemplate(id)
      await fetchTemplates()
    } catch (err) {
      alert('Erro ao excluir template')
    }
  }

  return (
    <>
      <aside className="w-64 bg-stone-100 dark:bg-zinc-950 border-r border-stone-300 dark:border-zinc-800 flex flex-col h-full shrink-0 transition-colors">
        <div className="p-4 border-b border-stone-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-80">
              <Layout size={14} className="text-primary" />
              Templates
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all text-primary border border-transparent hover:border-stone-200 dark:hover:border-zinc-700"
              title="Novo Template"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground opacity-50 italic">
              Nenhum template encontrado
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between group transition-all ${
                  selectedTemplateId === template.id 
                    ? 'bg-white dark:bg-zinc-800 shadow-sm border border-stone-200 dark:border-zinc-700' 
                    : 'hover:bg-stone-200/50 dark:hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} className={selectedTemplateId === template.id ? 'text-primary' : 'text-muted-foreground'} />
                  <div className="truncate">
                    <p className={`text-xs font-semibold truncate ${selectedTemplateId === template.id ? 'text-primary-dark dark:text-primary' : 'text-foreground'}`}>
                      {template.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground opacity-70">
                      {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, template.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </button>
            ))
          )}
        </div>
      </aside>

      <CreateTemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCreate}
      />
    </>
  )
}

export default TemplateSidebar
