# Panduan Kompilasi & Build macOS - CV Sabila Invoice Manager

Panduan ini berisi langkah-langkah lengkap (*step-by-step*) untuk menjalankan dan mengompilasi aplikasi desktop **CV Sabila Invoice** di macOS (**Apple Silicon M1/M2/M3/M4** maupun **Intel Mac**).

Aplikasi ini menggunakan:
- **Tauri v2** (Rust desktop backend & window manager)
- **React + Vite + TypeScript + Tailwind CSS** (Frontend)
- **Bun** (Package manager & runtime script)

---

## 1. Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan macOS Anda sudah terpasang tools pengembangan dasar berikut:

### A. Xcode Command Line Tools
Dibutuhkan untuk compiler C/C++, clang, dan linker native macOS.

Buka **Terminal** di Mac Anda, lalu jalankan:
```bash
xcode-select --install
```
*Akan muncul pop-up jendela instalasi. Klik **Install** dan tunggu hingga selesai.*

Untuk memverifikasi:
```bash
clang --version
```

---

### B. Rust & Cargo
Tauri v2 membutuhkan Rust versi stabil.

Jalankan perintah resmi berikut di Terminal:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
- Pilih opsi **1 (Proceed with standard installation)** saat diminta.

Setelah selesai, aktifkan environment Rust:
```bash
source "$HOME/.cargo/env"
```

Verifikasi versi:
```bash
rustc --version
cargo --version
```

#### Tambahkan Target Kompilasi macOS:
Sesuaikan dengan tipe prosesor Mac Anda:
- **Untuk Apple Silicon (M1/M2/M3/M4):**
  ```bash
  rustup target add aarch64-apple-darwin
  ```
- **Untuk Mac berbasis Intel:**
  ```bash
  rustup target add x86_64-apple-darwin
  ```
- **(Disarankan) Tambahkan keduanya jika ingin membuat Universal Binary (bisa jalan di semua Mac):**
  ```bash
  rustup target add aarch64-apple-darwin x86_64-apple-darwin
  ```

---

### C. Bun
Proyek ini dikonfigurasi menggunakan **Bun** pada script Tauri (`tauri.conf.json` mengeksekusi `bun run dev` dan `bun run build`).

Install Bun melalui Terminal:
```bash
curl -fsSL https://bun.sh/install | bash
```

Atau via Homebrew (jika menggunakan brew):
```bash
brew install oven-sh/bun/bun
```

Setelah selesai, muat ulang shell profile:
```bash
source ~/.zshrc    # atau source ~/.bash_profile jika memakai bash
```

Verifikasi versi:
```bash
bun --version
```

---

## 2. Setup Proyek & Dependensi

1. Pindahkan folder proyek ini ke Mac Anda, lalu buka Terminal dan masuk ke direktori proyek:
   ```bash
   cd /path/ke/cvsabila
   ```

2. Install seluruh dependensi JavaScript / Node:
   ```bash
   bun install
   ```

---

## 3. Menjalankan Mode Development (Live Dev / Debug)

Untuk menjalankan aplikasi dalam mode development dengan fitur *Hot Module Replacement (HMR)* dan live debugging:

```bash
bun run tauri dev
```

*Saat pertama kali dijalankan, Cargo akan mengunduh dan mengompilasi crate Rust. Proses ini memakan waktu beberapa menit. Setelah selesai, jendela aplikasi akan otomatis terbuka.*

> **Catatan (Opsional Server Backend):**
> Jika Anda memerlukan mock server data lokal untuk produk/katalog:
> ```bash
> bun run server
> ```
> Server backend akan berjalan di `http://localhost:3001` (atau port yang tertera di log).

---

## 4. Kompilasi & Build Production (.dmg dan .app)

### Opsi A: Build Sesuai Arsitektur Mac Anda Saat Ini
Perintah ini akan membuat installer untuk arsitektur komputer tempat Anda melakukan build (misal: M1/M2/M3/M4 -> `aarch64`):

