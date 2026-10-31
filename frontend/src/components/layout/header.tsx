"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Thermometer,
  LogOut,
  User,
  Users,
  Settings,
  ShieldCheck,
  ChevronDown,
  X,
  AlertTriangle
} from "lucide-react";

export function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Active current user (read from localStorage or default to Admin Gudang)
  const [currentUser, setCurrentUser] = useState({
    name: "Bambang Pratama",
    username: "admin_gudang",
    role: "Manajer Gudang (Admin)",
    email: "bambang.pratama@frostflow.id",
    initials: "BP",
  });

  useEffect(() => {
    // Check initial dark mode from document or localStorage
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    // Check stored user session
    try {
      const stored = localStorage.getItem("icecream_user_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {}

    // Close profile dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("icecream_user_session");
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Quick Cold Chain Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Cold Chain Quick Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Thermometer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>-21.2°C Optimal Cold Chain</span>
          </div>
        </div>

        {/* Center: Universal Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SKU es krim, nomor batch, SO, pelanggan, atau akun..."
              className="w-full pl-9 pr-12 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right: Actions, Notifications, Dark Mode, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            title="Pemberitahuan Sistem Cold Chain"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" />

          {/* User Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold border border-cyan-400/40 shadow-sm">
                {currentUser.initials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
                <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {currentUser.role}
                </p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Info Header */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {currentUser.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        @{currentUser.username}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Links */}
                <div className="py-1.5 space-y-0.5">
                  <Link
                    href="/users"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span>Kelola Pengguna &amp; Hak Akses</span>
                  </Link>

                  <Link
                    href="/inventory/temperature-logs"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Audit Log &amp; Kontrol Suhu</span>
                  </Link>
                </div>

                {/* Logout Action */}
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Sistem (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfirmasi Keluar (Logout)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Apakah Anda yakin ingin mengakhiri sesi kerja sebagai <strong>{currentUser.name}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
