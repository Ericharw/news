"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Lock, Mail, Building2, Calendar, RefreshCw, Save, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

interface SessionUser {
  id: string;
  username: string;
  nama: string;
  role: string;
}

export const ProfileSettingsView: React.FC = () => {
  // Session & User Info State
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [currentUserRole, setCurrentUserRole] = useState("ADMIN");
  const [namaUser, setNamaUser] = useState("Admin PLN");
  const [emailUser, setEmailUser] = useState("admin.diklat@pln.co.id");
  const [unitUser, setUnitUser] = useState("PT PLN (Persero) UPDL Surabaya");
  const [jabatanUser, setJabatanUser] = useState("Administrator SDM & Diklat");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load user session and corresponding profile
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const json: { success?: boolean; data?: SessionUser | null } = await res.json();
        
        let uname = "admin";
        let role = "ADMIN";
        let defaultNama = "Admin PLN";
        let defaultEmail = "admin.diklat@pln.co.id";
        let defaultJabatan = "Administrator SDM & Diklat";
        const defaultUnit = "PT PLN (Persero) UPDL Surabaya";

        if (json.success && json.data) {
          uname = json.data.username;
          role = json.data.role;

          if (role === "PKU") {
            defaultNama = "PKU";
            defaultEmail = "pku.diklat@pln.co.id";
            defaultJabatan = "User Bagian PKU";
          } else if (role === "JAR") {
            defaultNama = "JAR";
            defaultEmail = "jar.diklat@pln.co.id";
            defaultJabatan = "User Bagian JAR";
          } else if (role === "K3L_KAM") {
            defaultNama = "K3L & KAM";
            defaultEmail = "k3l_kam.diklat@pln.co.id";
            defaultJabatan = "User Bagian K3L & Keamanan";
          } else {
            defaultNama = json.data.nama || "Admin PLN";
            defaultEmail = "admin.diklat@pln.co.id";
            defaultJabatan = "Administrator SDM & Diklat";
          }
        }

        setCurrentUsername(uname);
        setCurrentUserRole(role);

        // Check local storage for customized profile for this specific user
        if (typeof window !== "undefined") {
          const userKey = uname === "admin" ? "pln_admin_profile" : `pln_profile_${uname}`;
          const saved = localStorage.getItem(userKey);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setNamaUser(parsed.namaAdmin || parsed.namaUser || defaultNama);
              setEmailUser(parsed.emailAdmin || parsed.emailUser || defaultEmail);
              setUnitUser(parsed.unitAdmin || parsed.unitUser || defaultUnit);
              setJabatanUser(parsed.jabatanAdmin || parsed.jabatanUser || defaultJabatan);
              return;
            } catch {
              // fallback to defaults
            }
          }
        }

        setNamaUser(defaultNama);
        setEmailUser(defaultEmail);
        setUnitUser(defaultUnit);
        setJabatanUser(defaultJabatan);
      } catch (e) {
        console.error("Error loading profile session:", e);
      }
    }

    loadUserData();
  }, []);

  const getInitials = (name: string, role: string) => {
    if (role && role !== "ADMIN") {
      if (role === "K3L_KAM") return "K3L";
      return role.slice(0, 3).toUpperCase();
    }
    if (!name) return "AP";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayRoleLabel = currentUserRole === "K3L_KAM" ? "K3L & KAM" : currentUserRole;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUser.trim() || !emailUser.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Harap lengkapi Nama dan Email Anda.",
        confirmButtonColor: "#0072CE",
      });
      return;
    }

    setIsProfileSaving(true);
    if (typeof window !== "undefined") {
      const profileData = {
        namaAdmin: namaUser.trim(),
        namaUser: namaUser.trim(),
        emailAdmin: emailUser.trim(),
        emailUser: emailUser.trim(),
        unitAdmin: unitUser.trim(),
        unitUser: unitUser.trim(),
        jabatanAdmin: jabatanUser.trim(),
        jabatanUser: jabatanUser.trim(),
      };

      const userKey = currentUsername === "admin" ? "pln_admin_profile" : `pln_profile_${currentUsername}`;
      localStorage.setItem(userKey, JSON.stringify(profileData));
      window.dispatchEvent(new CustomEvent("pln-profile-updated", { detail: profileData }));
    }

    setTimeout(async () => {
      setIsProfileSaving(false);
      await Swal.fire({
        icon: "success",
        title: "Profil Berhasil Diperbarui!",
        text: "Detail informasi akun Anda telah berhasil disimpan.",
        confirmButtonColor: "#0072CE",
        timer: 2000,
      });
    }, 500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Harap lengkapi semua kolom password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg("Password baru minimal terdiri dari 4 karakter.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const json = await res.json();

      if (json.success) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMsg("");

        await Swal.fire({
          icon: "success",
          title: "Password Berhasil Diperbarui!",
          text: "Password baru Anda telah berhasil tersimpan di database.",
          confirmButtonColor: "#0072CE",
          timer: 2000,
        });
      } else {
        setErrorMsg(json.error || "Gagal memperbarui password.");
      }
    } catch (err: unknown) {
      console.error("Error updating password:", err);
      setErrorMsg((err as Error).message || "Terjadi kesalahan saat terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003B70] via-[#0072CE] to-[#00A3E0] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <svg width="320" height="320" viewBox="0 0 200 200" fill="none">
            <path d="M40 0 L200 160 L160 200 L0 40 Z" fill="#FFFFFF" />
            <path d="M90 0 L200 110 L180 130 L70 0 Z" fill="#FFC72C" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner shrink-0">
              {getInitials(namaUser, currentUserRole)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {namaUser}
                </h2>
                <span className="px-3 py-1 bg-[#FFC72C] text-slate-950 text-xs font-black uppercase tracking-wider rounded-full border border-amber-300 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span>{displayRoleLabel}</span>
                </span>
              </div>
              <p className="text-sky-100 text-xs sm:text-sm mt-1 font-medium">
                {unitUser}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editable Account Detail Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[#0072CE]" />
                <span>Detail Informasi Akun</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Mode Edit</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              {/* Username System (Non-editable) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Username System</span>
                  <span className="text-[10px] text-slate-400 font-normal italic flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Tidak dapat diubah
                  </span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={currentUsername}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-extrabold text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Nama Pengguna */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Pengguna / Akun <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#0072CE] absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={namaUser}
                    onChange={(e) => setNamaUser(e.target.value)}
                    placeholder="Masukkan nama akun..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Official */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Email Official <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#0072CE] absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value)}
                    placeholder="Contoh: user@pln.co.id"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Unit / Instansi */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Unit / Instansi PLN
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-[#0072CE] absolute left-3.5" />
                  <input
                    type="text"
                    value={unitUser}
                    onChange={(e) => setUnitUser(e.target.value)}
                    placeholder="Nama unit kerja..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Jabatan / Access Level */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Jabatan / Akses Role
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-[#0072CE] absolute left-3.5" />
                  <input
                    type="text"
                    value={jabatanUser}
                    onChange={(e) => setJabatanUser(e.target.value)}
                    placeholder="Jabatan pengguna..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="px-5 py-2.5 bg-[#0072CE] hover:bg-[#005bb5] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#00A3E0]/30 disabled:opacity-50"
                >
                  {isProfileSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#FFC72C]" />
                      <span>Simpan Perubahan Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
              <KeyRound className="w-4.5 h-4.5 text-amber-500" />
              <span>Pengaturan Ubah Password</span>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Password Lama <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showOldPass ? "text" : "password"}
                    required
                    placeholder="Masukkan password lama Anda"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showOldPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showOldPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Password Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    placeholder="Masukkan password baru (minimal 4 karakter)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showNewPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showNewPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Konfirmasi Password Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder="Ketik ulang password baru Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showConfirmPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showConfirmPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-400/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan DB...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-100" />
                      <span>Simpan Password Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
