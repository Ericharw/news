--
-- PostgreSQL database dump
--
-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-09-01 11:43:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 74496)
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    no integer,
    nama_program character varying(255) NOT NULL,
    subjek_kegiatan character varying(255) NOT NULL,
    jenis_biaya character varying(100) NOT NULL,
    objek_kegiatan text,
    tanggal_awal character varying(50) NOT NULL,
    batch character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status_nac character varying(50) DEFAULT 'AMAN'::character varying,
    catatan_nac text,
    created_by character varying(100),
    created_by_username character varying(100),
    created_by_role character varying(50)
);


ALTER TABLE public.activities OWNER TO news_user;

--
-- TOC entry 223 (class 1259 OID 74495)
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO news_user;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 223
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- TOC entry 232 (class 1259 OID 74570)
-- Name: admin_login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_login_logs (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_login_logs OWNER TO news_user;

--
-- TOC entry 231 (class 1259 OID 74569)
-- Name: admin_login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_login_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_login_logs_id_seq OWNER TO news_user;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 231
-- Name: admin_login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_login_logs_id_seq OWNED BY public.admin_login_logs.id;


--
-- TOC entry 230 (class 1259 OID 74553)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    nama character varying(150),
    role character varying(50) DEFAULT 'admin'::character varying,
    last_login timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_users OWNER TO news_user;

--
-- TOC entry 229 (class 1259 OID 74552)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO news_user;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 229
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- TOC entry 228 (class 1259 OID 74541)
-- Name: master_grey_area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_grey_area (
    id integer NOT NULL,
    id_kode character varying(50),
    nama_transaksi text,
    status character varying(100),
    ringkasan text
);


ALTER TABLE public.master_grey_area OWNER TO news_user;

--
-- TOC entry 227 (class 1259 OID 74540)
-- Name: master_grey_area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_grey_area_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_grey_area_id_seq OWNER TO news_user;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 227
-- Name: master_grey_area_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_grey_area_id_seq OWNED BY public.master_grey_area.id;


--
-- TOC entry 226 (class 1259 OID 74527)
-- Name: master_jenis_biaya; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_jenis_biaya (
    id integer NOT NULL,
    jenis_biaya character varying(255) NOT NULL,
    singkatan character varying(255)
);


ALTER TABLE public.master_jenis_biaya OWNER TO news_user;

--
-- TOC entry 225 (class 1259 OID 74526)
-- Name: master_jenis_biaya_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_jenis_biaya_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_jenis_biaya_id_seq OWNER TO news_user;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 225
-- Name: master_jenis_biaya_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_jenis_biaya_id_seq OWNED BY public.master_jenis_biaya.id;


--
-- TOC entry 222 (class 1259 OID 74483)
-- Name: master_keyword; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_keyword (
    id integer NOT NULL,
    keyword character varying(255) NOT NULL,
    tipe_transaksi character varying(255)
);


ALTER TABLE public.master_keyword OWNER TO news_user;

--
-- TOC entry 221 (class 1259 OID 74482)
-- Name: master_keyword_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_keyword_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_keyword_id_seq OWNER TO news_user;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 221
-- Name: master_keyword_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_keyword_id_seq OWNED BY public.master_keyword.id;


--
-- TOC entry 220 (class 1259 OID 74475)
-- Name: master_program; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_program (
    id integer NOT NULL,
    nama_program character varying(255),
    singkatan character varying(255)
);


ALTER TABLE public.master_program OWNER TO news_user;

--
-- TOC entry 219 (class 1259 OID 74474)
-- Name: master_program_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_program_id_seq OWNER TO news_user;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 219
-- Name: master_program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_program_id_seq OWNED BY public.master_program.id;


--
-- TOC entry 4888 (class 2604 OID 74499)
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- TOC entry 4897 (class 2604 OID 74573)
-- Name: admin_login_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_login_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_login_logs_id_seq'::regclass);


--
-- TOC entry 4893 (class 2604 OID 74556)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 74544)
-- Name: master_grey_area id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_grey_area ALTER COLUMN id SET DEFAULT nextval('public.master_grey_area_id_seq'::regclass);


