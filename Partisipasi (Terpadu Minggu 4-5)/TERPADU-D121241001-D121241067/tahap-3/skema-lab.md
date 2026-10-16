# Skema Basis Data — Pendaftaran Seminar (Tahap 3, Modul 06)

Tugas Mandiri Terpadu Minggu 4–6 · Pemrograman Website
Departemen Teknik Informatika, Fakultas Teknik, Universitas Hasanuddin

## 1. Ruang lingkup dan asumsi

- Dokumen tugas menyebut Tahap 3 sebagai perancangan "tempat tinggal permanen bagi data
  [pendaftaran seminar]: skema basis data yang kebal dari data ganda" (Modul 06), dan
  Panduan Pengumpulan mencantumkan berkas `tahap-3/skema-lab.md`.
- Dokumen tugas **tidak memuat spesifikasi kolom yang rinci**. Karena itu skema berikut
  adalah **usulan desain** yang diturunkan dari kebutuhan fitur Tahap 2 (pendaftaran
  seminar dengan kuota, daftar peserta, dan pembatalan). Asumsi yang diambil dicatat di
  Bagian 6 — bukan diklaim sebagai ketentuan dosen.
- Sesuai lingkup tugas, tahap ini hanya menghasilkan **rancangan** (dokumen ini), bukan
  basis data yang benar-benar dibangun atau disambungkan ke aplikasi.

## 2. Entitas dan tabel

### 2.1 `mahasiswa`

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `nim` | `CHAR(10)` | **Primary key**. NIM tepat 10 karakter (sesuai validasi Tahap 2). |
| `nama` | `VARCHAR(100) NOT NULL` | Nama lengkap mahasiswa. |
| `program_studi` | `VARCHAR(100) NOT NULL` | Program studi mahasiswa. |
| `angkatan` | `YEAR NOT NULL` | Tahun angkatan. |

### 2.2 `seminar`

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `id_seminar` | `INT UNSIGNED AUTO_INCREMENT` | **Primary key**. |
| `judul` | `VARCHAR(150) NOT NULL` | Judul seminar. |
| `kuota` | `INT NOT NULL`, `CHECK (kuota >= 0)` | Jumlah kursi yang tersedia; tidak boleh negatif. |
| `tanggal` | `DATE NOT NULL` | Tanggal pelaksanaan. |
| `lokasi` | `VARCHAR(100) NOT NULL` | Tempat pelaksanaan. |

### 2.3 `pendaftaran`

Tabel penghubung (junction) antara `mahasiswa` dan `seminar`.

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `id_pendaftaran` | `BIGINT UNSIGNED AUTO_INCREMENT` | **Primary key**. |
| `id_seminar` | `INT UNSIGNED NOT NULL` | **Foreign key** → `seminar.id_seminar`. |
| `nim` | `CHAR(10) NOT NULL` | **Foreign key** → `mahasiswa.nim`. |
| `jumlah_kursi` | `INT NOT NULL DEFAULT 1`, `CHECK (jumlah_kursi >= 1)` | Jumlah kursi yang dipesan pada satu pendaftaran. |
| `status` | `ENUM('terdaftar','batal') NOT NULL DEFAULT 'terdaftar'` | Status pendaftaran; pembatalan tidak menghapus riwayat. |
| `waktu_daftar` | `TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP` | Waktu pendaftaran dicatat otomatis. |

**Kunci anti data ganda:** `UNIQUE (id_seminar, nim)` — satu mahasiswa hanya boleh
memiliki satu baris pendaftaran untuk satu seminar.

## 3. Relasi antartabel

```
mahasiswa (1) ────< pendaftaran >──── (1) seminar
```

- Satu `mahasiswa` dapat mendaftar ke banyak `seminar` (1 : N melalui `pendaftaran`).
- Satu `seminar` dapat diikuti banyak `mahasiswa` (1 : N melalui `pendaftaran`).
- Jadi relasi mahasiswa–seminar adalah **many-to-many** yang dipecah oleh tabel
  `pendaftaran` menjadi dua relasi one-to-many.

## 4. Constraint yang relevan

| Constraint | Dipasang pada | Tujuan |
|---|---|---|
| `PRIMARY KEY` | ketiga tabel | Menjamin setiap baris unik dan dapat diidentifikasi. |
| `FOREIGN KEY ... ON DELETE CASCADE ON UPDATE CASCADE` | `pendaftaran.id_seminar`, `pendaftaran.nim` | Integritas referensial: pendaftaran tidak bisa menunjuk seminar/mahasiswa yang tidak ada; ikut terhapus bila induknya dihapus. |
| `UNIQUE (id_seminar, nim)` | `pendaftaran` | Mencegah pendaftaran ganda pada seminar yang sama. |
| `CHECK (kuota >= 0)` | `seminar` | Kuota tidak pernah negatif. |
| `CHECK (jumlah_kursi >= 1)` | `pendaftaran` | Jumlah kursi selalu bilangan bulat positif (konsisten dengan validasi Tahap 2). |
| `NOT NULL` | kolom-kolom inti | Data wajib tidak boleh kosong. |
| `DEFAULT` | `jumlah_kursi`, `status`, `waktu_daftar` | Nilai wajar otomatis bila tidak diisi. |

