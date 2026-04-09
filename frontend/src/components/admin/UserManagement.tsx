import React, { useState, useEffect } from 'react';
import { Users, UserCog, Mail, ShieldCheck, RefreshCcw, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import CreateUserModal from '../modals/CreateUserModal';

interface Role {
  id: number;
  name: string;
}

interface UserAdmin {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string | null;
}

const UserManagement: React.FC = () => {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = 'http://localhost:5128/api';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${API_URL}/users`, { headers: getHeaders() }),
        fetch(`${API_URL}/roles`, { headers: getHeaders() })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (rolesRes.ok) setRoles(await rolesRes.json());
    } catch (err) {
      console.error('Failed to fetch user management data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (userId: number, roleId: number | null) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ roleId })
      });

      if (res.ok) {
        await fetchData();
      } else {
        alert('Erro ao atualizar papel do usuário');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Erro ao criar usuário');
      }

      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Carregando usuários...</div>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto font-sans">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users className="text-primary" /> Gerenciamento de Usuários
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Atribua perfis de acesso aos colaboradores da plataforma</p>
          </div>
          <div className="flex items-center gap-3">
           <button 
             onClick={fetchData}
             className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-muted-foreground"
             title="Recarregar dados"
           >
             <RefreshCcw size={18} />
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:scale-[1.02]"
           >
             <UserPlus size={16} />
             Novo Usuário
           </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 dark:bg-zinc-800/30 border-b border-stone-100 dark:border-zinc-800">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Perfil Atual</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail size={12} /> {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className={user.roleName ? 'text-emerald-500' : 'text-muted-foreground opacity-30'} />
                        <span className={`text-xs font-medium ${user.roleName ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                          {user.roleName || 'Sem Perfil'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                         <select 
                           disabled={updatingUserId === user.id}
                           value={user.roleId || ''}
                           onChange={(e) => handleUpdateRole(user.id, e.target.value ? parseInt(e.target.value) : null)}
                           className="bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg py-1 px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                         >
                           <option value="">Sem Perfil</option>
                           {roles.map(role => (
                             <option key={role.id} value={role.id}>{role.name}</option>
                           ))}
                         </select>
                         {updatingUserId === user.id && <RefreshCcw size={14} className="animate-spin text-primary" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-transparent border-2 border-dashed border-stone-100 dark:border-zinc-800 rounded-3xl mt-6">
            <UserCog size={40} className="mx-auto text-muted-foreground opacity-10 mb-4" />
            <p className="text-muted-foreground text-sm font-medium">Nenhum usuário encontrado no sistema.</p>
          </div>
        )}
      </div>

      <CreateUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateUser}
        roles={roles}
      />
    </>
  );
};

export default UserManagement;
