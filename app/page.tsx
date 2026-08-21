"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ActivityItem, ActivityFormValues, ActiveMenuType } from "@/types/activity";
import { INITIAL_ACTIVITIES } from "@/data/initialActivities";

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

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch activities from PostgreSQL API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/activities");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDataList(json.data);
        }
      } catch (err) {
        console.error("Error fetching activities from PostgreSQL:", err);
      }
    }
    loadData();
  }, []);

  const refetchActivities = async () => {
    try {
      const res = await fetch("/api/activities");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDataList(json.data);
      }
    } catch (err) {
      console.error("Error fetching activities from PostgreSQL:", err);
    }
  };

  // Form Submit Handler -> Step 1: Validate against master_keywords in PostgreSQL
  const handleValidateAndPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaProgram || !formValues.subjekKegiatan || !formValues.jenisBiaya) {
      alert("Harap lengkapi seluruh kolom yang bertanda bintang (*).");
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
        alert(json.error || "Gagal melakukan validasi keyword NAC.");
      }
    } catch (err) {
      console.error("Error validating form:", err);
      alert("Terjadi kesalahan saat menghubungi API validasi.");
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
        showNotification("Data kegiatan baru berhasil disimpan ke PostgreSQL!");
        handleResetForm();
        refetchActivities();
        setActiveMenu("data-kegiatan");
      } else {
        alert(json.error || "Gagal menyimpan data ke PostgreSQL.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Terjadi kesalahan saat menyimpan ke database.");
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
        showNotification("Data kegiatan berhasil dihapus dari PostgreSQL!");
        refetchActivities();
      } else {
        alert(json.error || "Gagal menghapus data dari PostgreSQL.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Terjadi kesalahan saat menghapus data.");
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
        setActiveMenu={setActiveMenu}
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
