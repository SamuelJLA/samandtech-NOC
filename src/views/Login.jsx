import React, { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError("Credenciales inválidas o acceso denegado.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-black">
      <div className="w-full max-w-md space-y-8 relative">
        
        {/* Decoración Neón de fondo */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />

        <div className="text-center relative">
          <div className="inline-flex p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <ShieldCheck className="text-cyan-400" size={48} />
          </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            SAMANDTECH<span className="text-cyan-400">.NOC</span>
            </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2">
            Secure Access Gateway
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  placeholder="admin@samandtech.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "AUTENTICAR SISTEMA"}
          </button>
        </form>

        <p className="text-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          SAMANDTECH Infrastructure Monitoring System v1.0
        </p>
      </div>
    </div>
  );
};

export default Login;