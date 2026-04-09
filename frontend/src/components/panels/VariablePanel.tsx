import { Settings2, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { usePromptStore } from '../../store/usePromptStore'
import { VariableService } from '../../services/VariableService'
import { useEffect, useState } from 'react'

const VariablePanel = () => {
  const { content, setContent, variables, setVariable } = usePromptStore()
  const [detectedVars, setDetectedVars] = useState<string[]>([])

  // Detect variables whenever content changes
  useEffect(() => {
    const vars = VariableService.extractVariables(content)
    setDetectedVars(vars)
  }, [content])

  const handleApply = () => {
    const finalContent = VariableService.applyVariables(content, variables)
    setContent(finalContent)
  }

  if (detectedVars.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center text-center opacity-50 space-y-2 h-full bg-stone-50/50 dark:bg-zinc-800/30">
        <Settings2 size={32} />
        <p className="text-xs font-medium">Nenhuma variável detectada.<br />Use a sintaxe {"{{variavel}}"}.</p>
      </div>
    )
  }

  return (
    <div className="w-80 bg-stone-50 dark:bg-zinc-900 border-l border-stone-200 dark:border-zinc-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Settings2 size={16} />
          Variáveis
        </div>
        <button 
          onClick={handleApply}
          className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:shadow-md transition-all active:scale-95"
        >
          <RefreshCcw size={12} /> Aplicar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {detectedVars.map((v) => (
          <div key={v} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <CheckCircle2 size={10} className={variables[v] ? 'text-emerald-500' : ''} />
              {v.replace(/_/g, ' ')}
            </label>
            <input 
              type="text" 
              value={variables[v] || ''}
              onChange={(e) => setVariable(v, e.target.value)}
              placeholder={`Digite o valor para ${v}...`}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-md shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
        ))}
      </div>

      <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 m-3 rounded-lg border border-blue-100 dark:border-blue-900/50">
        <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-tight">
          <strong>Dica:</strong> Aplicar variáveis irá substituí-las permanentemente no seu prompt. Sempre mantenha o template original salvo!
        </p>
      </div>
    </div>
  )
}

export default VariablePanel
