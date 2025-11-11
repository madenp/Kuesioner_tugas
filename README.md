# Kuesioner App - Mobile Web App dengan CRUD

Aplikasi web mobile-first dengan fitur CRUD (Create, Read, Update, Delete) yang menggunakan Google Sheets sebagai database. Aplikasi ini dapat dihosting di GitHub Pages.

## 🚀 Fitur

- ✅ **Create** - Tambah data baru
- ✅ **Read** - Lihat semua data
- ✅ **Update** - Edit data yang sudah ada
- ✅ **Delete** - Hapus data
- 📱 **Mobile-First Design** - Optimized untuk tampilan mobile
- 🎨 **Modern UI** - Interface yang menarik dan user-friendly
- ☁️ **Google Sheets Database** - Menggunakan Google Sheets sebagai database
- 🌐 **GitHub Pages Ready** - Siap dihosting di GitHub Pages

## 📋 Prerequisites

- Akun Google (untuk Google Sheets dan Google Apps Script)
- Akun GitHub (untuk hosting)

## 🛠️ Setup Instructions

### 1. Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Beri nama spreadsheet (contoh: "Kuesioner Database")
4. Copy **Sheet ID** dari URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Contoh: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 2. Buat Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Klik **"New Project"**
3. Hapus kode default dan paste kode dari file `google-apps-script.js`
4. Ganti `YOUR_SHEET_ID_HERE` dengan Sheet ID yang Anda copy di langkah 1
5. Simpan project dengan nama "Kuesioner API" (atau nama lain)

### 3. Deploy Google Apps Script sebagai Web App

1. Di Google Apps Script editor, klik **"Deploy"** → **"New deployment"**
2. Klik ikon gear ⚙️ di sebelah "Select type" → pilih **"Web app"**
3. Isi konfigurasi:
   - **Description**: "Kuesioner API v1" (atau versi lainnya)
   - **Execute as**: "Me"
   - **Who has access**: **"Anyone"** (penting untuk GitHub Pages)
4. Klik **"Deploy"**
5. **Authorize access** saat diminta:
   - Klik "Authorize access"
   - Pilih akun Google Anda
   - Klik "Advanced" → "Go to [Project Name] (unsafe)"
   - Klik "Allow"
6. **Copy Web App URL** yang muncul (format: `https://script.google.com/macros/s/AKfycby.../exec`)
7. **Penting**: Klik "Done" dan pastikan deployment status adalah "Active"

### 4. Update Config di Web App

1. Buka file `config.js`
2. Ganti `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` dengan Web App URL yang Anda copy
3. Simpan file

```javascript
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycby.../exec'
};
```

### 5. Test Lokal (Opsional)

1. Buka file `index.html` di browser
2. Test semua fitur CRUD
3. Pastikan data muncul di Google Sheet Anda

### 6. Deploy ke GitHub Pages

#### Option A: Menggunakan GitHub Desktop / Git CLI

1. Buat repository baru di GitHub
2. Clone repository ke komputer Anda
3. Copy semua file ke folder repository
4. Commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Kuesioner App"
   git push origin main
   ```

#### Option B: Menggunakan GitHub Web Interface

1. Buat repository baru di GitHub
2. Klik "Add file" → "Upload files"
3. Upload semua file ke repository
4. Klik "Commit changes"

#### Enable GitHub Pages

1. Di repository GitHub, klik **"Settings"**
2. Scroll ke **"Pages"** di sidebar kiri
3. Di "Source", pilih **"Deploy from a branch"**
4. Pilih branch **"main"** (atau "master")
5. Pilih folder **"/ (root)"**
6. Klik **"Save"**
7. Tunggu beberapa menit, lalu akses aplikasi di: `https://[username].github.io/[repository-name]`

## 📁 Struktur File

```
├── index.html              # Halaman utama
├── styles.css              # Styling
├── app.js                  # Logika aplikasi
├── config.js               # Konfigurasi API URL
├── google-apps-script.js   # Backend Google Apps Script
├── manifest.json           # PWA manifest
└── README.md               # Dokumentasi
```

## 🔧 Konfigurasi

### Mengubah Kolom Data

Jika Anda ingin menambah/mengubah kolom data:

1. **Update Google Apps Script** (`google-apps-script.js`):
   - Tambah kolom baru di header sheet
   - Update fungsi `handleCreate` dan `handleUpdate`
   - Update fungsi `getDataFromSheet`

2. **Update Frontend** (`index.html` dan `app.js`):
   - Tambah input field di form
   - Update fungsi `createDataItemHTML` untuk menampilkan data baru
   - Update fungsi `saveData` untuk mengirim data baru

### Mengubah Tema Warna

Edit variabel CSS di `styles.css`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #7b68ee;
    /* ... */
}
```

## 🐛 Troubleshooting

### Error: "Gagal memuat data"

- Pastikan URL Google Apps Script sudah benar di `config.js`
- Pastikan Google Apps Script sudah di-deploy dan status "Active"
- Pastikan "Who has access" di set ke "Anyone"
- Cek browser console untuk error detail

### Error: "CORS" atau "Access-Control-Allow-Origin"

**✅ SOLUSI SUDAH DITERAPKAN!**

Aplikasi sudah di-update untuk mengatasi masalah CORS dengan menggunakan `application/x-www-form-urlencoded` untuk POST requests.

**Jika masih ada masalah CORS:**

1. **Pastikan Google Apps Script sudah di-update** dengan kode terbaru dari `google-apps-script.js`
2. **Re-deploy Google Apps Script** dengan versi baru:
   - Deploy → Manage deployments → Edit → New version → Deploy
3. **Pastikan "Who has access"** di set ke **"Anyone"**
4. **Clear browser cache** (Ctrl+Shift+R)
5. Lihat file `CORS_FIX.md` untuk detail lengkap

### Data tidak tersimpan

- Pastikan Sheet ID sudah benar di Google Apps Script
- Pastikan Anda sudah authorize Google Apps Script
- Cek execution log di Google Apps Script untuk error

### GitHub Pages tidak update

- Pastikan file sudah di-commit dan push
- Tunggu beberapa menit untuk GitHub Pages rebuild
- Clear cache browser (Ctrl+Shift+R atau Cmd+Shift+R)

## 🔒 Keamanan

⚠️ **Penting**: 
- Google Apps Script Web App dengan akses "Anyone" bisa diakses oleh siapa saja
- Untuk aplikasi production, pertimbangkan untuk menambahkan autentikasi
- Jangan simpan data sensitif tanpa enkripsi

## 📝 License

MIT License - bebas digunakan untuk proyek apapun

## 🤝 Kontribusi

Silakan buat issue atau pull request jika ada saran perbaikan!

## 📧 Support

Jika ada pertanyaan atau masalah, silakan buat issue di GitHub repository.

---

**Selamat menggunakan! 🎉**

