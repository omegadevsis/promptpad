import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, UserPlus, AlertCircle } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => Promise<void>;
  roles: Role[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onConfirm, roles }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) {
      setError('Por favor, selecione um perfil para o usuário.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    try {
      await onConfirm({
        name,
        email,
        password,
        roleId: parseInt(roleId)
      });
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRoleId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar usuário. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden min-h-[500px] flex flex-col font-sans">
        <div className="p-6 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between bg-stone-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 text-primary rounded-xl">
               <UserPlus size={20} />
             </div>
             <h3 className="text-xl font-bold">Novo Usuário</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex-1 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Nome do colaborador"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Senha Temporária</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Perfil de Acesso</label>
              <div className="relative group">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Selecione um perfil...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-stone-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm font-bold hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-3 px-8 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Criar Usuário
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
