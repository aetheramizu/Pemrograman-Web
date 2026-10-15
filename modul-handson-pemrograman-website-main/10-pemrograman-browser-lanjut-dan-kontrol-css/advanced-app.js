// advanced-app.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inisialisasi Data Dummy Skala Besar
    const studentGrades = [
        { nim: "D121241001", nama: "Rian Diantara", nilai: 88, predikat: "A" },
        { nim: "D121241002", nama: "Muhammad Akbar", nilai: 78, predikat: "B" },
        { nim: "D121241003", nama: "Andi Saputra", nilai: 92, predikat: "A" },
        { nim: "D121241004", nama: "Dewi Lestari", nilai: 65, predikat: "C" },
        { nim: "D121241005", nama: "Fajar Pratama", nilai: 55, predikat: "D" },
        { nim: "D121241006", nama: "Siti Rahma", nilai: 84, predikat: "A" },
        { nim: "D121241007", nama: "Budi Santoso", nilai: 70, predikat: "B" },
        { nim: "D121241008", nama: "Eka Wijaya", nilai: 90, predikat: "A" }
    ];

    // 2. DOM Selection
    const gradesTableBody = document.getElementById("gradesTableBody");
    const searchInput = document.getElementById("searchInput");
    const pageIndicator = document.getElementById("pageIndicator");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");

    // Parameter Paginasi
    const itemsPerPage = 3;
    let currentPage = 1;
    let filteredData = [...studentGrades];

    // 3. Fungsi Render Utama Menggunakan DocumentFragment (Optimasi Kinerja)
    const renderTable = () => {
        // Bersihkan tabel body (memicu reflow minimal)
        gradesTableBody.textContent = "";

        // Hitung indeks data untuk halaman berjalan
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        // Buat DocumentFragment sebagai kontainer memori sementara
        const fragment = document.createDocumentFragment();

        pageData.forEach(student => {
            const tr = document.createElement("tr");

            const tdNim = document.createElement("td");
            tdNim.textContent = student.nim;

            const tdNama = document.createElement("td");
            tdNama.textContent = student.nama;

            const tdNilai = document.createElement("td");
            tdNilai.textContent = String(student.nilai);

            const tdPredikat = document.createElement("td");
            tdPredikat.textContent = student.predikat;

            tr.appendChild(tdNim);
            tr.appendChild(tdNama);
            tr.appendChild(tdNilai);
            tr.appendChild(tdPredikat);

            // Sisipkan tr ke fragment, bukan ke DOM aktif!
            fragment.appendChild(tr);
        });

        // Masukkan fragment ke DOM aktif (Hanya memicu 1x Reflow/Repaint total)
        gradesTableBody.appendChild(fragment);

        // Perbarui indikator halaman
        const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;

        // Aktif/Nonaktifkan tombol paginasi
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    };

    // 4. Integrasi BOM: Paginasi Terkontrol via Hash URL
    const updatePageFromHash = () => {
        const hash = window.location.hash;
        if (hash.startsWith("#page-")) {
            const pageNum = parseInt(hash.replace("#page-", ""), 10);
            if (!isNaN(pageNum) && pageNum > 0) {
                currentPage = pageNum;
            }
        } else {
            currentPage = 1;
        }
        renderTable();
    };

    // Listener perubahan hash URL (BOM Event)
    window.addEventListener("hashchange", updatePageFromHash);

    // Navigasi Tombol memicu Perubahan Hash URL
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            window.location.hash = `page-${currentPage - 1}`;
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            window.location.hash = `page-${currentPage + 1}`;
        }
    });

    // 5. Fitur Filter Pencarian Instan (Mereset ke halaman 1)
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        filteredData = studentGrades.filter(s => s.nama.toLowerCase().includes(query));
        window.location.hash = "page-1"; // Pindah ke halaman 1 via hash
        updatePageFromHash();
    });

    // 6. Kontrol Gaya CSS Dinamis: Toggle Tema Gelap
    themeToggleBtn.addEventListener("click", () => {
        // Manipulasi kelas CSS menggunakan classList
        document.body.classList.toggle("dark-theme");
        
        // Membaca status kelas untuk mengubah label tombol
        if (document.body.classList.contains("dark-theme")) {
            themeToggleBtn.textContent = "Tema Terang";
            themeToggleBtn.className = "btn btn-outline-light";
        } else {
            themeToggleBtn.textContent = "Tema Gelap";
            themeToggleBtn.className = "btn btn-outline-secondary";
        }
    });

    // Inisialisasi Pemuatan Awal
    updatePageFromHash();
});