--
-- TOC entry 4891 (class 2604 OID 74530)
-- Name: master_jenis_biaya id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_jenis_biaya ALTER COLUMN id SET DEFAULT nextval('public.master_jenis_biaya_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 74486)
-- Name: master_keyword id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_keyword ALTER COLUMN id SET DEFAULT nextval('public.master_keyword_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 74478)
-- Name: master_program id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_program ALTER COLUMN id SET DEFAULT nextval('public.master_program_id_seq'::regclass);


--
-- TOC entry 5067 (class 0 OID 74496)
-- Dependencies: 224
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.activities VALUES (1, 1, 'Vendor Invoicing Portal', 'ericha', '5.2 Honor Instruktur', 'cctv', 'batch 5', 'Batch batch 5', '2026-08-28 14:33:05.790701', 'GREY_AREA', '[Grey Area] Transaksi "CCTV" pada Objek Kegiatan: AC jika di kompleks ovitnas, ovitsus, dan lingkungan kantor, NAC jika berada di kantin, rumah ibadah dan taman', 'admin-1', 'admin', 'ADMIN');
INSERT INTO public.activities VALUES (2, 2, 'Vendor Invoicing Portal', 'ericha rizki', '5.2 Aplikasi', 'laundry', '28/08/2026', 'Batch 1', '2026-08-28 14:49:37.716061', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'k3l-kam-1', 'k3l_kam', 'K3L_KAM');
INSERT INTO public.activities VALUES (3, 3, 'Vendor Invoicing Portal', 'eer', '5.2 SARANA PEMBELAJARAN (untuk biaya konsumsi, transportasi, laundry, cetakan, ATK, perkakas, Hotel)', 'ccc', '28/08/2026', 'Batch 1', '2026-08-28 15:30:57.351704', 'AMAN', '', 'pku-1', 'pku', 'PKU');
INSERT INTO public.activities VALUES (4, 4, 'Nota Buku', 'frf', '5.2 Jasa Pembelajaran, asesmen dan sertifikasi', 'sponsorship', 'batch 3', 'Batch batch 3', '2026-08-28 15:31:59.25188', 'TERDETEKSI_NAC', '[Merah] Kata "sponsor" pada Objek Kegiatan (Sponsorship - Proporsi 80%); [Merah] Kata "sponsorship" pada Objek Kegiatan (Sponsorship - Proporsi 80%) | [Grey Area] Transaksi "SPONSORSHIP" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (5, 5, 'Vendor Invoicing Portal', 'errr', '5.2 SARANA PEMBELAJARAN (untuk biaya konsumsi, transportasi, laundry, cetakan, ATK, perkakas, Hotel)', 'laundry', '28/08/2026', 'Batch 1', '2026-08-28 15:39:00.427415', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (6, 6, 'Biaya Lain-Lain', 'rizki', '5.2 Honor Instruktur', 'laundry', 'batch 5', 'Batch batch 5', '2026-08-28 15:54:18.844788', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (7, 7, 'Kas Kecil', 'mm', '5.2 Jasa Pembelajaran, asesmen dan sertifikasi', 'laundry', '28/08/2026', 'Batch 1', '2026-08-28 16:02:33.466157', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (8, 8, 'Pengembangan Materi Legal dan Regulasi', 'ericha', '5.2 Honor Instruktur', 'laundry', '25/08/2026', 'Batch 1', '2026-08-31 09:16:48.012439', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'admin-1', 'admin', 'ADMIN');
INSERT INTO public.activities VALUES (9, 9, 'Nota Buku', 'errr', '5.2 Honor Instruktur', 'sportif', 'batch 2', 'Batch batch 2', '2026-08-31 14:19:50.839333', 'AMAN', '', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (10, 10, 'Pengembangan Materi Human Capital dan General Affair', 'fr', '5.2 honor MC', 'makan', 'batch 3', 'Batch batch 3', '2026-08-31 14:37:52.935025', 'TERDETEKSI_NAC', '[Merah] Kata "Makan" pada Objek Kegiatan (Bahan Makanan dan Konsumsi (Selain Akun 6107201100))', 'admin-1', 'admin', 'ADMIN');
INSERT INTO public.activities VALUES (11, 11, 'Pengembangan Materi Perencanaan Sistem dan Aset Manajemen', 'caca', '5.2 Enterpreneur', 'laundry', '31/08/2026', 'Batch 1', '2026-08-31 14:44:20.012004', 'TERDETEKSI_NAC', '[Merah] Kata "Laundry" pada Objek Kegiatan (Laundry) | [Grey Area] Transaksi "Laundry" pada Objek Kegiatan: Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan', 'k3l-kam-1', 'k3l_kam', 'K3L_KAM');
INSERT INTO public.activities VALUES (12, 12, 'Vendor Invoicing Portal', 'ddd', '5.2 Honor Instruktur', 'cctv', '01/09/2026', 'Batch 1', '2026-09-01 08:12:17.820153', 'GREY_AREA', '[Grey Area] Transaksi "CCTV" pada Objek Kegiatan: AC jika di kompleks ovitnas, ovitsus, dan lingkungan kantor, NAC jika berada di kantin, rumah ibadah dan taman', 'jar-1', 'jar', 'JAR');
INSERT INTO public.activities VALUES (13, 13, 'Biaya Lain-Lain', 'ee', '5.2 Honor Instruktur', 'analisa statistika', '01/09/2026', 'Batch 1', '2026-09-01 08:26:06.109967', 'AMAN', '', 'admin-1', 'admin', 'ADMIN');


--
-- TOC entry 5075 (class 0 OID 74570)
-- Dependencies: 232
-- Data for Name: admin_login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admin_login_logs VALUES (1, 'admin', 'BERHASIL_LOGIN', '2026-08-26 10:06:25.126513');
INSERT INTO public.admin_login_logs VALUES (2, 'admin', 'GAGAL_PASSWORD_SALAH', '2026-08-26 10:08:59.278553');
INSERT INTO public.admin_login_logs VALUES (3, 'admin', 'BERHASIL_LOGIN', '2026-08-26 10:09:14.300769');
INSERT INTO public.admin_login_logs VALUES (4, 'admin', 'BERHASIL_LOGIN', '2026-08-26 10:50:51.891561');
INSERT INTO public.admin_login_logs VALUES (5, 'admin', 'UBAH_PASSWORD_BERHASIL', '2026-08-26 11:04:06.889081');
INSERT INTO public.admin_login_logs VALUES (6, 'admin', 'BERHASIL_LOGIN', '2026-08-26 11:13:35.778807');
INSERT INTO public.admin_login_logs VALUES (7, 'admin', 'BERHASIL_LOGIN', '2026-08-26 11:14:32.681372');
INSERT INTO public.admin_login_logs VALUES (8, 'admin', 'BERHASIL_LOGIN', '2026-08-26 11:16:56.727879');
INSERT INTO public.admin_login_logs VALUES (9, 'admin', 'BERHASIL_LOGIN', '2026-08-26 11:29:09.378338');
INSERT INTO public.admin_login_logs VALUES (10, 'admin', 'BERHASIL_LOGIN', '2026-08-26 11:29:24.230201');
INSERT INTO public.admin_login_logs VALUES (11, 'admin', 'BERHASIL_LOGIN', '2026-08-26 14:16:57.795599');
INSERT INTO public.admin_login_logs VALUES (12, 'admin', 'BERHASIL_LOGIN', '2026-08-26 14:22:04.444659');
INSERT INTO public.admin_login_logs VALUES (13, 'admin', 'BERHASIL_LOGIN', '2026-08-26 14:28:04.917775');
INSERT INTO public.admin_login_logs VALUES (14, 'admin', 'BERHASIL_LOGIN', '2026-08-26 14:44:35.081139');
INSERT INTO public.admin_login_logs VALUES (15, 'admin', 'BERHASIL_LOGIN', '2026-08-26 14:47:55.857761');
INSERT INTO public.admin_login_logs VALUES (16, 'admin', 'BERHASIL_LOGIN', '2026-08-26 15:02:14.580506');
INSERT INTO public.admin_login_logs VALUES (17, 'admin', 'BERHASIL_LOGIN', '2026-08-26 15:15:32.442814');
INSERT INTO public.admin_login_logs VALUES (18, 'admin', 'BERHASIL_LOGIN', '2026-08-26 16:01:40.487161');
INSERT INTO public.admin_login_logs VALUES (19, 'admin', 'BERHASIL_LOGIN', '2026-08-27 08:16:44.093127');
INSERT INTO public.admin_login_logs VALUES (20, 'admin', 'BERHASIL_LOGIN', '2026-08-27 09:28:36.300209');
INSERT INTO public.admin_login_logs VALUES (21, 'admin', 'BERHASIL_LOGIN', '2026-08-27 10:34:17.505458');
INSERT INTO public.admin_login_logs VALUES (22, 'admin', 'BERHASIL_LOGIN', '2026-08-27 10:34:31.740344');
INSERT INTO public.admin_login_logs VALUES (23, 'admin', 'BERHASIL_LOGIN', '2026-08-27 10:37:17.375649');
INSERT INTO public.admin_login_logs VALUES (24, 'admin', 'BERHASIL_LOGIN', '2026-08-27 11:01:18.967012');
INSERT INTO public.admin_login_logs VALUES (25, 'admin', 'BERHASIL_LOGIN', '2026-08-28 13:48:02.175259');
INSERT INTO public.admin_login_logs VALUES (26, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:22:44.156707');
INSERT INTO public.admin_login_logs VALUES (27, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:23:00.407019');
INSERT INTO public.admin_login_logs VALUES (28, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:23:40.580923');
INSERT INTO public.admin_login_logs VALUES (29, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:23:40.720129');
INSERT INTO public.admin_login_logs VALUES (30, 'jar', 'BERHASIL_LOGIN', '2026-08-28 14:23:40.798254');
INSERT INTO public.admin_login_logs VALUES (31, 'k3l_kam', 'BERHASIL_LOGIN', '2026-08-28 14:23:40.84829');
INSERT INTO public.admin_login_logs VALUES (32, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:24:58.412365');
INSERT INTO public.admin_login_logs VALUES (33, 'admin', 'GAGAL_PASSWORD_SALAH', '2026-08-28 14:30:50.973999');
INSERT INTO public.admin_login_logs VALUES (34, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:31:13.184689');
INSERT INTO public.admin_login_logs VALUES (35, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:32:24.789378');
INSERT INTO public.admin_login_logs VALUES (36, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:33:51.669363');
INSERT INTO public.admin_login_logs VALUES (37, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:37:46.248529');
INSERT INTO public.admin_login_logs VALUES (38, 'jar', 'BERHASIL_LOGIN', '2026-08-28 14:41:59.543818');
INSERT INTO public.admin_login_logs VALUES (39, 'k3l_kam', 'BERHASIL_LOGIN', '2026-08-28 14:42:36.454649');
INSERT INTO public.admin_login_logs VALUES (40, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:43:37.446184');
INSERT INTO public.admin_login_logs VALUES (41, 'k3l_kam', 'BERHASIL_LOGIN', '2026-08-28 14:44:07.109266');
INSERT INTO public.admin_login_logs VALUES (42, 'pku', 'BERHASIL_LOGIN', '2026-08-28 14:48:51.237095');
INSERT INTO public.admin_login_logs VALUES (43, 'admin', 'BERHASIL_LOGIN', '2026-08-28 14:50:18.926274');
INSERT INTO public.admin_login_logs VALUES (44, 'admin', 'BERHASIL_LOGIN', '2026-08-28 15:26:07.679521');
INSERT INTO public.admin_login_logs VALUES (45, 'pku', 'GAGAL_PASSWORD_SALAH', '2026-08-28 15:30:17.790449');
INSERT INTO public.admin_login_logs VALUES (46, 'pku', 'BERHASIL_LOGIN', '2026-08-28 15:30:26.201461');
INSERT INTO public.admin_login_logs VALUES (47, 'jar', 'BERHASIL_LOGIN', '2026-08-28 15:31:32.331463');
INSERT INTO public.admin_login_logs VALUES (48, 'pku', 'BERHASIL_LOGIN', '2026-08-28 16:00:08.254893');
INSERT INTO public.admin_login_logs VALUES (49, 'admin', 'BERHASIL_LOGIN', '2026-08-28 16:02:59.742603');
INSERT INTO public.admin_login_logs VALUES (50, 'admin', 'BERHASIL_LOGIN', '2026-08-28 16:13:35.433827');
INSERT INTO public.admin_login_logs VALUES (51, 'admin', 'BERHASIL_LOGIN', '2026-08-31 08:01:44.346546');
INSERT INTO public.admin_login_logs VALUES (52, 'admin', 'BERHASIL_LOGIN', '2026-08-31 08:42:14.962675');
INSERT INTO public.admin_login_logs VALUES (53, 'admin', 'BERHASIL_LOGIN', '2026-08-31 10:42:05.394166');
INSERT INTO public.admin_login_logs VALUES (54, 'jar', 'BERHASIL_LOGIN', '2026-08-31 14:19:11.642404');
INSERT INTO public.admin_login_logs VALUES (55, 'admin', 'BERHASIL_LOGIN', '2026-08-31 14:20:49.835635');
INSERT INTO public.admin_login_logs VALUES (56, 'k3l_kam', 'BERHASIL_LOGIN', '2026-08-31 14:43:27.997676');
INSERT INTO public.admin_login_logs VALUES (57, 'admin', 'BERHASIL_LOGIN', '2026-08-31 14:44:44.962011');
INSERT INTO public.admin_login_logs VALUES (58, 'admin', 'BERHASIL_LOGIN', '2026-09-01 08:03:12.073479');
INSERT INTO public.admin_login_logs VALUES (59, 'jar', 'BERHASIL_LOGIN', '2026-09-01 08:11:50.895422');
INSERT INTO public.admin_login_logs VALUES (60, 'admin', 'BERHASIL_LOGIN', '2026-09-01 08:24:57.252409');


--
-- TOC entry 5073 (class 0 OID 74553)
-- Dependencies: 230
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admin_users VALUES (1, 'admin', 'admin123', 'Administrator SDM & Diklat', 'admin', '2026-08-28 13:48:02.162427', '2026-08-26 10:06:25.117865');


--
-- TOC entry 5071 (class 0 OID 74541)
-- Dependencies: 228
-- Data for Name: master_grey_area; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_grey_area VALUES (1, 'GA001', 'Asuransi Direksi & Pajak Direksiosiali', 'Grey Area', 'Tidak dapat diberikan karena substansi sama dengan asuransi dan pajak pegawai yg NAC');
INSERT INTO public.master_grey_area VALUES (2, 'GA002', 'Bahan Bakar Minyak Kendaraan Selain Kendaraan Pool', 'Grey Area', '*Dapat diberikan sepanjang dpt dipisahkan utk kegiatan kedinasan utama namun tidak utk kegiatan internal/kenikmatan pegawai/tamu');
INSERT INTO public.master_grey_area VALUES (3, 'GA003', 'Bahan Makanan dan Konsumsi Kegiatan Swakelola', 'Grey Area', '*Dapat diberikan sepanjang utk kegiatan kedinasan utama seperti kegiatan penertiban P2TL/penebangan pohon');
INSERT INTO public.master_grey_area VALUES (4, 'GA004', 'Bantuan Dana Sponsorship', 'Proporsional (PR 80%)', 'Tidak dapat diberikan. Kegiatan yang ditujukan untuk membangun corp image/sosial/keagamaan. Jika dapat diberikan dengan biaya CSR yang notabene bukan BPP. Karena keg CSR sebenarnya kegiatan dalam membangun hubungan bermasyarakat/bersosialisasi baik kedalam atau keluar perusahaan.');
INSERT INTO public.master_grey_area VALUES (5, 'GA005', 'Cinderamata Pegawai Mutasi & Pensiun', 'Grey Area', 'Bersifat seremonial');
INSERT INTO public.master_grey_area VALUES (6, 'GA006', 'Cleaning Service Gedung Kantor', 'Proporsional (PR 10%)', 'Dapat diberikan secara proporsional 10% (NAC 10%) proporsi untuk taman/toilet/tempat ibadah');
INSERT INTO public.master_grey_area VALUES (7, 'GA007', 'Ekstra Fooding Operator & Pemeliharaan', 'Grey Area', 'Dapat diberikan hanya utk dispatcher atau saat kegiatan pemeliharaan berlangsung, tidak utk keg rapat/koordinasi');
INSERT INTO public.master_grey_area VALUES (8, 'GA008', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)', 'Grey Area', 'Tidak dapat diberikan karena tidak terkait dengan kelistrikan');
INSERT INTO public.master_grey_area VALUES (9, 'GA009', 'Honor Instruktur Olahraga', 'Grey Area', 'SBO');
INSERT INTO public.master_grey_area VALUES (10, 'GA010', 'Honor Penceramah', 'Grey Area', 'SBO');
INSERT INTO public.master_grey_area VALUES (11, 'GA011', 'Iklan, Brosur, Banner, Spanduk dan Umbul-umbul', 'Proporsional (PR 80%)', 'Dapat Diberikan jika berhubungan dgn informasi program/layanan kelistrikan dengan Proporsi 80%. Namun jika berhubungan dgn corp image/sosial/keagamaan/seremonial tidak dapat diberikan.');
INSERT INTO public.master_grey_area VALUES (12, 'GA012', 'In House Training', 'Grey Area', 'Dapat diberikan sepanjang topiknya terkait kelistrikan bukan kegiatan penunjang (english speaker, 5S, 4D)');
INSERT INTO public.master_grey_area VALUES (13, 'GA013', 'Iuran Pemberi Kerja BPJS Jaminan Pensiun', 'Grey Area', 'Tidak dapat diberikan karena dobel dengan biaya manfaat pekerja - Aktuaris yang menjadi BPP');
INSERT INTO public.master_grey_area VALUES (14, 'GA014', 'Jasa & Material Kendaraan Bermotor', 'Grey Area', 'Dapat diberikan sepanjang bukan kendaraan COP/menambah/memperbaiki aksesoris, interior dan eksterior mobil');
INSERT INTO public.master_grey_area VALUES (15, 'GA015', 'Jasa Borongan Alih Daya - Khusus Komponen BPJS', 'Grey Area', 'Dapat diberikan bukan NAC');
INSERT INTO public.master_grey_area VALUES (16, 'GA016', 'Keamanan', 'Proporsional (PR 10%)', 'Dapat diberikan dengan proporsi sebesar 10%');
INSERT INTO public.master_grey_area VALUES (17, 'GA017', 'CCTV', 'Grey Area', 'AC jika di kompleks ovitnas, ovitsus, dan lingkungan kantor, NAC jika berada di kantin, rumah ibadah dan taman');
INSERT INTO public.master_grey_area VALUES (18, 'GA018', 'Kegiatan K3L / Profer / Lingkungan', 'Grey Area', 'Dapat diberikan utk kompleks pembangkit/GI/transmisi/obvitnas namun tidak utk seromonial seperti upacara/peringatan. Biaya pelatihan dapat diberikan sepanjang tdk terkait dgn NAC seperti makan dan minum');
INSERT INTO public.master_grey_area VALUES (19, 'GA019', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga', 'Grey Area', 'Tidak dapat diberikan karena termasuk kegiatan sosial/keagamaan/seremonial dalam membangun hubungan bermasyarakat/bersosialisasi baik kedalam atau keluar perusahaan.');
INSERT INTO public.master_grey_area VALUES (20, 'GA020', 'Kegiatan Hari Besar (HLN, Nasional, Keagamaan)', 'Grey Area', 'Tidak dapat diberikan karena kegiatan seremonial yang ditujukan untuk membangun corp image/sosial/keagamaan.');
INSERT INTO public.master_grey_area VALUES (21, 'GA021', 'Kelengkapan Halaman / Pengecatan Pagar dan Lapangan', 'Grey Area', 'Kelengkapan halaman dapat diberikan jika berhub dgn K3 Pembangkit/Gi/transmisi/obvitnas. Utk pengecatan dan lapangan tdk dapat diberikan');
INSERT INTO public.master_grey_area VALUES (22, 'GA022', 'Knowlegde Management (Inovasi, KS)', 'Grey Area', 'Tidak dapat diberikan jika topik terkait manajemen orang, aset tidak langsung, kinerja unit/satker.');
INSERT INTO public.master_grey_area VALUES (23, 'GA023', 'Komunikasi (Prabayar, Pascabayar, Internet, HP)', 'Proporsional (PR 29%)', 'Dapat diberikan secara proporsional berhubungan dgn pekerjaan (29%) atau hanya utk bagian dispatcher/call center (NAC 29%)');
INSERT INTO public.master_grey_area VALUES (24, 'GA024', 'Konsultasi Hukum', 'Grey Area', 'Dpt diberikan jika permasalahan kedinasan terkait pembangunan SUTT/GI/pembangkit dengan valuasi yg sesuai diatur oleh Perpres namun jika terkait kasus pidana atau kelalaian pegwai seperti tipikor/pengembangan OTT/bentuk pidana lainnya tidak dapat diberikan');
INSERT INTO public.master_grey_area VALUES (25, 'GA025', 'Pembelian Pakaian (Pakaian Operator, Pemeliharaan, Jaket)', 'Grey Area', 'hanya dapat diberikan untuk APD, tidak untuk seragam dinas/olahraga/jaket');
INSERT INTO public.master_grey_area VALUES (26, 'GA026', 'Pengelolaan Pelanggan', 'Grey Area', 'Dapat diberikan sepanjang substansinya bukan NAC/seremonial/SBO');
INSERT INTO public.master_grey_area VALUES (27, 'GA027', 'Pengharum Ruangan Kantor', 'Grey Area', 'Tidak dapat diberikan karena tidak termasuk perlengkapan umum kelistrikan pada pembangkit/GI/transmisi');
INSERT INTO public.master_grey_area VALUES (28, 'GA028', 'Penyemperotan Hama', 'Grey Area', 'Tidak dapat diberikan atau dapat diberikan jika hama tdk dibasmi berdampak langsung pada gangguan fungsi/trip peralatan/aset kelistrikan');
INSERT INTO public.master_grey_area VALUES (29, 'GA029', 'Penyusutan Aktiva Tetap Hibah', 'Grey Area', 'Tidak dapat diberikan karena perolehan bukan dari pengadaan PLN');
INSERT INTO public.master_grey_area VALUES (30, 'GA030', 'Penyusutan Aset Non Operasi', 'Grey Area', 'Tidak dapat diberikan sepanjang aset rusak/proses penghapusbukuan. Terkait isu utilisasi dpt diteruskan/didalami dalam Temuan Audit');
INSERT INTO public.master_grey_area VALUES (31, 'GA031', 'Analisa Cuaca BMKG, BNPB', 'Grey Area', 'Tidak dapat diberikan karena tidak berhubungan dengan penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (32, 'GA032', 'Anti Petir (Aula, Kantin, Ruang Arsip)', 'Grey Area', 'Dapat diberikan jika berhubungan dgn Gedung Kantor, Unit Layanan, Transmisi, GI dan Pembangkit untuk pengamanan aset dimasukan AC');
INSERT INTO public.master_grey_area VALUES (33, 'GA033', 'APAR (Aula, Kantin, Ruang Arsip, Dapur)', 'Grey Area', 'Dapat diberikan jika APAR berhubungan dgn Gedung Kantor, Unit Layanan, Transmisi, GI dan Pembangkit untuk pengamanan aset dimasukan AC');
INSERT INTO public.master_grey_area VALUES (34, 'GA034', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Figura)', 'Grey Area', 'AC jika terkait dengan K3, Kelistrikan, Pelayan Pelanggan, NAC jika terkait dengan seremonial, kalender dan sejenisnya');
INSERT INTO public.master_grey_area VALUES (35, 'GA035', 'Beban penyusutan Aset Tetap yang habis masa manfaatnya', 'Grey Area', 'Sesuai PMK 20/2025');
INSERT INTO public.master_grey_area VALUES (36, 'GA036', 'SPONSORSHIP', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (37, 'GA037', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)', 'Grey Area', 'AC jika terkait peningkatan penjualan, NAC jika terkait konsumsi dan seremonial');
INSERT INTO public.master_grey_area VALUES (38, 'GA038', 'Ekspedisi/Pengiriman Dokumen', 'Grey Area', 'AC jika terkait TLSK, NAC jika terkait pengiriman makanan, dokumen kalender dan kegiatan tidak terkait ketenagalistrikan lainnya');
INSERT INTO public.master_grey_area VALUES (39, 'GA039', 'Fee Informan P2TL', 'Grey Area', 'Terkait informan P2TL');
INSERT INTO public.master_grey_area VALUES (40, 'GA040', 'Gedung Arsip, Aula, Kantin, Area Parkir, Toilet', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (41, 'GA041', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)', 'Grey Area', 'AC jika terkait ketenagalistrikan / NAC jika tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (42, 'GA042', 'Kendaraan Dinas (Cusi, Aksesoris, interior)', 'Grey Area', 'NAC jika terkait Aksesoris tambahan, cuci steam');
INSERT INTO public.master_grey_area VALUES (43, 'GA043', 'Laundry', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (44, 'GA044', 'Legalisasi Dokumen, Sertifikat', 'Grey Area', 'Dapat diberikanj jika berkaitan penyediaan ketenagalistrikan, seperti Sertifikasi Tanah');
INSERT INTO public.master_grey_area VALUES (45, 'GA045', 'Lounge Bandara/Staisun/Terminal/Pelabuhan', 'Grey Area', 'NAC jika terkait penjamuan tamu');
INSERT INTO public.master_grey_area VALUES (46, 'GA046', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)', 'Grey Area', 'NAC karena bukan pegawai');
INSERT INTO public.master_grey_area VALUES (47, 'GA047', 'Pagar, Halaman, Jalan', 'Proporsional (PR 20%)', 'Diberikan dengan proporsi (NAC 20%)');
INSERT INTO public.master_grey_area VALUES (48, 'GA048', 'Parkir dan Tol', 'Grey Area', 'NAC jika terkait penjamuan tamu undangan / AC jika terkait penanganan gangguan dan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (49, 'GA049', 'Paspor/Visa', 'Grey Area', 'Tidak dapat diberikan');
INSERT INTO public.master_grey_area VALUES (50, 'GA050', 'Pembasmian Hama', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (51, 'GA051', 'Penyesuaian Tahun Lalu', 'Grey Area', 'Penyesuaian tahun lalu AC jika terkait ketenagalistrikan dan maksimal 1 tahun buku sebelumnya / NAC jika tidak terkait ketenagalistrikan dan di atas satu tahun buku');
INSERT INTO public.master_grey_area VALUES (52, 'GA052', 'Penyusutan Aktiva Tetap Rusak', 'Grey Area', 'Tidak menghasilkan/menyalurkan tenagalistrik');
INSERT INTO public.master_grey_area VALUES (53, 'GA053', 'Penyusutan Aktiva Tetap Tidak Beroperasi', 'Grey Area', 'Tidak menghasilkan/menyalurkan tenagalistrik');
INSERT INTO public.master_grey_area VALUES (54, 'GA054', 'Perabotan dan Perlengkapan Kantor/Dapur/Toilet', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (55, 'GA055', 'PPH 26 Bank Loan', 'Grey Area', 'nan');
INSERT INTO public.master_grey_area VALUES (56, 'GA056', 'Rapat Koordinasi Non Penyedian Ketenaga Listrikan', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (57, 'GA057', 'Rapat Koordinasi Penyedian Ketenaga Listrikan', 'Proporsional (PR 21%)', 'Diberikan dengan proporsi (NAC 21%)');
INSERT INTO public.master_grey_area VALUES (58, 'GA058', 'Renovasi Ruang Kerja dan Ruang Pendukung Lainnya', 'Proporsional (PR 20%)', 'Diberikan dengan proporsi (NAC20%)');
INSERT INTO public.master_grey_area VALUES (59, 'GA059', 'Retribusi (Lingkungan, Sampah)', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (60, 'GA060', 'Sarana dan Fasilitas GM/Manager', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (61, 'GA061', 'Sarana Rumah Ibadah', 'Grey Area', 'Tidak dapat diberikan karena SBO tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (62, 'GA062', 'Seleksi Pra Kuliah dan Wisuda', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan, Wisuda bersifat seremonial');
INSERT INTO public.master_grey_area VALUES (63, 'GA063', 'Seremonial K3L/Proper/Lingkungan', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (64, 'GA064', 'Sewa Kendaraan', 'Proporsional (PR 29%)', 'Diberikan dengan Proporsi (NAC 29%)');
INSERT INTO public.master_grey_area VALUES (65, 'GA065', 'Smartwatch, Tablet', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (66, 'GA066', 'Sponsorhip', 'Proporsional (PR 80%)', 'Diberikan dengan proporsi (NAC 80%)');
INSERT INTO public.master_grey_area VALUES (67, 'GA067', 'SPPD Diklat/Non Diklat', 'Proporsional (PR 21%)', 'Diberikan dengan proporsi untuk konsumsi (NAC 21%)');
INSERT INTO public.master_grey_area VALUES (68, 'GA068', 'SPPD Driver/Lembur', 'Proporsional (PR 10%)', 'Diberikan dengan proporsi (NAC 10%)');
INSERT INTO public.master_grey_area VALUES (69, 'GA069', 'SPPD Non BPP', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (70, 'GA070', 'Stakeholder Management', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan, hanya bersifat seremonial managemen');
INSERT INTO public.master_grey_area VALUES (71, 'GA071', 'Survey Kepuasan Pelanggan', 'Grey Area', 'Tidak terkait ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (72, 'GA072', 'Tagihan PDAM dan Token Mess/Rumah Dinas (Listrik, Air, Gas)', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan, hanya bersifat pendukung fasilitas kantor');
INSERT INTO public.master_grey_area VALUES (73, 'GA073', 'Taman/Kolam Ikan/Aquarium', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan, hanya bersifat pendukung/penghias ruangan/kantor');
INSERT INTO public.master_grey_area VALUES (74, 'GA074', 'Tax Allowance', 'Grey Area', 'Justifikasi BPK');
INSERT INTO public.master_grey_area VALUES (75, 'GA075', 'TJSL, CSR', 'Grey Area', 'Tidak dapat diberikan karena tidak menjadi bagian penyediaan ketenagalistrikan');
INSERT INTO public.master_grey_area VALUES (76, 'GA076', 'Pendapatan Denda Pembelian Listrik Swasta', 'Grey Area', 'Tidak dapat diberikan karena pembelian TL swasta merupakan BPP. Terkait isu optimalisasi dpt diteruskan/didalami dalam Temuan Audit');
INSERT INTO public.master_grey_area VALUES (77, 'GA077', 'Pendapatan Denda Penalti kWh Mampu', 'Grey Area', 'Dapat diberikan');
INSERT INTO public.master_grey_area VALUES (78, 'GA078', 'Pendapatan Denda SFC Sewa Pembangkit', 'Grey Area', 'Tidak dpt diberikan karena ada biaya penyediaan bahan bakar dan timbulnya tambahan biaya penyediaan bahan bakar yang dikeluarkan sehingga pendapatan tersebut digunakan untuk menutupi biaya/tambahan biaya');
INSERT INTO public.master_grey_area VALUES (79, 'GA079', 'Pendapatan Denda SPK/Non Reklis', 'Grey Area', 'Tidak dapat diberikan karena seluruh biaya/nilai pengadaan dibebankan ke negara dan ada tambahan biaya yang harus dikeluarkan untuk mengatasi keterlambatan atau ketiadaan barang/jasa yang dimaksud');
INSERT INTO public.master_grey_area VALUES (80, 'GA080', 'Pendapatan Jasa Lain', 'Grey Area', 'Tidak dapat diberikan kecuali pengadaannya bukan BPP');
INSERT INTO public.master_grey_area VALUES (81, 'GA081', 'Pendapatan Klaim Asuransi', 'Grey Area', 'Tidak dapat diberikan karena perbaikannya sudah dihitung BPP');
INSERT INTO public.master_grey_area VALUES (82, 'GA082', 'Pendapatan Penalti Pegawai Berhenti', 'Grey Area', 'Tidak dapat diberikan karena P1 s.d P3 ditanggung atau diproporsionalkan dengan penghasilan yg diterima/perekrutan');
INSERT INTO public.master_grey_area VALUES (83, 'GA083', 'Pendapatan Pencairan Bank Garansi', 'Grey Area', 'Tidak dapat diberikan karena
  1. Terdapat biaya konstruksi/pengadaan yang telah keluar atas pekerjaan yang terhenti/gagal
  2. Tujuan kegiatan tersebut tidak tercapai berpotensi terjadi pemborosan/ketidakhematan BPP
  3. Uang yang diterima dari BG tersebut telah digunakan untuk kegiatan BPP yg jika diberikan akan dobel dgn penghitungan BPP di akhir tahun.');
INSERT INTO public.master_grey_area VALUES (84, 'GA084', 'Pendapatan Penjualan Aset Tetap', 'Grey Area', 'Tidak dapat diberikan jika biaya penyusutan aset tetap termasuk BPP (Non properti, ATTB, dan sebagainya)');
INSERT INTO public.master_grey_area VALUES (85, 'GA085', 'Pendapatan Penjualan Dokumen Tender', 'Grey Area', 'Tidak dapat diberikan karena seluruh biaya/nilai perencanaan dan pengadaan dibebankan ke negara seperti biaya konsultan perencana/FS/publikasi di media cetak');
INSERT INTO public.master_grey_area VALUES (86, 'GA086', 'Pendapatan Penjualan Limbah', 'Grey Area', 'Dapat diberikan sebagai insentif kepada PLN');
INSERT INTO public.master_grey_area VALUES (87, 'GA087', 'Pendapatan PFK', 'Grey Area', 'Dapat diberikan');
INSERT INTO public.master_grey_area VALUES (88, 'GA088', 'Pendapatan Sewa Aktiva Tetap', 'Grey Area', 'Dapat diberikan sepanjang dapat teridentifikasi seluruh biaya biaya yang timbul dari sejak aset diperoleh.');
INSERT INTO public.master_grey_area VALUES (89, 'GA089', 'Pendapatan Hibah Pihak Ketiga', 'Proporsional (PR 5%)', 'Proporsi 5% sebagai penggangi biaya pengurusan hibah yang sudah jadi BPP');
INSERT INTO public.master_grey_area VALUES (90, 'GA090', 'Pendapatan Lain-Lain', 'Grey Area', 'csr');


--
-- TOC entry 5069 (class 0 OID 74527)
-- Dependencies: 226
-- Data for Name: master_jenis_biaya; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_jenis_biaya VALUES (1, '5.2 Jasa Pembelajaran, asesmen dan sertifikasi', 'JASA');
INSERT INTO public.master_jenis_biaya VALUES (2, '5.2 Laboratorium', 'LAB');
INSERT INTO public.master_jenis_biaya VALUES (3, '5.2 Aplikasi', 'APL');
INSERT INTO public.master_jenis_biaya VALUES (4, '5.2 Honor Instruktur', 'INST');
INSERT INTO public.master_jenis_biaya VALUES (5, '5.2 Honor Instruktur Workshop', 'INSTWS');
INSERT INTO public.master_jenis_biaya VALUES (6, '5.2 Honor Penyusun Materi dan Modul', 'MATERI');
INSERT INTO public.master_jenis_biaya VALUES (7, '5.2 Honor Penyusun Studi Kasus', 'STUDI');
INSERT INTO public.master_jenis_biaya VALUES (8, '5.2 Honor/Jasa Narasumber, Narasumber Penyusun Materi dan Narasumber Modul', 'NARSUM');
INSERT INTO public.master_jenis_biaya VALUES (9, '5.2 honor pembimbing pembelajaran kepemimpinan dan prajabatan', 'MENTOR');
INSERT INTO public.master_jenis_biaya VALUES (10, '5.2 honor coach', 'COACH');
INSERT INTO public.master_jenis_biaya VALUES (11, '5.2 honor MC', 'MC');
INSERT INTO public.master_jenis_biaya VALUES (12, '5.2 Honor honor penguji kepemimpinan dan prajabatan', 'UJI');
INSERT INTO public.master_jenis_biaya VALUES (13, '5.2 Realisasi honor koordinator P B K', 'KOORD');
INSERT INTO public.master_jenis_biaya VALUES (14, '5.2 Honor Asesor', 'ASESOR');
INSERT INTO public.master_jenis_biaya VALUES (15, '5.2 Pembinaan Fisik Karakter (PFK)', 'PFK');
INSERT INTO public.master_jenis_biaya VALUES (16, '5.2 Pengenalan Perusahaan (PP)', 'PP');
INSERT INTO public.master_jenis_biaya VALUES (17, '5.2 Pembidangan', 'BID');
INSERT INTO public.master_jenis_biaya VALUES (18, '5.2 On The Job Training', 'OJT');
INSERT INTO public.master_jenis_biaya VALUES (19, '5.2 Perjalanan Rohani', 'ROHANI');
INSERT INTO public.master_jenis_biaya VALUES (20, '5.2 Uang Saku Prajab', 'SAKU');
INSERT INTO public.master_jenis_biaya VALUES (21, '5.2 Bantuan Hari Raya Keagamaan Prajab', 'BHRK');
INSERT INTO public.master_jenis_biaya VALUES (22, '5.2 Restitusi Kesehatan', 'SEHAT');
INSERT INTO public.master_jenis_biaya VALUES (23, '5.2 Project Team Leader', 'PTL');
INSERT INTO public.master_jenis_biaya VALUES (24, '5.2 Roleplayer', 'RLP');
INSERT INTO public.master_jenis_biaya VALUES (25, '5.2 Petugas Kelas', 'PTG');
INSERT INTO public.master_jenis_biaya VALUES (26, '5.2 SBO', 'SBO');
INSERT INTO public.master_jenis_biaya VALUES (27, '5.2 BFKO', 'BFKO');
INSERT INTO public.master_jenis_biaya VALUES (28, '5.2 Lainnya', 'LAIN');
INSERT INTO public.master_jenis_biaya VALUES (29, '5.2 Enterpreneur', 'ENT');
INSERT INTO public.master_jenis_biaya VALUES (31, '5.2 Honor ADMIN', 'ADMIN');
INSERT INTO public.master_jenis_biaya VALUES (32, '5.2 Honor Konsultan', 'KNSLTN');
INSERT INTO public.master_jenis_biaya VALUES (33, '5.2 Retribusi PNBP', 'PNBP');
INSERT INTO public.master_jenis_biaya VALUES (34, '5.2 Honor Pembuatan Materi DIGITAL', 'MATDIG');
INSERT INTO public.master_jenis_biaya VALUES (35, '5.2 Apresiasi TIM Inovasi/Budaya', 'APRE');
INSERT INTO public.master_jenis_biaya VALUES (36, 'Tanggun Jawab Sosial Lingkungan', 'TJSL');
INSERT INTO public.master_jenis_biaya VALUES (37, '5.3 Alih Daya', 'ALIH');
INSERT INTO public.master_jenis_biaya VALUES (38, '5.3 Non Rutin', 'NON');
INSERT INTO public.master_jenis_biaya VALUES (39, '5.3 BBM', 'BBM');
INSERT INTO public.master_jenis_biaya VALUES (40, '5.3 Teknologi Informasi', 'IT');
INSERT INTO public.master_jenis_biaya VALUES (41, '5.3 K 3', 'KIII');
INSERT INTO public.master_jenis_biaya VALUES (42, '5.3 K3 Keamanan', 'KAM');
INSERT INTO public.master_jenis_biaya VALUES (43, '5.3 K3 Lingkungan Hidup', 'LH');
INSERT INTO public.master_jenis_biaya VALUES (44, '5.3 Pemeliharaan Rutin', 'RUTIN');
INSERT INTO public.master_jenis_biaya VALUES (45, '5.4 Honorarium', 'HONOR');
INSERT INTO public.master_jenis_biaya VALUES (46, '5.4 Pemakaian Perkakas & Peralatan', 'ALAT');
INSERT INTO public.master_jenis_biaya VALUES (47, '5.4 Perjalanan Dinas Non Diklat', 'SPPD');
INSERT INTO public.master_jenis_biaya VALUES (48, '5.4 Teknologi Informasi', 'TI');
INSERT INTO public.master_jenis_biaya VALUES (49, '5.4 Teknologi Informasi dgn Anak Perusahaan', 'TIAP');
INSERT INTO public.master_jenis_biaya VALUES (50, '5.4 Listrik, Gas dan Air', 'LGA');
INSERT INTO public.master_jenis_biaya VALUES (51, '5.4 Listrik, gas dan air dengan Anak Perusahaan', 'LGAP');
INSERT INTO public.master_jenis_biaya VALUES (52, '5.4 Pos & Telekomunikasi', 'POSTEL');
INSERT INTO public.master_jenis_biaya VALUES (53, '5.4 Beban Bank', 'BANK');
INSERT INTO public.master_jenis_biaya VALUES (54, '5.4 Bahan Makanan & Konsumsi', 'KONS');
INSERT INTO public.master_jenis_biaya VALUES (55, '5.4 Alat dan Keperluan Kantor', 'ATK');
INSERT INTO public.master_jenis_biaya VALUES (56, '5.4 Barang Cetakan dan Penerbitan', 'CETAK');
INSERT INTO public.master_jenis_biaya VALUES (57, '5.4 Pajak dan Retribusi', 'PAJAK');
INSERT INTO public.master_jenis_biaya VALUES (58, '5.4 Iuran, Abodemen & Iklan', 'IURAN');
INSERT INTO public.master_jenis_biaya VALUES (59, '5.4 Beban Amortisasi', 'AMOR');
INSERT INTO public.master_jenis_biaya VALUES (30, '5.2 SARANA PEMBELAJARAN (untuk biaya konsumsi, transportasi, laundry, cetakan, ATK, perkakas, Hotel)', 'SARJAR');


--
-- TOC entry 5065 (class 0 OID 74483)
-- Dependencies: 222
-- Data for Name: master_keyword; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_keyword VALUES (1, 'coc', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (2, 'EMBER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (3, 'rd', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (4, 'Spons', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (5, 'tamu', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (6, 'amanan rw', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (7, 'beli buah', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (8, 'HPN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (9, 'kabar', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (10, 'LOLAADM', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (11, 'naman pohon', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (12, 'rohani', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (13, 'souv', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (14, ',EMBER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (15, '/5S GI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (16, '000171101705122 PPN Put 06-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (17, '000191101705122 PPN Dalam Negeri 02-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (18, '000211101705122 PPN Put 03-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (19, '000221101705122 PPN Put 02-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (20, '000241101705122 PPN Dalam Negeri 04-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (21, '000271101705122 PPN Put 12-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (22, '000281101705122 PPN Put 08-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (23, '000291101705122 PPN Put 09-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (24, '000311101705122 PPN Put 01-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (25, '000321101705122 PPN Dalam Negeri 03-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (26, '000331101705122 PPh Pasal 23 12-2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (27, '004.PJ/17', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (28, '019.PJ/DAN.02.02/UPT DKSI/2019', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (29, '159.PJ/DAN.02.02/APP DKSI/2017', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (30, '17an', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (31, '2021 Nota Depre', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (32, '3101404361 Support PLN on G20 Carbon Ne2', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (33, '3101495281 Js Dukungan PLN Net Zero', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (34, '3101495281 Js Dukungan PLN Net Zero T2', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (35, '3101495281 Js Dukungan PLN Net Zero T3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (36, '3DModelling', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (37, '5489. KOREKSI BEBAN THN LALU 0491/2019 PT TRILISTR', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (38, '5R/5S', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (39, '5S GUD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (40, 'Abonemen MNC Vision', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (41, 'ACARA KEMENTERIAN BUMN FIBA', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (42, 'Acara Konsolidasi Komunikasi', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (43, 'ACARA RAMAH TA', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (44, 'AcaraHLN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (45, 'ACRYLIC', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (46, 'ActionLea', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (47, 'adeging', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (48, 'Advertising', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (49, 'aerocol', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (50, 'agenda  BUMN', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (51, 'AgendaSettingBUMN', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (52, 'Air Fryer Rudin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (53, 'air kemasan', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (54, 'air mineral', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (55, 'air minum', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (56, 'airulang', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (57, 'akhlak', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (58, 'AKMDSSTKHLDR', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (59, 'AKMDSWS', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (60, 'Akom&kons penjurian marketing', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (61, 'AKOMKON', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (62, 'Akomodasi Media', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (63, 'AKOMODASIACARA', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (64, 'AKOMODASIFGD', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (65, 'akomodasiForumInstruktur', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (66, 'AKOMODASIGM', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (67, 'AkomodasiMagang', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (68, 'AKOMODASIMEETING', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (69, 'AKOMODASISTEI', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (70, 'AKOMODASITWMT', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (71, 'AKOMODASIWS', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (72, 'akrilik', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (73, 'AKRILIK', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (74, 'AKRLCS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (75, 'aksesoriskabelcolokan', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (76, 'ALAS KAKI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (77, 'ALAT PEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (78, 'AlatFitnes', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (79, 'ALIHDAYACWG', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (80, 'Alihdaya Pengamanan UIT', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1055, 'PERALATANKECIL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (81, 'ALIHDAYA PG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (82, 'ALILAHOTEL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (83, 'AMPLIKREATIF', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (84, 'AMPLIPERS', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (85, 'ANGGARANPIISTRI', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (86, 'ANTIGORES', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (87, 'ANTIS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (88, 'APLIKASISHEET', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (89, 'APPRENTICE FOR TALENT', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (90, 'APRESIASI', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (91, 'apresiasi', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (92, 'aqua', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (93, 'Arang', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (94, 'ArsipBox', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (95, 'ARTCARTON', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (96, 'ARTINTELIGENCE', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (97, 'ARTIKEL', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (98, 'askreat des Pub', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (99, 'ASMEBOOKS', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (100, 'ASRAMAMENTARIMITRA', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (101, 'ASSESMENTIPEA', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (102, 'ASSESSMENT', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (103, 'Asuransi', 'Asuransi Pegawai (Selain Akun 6105201000)');
INSERT INTO public.master_keyword VALUES (104, 'ASURANSIPURNAJABATAN', 'Asuransi Pegawai (Selain Akun 6105201000)');
INSERT INTO public.master_keyword VALUES (105, 'ASURASIPURNAJABATAN', 'Asuransi Pegawai (Selain Akun 6105201000)');
INSERT INTO public.master_keyword VALUES (106, 'AUDIO', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (107, 'award', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (108, 'B.MNGMNT', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (109, 'BACKDROP', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (110, 'BACKDROP', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (111, 'backdrop', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (112, 'BADMINTON', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (113, 'BAGIANT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (114, 'bahasa inggris', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (115, 'BAHASAINGGRIS', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (116, 'Baju', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (117, 'Baju', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (118, 'BAJU', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (119, 'baju adat', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (120, 'BAK SAMPAH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (121, 'BAKTISOSIAL', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (122, 'balap sampan', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (123, 'BALONLED', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (124, 'BAN MOBIL', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (125, 'BanArco', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (126, 'BANDALAM', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (127, 'BANLUAR', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (128, 'Banner4NO', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (129, 'BannerCenterlized', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (130, 'Bantal', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (131, 'BARCODEDRIVER', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (132, 'BATERAIA3', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (133, 'BateraiAA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (134, 'BateraiABC', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (135, 'BATERAISENTER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (136, 'BATERAIULP', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (137, 'batu putih', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (138, 'BAUT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (139, 'Baygon', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (140, 'BAYGON', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (141, 'BBMMUP2K', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (142, 'BBMMUP3', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (143, 'BEAMASUK', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (144, 'BEBAN KEAMANAN GD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (145, 'BEDCOVER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (146, 'Beecara', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (147, 'BEHAVIORALTHERAPY', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (148, 'BELASUNGKAWA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (149, 'benchmar', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (150, 'Bencmark', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (151, 'Bendera', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (152, 'BENDERA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (153, 'BERITA', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (154, 'berita intern', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (155, 'BeritaOnline', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (156, 'bersama wali', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (157, 'Biaya Iklan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (158, 'Biaya Opr Divisi Hukum', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (159, 'Biaya Partisipasi DIR LHC', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (160, 'BIAYA PEMEL UP3 CKR', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (161, 'BiayaHotel', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (162, 'BiayaKirim', 'Ekspedisi / Pengiriman Dokumen');
INSERT INTO public.master_keyword VALUES (163, 'BIAYAPBJJ', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (164, 'BIBITBUNGA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (165, 'billboard', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (166, 'bincang media', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (167, 'bingkai', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (168, 'BINGKAI', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (169, 'bingkisan', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (170, 'BLUESKY', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (171, 'BLUTANGKIS', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (172, 'BNCHMARK', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (173, 'BNTEN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (174, 'Board f Advisor', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (175, 'BODMEETING', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (176, 'BOHLAM', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (177, 'BootcampInnovation', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (178, 'booth', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (179, 'BOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (180, 'BordirNamamup', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (181, 'BOTOL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (182, 'boxcb25', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (183, 'BoxCB70', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (184, 'BoxKontainer', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (185, 'BoxMakan', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (186, 'boxplastik', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (187, 'BoxShinpo', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (188, 'BPJSDIR', 'Iuran Pemberi Kerja BPJS Kesehatan, kecuali untuk TAD pada anak perusahaan (Selain Akun 6105200902)');
INSERT INTO public.master_keyword VALUES (189, 'BPKRI', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (190, 'BRACKET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (191, 'BRAND', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (192, 'BRAND,', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (193, 'BRANDING', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (194, 'Buahpotong', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (195, 'BUCKET PENGHARGAAN', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (196, 'budaya', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (197, 'BUIDCAMP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (198, 'BUILDING MANAGEMENT', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (199, 'BUILDMAN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (200, 'BukaBersama', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (201, 'BUKU SUCCESS STORY', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (202, 'BukuBerbagi', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (203, 'BUKUTAMU', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (204, 'BULAN K3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (205, 'BULANK3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (206, 'BULMAN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (207, 'BUMNdiTV', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (208, 'BungaAcara', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (209, 'BUNGAARTIF', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (210, 'BUNGADIR', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (211, 'BUNGAPREMIUM', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (212, 'burung', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (213, 'BUSINESSANALYSISFOUND', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (214, 'BY OEPRASIONAL HK', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (215, 'BY OPR DIV HK', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (216, 'Cnderamata', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (217, 'CSTMER LOYALTY', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (218, 'cableprotectormup', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (219, 'CAFE', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (220, 'Canopy', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (221, 'Canva', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (222, 'CAPBUILDING', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (223, 'CAPACITY B', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (224, 'careeducation', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (225, 'CAREFORASET', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (226, 'CARRERA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (227, 'Cartoon', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (228, 'carwash', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (229, 'CASUALMEETING', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (230, 'catbesi', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (231, 'catering', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (232, 'CC Corporate', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (233, 'CCOLIVIA REGINA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (234, 'cepos', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (235, 'ceremony', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (236, 'CERTIFIEDPROPERTYANALYST', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (237, 'CETAKSMAP', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (238, 'CETAKSPANDUK', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (239, 'CetakTUG', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (240, 'CetakanSMAP', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (241, 'CHARITY', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (242, 'CHARTERFLIGHT', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (243, 'ChemicalCleaning', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (244, 'CIGRE', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (245, 'CINDERAMATA', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (246, 'cinderamata', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (247, 'Cinderamata', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (248, 'CLEANING UID', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (249, 'CLEANING SERVICE', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (250, 'CLEANINGSERVICE', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (251, 'CleaningService', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (252, 'CLEANINGUIDJAYA', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (253, 'CleaningServWil Timur', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (254, 'Cling Wrap', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (255, 'Clingcrapplastic', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (256, 'CLINGPEMBRS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (257, 'CLOSET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (258, 'CLURIT', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (259, 'cnbc', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (260, 'Cndrmta', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (261, 'COACH PROG', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (262, 'Coaching', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (263, 'Coffee', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (264, 'Coklat', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (265, 'COKLITTNI', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (266, 'compan profile', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (267, 'CORPORATE CARD', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (268, 'CORPORATECARD', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (269, 'CORPORATEMEMBER', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (270, 'COURSEITDP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (271, 'Coversein', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (272, 'CPWMARKETING', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (273, 'CreativeContent', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (274, 'CS UTARA', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (275, 'CS WIL TIMUR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (276, 'CS2023', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (277, 'CSUID', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (278, 'CSUP2B', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (279, 'CSUPK', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (280, 'CTCMEETING', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (281, 'cuaca ekstrem', 'Analisa Cuaca BMKG, BNPB');
INSERT INTO public.master_keyword VALUES (282, 'Cuci', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (283, 'CUCI KENDARAAN', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (284, 'cuci mobil', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (285, 'CULTURETALK', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (286, 'CUSTGATH', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (287, 'CustomerIntimacy', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (288, 'dandim cup', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (289, 'Dapur', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (290, 'DAPUR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (291, 'DASHBOARDMANJ', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (292, 'DEKORASI', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (293, 'dekorasi', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (294, 'DEMOMASAK', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (295, 'DENDA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (296, 'DENDATRANSPORT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (297, 'DESATEMATIK', 'TJSL, CSR');
INSERT INTO public.master_keyword VALUES (298, 'DESAIN THINKING', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (299, 'DESAININTE', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (300, 'DESAINKORP', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (301, 'DesignGrafis', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (302, 'DesignSprint', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (303, 'DESIGNTHINKING', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (304, 'Desinfectan', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (305, 'DEWANENERGI', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (306, 'DHUAFA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (307, 'DIGITALMINDSET', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (308, 'DINASDIR', 'SPPD Non BPP');
INSERT INTO public.master_keyword VALUES (309, 'DINDINGPARTISI', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (310, 'dirgahayu', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (311, 'dirgahayu', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (312, 'disinfektan', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (313, 'DISPENSER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (314, 'DISPENSER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (315, 'DISPENSR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (316, 'Documentation', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (317, 'DokHPE', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (318, 'dolcegusto', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (319, 'Dompet', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (320, 'Doorprize', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (321, 'DOORPRIZE', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (322, 'DORPRIZE', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (323, 'DOWNLIGHT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (324, 'DPD SP PLN', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (325, 'DPR', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (326, 'DRAINAS', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (327, 'DryClean', 'Laundry');
INSERT INTO public.master_keyword VALUES (328, 'DTSCIENCE', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (329, 'DukaCita', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (330, 'DUVET MES', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (331, 'EcoBottle', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (332, 'ECONINDUSTOUTLOOK', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (333, 'EDUKASI INTERNAL', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (334, 'EILTS PREDICTION TEST', 'Seleksi Pra Kuliah');
INSERT INTO public.master_keyword VALUES (335, 'ekfood', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (336, 'ELPIGI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (337, 'EMBER,', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (338, 'EmployeGathering', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (339, 'EMPOWERCAPABBUILD', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (340, 'EMPOWERING MANAGER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (341, 'energy outlook', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (342, 'ENGAGEMENTPELANGGAN', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (343, 'EngagmentHTD', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (344, 'ENGKRAK', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (345, 'English', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (346, 'Enterpreneur Milenials', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (347, 'EOFGD', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (348, 'EOHOLDING', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (349, 'ETHICALHACKING', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (350, 'etransition day', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (351, 'Eval Jabatan  Direksi', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (352, 'EVENT', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (353, 'EVENT ORGANIZER', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (354, 'exfood', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (355, 'EXAMPREPARATION', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (356, 'EXECUTIVE COACH', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (357, 'EXHOUSEFAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (358, 'FCUSGRUP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (359, 'FAMILY DAY', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (360, 'FAREWELDINER', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (361, 'FAS&JARRUDIN', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (362, 'fault indicator', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (363, 'FCCS', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (364, 'FCMBUILD', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (365, 'FCPPPAM', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (366, 'FCPPPENGAMANAN', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (367, 'FEEDRIVER', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (368, 'FESTIVAL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (369, 'FESTIVAL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (370, 'FGD BOD', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (371, 'FGDKementrian', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (372, 'FGDSPI', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (373, 'FIELDTRIP', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (374, 'FIFA MATCH DAY', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (375, 'figura', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (376, 'FIXCOSTNB', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (377, 'FIXCOSTTDP', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (378, 'FIXCOSTGEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (379, 'Florist', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (380, 'Football', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (381, 'FORKOM', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (382, 'Formula SAE Japan', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (383, 'Forum GA', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (384, 'ForumEvaluasi', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (385, 'FORUMINSTTIDAK TETAP', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (386, 'ForumITT', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (387, 'FORUMKOMUNIKASI', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (388, 'ForumVendor', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (389, 'FotoManajemen', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (390, 'FRAME', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (391, 'FULLDAYMEETING', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (392, 'fun bike', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (393, 'FUNDAY', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (394, 'GnertionExcelnt', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (395, 'GA Forum', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (396, 'GABUS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (397, 'GALON', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (398, 'GALUNGAN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (399, 'GAMBIRANG', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (400, 'GantunganKunci', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (401, 'GAPURA PATOK', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (402, 'GARPU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (403, 'GasElpiji', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (404, 'GasLPG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (405, 'GATHERING', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (406, 'gathering', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (407, 'gaung', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (408, 'GD KTR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (409, 'GdgTaman', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (410, 'GDGTMN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (411, 'GDG,TMAN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (412, 'GDRIVE', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (413, 'GedngTaman', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (414, 'GEDUNG&INSTALASI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (415, 'GEDUNG&TMN KANTOR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (416, 'GedungTaman', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (417, 'gelarpasukan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (418, 'GELAS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (419, 'GELAS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (420, 'gema sunari', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (421, 'GeneralAffairForum', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (422, 'GenerationIdea', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (423, 'glade', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (424, 'GLOVE', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (425, 'GMAIL', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (426, 'GoLive', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (427, 'Gotocam', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (428, 'Gojek', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (429, 'goldenorange', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (430, 'GOLF', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (431, 'GoogleAnalytic', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (432, 'GoogleDrive', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (433, 'GORDN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (434, 'GORDEN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (435, 'Gosend', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (436, 'GRABFood', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (437, 'GRASSCARPET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (438, 'GREENSCREEN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (439, 'GRENDEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (440, 'GUDANGTAMAN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (441, 'gula', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (442, 'gunting', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (443, 'GURINDA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (444, 'HADIAH', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (445, 'haji', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (446, 'HALAL BI HALAL', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (447, 'halal bihalal', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (448, 'HalalBihalal', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (449, 'HALAMANPOS', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (450, 'HANDSANITIZ', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (451, 'Handsanitizer', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (452, 'handuk', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (453, 'HANDUK', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (454, 'HAPUA SEMINAR', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (455, 'Har Gd,Taman PLN UIKSBU', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (456, 'HARFASAD', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (457, 'HARGEDUNG22', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (458, 'HARGEDUNG23', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (459, 'HARKLS', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (460, 'harlift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (461, 'HARPLAFON', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (462, 'HARBELNAS', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (463, 'HARDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (464, 'HARGED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (465, 'Hari Kemerdekaan', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (466, 'HARI LINGKUNGAN HIDUP', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (467, 'hari peduli lingkungan', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (468, 'HARI PELG NASIONAL', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (469, 'harilahir', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (470, 'harian bengkulu', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (471, 'harkitnas', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (472, 'HARPER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (473, 'Harpic', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (474, 'HAUL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (475, 'HIASKANTOR', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (476, 'hiburan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (477, 'hit,', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (478, 'hln', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (479, 'HLN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (480, 'HOLIDAYINN', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (481, 'HONORINSTRUKTUR', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (482, 'HORISON', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (483, 'HOUSEKEEPING', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (484, 'HPSAMSUNG', 'Smartwatch, Tablet');
INSERT INTO public.master_keyword VALUES (485, 'ht pfk', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (486, 'Humidifier', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (487, 'HUT', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (488, 'hut', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (489, 'hutang pfk', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (490, 'ICLOUD', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (491, 'idea generation', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (492, 'IDUL ADHA', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (493, 'idul adha', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (494, 'Idul Fitri', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (495, 'IDUL FITRI', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (496, 'ied ftr', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (497, 'IELTS PREDICTION TEST', 'Seleksi Pra Kuliah');
INSERT INTO public.master_keyword VALUES (498, 'IELTSPREP', 'Seleksi Pra Kuliah');
INSERT INTO public.master_keyword VALUES (499, 'IELTSPREPARATION', 'Seleksi Pra Kuliah');
INSERT INTO public.master_keyword VALUES (500, 'IHTPROGRAM', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (501, 'IHTSpeak', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (502, 'IHTSTATISTIK', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (503, 'iims', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (504, 'IKAMAJU', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (505, 'ikan', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (506, 'Iklan Ucpan Slmt', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (507, 'IklanUcapan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (508, 'IKLIM KERJA', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (509, 'INDPPI', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (510, 'indhmrudin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (511, 'indosolar', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (512, 'influencer', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (513, 'infopemadaman', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (514, 'innovation', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (515, 'InnovationBootcamp', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (516, 'Inovasi', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (517, 'Inovasi', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (518, 'inovasi', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (519, 'INOVATIONBOOTCAMP', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (520, 'instalasi  Rudin', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (521, 'INTERIOR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (522, 'INTERIOR RUANG', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (523, 'INTERIOROPI', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (524, 'INVENTARISASI', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (525, 'ip bpjs', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (526, 'IP Camera', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (527, 'ipk bpjs', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (528, 'IssuanceFee', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (529, 'IT Business Analyst', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (530, 'ITDP NOM TALENT BOD', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (531, 'iuran kebersihan', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (532, 'Iuran Lingkungan', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (533, 'Iuran Pas Bandara', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (534, 'IURANBPJS', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (535, 'IuranKoran', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (536, 'jln sehat', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (537, 'JS KEG BLN K3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (538, 'JS PROD  MULTIMEDIA', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (539, 'JSKBRSHN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (540, 'JSPENGAMAN', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (541, 'JABORPAM', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (542, 'Jaket Kulit', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (543, 'JAKETALUMNI', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (544, 'JALANKANTOR', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (545, 'JAM di', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (546, 'JAM DINDING', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (547, 'JamDinding', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (548, 'Jamkantor', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (549, 'JAMBORE', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (550, 'JAMBORE PLN MUDA', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (551, 'JARING JALA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (552, 'JASA CLEANING SERVICE', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (553, 'JASA CS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (554, 'Jasa Event Organizer', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (555, 'Jasa Multimedia MC', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (556, 'JASAPENGECAT', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (557, 'JASAPERBAIK', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (558, 'Jasbor Pngman', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (559, 'JasborSecurity', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (560, 'JASKET UTK DEKOM', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (561, 'JASKET UTK KEBUTUHAN DIR, DEKOM DAN EKST', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (562, 'Jaskrea desain', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (563, 'Jaskreadespub', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (564, 'jawa pos', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (565, 'jelajah alam', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (566, 'JERSEY', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (567, 'jersey', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (568, 'JETP', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (569, 'JS CLEANING SERVICE', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (570, 'JS HAR DAN TAMAN CLEANING', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (571, 'Js Pengmnan&Prkr', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (572, 'JS PMEL LIFT', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (573, 'Js Pngmanan OGI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (574, 'Js Pngmnan & Prkr', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (575, 'Js Satuan Pengamanan PT PLN Kantor Pusa', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (576, 'JTV', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (577, 'JUMATBERSIH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (578, 'JumatSehat', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (579, 'Jurnalistik', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (580, 'jurnalistik', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (581, 'Just Energy Transition', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (582, 'KNSMSI  PRJB', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (583, 'KNSMSI  PRJBTN', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (584, 'KNSMSI PRJBTN', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (585, 'KNSMSI LDP', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (586, 'KOS TANGAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (587, 'kt asean', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (588, 'K3NASIONAL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (589, 'KabelChargerMobil', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (590, 'Kaca Film', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (591, 'Kado', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (592, 'Kain', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (593, 'KAINLAP', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (594, 'KAINSATIN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (595, 'KALEIDOSKOP', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (596, 'KALENDER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (597, 'kalteng pos', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (598, 'kamarmandi', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (599, 'KANDANG RUSA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (600, 'KANDANGRUSA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (601, 'KANEBO', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (602, 'KANOPI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (603, 'KANTIN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (604, 'KantongPlastik', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (605, 'kaos', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (606, 'Kaos', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (607, 'kaospanitia', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (608, 'Kapas', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (609, 'KARANGAN', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (610, 'KARANGAN BUNGA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (611, 'karangan bunga', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (612, 'karanganbunga', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (613, 'Karbung', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (614, 'karbung', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (615, 'karduskosong', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (616, 'KARIKATUR', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (617, 'karpet', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (618, 'KARPET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (619, 'Kartu Kredit Korporat', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (620, 'KARTUKREDIT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (621, 'KARTUNAMA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (622, 'KARTUNAMA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (623, 'KARTUPAS', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (624, 'karung', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (625, 'KARUNG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (626, 'KaryaIno', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (627, 'KARYAINOVASI', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (628, 'KaryaInovasi', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (629, 'kawatputih', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (630, 'KAYU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (631, 'Kbrshan Ling', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (632, 'KEAMANANCS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (633, 'KEBERSIH', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (634, 'KEBUTUHAN PIN', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (635, 'KEBUTUHAN VIP', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (636, 'KEBUTUHANOPRASIO', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (637, 'KEG SOSIALISASI & KOORD DG STAKEHO', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (638, 'KEGPERSIAPAN', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (639, 'kegiatan 17', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (640, 'KEGIATAN PENAN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (641, 'KEGIATAN PENUNJANG BLN K3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (642, 'kegiatan1 Mhrm', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (643, 'KEGIATAN5S', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (644, 'KegiatanNegotiation', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (645, 'KELENGKAPANR.', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (646, 'Kelola Gd', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (647, 'KELOLA GED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (648, 'KelolaParkirPusenlis', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (649, 'kemeja', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (650, 'kemitraan', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (651, 'KEMOCENG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (652, 'Kendmup3', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (653, 'KendaraanMUP', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (654, 'KENDARAANNONRUTIN', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (655, 'Keperluan rudin', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (656, 'KEPERLUANUMUM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (657, 'KepulanganToT', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (658, 'Keramik', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (659, 'KERANWASTAFEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (660, 'Keris', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (661, 'kerohanian', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (662, 'kerudung', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (663, 'KESET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (664, 'keterbukaan Inf publik', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (665, 'ketua rt', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (666, 'ketua sp', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (667, 'khitan', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (668, 'KICK OFF  GCG', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (669, 'KinerjaHCROCR', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (670, 'Kipas', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (671, 'KIPASANGIN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (672, 'KirimDokumen', 'Ekspedisi / Pengiriman Dokumen');
INSERT INTO public.master_keyword VALUES (673, 'kirimpaket', 'Ekspedisi / Pengiriman Dokumen');
INSERT INTO public.master_keyword VALUES (674, 'Kispray', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (675, 'kitwash', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (676, 'KK KORPORAT', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (677, 'KLOSET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (678, 'KmarMandi', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (679, 'KmrMandi', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (680, 'KMRMES', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (681, 'KNJNGNRI1', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (682, 'KNPENSASITNGTEKNIK', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (683, 'Knsmsi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (684, 'KNSMSI  PRJBS', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (685, 'kodam', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (686, 'KOLAM', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (687, 'KolamIkan', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (688, 'KOMPEJABAT', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (689, 'KomitmenSMAP', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (690, 'komitmenSMT', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (691, 'kompas', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (692, 'KOMPENSASITAD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (693, 'KompensasiTHR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (694, 'KOMPOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (695, 'KOMPOR INDUKSI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (696, 'KOMPRESOR UDARA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (697, 'Komsumsi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (698, 'konsrutin', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (699, 'KonsWorkshop', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (700, 'kons. Overtime', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (701, 'kons. Pnghapusan', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (702, 'kons. Rapat', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (703, 'konser', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (704, 'Konsumsi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (705, 'konsumsi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (706, 'KONSUMSIMATERIAL', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (707, 'KONSUMSIRAKER', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (708, 'KONSUMSIRKAP', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (709, 'KONSUMSIUPDL', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (710, 'KoordEksternal', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (711, 'Kopi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (712, 'kopi', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (713, 'Koran', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (714, 'KORAN', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (715, 'koran', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (716, 'KOSTUMBAJU', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (717, 'kreatif desain Pub', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (718, 'KRKSI BBN DR PDP TUG  2018', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (719, 'kue kring', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (720, 'kulkas', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (721, 'KUNCI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (722, 'KunjDir', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (723, 'Kunjker', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (724, 'KunjKomisiDPR', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (725, 'kunjungan dirut', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (726, 'kunjungan gm', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (727, 'KUNKER', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (728, 'KunkerBOD', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (729, 'KUNKERGM', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (730, 'KURAS WC', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (731, 'LABEL TOIL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (732, 'LAMPU ILOVE PLN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (733, 'LampuBadmin', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (734, 'langgananTV', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (735, 'LAP,', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (736, 'LAPIITB', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (737, 'latgab', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (738, 'Laudry', 'Laundry');
INSERT INTO public.master_keyword VALUES (739, 'Launching', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (740, 'Laundry', 'Laundry');
INSERT INTO public.master_keyword VALUES (741, 'LAUNDRY', 'Laundry');
INSERT INTO public.master_keyword VALUES (742, 'LAZIS', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (743, 'Leader', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (744, 'LEADERSHIP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (745, 'Lebaran', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (746, 'LED Interaktif', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (747, 'LEM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (748, 'LEM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (749, 'LemTikus', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (750, 'LemburGdTruno', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (751, 'lhkpn', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (752, 'Lifestyle', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (753, 'LIFTGD', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (754, 'LIKE PLN', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (755, 'Lilin', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (756, 'Liputan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (757, 'liputan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (758, 'liputan tv', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (759, 'LISTRIKRUDIN', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (760, 'LKS Bipartit', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (761, 'LKS Bipatrit', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (762, 'LLGEDDKSI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (763, 'LO Kementerian Kemenhub', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (764, 'logo PLN', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (765, 'LOGOIDENTITAS', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (766, 'LOKER', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (767, 'LOL GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (768, 'LOLA GDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (769, 'LOLA GDNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (770, 'LOLAGD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (771, 'LOLAGDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (772, 'LOLAGEDDKSI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (773, 'LolaGedung', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (774, 'LOMBA', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (775, 'LOMBA', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (776, 'lomba', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (777, 'lombok post', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (778, 'Loundry', 'Laundry');
INSERT INTO public.master_keyword VALUES (779, 'LPG', 'Tagihan PDAM dan Token Mess / Rumah Dinas (Listrik, Air, Gas)');
INSERT INTO public.master_keyword VALUES (780, 'LunchBox', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (781, 'M .BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (782, 'M BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (783, 'MGMT FEE', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (784, 'M. BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (785, 'M.BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (786, 'Maintenance lift', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (787, 'maintenance5S', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (788, 'Makan', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (789, 'makan', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (790, 'MAKANAN', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (791, 'Malam Penghargaan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (792, 'MAN BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (793, 'MANBUILDING', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (794, 'MANAGEMEN BUILDING', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (795, 'MANAGEMENBUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (796, 'MANAGEMENT BUILDING', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (797, 'MANAGEMENT FEE', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (798, 'MANBUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (799, 'MANGKOK', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (800, 'Mangkunegaran Run', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (801, 'mangrove', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (802, 'mangunegara', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (803, 'MARCHANDISE', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (804, 'MARCOM', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (805, 'MARKETING BOOTCAMP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (806, 'Marketingaward', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (807, 'Marketplace', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (808, 'Marvelousyouth', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (809, 'MASJID', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (810, 'MASKER', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (811, 'master of ceremony', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (812, 'MasterCeremony', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (813, 'MATCLEANING', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (814, 'MATCS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (815, 'MATKEBUTUH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (816, 'MATKECIL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (817, 'MATKOMKORP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (818, 'MATMINOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (819, 'MATMOBIL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (820, 'MATUMUM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (821, 'MATABOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (822, 'MATERIKEPEMIMP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (823, 'MATERIAL CAT', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (824, 'MATERIAL LIFT', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (825, 'MCU SISWA PRJBTN', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)');
INSERT INTO public.master_keyword VALUES (826, 'MEBEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (827, 'medsosial', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (828, 'media campaign', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (829, 'media gath', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (830, 'media radar kepah', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (831, 'media relation', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (832, 'Medsos', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (833, 'MEET PACK', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (834, 'Membangun Negeri', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (835, 'MEMORIKAMERA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (836, 'mentri bumn', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (837, 'MercedesBenz', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (838, 'MercedezBenz', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (839, 'MERCH', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (840, 'Merch', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (841, 'MERCHANDISE', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (842, 'merchandise', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (843, 'MESIN AIR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (844, 'MESINKOPI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (845, 'MESINPOTONG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (846, 'mesinrumput', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (847, 'mess', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (848, 'MEUBEUL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (849, 'MGT BUILD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (850, 'microfber', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (851, 'Mindfullness', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (852, 'MINORRUANG', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (853, 'minuman', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (854, 'MIU-GEDUNG', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (855, 'MLAKUBARENG', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (856, 'MOBILMANAER', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (857, 'mobilmup', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (858, 'moh sarno', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (859, 'motor show', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (860, 'mou-', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (861, 'mou', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (862, 'mouseMUP3', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (863, 'mudik', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (864, 'MUKTAMAR', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (865, 'MULTIMEDIA KREATIF', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (866, 'munas', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (867, 'MUSLA', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (868, 'Mushalla', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (869, 'mushola', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (870, 'musholla', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (871, 'Mutasijabatan', 'SPPD - Proporsi Konsumsi 21%');
INSERT INTO public.master_keyword VALUES (872, 'Mutjab', 'SPPD - Proporsi Konsumsi 21%');
INSERT INTO public.master_keyword VALUES (873, 'Nampan', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (874, 'NANGKRING', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (875, 'NARASUMBER', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (876, 'NATAL', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (877, 'natal', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (878, 'NATARU', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (879, 'nataru', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (880, 'NegoSkil', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (881, 'netflix', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (882, 'News', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (883, 'NEWS', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (884, 'NGADAAN BUNGA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (885, 'NotaKesepahaman', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (886, 'NOVOTEL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (887, 'NYAMUK', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (888, 'Olahrag', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (889, 'Olahraga', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (890, 'OLIMESINSHELL', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (891, 'OngkosKirim', 'Ekspedisi / Pengiriman Dokumen');
INSERT INTO public.master_keyword VALUES (892, 'Opening', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (893, 'OPHAR GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (894, 'OPHARDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (895, 'opini publik', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (896, 'opinipublik', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (897, 'OprHarGdPusenlis', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (898, 'OPS&PML GDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (899, 'OPS&PMLGED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (900, 'OSGEDHAL', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (901, 'PMBTN VID', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (902, 'PNGMNAN GDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (903, 'PNGAMANNGED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (904, 'PNGAMANNSPI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (905, 'PngelolaanparkirPUSENSLIS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (906, 'Ppan Nama', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (907, 'Prfum', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (908, 'PtsanPradilan', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (909, 'PA SE I', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (910, 'Packfood', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (911, 'PAGAROTOMATIS', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (912, 'PAGUYUBAN', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (913, 'PAKAIAN DINAS', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (914, 'PAKANIKAN', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (915, 'PAKU PAYUNG', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (916, 'PALPON', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (917, 'PAMUP2B', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (918, 'P''AMANAN GED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (919, 'Pameran', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (920, 'PANCI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (921, 'PANTR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (922, 'Pantry', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (923, 'PANTRY', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (924, 'PAPANBUNGA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (925, 'PAPER BAG', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (926, 'PAPERBAG', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (927, 'papua news', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (928, 'PARANG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (929, 'parcel', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (930, 'PARF.', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (931, 'PARFM', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (932, 'PARFUM', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (933, 'parfum', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (934, 'PARKIRAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (935, 'Partisipasihari besar', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (936, 'PARTNERSHIP JELAJAH BUMN', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (937, 'pasal188KUHP', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (938, 'pastasilikon', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (939, 'pasundan Ekspres', 'Ekspedisi / Pengiriman Dokumen');
INSERT INTO public.master_keyword VALUES (940, 'Paten', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (941, 'pb pasi', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (942, 'PBNGN PRKRN KTR UIW NTT 0016.SPK', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (943, 'PDAMRuDin', 'Tagihan PDAM dan Token Mess / Rumah Dinas (Listrik, Air, Gas)');
INSERT INTO public.master_keyword VALUES (944, 'PEDULI', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (945, 'peduli', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (946, 'PekerjaanTMBH', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (947, 'Pelimageprocessing', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (948, 'PELANGGANTERBAIK', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (949, 'pelantikan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (950, 'PelatihanCamera', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (951, 'PelatihanImproving', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (952, 'PelatihanInfogra', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (953, 'PelatihanJournalism', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (954, 'PelatihanPenulisan', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (955, 'PelatihanTJSL', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (956, 'PelatihanWriting', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (957, 'Pelepasan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (958, 'pelet', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (959, 'Peletikan', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (960, 'PEMBANTEN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (961, 'PemCoach', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (962, 'PemIn-house Training', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (963, 'PEMPEJATI', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (964, 'PEMASARNKREATIF', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (965, 'Pemb CS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (966, 'PEMBBALO', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (967, 'PEMBBTL', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (968, 'PEMBBUAH', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (969, 'PEMBKERAN', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (970, 'PEMBKRA', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (971, 'PEMBMATRIAL', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (972, 'PEMBPULUH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (973, 'PEMBSTOP', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (974, 'PEMBTABU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (975, 'PEMBTINT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (976, 'PEMBARUANINTERIOR', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (977, 'Pembelian Bunga', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (978, 'PEMBELIAN JAKET', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (979, 'PEMBELIAN BAN', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (980, 'PEMBELIANAKI', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (981, 'PembelianPDL', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (982, 'PEMBENAHAN', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (983, 'Pemberitaan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (984, 'pemberitaan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (985, 'PEMBERSIH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (986, 'PEMBORONGAN PEKERJAAN PENGELOLAAN SARANA', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (987, 'PEMEL GED', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (988, 'PEMEL SARANA GDG REHAB GEDUNG & PAGAR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (989, 'PEMELGEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (990, 'PEMELTANAH', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (991, 'pemelihlift', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (992, 'Pemeliharaan fasilitas gedung', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (993, 'Pemeliharaan Ged', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (994, 'Pemeliharaan gedung', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (995, 'PEMELIHARAAN RUTIN T', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (996, 'PEMESANAN BUNGA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (997, 'PENANDATANGANANNOTA', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (998, 'PENATAANSPBKLU', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (999, 'PENDAMPINGAN KEJAKSAAN', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (1000, 'PENDIDIKAN FORMALPLN-UI', 'SPPD Non BPP');
INSERT INTO public.master_keyword VALUES (1001, 'PENERANG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1002, 'PENGKEAMANAN GD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1003, 'PENGMNAN GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1004, 'PENGADAAN ISS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1005, 'Pengadaan pendukung kegiatan RI1 UID', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1006, 'PENGADAAN SARANA PENUNJANG KEGIATAN SOSI', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1007, 'PENGAMAN GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1008, 'PENGAMANDKSI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1009, 'PENGAMANAN ASET', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1010, 'PENGAMANAN GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1011, 'PENGAMANAN KANTOR', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1012, 'PENGAMANAN UP3 SIGLI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1013, 'PENGAMANANBALSAM', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1014, 'PENGAMANANCWNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1015, 'PENGAMANANGD', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1016, 'PENGAMANANGDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1017, 'PengamananGed', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1018, 'PENGAMANANPOL', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1019, 'PENGAMANANUID', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1020, 'PENGAMANANUPT', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1021, 'PENGECATAN', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1022, 'pengecatan', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1023, 'PENGECATANDINDINGKM', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1024, 'pengecetan', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1025, 'PENGELOLAAN GDNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1026, 'Pengelolaan Gedu', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1027, 'Pengelolaan Gedung & Pertamanan', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1028, 'pengelolaan5S', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1029, 'Penggantian  Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1030, 'PENGGANTIAN PART LIFT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1031, 'pengharum', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (1032, 'PENGHARUM', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (1033, 'penghijauan', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1034, 'penghisapdebumobil', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1035, 'PENGINAPANGM', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1036, 'PengisianKuisioner', 'Survey Kepuasan Pelanggan');
INSERT INTO public.master_keyword VALUES (1037, 'pengobatan', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)');
INSERT INTO public.master_keyword VALUES (1038, 'PENGUMUMANPASCAKUALIFIKASI', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1039, 'PENITIBESAR', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1040, 'PENSIUNKESEHATAN', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)');
INSERT INTO public.master_keyword VALUES (1041, 'pensiunan', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)');
INSERT INTO public.master_keyword VALUES (1042, 'penterjemah', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1043, 'PENUGASAN WORKSHOP DESIGN THINKING EXPER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1044, 'Penyebarluasaninformasi', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1045, 'PENYEDOTAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1046, 'PENYEMPROT', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (1047, 'PENYERAHANPENGHAR', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1048, 'penyiaran berita', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1049, 'PERABOTKANTO', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1050, 'PERABOTANMINOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1051, 'PERALATAN KEBESI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1052, 'PERALATAN KEPERLU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1053, 'PERALATAN PERSEDI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1054, 'PERALATANKEBRSH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1056, 'PERALATANUMUM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1057, 'PeranHCBPPLN', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1058, 'PERAPIHAN TPS', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1059, 'Perawatan  lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1060, 'PERAWATAN LIFT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1061, 'PERB LIFT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1062, 'PERB LIFT BARANG', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1063, 'PERB MINOR', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1064, 'Perbaikan Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1065, 'PerbaikanRuDin', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1066, 'PERC PENY 0691.PJ/DAN.02.02/DIT DAN-2/2018 - 2020', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1067, 'peresmian', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1068, 'PERESMIAN', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1069, 'peresmian', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1070, 'perfomance dialog', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1071, 'periklindo', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1072, 'PERINGATAN', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1073, 'PeringatanK3', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (1074, 'PERKAKAS STB', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1075, 'PERLENG17', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1076, 'PERLENGPANT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1077, 'PERLENGPENDUKUN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1078, 'Perlengkapan 3R', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (1079, 'PERLENGKAPAN LAINLAIN DIREK', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1080, 'PERLENGKAPAN RMH MANAGER', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1081, 'Perlengkapan Ruah Dinas Jabatan', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1082, 'PERLENGKAPANKEBERSIHAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1083, 'PerlengkapanMUP', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1084, 'PERMOHONAN PEMBAYARAN TAGIHAN CORPORATE CARD HERLI', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1085, 'PERSEDIAANU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1086, 'PersonalBrand', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1087, 'PERSONALITY SC PRJBTN', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1088, 'PERUMMINOR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1089, 'PerundinganPKB', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1090, 'Perwatanlift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1091, 'PESANAN BUNGA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1092, 'PEWANGI', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (1093, 'pewangi', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (1094, 'pfk', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1095, 'pfk', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1096, 'PGLLN GDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1097, 'PGLOLN GDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1098, 'PGMNAN GDNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1099, 'PhotoStudio', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1100, 'PHOTOBOOTH', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1101, 'photogrphy', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1102, 'pica fest', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1103, 'PIGURA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1104, 'PIKK', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1105, 'PILDUN', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1106, 'Pingpong', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1107, 'PINTUSLEDING', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1108, 'PIPA AIR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1109, 'PIRING', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1110, 'PIRING', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1111, 'Pirng', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1112, 'PISAHSAMBUT', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1113, 'PISAU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1114, 'pita', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1115, 'PJJUI', 'SPPD Non BPP');
INSERT INTO public.master_keyword VALUES (1116, 'PJPDCOKLIT', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (1117, 'PJPDHSH', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (1118, 'plakat', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1119, 'Planning Session', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1120, 'platnomorMUP', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1121, 'PLNENGLISH', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1122, 'PLNITB', 'SPPD Non BPP');
INSERT INTO public.master_keyword VALUES (1123, 'PlstikSampah', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1124, 'plthndrn', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1125, 'PMBANGUNAN APLIKASI DTBASE INSTRUKTUR', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1126, 'PmbklnPurn', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1127, 'PmbljrnMetrologi', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1128, 'Pmlhrn Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1129, 'PNATAA&RHBLTSI R.MAN UPT PLGD 95%', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1130, 'Pngadaan Buku Bangkit Mngndalikn Gel.Per', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1131, 'Pngamanan Gd', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1132, 'PNGCATAN DINDING LUAR BLKANG GD UTAMA', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1133, 'pnggantian  Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1134, 'PNGLAAN GEDUNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1135, 'PNGLLN GDG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1136, 'PNGMNGDNG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1137, 'Pompaban', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1138, 'PORSENI', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1139, 'pos belitung', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1140, 'POSTERSMAP', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1141, 'posting berita', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1142, 'POTONGRUMPUT', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1143, 'PP JASBOR SATPAM', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1144, 'PPCS', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1145, 'pph 21', 'Pajak Penghasilan Pasal 21 Pegawai (Selain Akun 6105201100)');
INSERT INTO public.master_keyword VALUES (1146, 'pph ps 21', 'Pajak Penghasilan Pasal 21 Pegawai (Selain Akun 6105201100)');
INSERT INTO public.master_keyword VALUES (1147, 'PPh21', 'Pajak Penghasilan Pasal 21 Pegawai (Selain Akun 6105201100)');
INSERT INTO public.master_keyword VALUES (1148, 'PPN 10% PT PAGUNTAKA CAHAYA NUSANTARA 2021', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1149, 'PPN Dalam Negeri 2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1150, 'PPN PIB SESCO DESEMBER 2021', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1151, 'PPN Put 2017', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1152, 'Prajab', 'OJT (SPPD, Prajabatan, Kesehatan, Honor)');
INSERT INTO public.master_keyword VALUES (1153, 'PraktisiKomunikasi', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1154, 'PRBAIKN PAGR KLILING', 'Pagar, Halaman, Jalan - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1155, 'press relase', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1156, 'press release', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1157, 'Prkir', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1158, 'PRLKPN JMBR MD 3', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1159, 'ProductDev', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1160, 'PRODUKSI VIDEO', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1161, 'ProfessionalMC', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1162, 'Profiling Program Neuromatik', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1163, 'ProgramInkubasi', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1164, 'ProgramMental', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1165, 'promosi', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1166, 'promosipedia', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1167, 'PROTOKOLERDIR', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1168, 'PRSNIPLN', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1169, 'PRWTAN HAL & GEDUNG INSTLS GI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1170, 'Psychological', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1171, 'PT Astagina Sulsel Media', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1172, 'PT Bisnis Sulawesi', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1173, 'publ', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1174, 'publ pln', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1175, 'PublicSpeaking', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1176, 'publikasi', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1177, 'publish media', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1178, 'PULLMAN', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1179, 'PULSA', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1180, 'PULSA PEKUMUM', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1181, 'PulsaDriver', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1182, 'PulsaManaemen', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1183, 'PULSAMANAGER', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1184, 'PULSAMULP', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1185, 'PULSANON STRUK', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1186, 'PulsaPejabat', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1187, 'PULSASATPAM', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1188, 'PULSASECURITY', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1189, 'PULSASTRUKTURAL', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1190, 'PUPUK', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1191, 'purnabakti', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1192, 'purnabakti', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1193, 'qori', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1194, 'quizizz', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1195, 'QURBA', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1196, 'Qurban', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1197, 'RMHJABATAN', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1198, 'Rpt Kin Unggul', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1199, 'RACUN', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1200, 'RacunRumputULP', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (1201, 'RacunTikus', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (1202, 'radar sulteng', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1203, 'radar sumbawa', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1204, 'radikalisme', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1205, 'Radiography', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1206, 'RAFIA', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1207, 'raksepatu', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1208, 'rakor G20', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1209, 'RAKOR SEKPER', 'Rapat Koordinasi Non Penyediaan Tenaga Listrik');
INSERT INTO public.master_keyword VALUES (1210, 'Ramadhan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1211, 'ramah tamah', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1212, 'RANGER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1213, 'RANGER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1214, 'ranger', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1215, 'RANGKAIAN BUNGA', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1216, 'refresment', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1217, 'REGULATORGAS', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1218, 'reklame', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1219, 'REKLAS BONUS TAHUN 2021', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (1220, 'Reklas PPN ymh Disetor atas Tagihan IP 2018', 'Penyesuaian < Y-1');
INSERT INTO public.master_keyword VALUES (1221, 'REKRUTMENOAP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1222, 'relberita', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1223, 'release berita', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1224, 'release iklan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1225, 'REMOTAC', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1226, 'renovasi rd', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1227, 'RenovasiRuangRapat', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1228, 'REWARD', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1229, 'reward', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1230, 'RHB GDNG UNT SRN OLRGA', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1231, 'riau pos', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1232, 'RIBBEN', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1233, 'rilis berita', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1234, 'riliskalimantan', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1235, 'RMDHN', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1236, 'RMH GM', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1237, 'RmhDinas', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1238, 'ROMPI TAHAN SAJAM DAN PELURU', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1239, 'Rompimup', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1240, 'RuangFitness', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1241, 'RUANGMANAGER', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1242, 'RUANGRAPIM', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1243, 'rudin dir', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1244, 'rudin GM', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1245, 'Rudin Manager', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1246, 'RUDIN MUP3', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1247, 'RUJ', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1248, 'RUJAB', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1249, 'rumah dinas', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1250, 'RUMAHBAMBU', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1251, 'Rumahdinas', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1252, 'RUMAHDINAS', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1253, 'RUMAHJ', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1254, 'RUMAHMANAGER', 'Sarana dan Fasilitas GM / Manajer');
INSERT INTO public.master_keyword VALUES (1255, 'RUMDI', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1256, 'Rumdin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1257, 'RUMDIN', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1258, 'Rumdin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1259, 'rumdin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1260, 'RUMPUT', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1261, 'RUMPUTGAJAH', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1262, 'running text', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1263, 'RunningText', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1264, 'Sjadah', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (1265, 'svenir', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1266, 'SABLON', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1267, 'sabun', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1268, 'SABUN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1269, 'safari', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1270, 'salonpas', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1271, 'sambut', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1272, 'Sambutan', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1273, 'SAMPAH', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (1274, 'sampah', 'Retribusi (Lingkungan, Sampah)');
INSERT INTO public.master_keyword VALUES (1275, 'Samsung Flip', 'Smartwatch, Tablet');
INSERT INTO public.master_keyword VALUES (1276, 'SANDAL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1277, 'Sandwich', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1278, 'Saniter', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (1279, 'Santripreneur', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1280, 'santunan', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1281, 'SAPU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1282, 'SAPU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1283, 'Sarana Fitnes', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1284, 'SaranaRudin', 'Beban Administrasi Wisma dan Rumah Dinas (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1285, 'SARAPAN', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1286, 'SARUNGJOK', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1287, 'SARUNGMIC', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1288, 'SARUNGTANGAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1289, 'SATPAM', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1290, 'SATPAM UNIT KERJA SUMATERA', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1291, 'SATYALENCANA', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1292, 'sbo', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1293, 'SCAFOLDING', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1294, 'SECURITYUID', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1295, 'SECURITY;', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1296, 'SEDOT WC', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1297, 'SEDOTTINJA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1298, 'SEKOP', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1299, 'SeleksiInov', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (1300, 'semarang tv', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1301, 'SEMINARETOS', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1302, 'SENAM', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1303, 'senam', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1304, 'Sendal', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1305, 'SENDOK', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1306, 'SENSO', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1307, 'sentana', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1308, 'SERAGAM', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (1309, 'SERAGAM', 'Pakaian Dinas, kecuali untuk petugas operasi dan pemeliharaan ketenagalistrikan (Selain Akun 6105201800)');
INSERT INTO public.master_keyword VALUES (1310, 'SERAHTERIMAjab', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1311, 'Serangga', 'Pembasmian Hama');
INSERT INTO public.master_keyword VALUES (1312, 'SERBET', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1313, 'SERIKAT PEKERJA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1314, 'SERTIFPMP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1315, 'SertifikasiCoach', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1316, 'SertifikasiTalent', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1317, 'Sertijab', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1318, 'sertijab', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1319, 'SERVDINAMO', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1320, 'Service Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1321, 'SERVICEMOTOR', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1322, 'ServiceTv', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1323, 'servis lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1324, 'Servismobil', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1325, 'Servise lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1326, 'SETTOPBOX', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1327, 'Setrika', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1328, 'sewa rumah', 'Bantuan Fasilitas Sewa Rumah');
INSERT INTO public.master_keyword VALUES (1329, 'SEWA BUNGA', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1330, 'SEWABAJU', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1331, 'SEWAKAPAL', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1332, 'SHLAT', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (1333, 'SHADOWING PROG AFIRM PAPUA', 'TJSL, CSR');
INSERT INTO public.master_keyword VALUES (1334, 'SHIMIZU', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1335, 'sholat', 'Sarana Rumah Ibadah');
INSERT INTO public.master_keyword VALUES (1336, 'Siaran Pres', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1337, 'SIKATBAJA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1338, 'siskamling', 'Seremonial K3L / Proper / Lingkungan');
INSERT INTO public.master_keyword VALUES (1339, 'sistem manajemen terintegrasi', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1340, 'SKLLS-PRSNL QLFCTN', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1341, 'SMAP', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1342, 'smile', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1343, 'SMINAR', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1344, 'Snack', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1345, 'snack', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1346, 'SoftCompetency', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1347, 'soklin', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1348, 'SOSIALISASI KEJATI', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1349, 'sosialisasi maturity level', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1350, 'sosialisasi pkb', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1351, 'sosialisasi transformasi', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1352, 'SOUND', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1353, 'SOUVENIR', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1354, 'Souvenir', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1355, 'souvenir', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1356, 'SPANDUK', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1357, 'spanduk', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1358, 'spandukCSMS', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1359, 'spandukGOSPORT', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1360, 'spandukkomitmen', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1361, 'Spare part Lift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1362, 'SparepartLift', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1363, 'Speak', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1364, 'SPEAKER', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1365, 'Spirtus', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1366, 'Spons', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1367, 'sponsor', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1368, 'sponsorship', 'Sponsorship - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1369, 'spoundbondtas', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1370, 'SPPD DRIVER', 'SPPD Driver / Lembur Driver - Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1371, 'SPPDDRIVER', 'SPPD Driver / Lembur Driver - Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1372, 'SPPDMutasi', 'Perjalanan Dinas Terkait Orientasi Pekerjaan (Tidak Termasuk BPFP (Pegawai Pindah Tugas)) (Selain Akun 6105202000)');
INSERT INTO public.master_keyword VALUES (1373, 'SPPDPENGEMUDI', 'SPPD Driver / Lembur Driver - Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1374, 'Srtkbar', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1375, 'StakeHolderForum', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1376, 'stakeholder', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1377, 'stella', 'Pengharum Ruangan Kantor / Mobil / Toilet');
INSERT INTO public.master_keyword VALUES (1378, 'STICKER', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1379, 'STICKER KACA', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1380, 'STOP KONTAK', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1381, 'Storytelling', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1382, 'STUDIOMINI', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1383, 'SuccessCareer', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1384, 'sukacita', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1385, 'sumeks', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1386, 'SUMUR', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1387, 'SUNLIGHT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1388, 'SUNLIGHT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1389, 'SUPERPEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1390, 'Support PLN on G20 Carbon', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1391, 'Support Multimedia', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1392, 'surat kabar', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1393, 'suratkabar', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1394, 'SURVEIKEPUASANPELANGGAN', 'Survey Kepuasan Pelanggan');
INSERT INTO public.master_keyword VALUES (1395, 'Sustainability Day', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1396, 'SUSU', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1397, 'SUVENIR', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1398, 'tabloid', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1399, 'TABUNGGAS', 'Tagihan PDAM dan Token Mess / Rumah Dinas (Listrik, Air, Gas)');
INSERT INTO public.master_keyword VALUES (1400, 'tagihan radio', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1401, 'TAGIHANHALO', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1402, 'TAGIHANKARTU HALLO', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1403, 'TAGIHANKARTU HALO', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1404, 'TAGIHANKARTU PASCABAYAR', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1405, 'TAGIHANKARTU PASKABAYAR', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1406, 'tahun baru', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1407, 'TALANGFIBER', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1408, 'TALIPUTIH', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1409, 'TALIRAFIA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1410, 'TALIRAPIA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1411, 'talkshow', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1412, 'TalkshowSri', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1413, 'TAMAN', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1414, 'TambaBan', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1415, 'TAMBALBAN', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1416, 'Tamu', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1417, 'TANAM', 'Taman / Kolam Ikan / Aquarium');
INSERT INTO public.master_keyword VALUES (1418, 'TANGGA-', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1419, 'TANGGA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1420, 'TANGGA LIPAT', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1421, 'TANZANIA', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1422, 'Taplak', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1423, 'TASKAMERA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1424, 'TecHR Singapore', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1425, 'teh', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1426, 'teh,', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1427, 'TelkomRuDin', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1428, 'TelpSeluler', 'Komunikasi (Pulsa (Pra & Pasca), Internet) - Proporsi 29%');
INSERT INTO public.master_keyword VALUES (1429, 'TELUR', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1430, 'tempatsampah', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1431, 'temu alumni', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1432, 'temu media', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1433, 'TENDA', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1434, 'TENIS', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1435, 'TENNIS', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1436, 'teritorial', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1437, 'termos', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1438, 'TERMOSNASI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1439, 'TESTIMONI', 'Survey Kepuasan Pelanggan');
INSERT INTO public.master_keyword VALUES (1440, 'th baru', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1441, 'THR SATPAM', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1442, 'THRDRIVER', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1443, 'THRDRIVER', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1444, 'THRK TAD', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1445, 'tikus', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1446, 'TIMBANGAN', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1447, 'Tipikor', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1448, 'TIRAI', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1449, 'TIREGEL', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1450, 'Tissu', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1451, 'Tissue', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1452, 'Tisu', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1453, 'tisu', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1454, 'tisue', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1455, 'tjsl', 'TJSL, CSR');
INSERT INTO public.master_keyword VALUES (1456, 'TOILE', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1457, 'Toilet', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1458, 'ToiletSign', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1459, 'TONG TJIE', 'Bahan Makanan dan Konsumsi (Selain Akun 6107201100)');
INSERT INTO public.master_keyword VALUES (1460, 'TOP FM', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1461, 'TOPLES', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1462, 'toples', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1463, 'TOURNAMENT', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1464, 'town hall', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1465, 'Toys', 'Cinderamata / Souvenir/ Penghargaan / Reward / Hadiah / Doorprize');
INSERT INTO public.master_keyword VALUES (1466, 'TRADISI', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1467, 'TrainTJSL', 'TJSL, CSR');
INSERT INTO public.master_keyword VALUES (1468, 'transformasi bumn', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1469, 'transport media', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1470, 'Transportasidrivermup', 'Kendaraan Dinas (Cuci, Aksesoris, Interior)');
INSERT INTO public.master_keyword VALUES (1471, 'TRASHBAG', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1472, 'TREADMIL', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1473, 'tribute to', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1474, 'TUITIONFEE', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1475, 'TUKANG', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1476, 'Tunjngn Hri Rya Kgamaan kpd TAD', 'Kegiatan Hari Besar (HLN, HUT, Nasional, Keagamaan)');
INSERT INTO public.master_keyword VALUES (1477, 'tv berlngganan', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1478, 'tv kabel', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1479, 'tv langganan', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1480, 'TVKabel', 'Berlangganan Media Massa (TV, Surat Kabar)');
INSERT INTO public.master_keyword VALUES (1481, 'Ucapan', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1482, 'ucapan', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1483, 'Ucapn Plantikn', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1484, 'ucp hut', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1485, 'ucpan', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1486, 'ucpn', 'Kegiatan Sosial / Amal Bakti / Karangan Bunga');
INSERT INTO public.master_keyword VALUES (1487, 'UJI RIKSA LIFT', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1488, 'ultah', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1489, 'UMBUL', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1490, 'UMBUL', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1491, 'umkm', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1492, 'umrah', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1493, 'umroh', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1494, 'UndanganInnovation', 'Customer (Gathering, Engagement, Pemasaran, Intimasi, Electrifying Lifestyle)');
INSERT INTO public.master_keyword VALUES (1495, 'UNDURDIRI', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1496, 'UPACARA', 'Event (Pisah Sambut, Ulang Tahun, Refleksi Akhir Tahun, Kunjungan)');
INSERT INTO public.master_keyword VALUES (1497, 'UPAHOBHPI', 'Management Building (Gedung, CS, Satpam, Taman) -  Proporsi 10%');
INSERT INTO public.master_keyword VALUES (1498, 'UPDATE DATA NIK', 'Stakeholder Management');
INSERT INTO public.master_keyword VALUES (1499, 'UPGRADING RUANG KELAS', 'Renovasi Ruang Kerja & Ruang Pendukung Lainnya - Proporsi 20%');
INSERT INTO public.master_keyword VALUES (1500, 'VACUUM', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1501, 'VID PBLJRN', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1502, 'VIDKICKOF', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1503, 'video dirut', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1504, 'Video DL', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1505, 'Video tanggap bencana', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1506, 'videotransformasi', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1507, 'Videografi', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1508, 'Videography', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1509, 'Videotron', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1510, 'videotron', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1511, 'VIDEOWALL', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1512, 'VINTAGE', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1513, 'VISA', 'Paspor / Visa');
INSERT INTO public.master_keyword VALUES (1514, 'VisualManagement', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (1515, 'VisualManagement', 'Knowlegde Management (Inovasi, Knowledge Sharing)');
INSERT INTO public.master_keyword VALUES (1516, 'VMS', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1517, 'WS Prog Strtgi', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1518, 'WS SINERGI', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1519, 'WadahSampah', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1520, 'WALLPAP', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1521, 'WALLPAPER', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1522, 'WALLPAPER', 'Barang Cetakan (Pembuatan Buku, Jilid, Laminating, Stiker, Akrilik, Figura)');
INSERT INTO public.master_keyword VALUES (1523, 'wastafel', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1524, 'WASTAFEL', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1525, 'WebinarLeader', 'Honorarium (Narasumber, Instruktur Webinar, Penceramah, Motivator)');
INSERT INTO public.master_keyword VALUES (1526, 'WELLBEING', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1527, 'wellness', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1528, 'WHATSAPP', 'NON ALLOWABLE COST LAINNYA');
INSERT INTO public.master_keyword VALUES (1529, 'wirelesscharger', 'Perabotan & Perlengkapan Kantor / Dapur/ Toilet');
INSERT INTO public.master_keyword VALUES (1530, 'WISMA', 'Beban Pemeliharaan Wisma dan Rumah Dinas (kecuali rumdin operator/instalasi dan rumah singgah operator) (Selain Lamp L.12.F)');
INSERT INTO public.master_keyword VALUES (1531, 'workshop design thinking expert with bus', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1532, 'Workshop Nasional', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1533, 'WORKSHOPCAREER', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1534, 'WorkshopCommunication', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1535, 'WorkshopKinerjaUnggul', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1536, 'WORLD CLASS TRAINING', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1537, 'WS ESG FOR EXECUTIVE', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1538, 'ws peningkatan kinerja', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1539, 'WSDEV', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1540, 'WSMRKTG', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1541, 'YBM', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1542, 'YOUTHGENERATIONFORUM', 'Inhouse Training Non Ketenagalistrikan');
INSERT INTO public.master_keyword VALUES (1543, 'Canang', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1544, 'Cnang', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1545, 'Bnten', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1546, 'Dupa', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1547, 'pura', 'Pembinaan Spritual, Budaya & Olah Raga (SBO) (Selain Akun 6105301110)');
INSERT INTO public.master_keyword VALUES (1548, 'greeting', 'Iklan / Brosur / Spanduk / Publikasi / Banner - Proporsi 80%');
INSERT INTO public.master_keyword VALUES (1549, 'Smart Watch', 'Smartwatch, Tablet');


--
-- TOC entry 5063 (class 0 OID 74475)
-- Dependencies: 220
-- Data for Name: master_program; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_program VALUES (1, 'Profesi (PROF)', 'PROF');
INSERT INTO public.master_program VALUES (2, 'LCM', 'LCM');
INSERT INTO public.master_program VALUES (3, 'TNA', 'TNA');
INSERT INTO public.master_program VALUES (4, 'PBK', 'PBK');
INSERT INTO public.master_program VALUES (5, 'Purnabakti', 'PURNA');
INSERT INTO public.master_program VALUES (6, 'Prajabat', 'PRAJAB');
INSERT INTO public.master_program VALUES (7, 'Program Strategis', 'STRATE');
INSERT INTO public.master_program VALUES (8, 'Kepemimpinan / Leadership', 'KPM');
INSERT INTO public.master_program VALUES (9, 'Asesmen Reguler', 'IKA');
INSERT INTO public.master_program VALUES (10, 'Asesmen Kepemimpinan', 'IKALDP');
INSERT INTO public.master_program VALUES (11, 'Penugasan Asesmen', 'PASES');
INSERT INTO public.master_program VALUES (12, 'Pelaksanaan Sertifikasi', 'SER');
INSERT INTO public.master_program VALUES (13, 'Perpanjangan Sertifikat Kompetensi', 'SERKOM');
INSERT INTO public.master_program VALUES (14, 'Pelaksanaan Evaluasi Sertifikasi', 'REAKRE');
INSERT INTO public.master_program VALUES (15, 'Pelaksanaan Konsultasi Sistem Manajemen', 'KONSUL');
INSERT INTO public.master_program VALUES (16, 'Pengembangan Materi KKJ', 'KKJ');
INSERT INTO public.master_program VALUES (17, 'Pengembangan Materi Distribusi', 'DIST');
INSERT INTO public.master_program VALUES (18, 'Pengembangan Materi Kontruksi dan Manajemen Proyek', 'PRO');
INSERT INTO public.master_program VALUES (19, 'Pengembangan Materi Pembangkitan', 'KIT');
INSERT INTO public.master_program VALUES (20, 'Pengembangan Materi Transmisi', 'TRM');
INSERT INTO public.master_program VALUES (21, 'Pengembangan Materi P P K 1', 'PPKI');
INSERT INTO public.master_program VALUES (22, 'Pengembangan Materi P P K 2', 'PPKII');
INSERT INTO public.master_program VALUES (23, 'Pengembangan Materi P P K 3', 'PPKIII');
INSERT INTO public.master_program VALUES (24, 'Pengembangan Materi P P K 4', 'PPKIV');
INSERT INTO public.master_program VALUES (25, 'Pengembangan Instruktur, Assesor, Konsultan', 'PIAK');
INSERT INTO public.master_program VALUES (26, 'Pengelolaan Kemitraan', 'KRP');
INSERT INTO public.master_program VALUES (27, 'Knowledge Management', 'KM');
INSERT INTO public.master_program VALUES (28, 'Digital Learning', 'DL');
INSERT INTO public.master_program VALUES (29, 'Manajemen Mutu & Evaluasi', 'MUTU');
INSERT INTO public.master_program VALUES (30, 'Pengembangan Laboratorium / Sarana Praktek', 'LAB');
INSERT INTO public.master_program VALUES (31, 'Pengembangan Materi Assesmen', 'MASES');
INSERT INTO public.master_program VALUES (32, 'Pengembangan Materi Sertifikasi', 'MUSER');
INSERT INTO public.master_program VALUES (33, 'Program Edukasi', 'MLEB');
INSERT INTO public.master_program VALUES (34, 'SBO', 'SBO');
INSERT INTO public.master_program VALUES (35, 'Pembelajaran PDKB', 'PDKB');
INSERT INTO public.master_program VALUES (36, 'Program Peran HCBP', 'HCBP');
INSERT INTO public.master_program VALUES (37, 'Peningkatan Kualitas Sarana Pembelajaran', 'SARJAR');
INSERT INTO public.master_program VALUES (38, 'Pembelajaran Inisiatif Stratejik', 'INISTR');
INSERT INTO public.master_program VALUES (39, 'Program Asesmen Hard Competency', 'ASHARD');
INSERT INTO public.master_program VALUES (40, 'Nota Buku', 'NOTA');
INSERT INTO public.master_program VALUES (41, 'Akrual', 'AKRUAL');
INSERT INTO public.master_program VALUES (42, 'Pengembangan Materi Digital', 'DIG');
INSERT INTO public.master_program VALUES (43, 'Pengembangan Materi Supply Chain Management', 'SCM');
INSERT INTO public.master_program VALUES (44, 'Pengembangan Materi Energi Primer', 'ENPRI');
INSERT INTO public.master_program VALUES (45, 'Pengembangan Materi Operasi Sistem dan Fasilitas Operasi', 'OSFO');
INSERT INTO public.master_program VALUES (46, 'Pengembangan Materi Perencanaan Sistem dan Aset Manajemen', 'PSAM');
INSERT INTO public.master_program VALUES (47, 'Pengembangan Materi Niaga, Pemasaran dan Penjualan', 'NPP');
INSERT INTO public.master_program VALUES (48, 'Pengembangan Materi Customer Experience dan Layanan Pelanggan', 'CELP');
INSERT INTO public.master_program VALUES (49, 'Pengembangan Materi Smart Grid dan Dekarbonisasi Sistem Energi', 'SGDE');
INSERT INTO public.master_program VALUES (50, 'Pengembangan Materi Energi Baru dan Energy Storage System', 'EBST');
INSERT INTO public.master_program VALUES (51, 'Pengembangan Materi Energi Terbarukan', 'ETER');
INSERT INTO public.master_program VALUES (52, 'Pengembangan Materi Non Technical Sustainability', 'NTS');
INSERT INTO public.master_program VALUES (53, 'Pengembangan Materi Human Capital dan General Affair', 'HCGA');
INSERT INTO public.master_program VALUES (54, 'Pengembangan Materi Penelitian dan Pengembangan, Pemeliharaan Ketenagalistrikan dan Sertifikasi', 'PPPKS');
INSERT INTO public.master_program VALUES (55, 'Pengembangan Materi Corporate Secretary', 'CSEC');
INSERT INTO public.master_program VALUES (56, 'Pengembangan Materi Digital dan Teknologi Informasi', 'DIGTI');
INSERT INTO public.master_program VALUES (57, 'Pengembangan Materi HSSE', 'HSSE');
INSERT INTO public.master_program VALUES (58, 'Pengembangan Materi Bussiness Development', 'BDEV');
INSERT INTO public.master_program VALUES (59, 'Pengambangan Materi Risiko dan Kepatuhan', 'RISK');
INSERT INTO public.master_program VALUES (60, 'Pengembangan Materi Legal dan Regulasi', 'LEGAL');
INSERT INTO public.master_program VALUES (61, 'Pengembangan Materi Keuangan', 'KEU');
INSERT INTO public.master_program VALUES (62, 'Biaya Lain-Lain', 'LAIN');
INSERT INTO public.master_program VALUES (63, 'Kas Kecil', 'KAS');
INSERT INTO public.master_program VALUES (64, 'Vendor Invoicing Portal', 'VIP');
INSERT INTO public.master_program VALUES (65, 'Nota Buku', 'NOTA');


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 223
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 13, true);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 231
-- Name: admin_login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_login_logs_id_seq', 60, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 229
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 227
-- Name: master_grey_area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_grey_area_id_seq', 90, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 225
-- Name: master_jenis_biaya_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_jenis_biaya_id_seq', 62, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 221
-- Name: master_keyword_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_keyword_id_seq', 1553, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 219
-- Name: master_program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_program_id_seq', 67, true);


--
-- TOC entry 4904 (class 2606 OID 74510)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 74579)
-- Name: admin_login_logs admin_login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_login_logs
    ADD CONSTRAINT admin_login_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 74566)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 4912 (class 2606 OID 74568)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- TOC entry 4908 (class 2606 OID 74549)
-- Name: master_grey_area master_grey_area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_grey_area
    ADD CONSTRAINT master_grey_area_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 74534)
-- Name: master_jenis_biaya master_jenis_biaya_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_jenis_biaya
    ADD CONSTRAINT master_jenis_biaya_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 74492)
-- Name: master_keyword master_keyword_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_keyword
    ADD CONSTRAINT master_keyword_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 74481)
-- Name: master_program master_program_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_program
    ADD CONSTRAINT master_program_pkey PRIMARY KEY (id);


-- Completed on 2026-09-01 11:43:35

--
-- PostgreSQL database dump complete
--