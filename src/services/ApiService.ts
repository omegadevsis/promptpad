const API_URL = 'http://localhost:5128/api';

export interface Template {
  id: number;
  name: string;
  description?: string;
  updatedAt: string;
  content: string;
}

export interface PromptVersion {
  id: number;
  content: string;
  createdAt: string;
  userName: string;
  changeSummary?: string;
}

export const ApiService = {
  async getTemplates(): Promise<Template[]> {
    const res = await fetch(`${API_URL}/templates`);
    if (!res.ok) throw new Error('Falha ao carregar templates');
    return res.json();
  },

  async createTemplate(name: string, content: string): Promise<Template> {
    const res = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content }),
    });
    if (!res.ok) throw new Error('Falha ao criar template');
    return res.json();
  },

  async updateTemplate(id: number, name: string, content: string): Promise<void> {
    const res = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar template');
  },

  async deleteTemplate(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir template');
  },

  async saveNewVersion(templateId: number, content: string, summary: string = 'Salvo via Web'): Promise<PromptVersion> {
    const res = await fetch(`${API_URL}/prompts/${templateId}/save-version?summary=${encodeURIComponent(summary)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (!res.ok) throw new Error('Falha ao salvar nova versão');
    return res.json();
  },

  async getHistory(templateId: number): Promise<PromptVersion[]> {
    const res = await fetch(`${API_URL}/prompts/${templateId}/history`);
    if (!res.ok) throw new Error('Falha ao carregar histórico');
    return res.json();
  },

  async restoreVersion(templateId: number, versionId: number): Promise<{ content: string }> {
    const res = await fetch(`${API_URL}/prompts/${templateId}/restore/${versionId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Falha ao restaurar versão');
    return res.json();
  }
};

export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponseDto {
  token: string;
  name: string;
  userId: number;
  role?: string;
}
