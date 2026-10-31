"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Snowflake, Lock, User, Eye, EyeOff, ShieldCheck, ThermometerSnowflake, CheckCircle2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    name: "Bambang Pratama",
    username: "admin_gudang",
    role: "Manajer Gudang (Admin)",
    email: "bambang.pratama@frostflow.id",
    initials: "BP",
    password: "password123",
  },
  {
    name: "Nadia Rahma",
    username: "nadia_ops",
    role: "Operator Cold Chain & Picking",
    email: "nadia.rahma@frostflow.id",
    initials: "NR",
    password: "password123",
  },
  {
    name: "Hendra Wijaya",
    username: "hendra_finance",
    role: "Staf Finance & Akuntansi",
    email: "hendra.wijaya@frostflow.id",
    initials: "HW",
    password: "password123",
  },
  {
    name: "Siti Rahma",
    username: "siti_inbound",
    role: "Operator Inbound & QC Suhu",
    email: "siti.rahma@frostflow.id",
    initials: "SR",
    password: "password123",
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState("admin_gudang");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (username && password) {
        const matched = DEMO_ACCOUNTS.find(
          (a) => a.username.toLowerCase() === username.trim().toLowerCase()
        ) || {
          name: username.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          username: username.trim(),
          role: "Manajer Gudang (Admin)",
          email: `${username.trim()}@frostflow.id`,
          initials: username.substring(0, 2).toUpperCase(),
        };

        // Simpan sesi login ke localStorage
        localStorage.setItem("icecream_user_session", JSON.stringify(matched));
        router.push("/");
      } else {
        setError("Nama pengguna dan kata sandi wajib diisi!");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4 relative overflow-hidden">
      {/* Background Cold Chain Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
            <Snowflake className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            FROST<span className="text-cyan-400">/FLOW</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
            Cold Chain WMS &amp; Double-Entry Accounting
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] text-cyan-300">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>Standar Integritas Suhu &le; -18&deg;C</span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
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
                placeholder="Masukkan username staf"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                onClick={() => alert("Silakan hubungi Manajer Gudang atau Admin IT untuk mereset kata sandi akun Anda.")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Lupa sandi?
              </button>
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
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
              <span className="text-xs text-slate-400">Ingat sesi kerja di perangkat ini</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Masuk ke Sistem Gudang"
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Footer */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            Pilih Akun Demo Cepat (Klik untuk Mengisi):
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  username === acc.username
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="font-bold truncate">{acc.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{acc.role.split(" ")[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
