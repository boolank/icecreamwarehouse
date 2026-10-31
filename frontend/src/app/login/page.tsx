"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Snowflake, Lock, User, Eye, EyeOff, ShieldCheck, ThermometerSnowflake } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("admin_gudang");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock direct login for demonstration
    setTimeout(() => {
      if (username && password) {
        window.location.href = "/";
      } else {
        setError("Nama pengguna dan kata sandi wajib diisi!");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-slate-100 p-4 relative overflow-hidden">
      {/* Background Cold Chain Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
            <Snowflake className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            FROST<span className="text-cyan-400">/FLOW</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
            Sistem Gudang & Akuntansi Distributor Es Krim
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] text-cyan-300">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>Standar Cold Chain &le; -18&deg;C</span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Pengguna (Username)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Silakan hubungi Administrator IT untuk mereset kata sandi Anda.");
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Lupa sandi?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
              />
              <span className="text-xs text-slate-400">Ingat sesi ini (7 hari)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Masuk ke Sistem"
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Footer */}
        <div className="mt-8 pt-5 border-t border-slate-700/60 text-center">
          <p className="text-[11px] text-slate-400">
            Kredensial Demo Cepat:
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-300">
              Admin: <strong className="text-white">admin_gudang</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-300">
              Sandi: <strong className="text-white">password123</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

