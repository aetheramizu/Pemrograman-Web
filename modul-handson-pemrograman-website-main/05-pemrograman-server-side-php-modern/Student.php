<?php
declare(strict_types=1);

class Student {
    // Constructor Property Promotion (Fitur PHP 8.x)
    public function __construct(
        private string $nim,
        private string $name,
        private string $email
    ) {}

    // Getter untuk enkapsulasi properti private
    public function getNim(): string {
        return $this->nim;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getEmail(): string {
        return $this->email;
    }

    // Metode simulasi penyimpanan data
    public function saveToSession(): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Simpan objek mahasiswa ke array session
        $_SESSION['registered_students'][] = [
            'nim' => $this->nim,
            'name' => $this->name,
            'email' => $this->email
        ];
        return true;
    }
}
