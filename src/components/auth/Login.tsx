import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthService } from '../../services/AuthService';
import { LogIn, UserPlus, Mail, Lock, Cpu, AlertCircle } from 'lucide-react';

interface LoginProps {
  onToggleRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const loginStore = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await AuthService.login({ email, password });
      loginStore(
        { id: response.userId, name: response.name, email: email, role: response.role },
        response.token
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden font-sans">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 animate-in zoom-in-50 duration-500">
              <Cpu size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">PromptPad</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center font-medium opacity-70">
              Entre para gerenciar seus prompts e templates
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Seu e-mail corporativo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Senha</label>
                <button type="button" className="text-[11px] font-bold text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Sua senha de acesso"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  Entrar no PromptPad
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-zinc-800 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Não tem uma conta?</p>
            <button
              onClick={onToggleRegister}
              className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors hover:scale-105"
            >
              <UserPlus size={18} />
              Criar conta gratuitamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
