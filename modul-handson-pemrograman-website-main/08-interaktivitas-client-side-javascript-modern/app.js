// app.js
"use strict";

// 1. Fungsi Asinkronus untuk Mengambil Data dari Berkas JSON
const fetchScheduleData = async (url) => {
    try {
        const response = await fetch(url);
        
        // Cek jika status HTTP respon tidak sukses (e.g. 404, 500)
        if (!response.ok) {
            throw new Error(`Gagal memuat data: Status HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Kesalahan pada fetchScheduleData:", error.message);
        throw error; // Teruskan error agar ditangani oleh fungsi pemanggil
    }
};

// 2. Fungsi untuk Memproses dan Menyaring Data (High-Order Methods)
const processSchedule = (scheduleList, targetSemester) => {
    // Filter mata kuliah berdasarkan semester target (e.g. semester genap 4)
    const filtered = scheduleList.filter(item => item.semester === targetSemester);
    
    // Transformasi objek data hanya menyisakan nama, sks, dan format string deskripsi
    const mapped = filtered.map(item => ({
        kode: item.kode,
        namaMataKuliah: item.nama.toUpperCase(),
        bobotSks: item.sks,
        deskripsiSingkat: `${item.nama} (${item.sks} SKS) diampu oleh ${item.dosen}`
    }));

    // Hitung total SKS yang disaring menggunakan reduce
    const totalSks = filtered.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.sks;
    }, 0);

    return {
        classes: mapped,
        totalSks: totalSks
    };
};

// 3. Fungsi Utama Pengendali Alur Program
const runAcademicApp = async () => {
    const jsonUrl = "./schedule.json";
    
    console.log("Memulai pengambilan data jadwal kuliah...");
    
    try {
        const rawSchedule = await fetchScheduleData(jsonUrl);
        console.log("Data mentah berhasil diambil. Memulai pemrosesan...");

        // Saring jadwal khusus untuk Semester 4
        const targetSemester = 4;
        const result = processSchedule(rawSchedule, targetSemester);

        console.log(`--- HASIL PENYARINGAN SEMESTER ${targetSemester} ---`);
        console.table(result.classes);
        console.log(`Total beban kuliah yang disaring: ${result.totalSks} SKS`);

    } catch (error) {
        console.log("Aplikasi gagal memproses karena kesalahan data.");
    }
};

// Eksekusi Program Utama
runAcademicApp();
