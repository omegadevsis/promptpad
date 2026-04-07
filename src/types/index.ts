export interface PromptTemplate {
  id: number;
  name: string;
  description?: string;
  content: string;
  updatedAt: string;
}

export interface PromptVersion {
  id: number;
  content: string;
  createdAt: string;
  userName: string;
  changeSummary?: string;
}

export interface Variable {
  name: string;
  value: string;
}

export interface PromptState {
  content: string;
  templates: PromptTemplate[];
  selectedTemplateId: number | null;
  variables: Record<string, string>;
  isDarkMode: boolean;

  // Actions
  setContent: (content: string) => void;
  fetchTemplates: () => Promise<void>;
  setTemplates: (templates: PromptTemplate[]) => void;
  updateTemplate: (id: number, updates: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: number) => void;
  selectTemplate: (id: number | null) => void;
  setVariable: (name: string, value: string) => void;
  toggleDarkMode: () => void;
}
export const TYPES_VERSION = '1.0.0';
