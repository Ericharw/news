"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ActivityFormValues, ActivityItem, ActiveMenuType, UserRole } from "@/types/activity";
import Swal from "sweetalert2";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ActivityTable } from "@/components/ActivityTable";
import { TambahKegiatanView } from "@/components/TambahKegiatanView";
import { MasterProgramView } from "@/components/MasterProgramView";
import { MasterKeywordView } from "@/components/MasterKeywordView";
import { MasterJenisBiayaView } from "@/components/MasterJenisBiayaView";
import { MasterGreyAreaView } from "@/components/MasterGreyAreaView";
import { ProfileSettingsView } from "@/components/ProfileSettingsView";
import { UserFormView } from "@/components/UserFormView";
import { LandingPage } from "@/components/LandingPage";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ValidationPreviewModal } from "@/components/ValidationPreviewModal";

interface HomeProps {
  initialRole?: UserRole;
  initialMenu?: ActiveMenuType;
}

function AdminShell({ activeMenu, children }: { activeMenu: ActiveMenuType; children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);
  const navigate = (menu: ActiveMenuType) => {
    const paths: Partial<Record<ActiveMenuType, string>> = {
      "data-kegiatan": "/data-kegiatan",
      "tambah-kegiatan": "/tambah-kegiatan",
      "master-program": "/master-program",
      "master-keyword": "/master-keyword",
      "master-jenis-biaya": "/master-jenis-biaya",
      "master-grey-area": "/master-grey-area",
      profile: "/data-kegiatan/profile",
    };
    window.location.href = paths[menu] || "/data-kegiatan";
  };

  return (
    <div className="min-h-screen flex bg-[#F1F5F9] text-slate-800 font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={navigate} isKegiatanOpen={isKegiatanOpen} setIsKegiatanOpen={setIsKegiatanOpen} sidebarCollapsed={sidebarCollapsed} userRole="admin" setUserRole={() => undefined} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header activeMenu={activeMenu} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} userRole="admin" setUserRole={() => undefined} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-x-hidden">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function AdminDataKegiatan() {
  const [dataList, setDataList] = useState<ActivityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenisBiaya, setFilterJenisBiaya] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);
  const [viewingItem, setViewingItem] = useState<ActivityItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) setDataList(result.data);
      })
      .catch((error) => console.error("Error fetching activities:", error));
  }, []);

  const filteredData = dataList.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = [item.namaProgram, item.subjekKegiatan, item.jenisBiaya, item.batch]
      .some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (filterJenisBiaya === "all" || item.jenisBiaya === filterJenisBiaya);
  });

  const confirmDelete = async () => {
    if (deletingId === null) return;
    try {
      const response = await fetch(`/api/activities/${deletingId}`, { method: "DELETE" });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Gagal menghapus data.");
      setDataList((current) => current.filter((item) => item.id !== deletingId));
      await Swal.fire({ icon: "success", title: "Berhasil Dihapus!", text: "Data kegiatan telah berhasil dihapus.", confirmButtonColor: "#0072CE", timer: 2000 });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Gagal Menghapus Data", text: error instanceof Error ? error.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteAll = async () => {
    const result = await Swal.fire({ icon: "warning", title: "Hapus Semua Data Kegiatan?", text: "Tindakan ini tidak dapat dibatalkan!", showCancelButton: true, confirmButtonColor: "#e11d48", cancelButtonColor: "#64748b", confirmButtonText: "Ya, Hapus Semua", cancelButtonText: "Batal" });
    if (!result.isConfirmed) return;
    try {
      const response = await fetch("/api/activities", { method: "DELETE" });
      const deleted = await response.json();
      if (!deleted.success) throw new Error(deleted.error || "Gagal menghapus semua data.");
      setDataList([]);
      await Swal.fire({ icon: "success", title: "Berhasil Dihapus!", text: "Seluruh data kegiatan telah dihapus.", confirmButtonColor: "#0072CE", timer: 2000 });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Gagal Menghapus", text: error instanceof Error ? error.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    }
  };

  const navigate = (menu: ActiveMenuType) => {
    const paths: Partial<Record<ActiveMenuType, string>> = {
      "data-kegiatan": "/data-kegiatan",
      "tambah-kegiatan": "/tambah-kegiatan",
      "master-program": "/master-program",
      "master-keyword": "/master-keyword",
      "master-jenis-biaya": "/master-jenis-biaya",
      "master-grey-area": "/master-grey-area",
      profile: "/data-kegiatan/profile",
    };
    window.location.href = paths[menu] || "/data-kegiatan";
  };

  return (
    <div className="min-h-screen flex bg-[#F1F5F9] text-slate-800 font-sans">
      <Sidebar activeMenu="data-kegiatan" setActiveMenu={navigate} isKegiatanOpen={isKegiatanOpen} setIsKegiatanOpen={setIsKegiatanOpen} sidebarCollapsed={sidebarCollapsed} userRole="admin" setUserRole={() => undefined} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header activeMenu="data-kegiatan" sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} userRole="admin" setUserRole={() => undefined} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          <ActivityTable filteredData={filteredData} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterJenisBiaya={filterJenisBiaya} setFilterJenisBiaya={setFilterJenisBiaya} showFilterDropdown={showFilterDropdown} setShowFilterDropdown={setShowFilterDropdown} currentPage={currentPage} setCurrentPage={setCurrentPage} onViewItem={setViewingItem} onDeleteItem={setDeletingId} onDeleteAllItems={confirmDeleteAll} onNavigateToAdd={() => navigate("tambah-kegiatan")} />
        </main>
        <Footer />
      </div>
      <ViewDetailModal item={viewingItem} onClose={() => setViewingItem(null)} />
      <DeleteConfirmModal deletingId={deletingId} onCancel={() => setDeletingId(null)} onConfirm={confirmDelete} />
    </div>
  );
}

