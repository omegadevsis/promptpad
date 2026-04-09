import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, Check, X, AlertCircle, Save } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface Permission {
  id: number;
  key: string;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
}

const RoleManagement: React.FC = () => {
  const { token } = useAuthStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:5128/api/roles';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchRoles = async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (res.ok) setRoles(await res.json());
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${API_URL}/permissions`, { headers: getHeaders() });
      if (res.ok) setPermissions(await res.json());
    } catch (err) {
      console.error('Failed to fetch permissions', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchRoles(), fetchPermissions()]).finally(() => setIsLoading(false));
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: newRoleName, description: newRoleDesc })
      });
      if (res.ok) {
        setNewRoleName('');
        setNewRoleDesc('');
        setIsAddingRole(false);
        fetchRoles();
      }
    } catch (err) {
      alert('Erro ao criar perfil');
    }
  };

  const togglePermission = async (roleId: number, permissionId: number, hasPermission: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${roleId}/permissions/${permissionId}`, {
        method: hasPermission ? 'DELETE' : 'POST',
        headers: getHeaders()
      });
      if (res.ok) fetchRoles();
    } catch (err) {
      alert('Erro ao atualizar permissão');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-primary" /> Gerenciamento de Perfis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Crie papéis e atribua permissões granulares no sistema</p>
        </div>
        <button
          onClick={() => setIsAddingRole(!isAddingRole)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          {isAddingRole ? <X size={16} /> : <Plus size={16} />}
          {isAddingRole ? 'Cancelar' : 'Novo Perfil'}
        </button>
      </div>

      {isAddingRole && (
        <form onSubmit={handleCreateRole} className="mb-8 p-6 bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome do Perfil</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Ex: Supervisor, Revisor..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Descrição</label>
              <input
                type="text"
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="O que este perfil pode fazer no sistema?"
              />
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-foreground text-background px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            <Save size={16} /> Salvar Perfil
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-stone-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{role.name}</h3>
                <p className="text-xs text-muted-foreground">{role.description || 'Sem descrição'}</p>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">ID: {role.id}</div>
            </div>
            <div className="p-5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Key size={12} /> Permissões Associadas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {permissions.map((perm) => {
                  const hasPerm = role.permissions.some(p => p.id === perm.id);
                  return (
                    <button
                      key={perm.id}
                      onClick={() => togglePermission(role.id, perm.id, hasPerm)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                        hasPerm 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-stone-50 dark:bg-zinc-800/50 border-stone-200 dark:border-zinc-700 text-muted-foreground hover:border-primary'
                      }`}
                    >
                      <span className="font-medium">{perm.name}</span>
                      {hasPerm ? <Check size={16} /> : <Plus size={16} className="opacity-40" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {roles.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-3xl">
          <AlertCircle size={40} className="mx-auto text-muted-foreground opacity-20 mb-3" />
          <p className="text-muted-foreground">Nenhum perfil cadastrado.</p>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