```bash
bun run tauri build
```

---

### Opsi B: Build Universal Binary (Rekomendasi Distribusi)
Membuat satu paket installer tunggal yang kompatibel langsung untuk **Apple Silicon dan Intel Mac**:

1. Pastikan target sudah terpasang:
   ```bash
   rustup target add aarch64-apple-darwin x86_64-apple-darwin
   ```

2. Jalankan build universal:
   ```bash
   bun run tauri build --target universal-apple-darwin
   ```

---

## 5. Lokasi File Hasil Kompilasi

Setelah proses build selesai dengan status `Finished`, file executable dan installer dapat ditemukan di:

### Build Standar (Opsi A):
- **Installer macOS (.dmg):**
  ```text
  src-tauri/target/release/bundle/dmg/CV Sabila Invoice_1.0.0_aarch64.dmg
  ```
  *(Nama file berakhiran `_x64.dmg` jika dibuild di Mac Intel)*
- **Aplikasi (.app):**
  ```text
  src-tauri/target/release/bundle/macos/CV Sabila Invoice.app
  ```

### Build Universal (Opsi B):
- **Installer macOS (.dmg):**
  ```text
  src-tauri/target/universal-apple-darwin/release/bundle/dmg/CV Sabila Invoice_1.0.0_universal.dmg
  ```
- **Aplikasi (.app):**
  ```text
  src-tauri/target/universal-apple-darwin/release/bundle/macos/CV Sabila Invoice.app
  ```

---

## 6. Penanganan Keamanan macOS (Gatekeeper / "App is damaged")

Karena aplikasi dikompilasi secara lokal tanpa sertifikat berbayar Apple Developer ID dan Notarization, macOS Gatekeeper secara default akan memblokir aplikasi saat dibuka pertama kali dengan pesan seperti:
> *"CV Sabila Invoice is damaged and can’t be opened. You should move it to the Trash."*  
> atau  
> *"CV Sabila Invoice cannot be opened because the developer cannot be verified."*

### Solusi 1: Hilangkan Atribut Karantina macOS via Terminal (Paling Cepat & Ampuh)
Jika Anda sudah memasang aplikasi ke folder `/Applications`:
```bash
xattr -cr "/Applications/CV Sabila Invoice.app"
```

Atau jika file `.app` masih di folder build / Downloads:
```bash
xattr -cr "src-tauri/target/release/bundle/macos/CV Sabila Invoice.app"
```

### Solusi 2: Melalui Pengaturan macOS (GUI)
1. Buka **System Settings (Pengaturan Sistem)** > **Privacy & Security (Privasi & Keamanan)**.
2. Gulir ke bawah ke bagian **Security**.
3. Di samping pemberitahuan aplikasi diblokir, klik tombol **Open Anyway (Tetap Buka)**.
4. Masukkan password Mac Anda untuk konfirmasi.

---

## 7. Troubleshooting Masalah Umum

### 1. `xcrun: error: invalid active developer path`
- **Penyebab:** Xcode Command Line Tools belum terpasang atau perlu diperbarui setelah update macOS.
- **Solusi:**
  ```bash
  xcode-select --reset
  xcode-select --install
  ```

### 2. `error: could not find 'bun' in PATH` saat menjalankan Tauri
- **Penyebab:** Shell sub-process Tauri tidak menemukan path binary Bun.
- **Solusi:**
  Pastikan path Bun terdaftar di `~/.zshrc`:
  ```bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  ```
  Lalu jalankan `source ~/.zshrc`.

### 3. Ingin Membersihkan Cache Build (Clean Build)
Jika terjadi error cache kompilasi Rust atau Vite:
```bash
# Hapus build frontend
rm -rf dist

# Hapus cache build Rust
cd src-tauri && cargo clean && cd ..

# Jalankan build ulang
bun run tauri build
```