function AdminRoutePage({ menu }: { menu: ActiveMenuType }) {
  const [formValues, setFormValues] = useState<ActivityFormValues>({ namaProgram: "", subjekKegiatan: "", jenisBiaya: "", objekKegiatan: "", tanggalAwal: "", batch: "" });
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSafe, setIsSafe] = useState(true);
  const [detectedKeywords, setDetectedKeywords] = useState<{ keyword: string; field: string; category: string }[]>([]);
  const [detectedGreyAreas, setDetectedGreyAreas] = useState<{ keyword: string; field: string; category: string; ringkasan?: string }[]>([]);
  const resetForm = () => setFormValues({ namaProgram: "", subjekKegiatan: "", jenisBiaya: "", objekKegiatan: "", tanggalAwal: "", batch: "" });

  const validateForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formValues.namaProgram || !formValues.subjekKegiatan || !formValues.jenisBiaya) {
      await Swal.fire({ icon: "warning", title: "Input Tidak Lengkap", text: "Harap lengkapi kolom yang bertanda bintang (*).", confirmButtonColor: "#0072CE" });
      return;
    }
    setIsValidating(true);
    try {
      const response = await fetch("/api/activities/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Gagal melakukan validasi.");
      setIsSafe(result.statusVal === "AMAN");
      setDetectedKeywords(result.detectedKeywords || []);
      setDetectedGreyAreas(result.detectedGreyAreas || []);
      const redNotes = (result.detectedKeywords || []).map((item: { keyword: string; field: string; category: string }) => `[Merah] Kata "${item.keyword}" pada ${item.field} (${item.category})`).join("; ");
      const greyNotes = (result.detectedGreyAreas || []).map((item: { keyword: string; field: string; category: string; ringkasan?: string }) => `[Grey Area] Transaksi "${item.keyword}" pada ${item.field}: ${item.ringkasan || item.category || "Grey Area"}`).join("; ");
      const catatanNac = [redNotes, greyNotes].filter(Boolean).join(" | ");
      setFormValues((current) => ({ ...current, statusNac: result.statusVal || "AMAN", catatanNac }));
      setIsPreviewOpen(true);
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Gagal Validasi", text: error instanceof Error ? error.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setIsValidating(false);
    }
  };

  const confirmSubmit = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Gagal menyimpan data.");
      setIsPreviewOpen(false);
      resetForm();
      return true;
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Gagal Menyimpan Data", text: error instanceof Error ? error.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (menu === "data-kegiatan") return <AdminDataKegiatan />;
  if (menu === "master-program") return <AdminShell activeMenu={menu}><MasterProgramView /></AdminShell>;
  if (menu === "master-keyword") return <AdminShell activeMenu={menu}><MasterKeywordView /></AdminShell>;
  if (menu === "master-jenis-biaya") return <AdminShell activeMenu={menu}><MasterJenisBiayaView /></AdminShell>;
  if (menu === "master-grey-area") return <AdminShell activeMenu={menu}><MasterGreyAreaView /></AdminShell>;
  if (menu === "profile") return <AdminShell activeMenu={menu}><ProfileSettingsView /></AdminShell>;
  return <AdminShell activeMenu="tambah-kegiatan"><TambahKegiatanView formValues={formValues} setFormValues={setFormValues} onSubmit={validateForm} onReset={resetForm} onBackToData={() => { window.location.href = "/data-kegiatan"; }} isValidating={isValidating} /><ValidationPreviewModal isOpen={isPreviewOpen} isSafe={isSafe} detectedKeywords={detectedKeywords} detectedGreyAreas={detectedGreyAreas} formValues={formValues} onClose={() => setIsPreviewOpen(false)} onConfirmSubmit={confirmSubmit} isSubmitting={isSubmitting} /></AdminShell>;
}

