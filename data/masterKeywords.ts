export interface MasterKeywordItem {
  keyword: string;
  kategori: string;
}

export const RAW_CSV_KEYWORDS = `
1;* coc*;Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)
2;* EMBER *;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
3;* rd *;Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)
4;* Spons *;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
5;* tamu *;NON ALLOWABLE COST LAINNYA
6;*amanan rw;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
7;*beli* buah;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
8;*HPN*;Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)
9;*kabar;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
10;*LOLA*ADM;NON ALLOWABLE COST LAINNYA
11;*naman pohon;Taman / Kolam Ikan / Aquarium
12;*rohani*;Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)
13;*souv*;Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize
14;,EMBER;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
15;/5S GI;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
16;000171101705122 PPN Put 06-2017;NON ALLOWABLE COST LAINNYA
17;000191101705122 PPN Dalam Negeri 02-2017;NON ALLOWABLE COST LAINNYA
18;000211101705122 PPN Put 03-2017;NON ALLOWABLE COST LAINNYA
19;000221101705122 PPN Put 02-2017;NON ALLOWABLE COST LAINNYA
20;000241101705122 PPN Dalam Negeri 04-2017;NON ALLOWABLE COST LAINNYA
21;000271101705122 PPN Put 12-2017;NON ALLOWABLE COST LAINNYA
22;000281101705122 PPN Put 08-2017;NON ALLOWABLE COST LAINNYA
23;000291101705122 PPN Put 09-2017;NON ALLOWABLE COST LAINNYA
24;000311101705122 PPN Put 01-2017;NON ALLOWABLE COST LAINNYA
25;000321101705122 PPN Dalam Negeri 03-2017;NON ALLOWABLE COST LAINNYA
26;000331101705122 PPh Pasal 23 12-2017;NON ALLOWABLE COST LAINNYA
27;004.PJ/17;NON ALLOWABLE COST LAINNYA
28;019.PJ/DAN.02.02/UPT DKSI/2019;Penyesuaian < Y-1
29;159.PJ/DAN.02.02/APP DKSI/2017;Penyesuaian < Y-1
30;17an;Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)
31;2021 Nota Depre;Penyesuaian < Y-1
32;3101404361 Support PLN on G20 Carbon Ne2;Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)
33;3101495281 Js Dukungan PLN Net Zero;Seremonial K3L / Proper / Lingkungan
34;3101495281 Js Dukungan PLN Net Zero T2;Seremonial K3L / Proper / Lingkungan
35;3101495281 Js Dukungan PLN Net Zero T3;Seremonial K3L / Proper / Lingkungan
36;3D*Modelling;Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize
37;5489. KOREKSI BEBAN THN LALU 0491/2019 PT TRILISTR;Penyesuaian < Y-1
38;5R/5S;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
39;5S GUD;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
40;Abonemen MNC Vision;Berlangganan Media Massa (TV, Surat Kabar)
41;ACARA KEMENTERIAN BUMN FIBA;Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)
42;Acara Konsolidasi Komunikasi;Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)
43;ACARA RAMAH TA*;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
44;Acara*HLN;Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)
45;ACRYLIC;Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)
46;Action*Lea*;Inhouse Training Non Ketenagalistrikan
47;adeging;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
48;Advertising;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
49;aerocol;Pengharum Ruangan Kantor / Mobil / Toilet
50;agenda * BUMN;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
51;Agenda*Setting*BUMN;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
52;Air Fryer Rudin;Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)
53;air kemasan;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
54;air mineral;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
55;air minum;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
56;air*ulang;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
57;akhlak;Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)
58;AKMDS*STKHLDR;Stakeholder Management
59;AKMDS*WS;Stakeholder Management
60;Akom&kons penjurian marketing;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
61;AKOM*KON;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
62;Akomodasi Media;Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)
63;AKOMODASI*ACARA;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
64;AKOMODASI*FGD;Inhouse Training Non Ketenagalistrikan
65;akomodasi*Forum*Instruktur;Inhouse Training Non Ketenagalistrikan
66;AKOMODASI*GM;Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)
67;Akomodasi*Magang;Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)
68;AKOMODASI*MEETING;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
69;AKOMODASI*STEI;Inhouse Training Non Ketenagalistrikan
70;AKOMODASI*TWMT;Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)
71;AKOMODASI*WS;Stakeholder Management
72;akrilik;Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)
73;AKRILIK;Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)
74;AKRL*CS;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
75;aksesoris*kabel*colokan;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
76;ALAS KAKI;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
77;ALAT PEL;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
78;Alat*Fitnes;Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)
79;ALIH*DAYA*CWG;NON ALLOWABLE COST LAINNYA
80;Alihdaya Pengamanan UIT*;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
81;ALIHDAYA PG;Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%
82;ALILAHOTEL;Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)
83;AMPLI*KREATIF;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
84;AMPLI*PERS;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
85;ANGGARAN*PI*ISTRI;Sponsorship - Proporsi 80%
86;ANTI*GORES;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
87;ANTIS;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
88;APLIKASI*SHEET;NON ALLOWABLE COST LAINNYA
89;APPRENTICE FOR TALENT;Sponsorship - Proporsi 80%
90;APRESIASI;Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize
91;apresiasi;Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize
92;aqua;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
93; Arang *;Bahan Makanan dan Konsumsi (Selain Akun 6107201100)
94;Arsip*Box;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
95;ART*CARTON;Perabotan & Perlengkapan Kantor / Dapur/ Toilet
96;ART*INTELIGENCE;Inhouse Training Non Ketenagalistrikan
97;ARTIKEL;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
98;askreat des Pub;Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%
99;ASME*BOOKS;Inhouse Training Non Ketenagalistrikan
100;ASRAMA*MENTARI*MITRA;Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)
738;Laudry;Laundry
740;Laundry;Laundry
741;LAUNDRY;Laundry
778;Loundry;Laundry
1549;Smart Watch;Smartwatch, Tablet
`;

export function parseRawCsvKeywords(): MasterKeywordItem[] {
  const lines = RAW_CSV_KEYWORDS.trim().split("\n");
  const result: MasterKeywordItem[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(";");
    if (parts.length >= 3) {
      const kw = parts[1].trim();
      const cat = parts[2].trim();
      if (kw) {
        result.push({ keyword: kw, kategori: cat || "Non-Allowable Cost" });
      }
    }
  }

  return result;
}
