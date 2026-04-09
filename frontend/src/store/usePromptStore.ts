import { create } from 'zustand'
import type { PromptState } from '../types'
import { ApiService } from '../services/ApiService'

export const usePromptStore = create<PromptState>()(
  (set, get) => ({
    content: '',
    templates: [],
    projects: [],
    selectedTemplateId: null,
    selectedProjectId: null,
    variables: {},
    isDarkMode: false,

    setContent: (content) => set({ content }),
    
    setTemplates: (templates) => set({ templates }),

    fetchProjects: async () => {
      try {
        const projects = await ApiService.getProjects();
        set({ projects });
        // Auto-select first project if none selected
        if (projects.length > 0 && !get().selectedProjectId) {
            set({ selectedProjectId: projects[0].id });
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    },

    setSelectedProjectId: (id) => {
        set({ selectedProjectId: id });
        // Optional: clear selected template if it doesn't belong to the new project
        const currentTemplate = get().templates.find(t => t.id === get().selectedTemplateId);
        if (currentTemplate && currentTemplate.projectId !== id) {
            set({ selectedTemplateId: null, content: '' });
        }
    },

    createProject: async (name, description) => {
        try {
            await ApiService.createProject(name, description);
            await get().fetchProjects();
        } catch (err) {
            console.error('Error creating project', err);
        }
    },

    fetchTemplates: async () => {
      try {
        const templates = await ApiService.getTemplates();
        set({ templates });
        
        // Ensure projects are also fetched
        if (get().projects.length === 0) {
            await get().fetchProjects();
        }

        // Auto-select first template of the selected project if none selected
        if (!get().selectedTemplateId && templates.length > 0) {
            const currentProjectId = get().selectedProjectId;
            const projectTemplates = currentProjectId 
                ? templates.filter((t: any) => t.projectId === currentProjectId)
                : templates;
            
            if (projectTemplates.length > 0) {
                const first = projectTemplates[0];
                set({ selectedTemplateId: first.id, content: first.content });
            }
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
      if (id === null) return { selectedTemplateId: null };
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
