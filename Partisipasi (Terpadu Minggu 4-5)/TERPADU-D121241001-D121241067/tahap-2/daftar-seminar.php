<?php

declare(strict_types=1);

require_once __DIR__ . '/Seminar.php';
session_start();

/**
 * Escape keluaran dinamis agar aman ditampilkan sebagai HTML (anti-XSS).
 */
function e(string $teks): string
{
    return htmlspecialchars($teks, ENT_QUOTES, 'UTF-8');
}

/**
 * Ambil nilai string dari array masukan dengan aman:
 * nilai non-string (mis. array dari ?nim[]=) dianggap kosong.
 */
function masukanString(array $sumber, string $kunci): string
{
    $nilai = $sumber[$kunci] ?? '';

    return is_string($nilai) ? trim($nilai) : '';
}

/* --------------------------------------------------------------------
   1. Siapkan state sesi: kuota, daftar peserta, dan token CSRF.
   -------------------------------------------------------------------- */
if (!isset($_SESSION['kuota'], $_SESSION['peserta']) || !is_array($_SESSION['peserta'])) {
    $_SESSION['kuota'] = 40;
    $_SESSION['peserta'] = [];
}
$_SESSION['kuota'] = (int) $_SESSION['kuota'];

if (!isset($_SESSION['csrf']) || !is_string($_SESSION['csrf']) || $_SESSION['csrf'] === '') {
    $_SESSION['csrf'] = bin2hex(random_bytes(32)); // token acak kriptografis
}

if (!isset($_COOKIE['peran'])) {
    setcookie('peran', 'peserta');
}

/* --------------------------------------------------------------------
   2. Model seminar (OOP): kuota private, dibaca lewat sisaKursi().
   -------------------------------------------------------------------- */
$seminar = new Seminar('Seminar Keamanan Web', (int) $_SESSION['kuota']);

$errors = [];
$pesanSukses = '';

/* --------------------------------------------------------------------
   3. Tangani pengiriman formulir (POST).
   -------------------------------------------------------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 3a. CSRF: SELALU diperiksa, termasuk ketika token tidak dikirim.
    $tokenDikirim = $_POST['csrf'] ?? '';
    if (!is_string($tokenDikirim) || $tokenDikirim === ''
        || !hash_equals((string) $_SESSION['csrf'], $tokenDikirim)) {
        http_response_code(403);
        exit('Permintaan ditolak: token CSRF tidak valid.');
    }

    // 3b. Ambil dan validasi masukan sebelum dipakai.
    $nim = masukanString($_POST, 'nim');
    $nama = masukanString($_POST, 'nama');
    $aksi = masukanString($_POST, 'aksi');
    $jumlah = filter_var(masukanString($_POST, 'jumlah'), FILTER_VALIDATE_INT);

    if (strlen($nim) !== 10) {
        $errors[] = 'NIM harus tepat 10 karakter.';
    }
    if ($nama === '') {
        $errors[] = 'Nama lengkap wajib diisi.';
    }
    if ($jumlah === false || $jumlah < 1) {
        $errors[] = 'Jumlah peserta harus berupa bilangan bulat positif (minimal 1).';
    }
    if (!in_array($aksi, ['daftar', 'batal'], true)) {
        $errors[] = 'Aksi tidak dikenal.';
    }

    // 3c. Jalankan aksi hanya jika seluruh masukan valid.
    if (count($errors) === 0) {
        switch ($aksi) {
            case 'daftar':
                if (!$seminar->pesan($jumlah)) {
                    $errors[] = 'Sisa kursi tidak mencukupi: tersedia '
                        . $seminar->sisaKursi() . ' kursi.';
                } else {
                    $_SESSION['peserta'][] = [
                        'nim' => $nim,
                        'nama' => $nama,
                        'kursi' => $jumlah,
                    ];
                    $pesanSukses = 'Pendaftaran berhasil: ' . $jumlah
                        . ' kursi untuk ' . $nama . '.';
                }
                break;

            case 'batal':
                if (count($_SESSION['peserta']) === 0) {
                    $errors[] = 'Belum ada peserta yang bisa dibatalkan.';
                } else {
                    $dibebaskan = 0;
                    while ($dibebaskan < $jumlah && count($_SESSION['peserta']) > 0) {
                        $terakhir = array_pop($_SESSION['peserta']);
                        $dibebaskan += (int) ($terakhir['kursi'] ?? 1);
                    }
                    $seminar->batal($dibebaskan);
                    $pesanSukses = 'Pembatalan berhasil: ' . $dibebaskan
                        . ' kursi dibebaskan.';
                }
                break;
        }

        $_SESSION['kuota'] = $seminar->sisaKursi();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pendaftaran Seminar</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container py-4">
  <h1 class="h3"><?= e($seminar->getJudul()) ?></h1>
  <p>Sisa kursi: <strong><?= e((string) $seminar->sisaKursi()) ?></strong></p>

  <?php if ($pesanSukses !== ''): ?>
    <div class="alert alert-success"><?= e($pesanSukses) ?></div>
  <?php endif; ?>

  <?php foreach ($errors as $err): ?>
    <div class="alert alert-danger"><?= e($err) ?></div>
  <?php endforeach; ?>

  <form method="POST" action="daftar-seminar.php" class="mb-4">
    <input type="hidden" name="csrf" value="<?= e($_SESSION['csrf']) ?>">
    <input class="form-control mb-2" name="nim" placeholder="NIM">
    <input class="form-control mb-2" name="nama" placeholder="Nama lengkap">
    <input class="form-control mb-2" name="jumlah" type="number" value="1">
    <select class="form-select mb-2" name="aksi">
      <option value="daftar">Daftar</option>
      <option value="batal">Batalkan</option>
    </select>
    <button class="btn btn-primary">Kirim</button>
  </form>

  <h2 class="h5">Peserta terdaftar</h2>
  <ul class="list-group mb-4">
    <?php foreach ($_SESSION['peserta'] as $p): ?>
      <li class="list-group-item"><?= e((string) $p['nim']) ?> — <?= e((string) $p['nama']) ?></li>
    <?php endforeach; ?>
  </ul>

  <?php if (($_COOKIE['peran'] ?? '') === 'panitia'): ?>
    <div class="border border-danger p-3">
      <h2 class="h6">Panel panitia</h2>
      <a href="atur-ulang.php" class="btn btn-sm btn-danger">Atur ulang semua pendaftaran</a>
    </div>
  <?php endif; ?>

  <?php include __DIR__ . '/bagian-kaki.php'; ?>
</body>
</html>
