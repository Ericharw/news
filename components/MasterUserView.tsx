"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MasterUserItem } from "@/types/activity";
import Swal from "sweetalert2";
import {
  Search,
  PlusCircle,
  Trash2,
  Pencil,
  Users,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const ROLE_OPTIONS = ["ADMIN", "PKU", "JAR", "K3L_KAM"];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-rose-100 text-rose-700 border border-rose-200",
  PKU: "bg-blue-100 text-blue-700 border border-blue-200",
  JAR: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  K3L_KAM: "bg-amber-100 text-amber-700 border border-amber-200",
};

export const MasterUserView: React.FC = () => {
  const [users, setUsers] = useState<MasterUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterUserItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MasterUserItem | null>(null);
  const [detailItem, setDetailItem] = useState<MasterUserItem | null>(null);

  // Add form state
  const [newUsername, setNewUsername] = useState("");
  const [newNama, setNewNama] = useState("");
  const [newRole, setNewRole] = useState("PKU");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Edit form state
  const [editUsername, setEditUsername] = useState("");
  const [editNama, setEditNama] = useState("");
  const [editRole, setEditRole] = useState("PKU");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/master/users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error("Error fetching master users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setNewUsername("");
    setNewNama("");
    setNewRole("PKU");
    setNewPassword("");
    setNewPasswordConfirm("");
    setShowNewPassword(false);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newNama.trim() || !newPassword.trim()) {
      Swal.fire({ icon: "warning", title: "Input Tidak Lengkap", text: "Username, nama, dan password wajib diisi.", confirmButtonColor: "#0072CE" });
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      Swal.fire({ icon: "warning", title: "Password Tidak Cocok", text: "Konfirmasi password tidak sesuai.", confirmButtonColor: "#0072CE" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/master/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), nama: newNama.trim(), role: newRole, password: newPassword }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal menyimpan user.");
      setIsAddModalOpen(false);
      fetchUsers();
      Swal.fire({ icon: "success", title: "Berhasil!", text: `User "${newUsername}" berhasil ditambahkan.`, confirmButtonColor: "#0072CE", timer: 2500 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal Menyimpan", text: err instanceof Error ? err.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: MasterUserItem) => {
    setEditingItem(item);
    setEditUsername(item.username);
    setEditNama(item.nama);
    setEditRole(item.role);
    setEditPassword("");
    setShowEditPassword(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editUsername.trim() || !editNama.trim()) {
      Swal.fire({ icon: "warning", title: "Input Tidak Lengkap", text: "Username dan nama wajib diisi.", confirmButtonColor: "#0072CE" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/master/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          username: editUsername.trim(),
          nama: editNama.trim(),
          role: editRole,
          password: editPassword.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal mengupdate user.");
      setEditingItem(null);
      fetchUsers();
      Swal.fire({ icon: "success", title: "Berhasil Diupdate!", text: `User "${editUsername}" berhasil diperbarui.`, confirmButtonColor: "#0072CE", timer: 2500 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal Update", text: err instanceof Error ? err.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/master/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingItem.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal menghapus user.");
      setDeletingItem(null);
      fetchUsers();
      Swal.fire({ icon: "success", title: "Berhasil Dihapus!", text: `User "${deletingItem.username}" berhasil dihapus.`, confirmButtonColor: "#0072CE", timer: 2000 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal Menghapus", text: err instanceof Error ? err.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users
      .filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.nama.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const adminOrder = Number(b.role === "ADMIN") - Number(a.role === "ADMIN");
        return adminOrder || a.username.localeCompare(b.username, "id", { sensitivity: "base" });
      });
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Master User</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola akun pengguna yang dapat login ke sistem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Tambah User
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari username, nama, atau role..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 bg-slate-50 transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 shrink-0">Total: <span className="font-bold text-slate-700">{filteredUsers.length}</span> user</span>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Memuat data...</span>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Users className="w-10 h-10 opacity-30" />
            <span className="text-sm font-medium">{searchQuery ? "Tidak ada user yang cocok." : "Belum ada user terdaftar."}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10">#</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dibuat</th>
                  <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {user.username?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-xs font-bold text-slate-800 font-mono">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">{user.nama}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ROLE_BADGE[user.role] || "bg-slate-100 text-slate-600"}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailItem(user)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                          title="Detail user"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(user)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors"
                          title="Hapus user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                  <PlusCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Tambah User Baru</h2>
                  <p className="text-[11px] text-slate-500">User baru dapat digunakan untuk login</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                  placeholder="Contoh: john_doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition-all bg-slate-50"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Username hanya huruf kecil dan underscore</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Nama lengkap pengguna"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition-all bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role <span className="text-rose-500">*</span></label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition-all bg-slate-50"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition-all bg-slate-50"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password <span className="text-rose-500">*</span></label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 transition-all bg-slate-50 ${
                    newPasswordConfirm && newPassword !== newPasswordConfirm
                      ? "border-rose-300 focus:ring-rose-400/40 focus:border-rose-400"
                      : "border-slate-200 focus:ring-violet-400/40 focus:border-violet-400"
                  }`}
                  required
                />
                {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                  <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Password tidak cocok</p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isSubmitting ? "Menyimpan..." : "Simpan User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Edit User</h2>
                  <p className="text-[11px] text-slate-500 font-mono">{editingItem.username}</p>
                </div>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role <span className="text-rose-500">*</span></label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all bg-slate-50"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password Baru <span className="text-slate-400 font-normal">(opsional)</span></label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition-all bg-slate-50"
                  />
                  <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan jika tidak ingin mengubah password</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDetailItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Detail User</h2>
                  <p className="text-[11px] text-slate-500">Informasi akun pengguna</p>
                </div>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Username</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{detailItem.username}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Nama Lengkap</span>
                <span className="text-xs font-semibold text-slate-800 text-right">{detailItem.nama}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Role</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ROLE_BADGE[detailItem.role] || "bg-slate-100 text-slate-600"}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {detailItem.role}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Password</span>
                <span className="text-xs font-semibold text-slate-800">Tersimpan aman</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Dibuat</span>
                <span className="text-xs font-semibold text-slate-800">{formatDate(detailItem.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeletingItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Hapus User?</h2>
            <p className="text-xs text-slate-500 mb-1">
              User <span className="font-bold text-slate-800 font-mono">{deletingItem.username}</span> akan dihapus permanen.
            </p>
            <p className="text-[11px] text-rose-500 mb-5">User yang dihapus tidak bisa login lagi.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeletingItem(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

