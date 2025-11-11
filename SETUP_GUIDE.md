# 📖 Panduan Setup Step-by-Step

Panduan lengkap untuk setup aplikasi Kuesioner App dari awal sampai deploy.

## Langkah 1: Persiapan Google Sheet

### 1.1 Buat Google Sheet Baru

1. Buka browser dan kunjungi: https://sheets.google.com
2. Klik **"Blank"** untuk membuat spreadsheet baru
3. Beri nama spreadsheet: **"Kuesioner Database"** (atau nama lain sesuai keinginan)

### 1.2 Dapatkan Sheet ID

1. Lihat URL di address bar browser
2. Format URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. **Copy Sheet ID** (string panjang antara `/d/` dan `/edit`)
   - Contoh: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
4. **Simpan Sheet ID ini** - akan digunakan nanti

## Langkah 2: Setup Google Apps Script

### 2.1 Buat Project Baru

1. Buka: https://script.google.com
2. Klik **"+ New project"**
3. Project akan terbuka dengan nama "Untitled project"

### 2.2 Paste Kode Backend

1. Buka file `google-apps-script.js` di folder project ini
2. **Copy semua isi file**
3. Di Google Apps Script editor, **hapus semua kode default** (function myFunction)
4. **Paste kode yang sudah di-copy**

### 2.3 Update Sheet ID

1. Di baris 7, cari: `var SHEET_ID = 'YOUR_SHEET_ID_HERE';`
2. Ganti `'YOUR_SHEET_ID_HERE'` dengan Sheet ID yang Anda copy di Langkah 1.2
   - Contoh: `var SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';`

### 2.4 Simpan Project

1. Klik **"Untitled project"** di bagian atas
2. Ganti nama menjadi: **"Kuesioner API"**
3. Klik **💾 Save** (Ctrl+S atau Cmd+S)

## Langkah 3: Deploy sebagai Web App

### 3.1 Buat Deployment

1. Di Google Apps Script, klik **"Deploy"** → **"New deployment"**
2. Klik ikon **⚙️ gear** di sebelah "Select type"
3. Pilih **"Web app"**

### 3.2 Konfigurasi Deployment

Isi form dengan:
- **Description**: `Kuesioner API v1` (atau versi lain)
- **Execute as**: **"Me"** (akun Anda)
- **Who has access**: **"Anyone"** ⚠️ (PENTING: harus "Anyone" agar bisa diakses dari GitHub Pages)

### 3.3 Deploy dan Authorize

1. Klik tombol **"Deploy"**
2. Akan muncul popup "Authorization required"
3. Klik **"Authorize access"**
4. Pilih akun Google Anda
5. Akan muncul peringatan "Google hasn't verified this app"
6. Klik **"Advanced"**
7. Klik **"Go to Kuesioner API (unsafe)"** (atau nama project Anda)
8. Klik **"Allow"** untuk memberikan izin

### 3.4 Dapatkan Web App URL

1. Setelah authorize, akan muncul popup "Web app deployed"
2. **Copy Web App URL** (format: `https://script.google.com/macros/s/AKfycby.../exec`)
3. **Simpan URL ini** - akan digunakan di config.js
4. Klik **"Done"**

### 3.5 Verifikasi Deployment

1. Di halaman "Deployments", pastikan status adalah **"Active"**
2. Jika perlu update kode, klik **"Edit"** (pencil icon) → **"New version"** → update description → **"Deploy"**

## Langkah 4: Update Config Web App

### 4.1 Buka config.js

1. Buka file `config.js` di folder project
2. Cari baris: `API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'`

### 4.2 Update URL

1. Ganti `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` dengan Web App URL dari Langkah 3.4
2. Contoh:
   ```javascript
   const CONFIG = {
       API_URL: 'https://script.google.com/macros/s/AKfycby123456789/exec'
   };
   ```
3. **Simpan file**

## Langkah 5: Test Lokal

### 5.1 Buka di Browser

1. Buka file `index.html` di browser (double-click file)
2. Atau buka dengan Live Server jika menggunakan VS Code

### 5.2 Test Fitur