## 5. Strategi mencegah data ganda

1. `UNIQUE (id_seminar, nim)` pada `pendaftaran` adalah pertahanan utama: percobaan
   mendaftar dua kali pada seminar yang sama akan ditolak database dengan galat
   *duplicate key*, walaupun validasi aplikasi terlewat. Aplikasi dapat menangkapnya dan
   menampilkan pesan "sudah terdaftar".
2. `PRIMARY KEY` pada `mahasiswa.nim` mencegah dua baris mahasiswa dengan NIM sama.
3. Pembatalan disarankan mengubah `status` menjadi `'batal'` (bukan menghapus baris),
   sehingga riwayat tetap utuh. Karena `UNIQUE` tidak membedakan status, mahasiswa yang
   ingin mendaftar ulang **mengaktifkan kembali baris yang sama** (update status), bukan
   membuat baris baru — dengan begitu aturan anti-ganda tetap berlaku.

## 6. Asumsi yang dicatat secara eksplisit

- Nama tabel dan kolom di atas adalah **usulan**, karena dokumen tugas tidak memuat
  spesifikasi rinci (tidak ada daftar kolom wajib dari dosen).
- Tabel `mahasiswa` dipisahkan dari `pendaftaran` agar identitas peserta tidak berulang
  (normalisasi); alternatif menyimpan nama langsung di `pendaftaran` sengaja tidak dipilih
  karena berpotensi data ganda dan tidak konsisten.
- Kolom `jumlah_kursi` disertakan untuk mendukung fitur "pesan beberapa kursi" pada
  formulir Tahap 2; bila dosen menghendaki satu kursi per pendaftaran, kolom ini bisa
  dihilangkan tanpa mengubah relasi.
- Pengelolaan sisa kuota (pengurangan/penambahan) tetap dilakukan aplikasi di dalam
  transaksi; skema ini menyediakan tempat datanya.
- DDL pada Bagian 7 adalah ilustrasi untuk MySQL/MariaDB (validator `CHECK` ditegakkan
  sejak MySQL 8.0.16 / MariaDB 10.2). Basis data tidak dibangun pada tugas ini.

## 7. DDL ilustratif (MySQL/MariaDB)

```sql
CREATE TABLE mahasiswa (
  nim            CHAR(10)     NOT NULL,
  nama           VARCHAR(100) NOT NULL,
  program_studi  VARCHAR(100) NOT NULL,
  angkatan       YEAR         NOT NULL,
  PRIMARY KEY (nim)
) ENGINE=InnoDB;

CREATE TABLE seminar (
  id_seminar  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  judul       VARCHAR(150) NOT NULL,
  kuota       INT          NOT NULL,
  tanggal     DATE         NOT NULL,
  lokasi      VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_seminar),
  CONSTRAINT chk_seminar_kuota CHECK (kuota >= 0)
) ENGINE=InnoDB;

CREATE TABLE pendaftaran (
  id_pendaftaran BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_seminar     INT UNSIGNED    NOT NULL,
  nim            CHAR(10)        NOT NULL,
  jumlah_kursi   INT             NOT NULL DEFAULT 1,
  status         ENUM('terdaftar','batal') NOT NULL DEFAULT 'terdaftar',
  waktu_daftar   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pendaftaran),
  CONSTRAINT uq_pendaftaran_unik UNIQUE (id_seminar, nim),
  CONSTRAINT chk_pendaftaran_jumlah CHECK (jumlah_kursi >= 1),
  CONSTRAINT fk_pendaftaran_seminar FOREIGN KEY (id_seminar)
      REFERENCES seminar (id_seminar) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pendaftaran_mahasiswa FOREIGN KEY (nim)
      REFERENCES mahasiswa (nim) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
```

## 8. Alasan desain singkat

- **Terpisah per entitas** (mahasiswa, seminar, pendaftaran) agar tidak ada data yang
  diulang-ulang dan setiap entitas punya identitas sendiri — memenuhi semangat Modul 06
  tentang basis data relasional.
- **Tabel penghubung** `pendaftaran` adalah cara baku menyimpan relasi many-to-many
  sekaligus tempat menaruh atribut relasi (`jumlah_kursi`, `status`, `waktu_daftar`).
- **`UNIQUE` komposit** adalah jawaban langsung atas syarat "kekal dari data ganda":
  aturan ditegakkan oleh database, bukan hanya oleh kode aplikasi.
- **`CHECK` dan `NOT NULL`** menjaga kualitas data di titik masuknya (kuota tidak negatif,
  jumlah kursi minimal 1), sejalan dengan validasi server di Tahap 2.
