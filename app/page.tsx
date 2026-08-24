"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ActivityItem, ActivityFormValues, ActiveMenuType } from "@/types/activity";
import { INITIAL_ACTIVITIES } from "@/data/initialActivities";
import Swal from "sweetalert2";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { ActivityTable } from "@/components/ActivityTable";
import { TambahKegiatanView } from "@/components/TambahKegiatanView";
import { MasterProgramView } from "@/components/MasterProgramView";
import { MasterKeywordView } from "@/components/MasterKeywordView";
import { MasterJenisBiayaView } from "@/components/MasterJenisBiayaView";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ValidationPreviewModal } from "@/components/ValidationPreviewModal";

export default function Home() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<ActiveMenuType>("data-kegiatan");
  const [isKegiatanOpen, setIsKegiatanOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Table Data State
  const [dataList, setDataList] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
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
      else if (menu === "master-program") path = "/master-program";
      else if (menu === "master-keyword") path = "/master-keyword";
      else if (menu === "master-jenis-biaya") path = "/master-jenis-biaya";

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
        if (path === "/tambah-kegiatan") setActiveMenu("tambah-kegiatan");
        else if (path === "/master-program" || path === "/master-program-edit") setActiveMenu("master-program");
        else if (path === "/master-keyword" || path === "/master-keyword-edit") setActiveMenu("master-keyword");
        else if (path === "/master-jenis-biaya" || path === "/master-jenis-biaya-edit") setActiveMenu("master-jenis-biaya");
        else if (path === "/data-kegiatan" || path === "/") setActiveMenu("data-kegiatan");
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
        setIsSafe(json.isSafe);
        setDetectedKeywords(json.detectedKeywords || []);
        setIsPreviewOpen(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Validasi",
          text: json.error || "Gagal melakukan validasi keyword NAC.",
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
        setActiveMenu("data-kegiatan");

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
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP HEADER BAR */}
        <Header
          activeMenu={activeMenu}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeMenu === "master-program" ? (
            <MasterProgramView />
          ) : activeMenu === "master-keyword" ? (
            <MasterKeywordView />
          ) : activeMenu === "master-jenis-biaya" ? (
            <MasterJenisBiayaView />
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
            /* HALAMAN KHUSUS DATA KEGIATAN */
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
        formValues={formValues}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
