"use client";

import React, { useState, useEffect } from "react";
import { Menu, Bell, User, ChevronDown, Zap, LogOut, Settings, ShieldCheck, UserCheck, RefreshCw, Lock, X, AlertCircle, KeyRound, Eye, EyeOff } from "lucide-react";
import { ActiveMenuType, UserRole } from "@/types/activity";
import Swal from "sweetalert2";

interface HeaderProps {
  activeMenu: ActiveMenuType;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

interface SessionUser {
  username: string;
  nama: string;
  role: "ADMIN" | "PKU" | "JAR" | "K3L_KAM";
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  sidebarCollapsed,
  setSidebarCollapsed,
  userRole,
  setUserRole
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [profileName, setProfileName] = useState("Admin PLN");
  const [profileEmail, setProfileEmail] = useState("admin.diklat@pln.co.id");
  const [profileJabatan, setProfileJabatan] = useState("Administrator SDM");

  useEffect(() => {
    function loadSavedProfile(user?: SessionUser | null) {
      if (typeof window !== "undefined") {
        const key = user && user.username !== "admin" ? `pln_profile_${user.username}` : "pln_admin_profile";
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.namaAdmin || parsed.namaUser) setProfileName(parsed.namaAdmin || parsed.namaUser);
            if (parsed.emailAdmin || parsed.emailUser) setProfileEmail(parsed.emailAdmin || parsed.emailUser);
            if (parsed.jabatanAdmin || parsed.jabatanUser) setProfileJabatan(parsed.jabatanAdmin || parsed.jabatanUser);
          } catch (e) {}
        }
      }
    }

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { success?: boolean; data?: SessionUser | null }) => {
        if (result.success && result.data) {
          setSessionUser(result.data);
          loadSavedProfile(result.data);
          if (typeof window !== "undefined") {
            localStorage.setItem("news_cached_user", JSON.stringify(result.data));
            localStorage.setItem("adminSession", JSON.stringify(result.data));
          }
        } else {
          setSessionUser(null);
          loadSavedProfile();
          if (typeof window !== "undefined") {
            localStorage.removeItem("news_cached_user");
          }
        }
      })
      .catch(() => loadSavedProfile())
      .finally(() => setIsSessionLoading(false));

    const handleProfileUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.namaUser || customEvent.detail.namaAdmin) {
          setProfileName(customEvent.detail.namaUser || customEvent.detail.namaAdmin);
        }
        if (customEvent.detail.emailUser || customEvent.detail.emailAdmin) {
          setProfileEmail(customEvent.detail.emailUser || customEvent.detail.emailAdmin);
        }
        if (customEvent.detail.jabatanUser || customEvent.detail.jabatanAdmin) {
          setProfileJabatan(customEvent.detail.jabatanUser || customEvent.detail.jabatanAdmin);
        }
      }
    };

    window.addEventListener("pln-profile-updated", handleProfileUpdated);
    return () => window.removeEventListener("pln-profile-updated", handleProfileUpdated);
  }, []);

  // Change Password State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showHeaderOldPass, setShowHeaderOldPass] = useState(false);
  const [showHeaderNewPass, setShowHeaderNewPass] = useState(false);
  const [showHeaderConfirmPass, setShowHeaderConfirmPass] = useState(false);
  const [changePassError, setChangePassError] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setChangePassError("Harap isi semua kolom password.");
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePassError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    if (newPasswordInput.length < 4) {
      setChangePassError("Password baru minimal terdiri dari 4 karakter.");
      return;
    }

    setIsChangingPass(true);
    setChangePassError("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          oldPassword: oldPasswordInput,
          newPassword: newPasswordInput,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setIsChangePasswordOpen(false);
        setOldPasswordInput("");
        setNewPasswordInput("");
        setConfirmPasswordInput("");

        Swal.fire({
          icon: "success",
          title: "Password Berhasil Diperbarui!",
          text: "Password admin baru Anda telah tersimpan di database PostgreSQL.",
          confirmButtonColor: "#0072CE",
          timer: 2500,
        });
      } else {
        setChangePassError(json.error || "Gagal memperbarui password admin.");
      }
    } catch (err: unknown) {
      console.error("Error changing password:", err);
      setChangePassError((err as Error).message || "Terjadi kesalahan koneksi server.");
    } finally {
      setIsChangingPass(false);
    }
  };

  const getPageTitle = () => {
    if (activeMenu === "riwayat-user") {
      return "Riwayat Input Kegiatan Pegawai";
    }
    if (userRole === "user" || activeMenu === "user-form") {
      return "Portal Input Kegiatan & Diklat";
    }

    switch (activeMenu) {
      case "dashboard":
        return "Dashboard Statistik & Monitoring";
      case "data-kegiatan":
        return "Data Kegiatan & Diklat";
      case "tambah-kegiatan":
        return "Input Kegiatan Baru (NEWS)";
      case "master-program":
        return "Master Program & Singkatan";
      case "master-keyword":
        return "Master Keyword Non-Allowable Cost (NAC)";
      case "master-jenis-biaya":
        return "Master Jenis Biaya PLN";
      case "master-grey-area":
        return "Master Grey Area Transaksi";
      case "profile":
        return "Pengaturan Profil Administrator";
      default:
        return "Data Kegiatan";
    }
  };

  const getInitials = (name?: string, role?: string) => {
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

  const isLoggedIn = userRole === "admin" || Boolean(sessionUser);
  const displayName = sessionUser?.nama || profileName;
  const displayRole = sessionUser?.role || "ADMIN";
  const displayRoleLabel = displayRole === "K3L_KAM" ? "K3L & KAM" : displayRole;

  const handleToggleRole = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/user-form/login";
    }
  };

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
      localStorage.removeItem("adminSession");
    }
    await fetch("/api/auth/logout", { method: "POST" });
    setUserRole("user");
    Swal.fire({
      icon: "success",
      title: "Logout Berhasil!",
      text: "Anda telah keluar dari mode Admin PT PLN (Persero).",
      confirmButtonColor: "#0072CE",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/user-form";
      }
    });
  };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Header Left: Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-2xs shrink-0"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse shrink-0"></span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              NEWS • NAC Early Warning System
            </span>
          </div>
          <h1 className="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Header Right: Profile & Notifications */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-[#FFC72C] text-[#FFC72C]" />
          <span>Server PLN Online</span>
        </div>

        {/* Bell Notification */}
        <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Profile / Admin Login Container */}
        <div className="relative border-l border-slate-200 pl-3 sm:pl-5">
          {!isLoggedIn ? (
            isSessionLoading && userRole === "user" ? (
              <div className="w-28 h-9" />
            ) : (
              <button
                onClick={handleToggleRole}
                className="flex items-center gap-2 px-4 py-2 bg-[#0072CE] hover:bg-[#005bb5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#00A3E0]/30"
                title="Klik untuk Login sebagai Admin SDM"
              >
                <ShieldCheck className="w-4 h-4 text-[#FFC72C]" />
                <span>Login Admin</span>
              </button>
            )
          ) : (
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0072CE] to-[#00A3E0] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#00A3E0]/30 group-hover:ring-[#0072CE]/50">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{displayName}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  {sessionUser ? displayRoleLabel : (profileJabatan || "Administrator SDM")}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${showProfileDropdown ? "rotate-180 text-[#0072CE]" : ""}`} />
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && isLoggedIn && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 p-2 border-t-4 border-t-[#0072CE] animate-in fade-in zoom-in-95">
              {/* Header Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs bg-[#0072CE]">
                    {getInitials(displayName, displayRole)}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 truncate max-w-[150px]">
                      {displayName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                      {sessionUser ? `${sessionUser.username} • ${displayRoleLabel}` : profileEmail}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit text-emerald-700 bg-emerald-50 border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{sessionUser ? displayRoleLabel : profileJabatan}</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (typeof window !== "undefined") {
                      if (sessionUser && sessionUser.role === "ADMIN") {
                        window.location.href = "/data-kegiatan/profile";
                      } else {
                        // For non-admin users, dispatch a custom event to trigger profile menu in UserInputPage
                        window.dispatchEvent(new CustomEvent("open-user-profile"));
                      }
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Profil</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                {/* Logout Action */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UBAH PASSWORD ADMIN MODAL */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  <KeyRound className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                    Keamanan Akun PLN
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Ubah Password Admin
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleChangePasswordSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
              {changePassError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{changePassError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Password Lama <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showHeaderOldPass ? "text" : "password"}
                    required
                    placeholder="Masukkan password lama"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowHeaderOldPass(!showHeaderOldPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showHeaderOldPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showHeaderOldPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Password Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showHeaderNewPass ? "text" : "password"}
                    required
                    placeholder="Masukkan password baru (min 4 karakter)"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowHeaderNewPass(!showHeaderNewPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showHeaderNewPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showHeaderNewPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Konfirmasi Password Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showHeaderConfirmPass ? "text" : "password"}
                    required
                    placeholder="Ketik ulang password baru"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowHeaderConfirmPass(!showHeaderConfirmPass)}
                    className="absolute right-3 text-slate-400 hover:text-[#0072CE] transition-colors p-1 cursor-pointer"
                    title={showHeaderConfirmPass ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showHeaderConfirmPass ? <Eye className="w-4 h-4 text-[#0072CE]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-400/30 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-100" />
                  <span>{isChangingPass ? "Menyimpan DB..." : "Simpan Password Baru"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
