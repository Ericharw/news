import { NextResponse } from "next/server";
import pool from "@/lib/db";

const FALLBACK_KEYWORDS = [
  { keyword: "* EMBER *", kategori_transaksi: "Perabotan & Perlengkapan Kantor / Dapur/ Toilet" },
  { keyword: "* rd *", kategori_transaksi: "Beban Pemeliharaan Wisma dan Rumah Dinas" },
  { keyword: "* Spons *", kategori_transaksi: "Perabotan & Perlengkapan Kantor / Dapur/ Toilet" },
  { keyword: "* tamu *", kategori_transaksi: "NON ALLOWABLE COST LAINNYA" },
  { keyword: "*souv*", kategori_transaksi: "Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize" },
  { keyword: "LAUNDRY", kategori_transaksi: "Laundry / Non-Allowable Cost" },
  { keyword: "Laundry", kategori_transaksi: "Laundry / Non-Allowable Cost" },
  { keyword: "Wisata", kategori_transaksi: "Rekreasi / Non-Allowable" },
  { keyword: "Golf", kategori_transaksi: "Olahraga Pribadi / Non-Allowable" },
  { keyword: "Purnabakti", kategori_transaksi: "NON ALLOWABLE COST LAINNYA" },
];

function matchesKeyword(text: string, rawKeyword: string): boolean {
  if (!text || !rawKeyword) return false;
  const cleanText = text.trim().toLowerCase();
  let cleanKw = rawKeyword.trim().toLowerCase();

  // Strip asterisks and commas to get the literal core keyword phrase
  const literalCore = cleanKw.replace(/[\*\,]/g, "").trim();
  if (!literalCore || literalCore.length < 2) return false;

  const escaped = literalCore.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // If rawKeyword contains asterisks with spaces or is short (<= 5 chars, e.g. "* spons *", "* rd *"), match standalone word
  const isExactWord = cleanKw.includes("* ") || cleanKw.includes(" *") || literalCore.length <= 5;
  if (isExactWord) {
    try {
      const reg = new RegExp(`\\b${escaped}\\b`, "i");
      return reg.test(cleanText);
    } catch {
      return cleanText === literalCore;
    }
  }

  // For longer keywords, check if cleanText contains literalCore
  try {
    const reg = new RegExp(escaped, "i");
    return reg.test(cleanText);
  } catch {
    return cleanText.includes(literalCore);
  }
}



// POST /api/activities/validate - Validate inputs against master_keywords in PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaProgram, subjekKegiatan, jenisBiaya, objekKegiatan, tanggalAwal, batch } = body;

    if (!namaProgram?.trim() || !subjekKegiatan?.trim() || !jenisBiaya?.trim() || !objekKegiatan?.trim() || !tanggalAwal?.trim()) {
      return NextResponse.json(
        { success: false, error: "Harap lengkapi seluruh kolom bertanda bintang (*)." },
        { status: 400 }
      );
    }

    let masterKeywords = FALLBACK_KEYWORDS;
    let masterGreyAreas = [
      { nama_transaksi: "Sponsor", ringkasan: "Perlu klarifikasi peruntukan sponsor" },
      { nama_transaksi: "Sponsorship", ringkasan: "Perlu klarifikasi peruntukan sponsorship" },
      { nama_transaksi: "Entertainment", ringkasan: "Perlu bukti pendukung kegiatan" },
      { nama_transaksi: "Honorarium", ringkasan: "Perlu persetujuan khusus" },
      { nama_transaksi: "Incentive", ringkasan: "Ketentuan klaim insentif" },
    ];

    try {
      const keywordRes = await pool.query("SELECT * FROM master_keyword;");
      if (keywordRes.rows && keywordRes.rows.length > 0) {
        masterKeywords = keywordRes.rows;
      }
    } catch (dbErr) {
      console.warn("PostgreSQL query warning, using local master_keyword fallback:", dbErr);
    }

    try {
      const greyRes = await pool.query("SELECT * FROM master_grey_area;");
      if (greyRes.rows && greyRes.rows.length > 0) {
        masterGreyAreas = greyRes.rows;
      }
    } catch (dbErr) {
      console.warn("PostgreSQL query warning, using local master_grey_area fallback:", dbErr);
    }

    const detectedKeywords: { keyword: string; field: string; category: string }[] = [];
    const detectedGreyAreas: { keyword: string; field: string; category: string; ringkasan?: string }[] = [];

    const textToScan = [
      { text: objekKegiatan || subjekKegiatan || "", field: "Objek Kegiatan" },
    ];

    // Scan for NAC Keywords (Merah)
    for (const item of textToScan) {
      if (!item.text) continue;

      for (const kwObj of masterKeywords) {
        if (matchesKeyword(item.text, kwObj.keyword)) {
          const alreadyAdded = detectedKeywords.some(
            (d) => d.keyword.toLowerCase() === kwObj.keyword.toLowerCase() && d.field === item.field
          );
          if (!alreadyAdded) {
            const categoryVal =
              (kwObj as { tipe_transaksi?: string; kategori_transaksi?: string }).tipe_transaksi ||
              (kwObj as { tipe_transaksi?: string; kategori_transaksi?: string }).kategori_transaksi ||
              "Non-Allowable Cost (NAC)";

            detectedKeywords.push({
              keyword: kwObj.keyword,
              field: item.field,
              category: categoryVal,
            });
          }
        }
      }
    }

    // Scan for Grey Area (Grey) using NAMA TRANSAKSI from master_grey_area
    for (const item of textToScan) {
      if (!item.text) continue;

      for (const gaObj of masterGreyAreas) {
        const gaNama = gaObj.nama_transaksi || (gaObj as any).namaTransaksi || "";
        const gaRingkasan = gaObj.ringkasan || "";
        if (!gaNama) continue;

        if (matchesKeyword(item.text, gaNama) || item.text.toLowerCase().includes(gaNama.toLowerCase())) {
          const alreadyAdded = detectedGreyAreas.some(
            (d) => d.keyword.toLowerCase() === gaNama.toLowerCase() && d.field === item.field
          );
          if (!alreadyAdded) {
            detectedGreyAreas.push({
              keyword: gaNama,
              field: item.field,
              category: (gaObj as any).status || "Grey Area",
              ringkasan: gaRingkasan,
            });
          }
        }
      }
    }

    let statusVal: "AMAN" | "TERDETEKSI_NAC" | "GREY_AREA" = "AMAN";
    if (detectedKeywords.length > 0) {
      statusVal = "TERDETEKSI_NAC";
    } else if (detectedGreyAreas.length > 0) {
      statusVal = "GREY_AREA";
    }

    const isSafe = statusVal === "AMAN";

    return NextResponse.json({
      success: true,
      isSafe,
      statusVal,
      detectedKeywords,
      detectedGreyAreas,
      inputData: {
        namaProgram,
        subjekKegiatan,
        jenisBiaya,
        objekKegiatan: objekKegiatan || subjekKegiatan,
        tanggalAwal: tanggalAwal || "20/08/2026",
        batch: batch || "Batch 1",
      },
    });
  } catch (error: unknown) {
    console.error("Validation API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to perform NAC validation check" },
      { status: 500 }
    );
  }
}
