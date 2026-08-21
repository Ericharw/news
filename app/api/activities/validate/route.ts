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

  // If keyword contains wildcard '*'
  if (cleanKw.includes("*")) {
    const coreKw = cleanKw.replace(/^[\*\s,]+|[\*\s,]+$/g, "");
    if (!coreKw) return false;

    const regexPattern = coreKw
      .split("*")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");

    try {
      const reg = new RegExp(regexPattern, "i");
      return reg.test(cleanText);
    } catch {
      return cleanText.includes(coreKw);
    }
  }

  // Handle leading punctuation like ",EMBER" or "/5S GI"
  cleanKw = cleanKw.replace(/^[,/]+/, "").trim();
  if (cleanKw.length < 2) return false;

  return cleanText.includes(cleanKw);
}

// POST /api/activities/validate - Validate inputs against master_keywords in PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaProgram, subjekKegiatan, jenisBiaya, objekKegiatan, tanggalAwal, batch } = body;

    if (!namaProgram || !subjekKegiatan || !jenisBiaya) {
      return NextResponse.json(
        { success: false, error: "Harap lengkapi seluruh kolom bertanda bintang (*)." },
        { status: 400 }
      );
    }

    let masterKeywords = FALLBACK_KEYWORDS;

    try {
      const keywordRes = await pool.query("SELECT * FROM master_keyword;");
      if (keywordRes.rows && keywordRes.rows.length > 0) {
        masterKeywords = keywordRes.rows;
      }
    } catch (dbErr) {
      console.warn("PostgreSQL query warning, using local master_keyword fallback:", dbErr);
    }

    const detectedKeywords: { keyword: string; field: string; category: string }[] = [];

    const textToScan = [
      { text: objekKegiatan || "", field: "Objek Kegiatan" },
      { text: subjekKegiatan || "", field: "Subjek Kegiatan" },
      { text: namaProgram || "", field: "Nama Program" },
    ];

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

    const isSafe = detectedKeywords.length === 0;

    return NextResponse.json({
      success: true,
      isSafe,
      detectedKeywords,
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
