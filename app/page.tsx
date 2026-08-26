"use client";

import React, { useState, useMemo, useEffect } from "react";

import { ActivityItem, ActivityFormValues, ActiveMenuType, UserRole } from "@/types/activity";
import Swal from "sweetalert2";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { ActivityTable } from "@/components/ActivityTable";
import { TambahKegiatanView } from "@/components/TambahKegiatanView";
import { UserFormView } from "@/components/UserFormView";
import { MasterProgramView } from "@/components/MasterProgramView";
import { MasterKeywordView } from "@/components/MasterKeywordView";
import { MasterJenisBiayaView } from "@/components/MasterJenisBiayaView";
import { MasterGreyAreaView } from "@/components/MasterGreyAreaView";
import { ProfileSettingsView } from "@/components/ProfileSettingsView";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ValidationPreviewModal } from "@/components/ValidationPreviewModal";

interface HomeProps {
  initialRole?: UserRole;
  initialMenu?: ActiveMenuType;
}

export default function Home({ initialRole, initialMenu }: HomeProps) {
  // Navigation & Role State initialized from props & URL to prevent flash on refresh
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/user-form" || p === "/") return "user";
      if (p.startsWith("/data-kegiatan") || p.startsWith("/master-")) return "admin";
    }
    return "user";
  });

  const [activeMenu, setActiveMenu] = useState<ActiveMenuType>(() => {
    if (initialMenu) return initialMenu;
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/user-form" || p === "/") return "user-form";
      if (p === "/tambah-kegiatan") return "tambah-kegiatan";
      if (p === "/data-kegiatan/profile") return "profile";
      if (p.includes("master-program")) return "master-program";
      if (p.includes("master-keyword")) return "master-keyword";
      if (p.includes("master-jenis-biaya")) return "master-jenis-biaya";
      if (p.includes("master-grey-area")) return "master-grey-area";
    }
    return "user-form";
  });

  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Table Data State
  const [dataList, setDataList] = useState<ActivityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenisBiaya, setFilterJenisBiaya] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Notifications State
  const [viewingItem, setViewingItem] = useState<ActivityItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Validation Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSafe, setIsSafe] = useState(true);
  const [detectedKeywords, setDetectedKeywords] = useState<{ keyword: string; field: string; category: string }[]>([]);
  const [detectedGreyAreas, setDetectedGreyAreas] = useState<{ keyword: string; field: string; category: string; ringkasan?: string }[]>([]);

  // Form State
  const [formValues, setFormValues] = useState<ActivityFormValues>({
    namaProgram: "",
    subjekKegiatan: "",
    jenisBiaya: "",
    objekKegiatan: "",
    tanggalAwal: "20/08/2026",
    batch: ""
  });

  // Toast Helper
  const showNotification = (msg: string) => {
    setToastMessage(msg);
  };

  // Fetch live activities from PostgreSQL DB
  const refetchActivities = async () => {
    try {
      const res = await fetch("/api/activities");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDataList(json.data);
      }
    } catch (err) {
      console.error("Error fetching activities from DB:", err);
    }
  };

  const handleMenuChange = (menu: ActiveMenuType) => {
    setActiveMenu(menu);
    if (typeof window !== "undefined") {
      let path = "/data-kegiatan";
      if (menu === "tambah-kegiatan") path = "/tambah-kegiatan";
      else if (menu === "user-form") path = "/user-form";
      else if (menu === "master-program") path = "/master-program";
      else if (menu === "master-keyword") path = "/master-keyword";
      else if (menu === "master-jenis-biaya") path = "/master-jenis-biaya";
      else if (menu === "profile") path = "/data-kegiatan/profile";

      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
    }
  };

  useEffect(() => {
    refetchActivities();

    const syncUrlMenu = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path === "/user-form" || path === "/") {
          setActiveMenu("user-form");
          setUserRole("user");
          if (path === "/") {
            window.history.replaceState(null, "", "/user-form");
          }
        } else if (path === "/data-kegiatan/profile") {
          setActiveMenu("profile");
        } else if (path === "/tambah-kegiatan") {
          setActiveMenu("tambah-kegiatan");
        } else if (path === "/master-program" || path === "/master-program-edit") {
          setActiveMenu("master-program");
        } else if (path === "/master-keyword" || path === "/master-keyword-edit") {
          setActiveMenu("master-keyword");
        } else if (path === "/master-jenis-biaya" || path === "/master-jenis-biaya-edit") {
          setActiveMenu("master-jenis-biaya");
        } else if (path === "/master-grey-area" || path === "/master-grey-area-edit") {
          setActiveMenu("master-grey-area");
        } else if (path === "/data-kegiatan") {
          setActiveMenu("data-kegiatan");
        }
      }
    };

    syncUrlMenu();
    window.addEventListener("popstate", syncUrlMenu);
    return () => window.removeEventListener("popstate", syncUrlMenu);
  }, []);

  // Form Submit Handler -> Step 1: Validate against master_keywords in PostgreSQL
  const handleValidateAndPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaProgram || !formValues.subjekKegiatan || !formValues.jenisBiaya) {
      Swal.fire({
        icon: "warning",
        title: "Input Tidak Lengkap",
        text: "Harap lengkapi seluruh kolom yang bertanda bintang (*).",
        confirmButtonColor: "#0072CE",
      });
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetch("/api/activities/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = await res.json();

      if (json.success) {
        const keywords = json.detectedKeywords || [];
        const greyAreas = json.detectedGreyAreas || [];
        const statusVal: "AMAN" | "TERDETEKSI_NAC" | "GREY_AREA" = json.statusVal || (keywords.length > 0 ? "TERDETEKSI_NAC" : (greyAreas.length > 0 ? "GREY_AREA" : "AMAN"));

        const nacNotes = keywords.map((k: { keyword: string; field: string; category: string }) => `[Merah] Kata "${k.keyword}" pada ${k.field} (${k.category})`).join("; ");
        const greyNotes = greyAreas.map((g: { keyword: string; field: string; category: string; ringkasan?: string }) => `[Grey Area] Transaksi "${g.keyword}" pada ${g.field}${g.ringkasan ? `: ${g.ringkasan}` : ""}`).join("; ");

        let catatanVal = "";
        if (keywords.length > 0 && greyAreas.length > 0) {
          catatanVal = `${nacNotes} | ${greyNotes}`;
        } else if (keywords.length > 0) {
          catatanVal = nacNotes;
        } else if (greyAreas.length > 0) {
          catatanVal = greyNotes;
        }

        setIsSafe(statusVal === "AMAN");
        setDetectedKeywords(keywords);
        setDetectedGreyAreas(greyAreas);
        setFormValues((prev) => ({
          ...prev,
          statusNac: statusVal,
          catatanNac: catatanVal
        }));
        setIsPreviewOpen(true);
      } else {

        Swal.fire({
          icon: "error",
          title: "Gagal Validasi",
          text: json.error || "Gagal melakukan validasi keyword NAC & Grey Area.",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Error validating form:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Validasi",
        text: (err as Error).message || "Terjadi kesalahan saat menghubungi API validasi.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Step 2: Confirm Submit after Preview (if Safe) -> POST to PostgreSQL API
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = await res.json();
      if (json.success) {
        setIsPreviewOpen(false);
        handleResetForm();
        refetchActivities();
        if (userRole === "user") {
          setActiveMenu("user-form");
        } else {
          setActiveMenu("data-kegiatan");
        }

        Swal.fire({
          icon: "success",
          title: "Berhasil Menyimpan Data!",
          text: "Data kegiatan baru berhasil disimpan ke database.",
          confirmButtonColor: "#0072CE",
          timer: 2500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan Data",
          text: json.error || "Gagal menyimpan data ke database.",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Data",
        text: (err as Error).message || "Terjadi kesalahan saat menyimpan ke database.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormValues({
      namaProgram: "",
      subjekKegiatan: "",
      jenisBiaya: "",
      objekKegiatan: "",
      tanggalAwal: "20/08/2026",
      batch: ""
    });
  };

  // Delete Action Handler -> DELETE to PostgreSQL API
  const confirmDelete = async () => {
    if (deletingId === null) return;
    try {
      const res = await fetch(`/api/activities/${deletingId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        refetchActivities();
        Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus!",
          text: "Data kegiatan telah berhasil dihapus dari database.",
          confirmButtonColor: "#0072CE",
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Data",
          text: json.error || "Gagal menghapus data dari.",
          confirmButtonColor: "#e11d48",
        });
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Data",
        text: (err as Error).message || "Terjadi kesalahan saat menghapus data.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered List Memo
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.namaProgram.toLowerCase().includes(q) ||
        item.subjekKegiatan.toLowerCase().includes(q) ||
        item.jenisBiaya.toLowerCase().includes(q) ||
        item.batch.toLowerCase().includes(q);

      const matchesJenis =
        filterJenisBiaya === "all" ? true : item.jenisBiaya === filterJenisBiaya;

      return matchesSearch && matchesJenis;
    });
  }, [dataList, searchQuery, filterJenisBiaya]);

  return (
    <div className="min-h-screen flex bg-[#F1F5F9] text-slate-800 font-sans selection:bg-[#00A3E0] selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* LEFT SIDEBAR */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
        isKegiatanOpen={isKegiatanOpen}
        setIsKegiatanOpen={setIsKegiatanOpen}
        sidebarCollapsed={sidebarCollapsed}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP HEADER BAR */}
        <Header
          activeMenu={activeMenu}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          {userRole === "user" || activeMenu === "user-form" ? (
            /* HALAMAN KHUSUS PEGAWAI PLN */
            <UserFormView
              formValues={formValues}
              setFormValues={setFormValues}
              onSubmit={handleValidateAndPreview}
              onReset={handleResetForm}
              isValidating={isValidating}
            />
          ) : activeMenu === "master-program" ? (

            <MasterProgramView />
          ) : activeMenu === "master-keyword" ? (
            <MasterKeywordView />
          ) : activeMenu === "master-jenis-biaya" ? (
            <MasterJenisBiayaView />
          ) : activeMenu === "master-grey-area" ? (
            <MasterGreyAreaView />
          ) : activeMenu === "profile" ? (
            <ProfileSettingsView />
          ) : activeMenu === "tambah-kegiatan" ? (

            /* HALAMAN KHUSUS TAMBAH KEGIATAN */
            <TambahKegiatanView
              formValues={formValues}
              setFormValues={setFormValues}
              onSubmit={handleValidateAndPreview}
              onReset={handleResetForm}
              onBackToData={() => setActiveMenu("data-kegiatan")}
              isValidating={isValidating}
            />
          ) : (
            /* HALAMAN KHUSUS DATA KEGIATAN (ADMIN) */
            <ActivityTable
              filteredData={filteredData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterJenisBiaya={filterJenisBiaya}
              setFilterJenisBiaya={setFilterJenisBiaya}
              showFilterDropdown={showFilterDropdown}
              setShowFilterDropdown={setShowFilterDropdown}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onViewItem={(item) => setViewingItem(item)}
              onDeleteItem={(id) => setDeletingId(id)}
              onNavigateToAdd={() => setActiveMenu("tambah-kegiatan")}
            />
          )}
        </main>

        {/* BOTTOM PAGE FOOTER */}
        <Footer />
      </div>

      {/* MODALS */}
      <ViewDetailModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />

      <DeleteConfirmModal
        deletingId={deletingId}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
      />

      {/* NAC EARLY WARNING VALIDATION PREVIEW MODAL */}
      <ValidationPreviewModal
        isOpen={isPreviewOpen}
        isSafe={isSafe}
        detectedKeywords={detectedKeywords}
        detectedGreyAreas={detectedGreyAreas}
        formValues={formValues}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

