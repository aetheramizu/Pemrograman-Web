<?php
declare(strict_types=1);

class Database {
    private string $host = '127.0.0.1';
    private string $db = 'akademik_db';
    private string $user = 'root'; // Sesuaikan pengguna db Anda
    private string $pass = '';     // Sesuaikan kata sandi db Anda
    private string $charset = 'utf8mb4';
    private ?PDO $pdo = null;

    public function getConnection(): PDO {
        if ($this->pdo === null) {
            // Data Source Name (DSN)
            $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
            
            // Konfigurasi Driver PDO
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lempar eksepsi saat error
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Kembalikan data sebagai array asosiatif
                PDO::ATTR_EMULATE_PREPARES   => false,                  // Matikan emulasi prepared statements agar native
            ];

            try {
                $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
            } catch (PDOException $e) {
                // Log kesalahan secara internal, tampilkan pesan aman kepada pengguna
                error_log("Database Connection Error: " . $e->getMessage());
                die("Sistem mengalami kegagalan teknis. Silakan coba beberapa saat lagi.");
            }
        }
        return $this->pdo;
    }
}