1. **Create**: Klik "Tambah Data" → isi form → klik "Simpan"
2. **Read**: Pastikan data muncul di list
3. **Update**: Klik tombol edit (✏️) → ubah data → klik "Update"
4. **Delete**: Klik tombol hapus (🗑️) → konfirmasi

### 5.3 Verifikasi di Google Sheet

1. Buka Google Sheet yang Anda buat di Langkah 1
2. Pastikan ada tab "Data" (akan dibuat otomatis)
3. Pastikan data yang Anda input muncul di sheet

## Langkah 6: Deploy ke GitHub Pages

### 6.1 Buat Repository GitHub

1. Buka: https://github.com
2. Klik **"+"** → **"New repository"**
3. Isi:
   - **Repository name**: `kuesioner-app` (atau nama lain)
   - **Description**: "Mobile CRUD App with Google Sheets"
   - **Visibility**: Public atau Private (Public untuk GitHub Pages gratis)
   - ❌ Jangan centang "Initialize with README" (jika sudah ada file)
4. Klik **"Create repository"**

### 6.2 Upload File ke GitHub

#### Option A: Menggunakan GitHub Web Interface

1. Di halaman repository, klik **"uploading an existing file"**
2. Drag & drop semua file ke repository:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
   - `manifest.json`
   - `README.md`
   - `.gitignore`
3. Klik **"Commit changes"**

#### Option B: Menggunakan Git CLI

```bash
# Navigate ke folder project
cd path/to/Kuesioner_tugas

# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit: Kuesioner App"

# Add remote
git remote add origin https://github.com/[username]/[repository-name].git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### 6.3 Enable GitHub Pages

1. Di repository GitHub, klik **"Settings"** (di bagian atas)
2. Scroll ke sidebar kiri, klik **"Pages"**
3. Di bagian "Source":
   - Pilih **"Deploy from a branch"**
   - Branch: **"main"** (atau "master")
   - Folder: **"/ (root)"**
4. Klik **"Save"**
5. Tunggu beberapa menit
6. Akses aplikasi di: `https://[username].github.io/[repository-name]`

### 6.4 Verifikasi Deployment

1. Buka URL GitHub Pages di browser
2. Test semua fitur CRUD
3. Pastikan data tersimpan di Google Sheet

## ✅ Checklist Setup

- [ ] Google Sheet dibuat dan Sheet ID didapat
- [ ] Google Apps Script project dibuat
- [ ] Kode backend di-paste dan Sheet ID di-update
- [ ] Google Apps Script di-deploy sebagai Web App
- [ ] Authorization sudah diberikan
- [ ] Web App URL didapat
- [ ] config.js di-update dengan Web App URL
- [ ] Test lokal berhasil
- [ ] File di-upload ke GitHub
- [ ] GitHub Pages di-enable
- [ ] Aplikasi bisa diakses di GitHub Pages
- [ ] Semua fitur CRUD berfungsi

## 🐛 Troubleshooting

### Problem: "Gagal memuat data"

**Solusi:**
1. Pastikan Web App URL di `config.js` sudah benar
2. Pastikan Google Apps Script deployment status "Active"
3. Pastikan "Who has access" di set ke "Anyone"
4. Buka browser console (F12) untuk lihat error detail

### Problem: CORS Error

**Solusi:**
1. Pastikan Google Apps Script di-deploy dengan akses "Anyone"
2. Re-deploy Google Apps Script dengan versi baru

### Problem: Data tidak tersimpan

**Solusi:**
1. Pastikan Sheet ID benar di Google Apps Script
2. Pastikan sudah authorize Google Apps Script
3. Cek execution log di Google Apps Script (View → Execution log)

### Problem: GitHub Pages tidak update

**Solusi:**
1. Pastikan file sudah di-commit dan push
2. Tunggu 1-2 menit untuk GitHub Pages rebuild
3. Clear browser cache (Ctrl+Shift+R)

## 📞 Need Help?

Jika masih ada masalah, cek:
1. Browser console untuk error JavaScript
2. Google Apps Script execution log
3. Network tab di browser untuk melihat request/response

---

**Selamat! Aplikasi Anda sudah siap digunakan! 🎉**

