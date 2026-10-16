<?php

declare(strict_types=1);

/**
 * Seminar.php - model seminar (judul + kuota kursi).
 * Tugas Terpadu Minggu 4-6, Tahap 2 (Modul 05).
 */
class Seminar
{
    private int $kuota;
    private string $judul;

    public function __construct(string $judul = 'Seminar Teknik Informatika', int $kuota = 40)
    {
        $this->judul = $judul;
        $this->kuota = $kuota >= 0 ? $kuota : 0;
    }

    public function getJudul(): string
    {
        return $this->judul;
    }

    /** Sisa kursi yang masih tersedia. */
    public function sisaKursi(): int
    {
        return $this->kuota;
    }

    /**
     * Pesan kursi sebanyak $jumlah.
     * Mengembalikan false bila jumlah tidak valid atau kursi tidak mencukupi.
     */
    public function pesan(int $jumlah): bool
    {
        if ($jumlah < 1 || $jumlah > $this->kuota) {
            return false;
        }

        $this->kuota -= $jumlah;

        return true;
    }

    /** Batalkan kursi sebanyak $jumlah (kuota dikembalikan). */
    public function batal(int $jumlah): void
    {
        if ($jumlah < 1) {
            return;
        }

        $this->kuota += $jumlah;
    }
}
