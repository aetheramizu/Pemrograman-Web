<?php
declare(strict_types=1);
require_once './Database.php';

$dbInstance = new Database();
$pdo = $dbInstance->getConnection();

$search = trim($_GET['search'] ?? '');
$students = [];

try {
    if (!empty($search)) {
        // Query dengan Prepared Statements menggunakan Named Placeholders (:search)
        $sql = "SELECT m.nim, m.nama_mhs, mk.nama_mk, mk.sks, d.nama_dosen, k.tanggal_ambil 
                FROM krs k
                INNER JOIN mahasiswa m ON k.nim = m.nim
                INNER JOIN mata_kuliah mk ON k.kode_mk = mk.kode_mk
                LEFT JOIN dosen d ON mk.nidn = d.nidn
                WHERE m.nama_mhs LIKE :search OR m.nim = :nim_exact
                ORDER BY m.nim ASC";
        
        $stmt = $pdo->prepare($sql);
        $searchParam = "%{$search}%";
        $stmt->execute([
            'search' => $searchParam,
            'nim_exact' => $search
        ]);
        $students = $stmt->fetchAll();
    } else {
        // Query tanpa filter pencarian
        $sql = "SELECT m.nim, m.nama_mhs, mk.nama_mk, mk.sks, d.nama_dosen, k.tanggal_ambil 
                FROM krs k
                INNER JOIN mahasiswa m ON k.nim = m.nim
                INNER JOIN mata_kuliah mk ON k.kode_mk = mk.kode_mk
                LEFT JOIN dosen d ON mk.nidn = d.nidn
                ORDER BY m.nim ASC";
        
        $stmt = $pdo->query($sql);
        $students = $stmt->fetchAll();
    }
} catch (PDOException $e) {
    error_log("Query Execution Failed: " . $e->getMessage());
    $errorMessage = "Gagal mengambil data dari database.";
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar KRS Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light p-5">

    <div class="container bg-white p-4 rounded shadow-sm">
        <h1 class="h3 mb-4">Daftar Pengambilan Kartu Rencana Studi (KRS)</h1>
        
        <!-- Formulir Pencarian Dinamis -->
        <form action="./daftar-krs.php" method="GET" class="row g-3 mb-4">
            <div class="col-sm-9">
                <input type="text" name="search" class="form-control" placeholder="Cari berdasarkan Nama Mahasiswa atau NIM..." value="<?= htmlspecialchars($search) ?>">
            </div>
            <div class="col-sm-3">
                <button type="submit" class="btn btn-primary w-100">Cari Data</button>
            </div>
        </form>

        <?php if (isset($errorMessage)): ?>
            <div class="alert alert-danger"><?= htmlspecialchars($errorMessage) ?></div>
        <?php endif; ?>

        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>NIM</th>
                    <th>Nama Mahasiswa</th>
                    <th>Mata Kuliah</th>
                    <th>SKS</th>
                    <th>Dosen Pengajar</th>
                    <th>Tanggal Ambil</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($students)): ?>
                    <tr>
                        <td colspan="6" class="text-center text-muted">Data pendaftaran KRS tidak ditemukan.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($students as $row): ?>
                        <tr>
                            <td><?= htmlspecialchars($row['nim']) ?></td>
                            <td><?= htmlspecialchars($row['nama_mhs']) ?></td>
                            <td><?= htmlspecialchars($row['nama_mk']) ?></td>
                            <td><?= htmlspecialchars((string)$row['sks']) ?></td>
                            <td><?= htmlspecialchars($row['nama_dosen'] ?? 'Belum Ditentukan') ?></td>
                            <td><?= htmlspecialchars($row['tanggal_ambil']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

</body>
</html>
