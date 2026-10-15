// dom-app.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM Selection
    const studentForm = document.getElementById("studentForm");
    const nimInput = document.getElementById("nim");
    const nameInput = document.getElementById("name");
    const nimError = document.getElementById("nimError");
    const nameError = document.getElementById("nameError");
    const studentTableBody = document.getElementById("studentTableBody");

    // 2. Real-time validation handler pada input NIM
    nimInput.addEventListener("input", () => {
        const nimValue = nimInput.value.trim();
        if (nimValue && !/^[0-9]{10}$/.test(nimValue)) {
            nimError.textContent = "NIM wajib berupa angka sepanjang tepat 10 digit.";
            nimInput.classList.add("is-invalid");
        } else {
            nimError.textContent = "";
            nimInput.classList.remove("is-invalid");
            nimInput.classList.add("is-valid");
        }
    });

    // 3. Form submit handler dengan pencegahan tindakan default
    studentForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Mencegah form melakukan POST/GET reload halaman

        const nim = nimInput.value.trim();
        const name = nameInput.value.trim();
        let isValid = true;

        // Validasi Akhir sebelum data dimasukkan ke tabel
        if (!/^[0-9]{10}$/.test(nim)) {
            nimError.textContent = "Validasi Gagal: Cek kembali NIM Anda.";
            nimInput.classList.add("is-invalid");
            isValid = false;
        }

        if (name.length < 3) {
            nameError.textContent = "Nama lengkap minimal terdiri atas 3 karakter.";
            nameInput.classList.add("is-invalid");
            isValid = false;
        } else {
            nameError.textContent = "";
            nameInput.classList.remove("is-invalid");
        }

        if (isValid) {
            // 4. Manipulasi Struktur: Buat baris baru untuk tabel
            const tr = document.createElement("tr");

            // Buat td untuk NIM
            const tdNim = document.createElement("td");
            tdNim.textContent = nim; // Menggunakan textContent agar aman dari XSS

            // Buat td untuk Nama
            const tdName = document.createElement("td");
            tdName.textContent = name;

            // Buat td untuk tombol Hapus
            const tdAction = document.createElement("td");
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm delete-btn";
            deleteBtn.textContent = "Hapus";
            tdAction.appendChild(deleteBtn);

            // Susun elemen baris tr
            tr.appendChild(tdNim);
            tr.appendChild(tdName);
            tr.appendChild(tdAction);

            // Sisipkan baris tr ke dalam tabel body
            studentTableBody.appendChild(tr);

            // Reset Form setelah sukses
            studentForm.reset();
            nimInput.classList.remove("is-valid");
            nameInput.classList.remove("is-valid");
        }
    });

    // 5. Event Delegation: Memasang satu listener di table body untuk aksi tombol hapus dinamis
    studentTableBody.addEventListener("click", (event) => {
        // Cek jika elemen target yang diklik memiliki kelas delete-btn
        if (event.target.classList.contains("delete-btn")) {
            // Ambil elemen baris (tr) pembungkus tombol tersebut
            const rowToDelete = event.target.closest("tr");
            if (rowToDelete) {
                rowToDelete.remove(); // Hapus baris dari DOM Tree secara dinamis
            }
        }
    });
});
