export type JenisBiayaType = "Perjalanan Dinas" | "Konsumsi" | "Akomodasi" | string;

export interface ActivityItem {
  no: number;
  id: number;
  namaProgram: string;
  subjekKegiatan: string;
  jenisBiaya: JenisBiayaType;
  objekKegiatan?: string;
  tanggalAwal: string;
  batch: string;
}

export interface ActivityFormValues {
  namaProgram: string;
  subjekKegiatan: string;
  jenisBiaya: string;
  objekKegiatan: string;
  tanggalAwal: string;
  batch: string;
}

export type ActiveMenuType = "data-kegiatan" | "tambah-kegiatan";