function UserInputPage() {
  const [formValues, setFormValues] = useState({ namaProgram: "", subjekKegiatan: "", jenisBiaya: "", objekKegiatan: "", tanggalAwal: "", batch: "" });
  const [isValidating, setIsValidating] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenuType>("user-form");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);

  const resetForm = () => setFormValues({ namaProgram: "", subjekKegiatan: "", jenisBiaya: "", objekKegiatan: "", tanggalAwal: "", batch: "" });

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formValues.namaProgram || !formValues.subjekKegiatan || !formValues.jenisBiaya) {
      await Swal.fire({ icon: "warning", title: "Input Tidak Lengkap", text: "Harap lengkapi kolom yang wajib diisi.", confirmButtonColor: "#0072CE" });
      return;
    }

    setIsValidating(true);
    try {
      const validationResponse = await fetch("/api/activities/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues) });
      const validation = await validationResponse.json();
      if (!validation.success) throw new Error(validation.error || "Validasi gagal.");
      const statusNac = validation.statusVal || "AMAN";
      const redNotes = (validation.detectedKeywords || []).map((item: { keyword: string; field: string; category: string }) => `[Merah] Kata "${item.keyword}" pada ${item.field} (${item.category})`).join("; ");
      const greyNotes = (validation.detectedGreyAreas || []).map((item: { keyword: string; field: string; category: string; ringkasan?: string }) => `[Grey Area] Transaksi "${item.keyword}" pada ${item.field}: ${item.ringkasan || item.category || "Grey Area"}`).join("; ");
      const catatanNac = [redNotes, greyNotes].filter(Boolean).join(" | ");
      const response = await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formValues, statusNac, catatanNac }) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Data gagal disimpan.");
      resetForm();
      await Swal.fire({ icon: "success", title: "Berhasil Menyimpan Data", text: "Laporan kegiatan berhasil dikirim.", confirmButtonColor: "#0072CE", timer: 2200 });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Gagal Menyimpan Data", text: error instanceof Error ? error.message : "Terjadi kesalahan.", confirmButtonColor: "#e11d48" });
    } finally {
      setIsValidating(false);
    }
  };

  const handleMenuChange = (menu: ActiveMenuType) => {
    if (menu === "user-form" || menu === "riwayat-user") setActiveMenu(menu);
  };

  return (
    <div className="min-h-screen flex bg-[#F1F5F9] text-slate-800 font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuChange} isKegiatanOpen={isKegiatanOpen} setIsKegiatanOpen={setIsKegiatanOpen} sidebarCollapsed={sidebarCollapsed} userRole="user" setUserRole={() => undefined} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header activeMenu={activeMenu} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} userRole="user" setUserRole={() => undefined} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          <UserFormView formValues={formValues} setFormValues={setFormValues} onSubmit={submitForm} onReset={resetForm} isValidating={isValidating} activeMenu={activeMenu} />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function Home(_props: HomeProps) {
  if (_props.initialRole === "admin" && _props.initialMenu && _props.initialMenu !== "user-form") {
    return <AdminRoutePage menu={_props.initialMenu} />;
  }
  if (_props.initialRole === "user") return <UserInputPage />;

  return <LandingPage />;
}
