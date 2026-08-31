"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, KeyRound, ShieldCheck, Zap, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Harap masukkan username dan password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (json.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("adminSession", JSON.stringify(json.data));
        }

        await Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang, ${json.data.nama}.`,
          confirmButtonColor: "#0072CE",
          timer: 2000,
        });

        window.location.href = json.data.role === "ADMIN" ? "/dashboard" : "/user-form";
      } else {
        setErrorMsg(json.error || "Username atau password tidak valid.");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);
      setErrorMsg((err as Error).message || "Gagal terhubung ke database server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background PLN Color Accent Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0072CE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00A3E0]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full max-w-md flex items-center justify-end pt-4 pb-2 z-10">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#0072CE]">
          <Zap className="w-4 h-4 text-[#FFC72C] fill-[#FFC72C]" />
          <span>NEWS PLN</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Card Header Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200 shadow-xs mb-1">
              <Image
                src="/Logo_PLN.png"
                alt="PLN Logo"
                width={48}
                height={48}
                className="h-10 w-auto object-contain mix-blend-multiply"
                priority
              />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#0072CE]/10 text-[#0072CE] text-[10px] font-black uppercase tracking-wider border border-[#0072CE]/20">
                NEWS PLN Authentication
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Login ke Sistem NEWS PLN
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Masukkan username dan password untuk melanjutkan ke layanan NEWS PLN sesuai hak akses Anda.
              </p>
            </div>
          </div>

          {/* Login Error Notification */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Username<span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Username (contoh: admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <KeyRound className="w-4.5 h-4.5 text-slate-400 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0072CE] to-[#00A3E0] hover:from-[#005bb5] hover:to-[#008cc3] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#00A3E0]/30 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Memverifikasi Database...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#FFC72C]" />
                  <span>Login ke NEWS PLN</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-500 font-semibold py-4 z-10">
        &copy; 2026 PT PLN (Persero) UPDL Surabaya • NAC Early Warning System
      </div>
    </div>
  );
}
