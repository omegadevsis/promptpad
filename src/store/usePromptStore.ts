import { create } from 'zustand'
import type { PromptState } from '../types'
import { ApiService } from '../services/ApiService'

export const usePromptStore = create<PromptState>()(
  (set, get) => ({
    content: '',
    templates: [],
    selectedTemplateId: null,
    variables: {},
    isDarkMode: false,

    setContent: (content) => set({ content }),
    
    setTemplates: (templates) => set({ templates }),

    fetchTemplates: async () => {
      try {
        const templates = await ApiService.getTemplates();
        set({ templates });
        // Auto-select first if none selected
        if (templates.length > 0 && !get().selectedTemplateId) {
          const first = templates[0];
          set({ selectedTemplateId: first.id, content: first.content });
        }
      } catch (err) {
        console.error(err);
      }
    },
    
    updateTemplate: (id, updates) => set((state) => ({
      templates: state.templates.map((t) => 
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    })),
    
    deleteTemplate: (id) => set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
      selectedTemplateId: state.selectedTemplateId === id ? null : state.selectedTemplateId
    })),
    
    selectTemplate: (id) => set((state) => {
      const template = state.templates.find((t) => t.id === id);
      return {
        selectedTemplateId: id,
        content: template ? template.content : state.content
      };
    }),
    
    setVariable: (name, value) => set((state) => ({
      variables: { ...state.variables, [name]: value }
    })),
    
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  })
)
