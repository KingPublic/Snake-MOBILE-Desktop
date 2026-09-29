# 🐍 Snake Game — Game Ular 2D

Website sederhana berisi game ular 2D klasik, dibuat dengan **HTML5 Canvas**, **CSS3**, dan **Vanilla JavaScript** (tanpa framework, tanpa dependensi).

![Tech](https://img.shields.io/badge/HTML5-Canvas-E34F26) ![Tech](https://img.shields.io/badge/CSS3-Neon%20Theme-1572B6) ![Tech](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E)

---

## 📁 Struktur Project

```text
TESTAI/
│
├── index.html    # Struktur halaman web & area canvas
├── style.css     # Styling tema arcade neon modern
├── script.js     # Logika game ular lengkap
└── README.md     # Dokumentasi (file ini)
```

---

## ▶️ Cara Menjalankan (Run)

### Cara 1: Buka Langsung (Paling Mudah)
1. Buka **File Explorer** dan masuk ke folder `TESTAI`.
2. **Double-click** file `index.html` — game akan terbuka di browser default kamu (Chrome/Edge/Firefox).

### Cara 2: Lewat VS Code (Live Server)
1. Install extension **Live Server** (oleh Ritwick Dey) di VS Code.
2. Klik kanan pada file `index.html` → pilih **"Open with Live Server"**.
3. Browser akan terbuka otomatis di `http://127.0.0.1:5500`.

### Cara 3: Lewat Terminal (Python HTTP Server)
```bash
# Masuk ke folder project
cd path/ke/TESTAI

# Jalankan server lokal (Python 3)
python -m http.server 5500
```
Lalu buka browser ke alamat: `http://localhost:5500`

> 💡 **Tips:** Game ini 100% berjalan di sisi klien (client-side), jadi **tidak butuh server** — Cara 1 sudah cukup. Server hanya berguna jika kamu ingin pengembangan lanjutan.

---

## 🎮 Cara Bermain

### Tujuan
Kendalikan ular untuk memakan apel 🍎 sebanyak mungkin. Setiap apel yang dimakan membuat ular **bertambah panjang** dan **skor bertambah 1**. Permainan berakhir (*Game Over*) jika ular menabrak **dinding** atau **tubuhnya sendiri**.

### Kontrol

| Aksi | Keyboard | Layar Sentuh (HP / Tablet) |
|---|---|---|
| Bergerak | `↑` `↓` `←` `→` atau `W` `A` `S` `D` | **Geser (swipe)** di papan permainan: ke atas ⬆, bawah ⬇, kiri ⬅, atau kanan ➡ |
| Mulai / Lanjut | `Spasi` | **Ketuk** papan sekali, atau tombol **▶ Mulai** / **▶ Lanjut** |
| Jeda | `Spasi` | Tombol **⏸ Jeda** (jeda otomatis saat pindah aplikasi) |
| Ulangi permainan | `R` | Ketuk papan atau tombol **🔄 Ulangi** |

> 📱 Di perangkat sentuh, tombol D-Pad otomatis disembunyikan karena digantikan oleh **swipe**. Di desktop (mouse/keyboard) D-Pad tetap muncul dan bisa diklik.

### Aturan Main
- 🚫 Ular **tidak bisa berbalik arah 180°** secara langsung (misal: sedang ke kanan, tidak bisa langsung ke kiri).
- ⚡ Kecepatan ular **bertambah** setiap kali makan apel (makin tinggi skor, makin cepat!).
- 🏆 **High Score** tersimpan otomatis di browser (`localStorage`) — rekor tidak hilang walau halaman ditutup.

---

## ✨ Fitur

- ✅ Grid permainan 20×20 dengan canvas HTML5
- ✅ Makanan muncul acak (tidak pernah di atas tubuh ular)
- ✅ Deteksi tabrakan dinding & tubuh sendiri
- ✅ Skor saat ini + High Score persisten (`localStorage`)
- ✅ Tombol Mulai / Jeda / Ulangi + overlay menu
- ✅ Kontrol **swipe / geser sentuh** interaktif untuk HP & tablet
- ✅ Deteksi sumbu dominan (horizontal vs vertikal) + ambang jarak agar tap tidak salah dianggap swipe
- ✅ Kontrol keyboard (Arrow & WASD) + D-Pad (khusus desktop / mouse)
- ✅ Jeda otomatis ketika tab atau aplikasi ditinggalkan
- ✅ Kecepatan meningkat bertahap sesuai skor
- ✅ Desain arcade neon modern & responsif

### 📱 Optimasi Mobile

| Aspek | Penanganan |
|---|---|
| Scroll & zoom tak sengaja | `touch-action: none` pada area papan permainan |
| Pull-to-refresh / efek bounce | `overscroll-behavior: none` pada `html, body` |
| Layar ber-notch / home indicator iPhone | `padding` + `env(safe-area-inset-*)` |
| Bar browser HP muncul / hilang | `min-height: 100dvh` pada `body` |
| Konten terpotong di layar pendek | `margin: auto` pada `.game-container` (tetap bisa di-scroll) |
| Pindah aplikasi saat bermain | Otomatis dijeda lewat event `visibilitychange` |

---

## 🛠️ Kustomisasi

Buka `script.js` dan ubah konstanta di bagian atas file:

| Konstanta | Default | Fungsi |
|---|---|---|
| `GRID_SIZE` | `20` | Jumlah kotak grid (20 = papan 20×20) |
| `CELL_SIZE` | `20` | Ukuran pixel per kotak |
| `BASE_SPEED` | `150` | Kecepatan awal (ms per langkah, makin kecil makin cepat) |
| `MIN_SPEED` | `70` | Kecepatan maksimal |
| `SPEED_STEP` | `5` | Percepatan per apel |
| `SWIPE_MIN_DISTANCE` | `24` | Jarak geser minimal (px) agar dianggap swipe, bukan ketukan |
| `SWIPE_MAX_DURATION` | `800` | Durasi maksimal gesture (ms); lebih lambat dari ini diabaikan |

> ⚠️ Jika mengubah `GRID_SIZE` atau `CELL_SIZE`, sesuaikan juga atribut `width`/`height` pada `<canvas>` di `index.html` (nilai = `GRID_SIZE × CELL_SIZE`).

---

## 📜 Lisensi

Bebas digunakan untuk keperluan belajar dan pengembangan. 🎓
