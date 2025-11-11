# 🚀 Quick Start Guide

Panduan cepat untuk setup dan mengatasi masalah CORS.

## ⚡ Setup Cepat (5 Menit)

### 1. Update Google Apps Script (PENTING!)

**Jika Anda sudah punya Google Apps Script:**

1. Buka [Google Apps Script](https://script.google.com)
2. Buka project Anda
3. **Copy semua kode** dari file `google-apps-script.js`
4. **Paste** menggantikan kode lama
5. **Save** (Ctrl+S)
6. **Re-deploy**:
   - Klik "Deploy" → "Manage deployments"
   - Klik ikon edit (✏️)
   - Klik "New version"
   - Description: "v2 - CORS fix"
   - Klik "Deploy"
   - **Pastikan "Who has access" = "Anyone"**

### 2. Test Aplikasi

1. Buka `index.html` di browser
2. Buka Developer Console (F12)
3. Test:
   - ✅ Tambah data baru
   - ✅ Lihat data
   - ✅ Edit data
   - ✅ Hapus data

### 3. Deploy ke GitHub Pages

1. Upload semua file ke GitHub
2. Enable GitHub Pages di Settings
3. Test di URL GitHub Pages

## 🔧 Mengatasi CORS Error

### Problem
```
Access to fetch at '...' has been blocked by CORS policy
```

### Solution ✅

**Aplikasi sudah diperbaiki!** Cukup:

1. ✅ **Update Google Apps Script** dengan kode baru (lihat langkah 1 di atas)
2. ✅ **Re-deploy** dengan versi baru
3. ✅ **Clear browser cache** (Ctrl+Shift+R)

### Verifikasi

Setelah update, test aplikasi. Seharusnya:
- ✅ Tidak ada error CORS di console
- ✅ Semua fitur CRUD bekerja
- ✅ Data tersimpan di Google Sheets

## 📋 Checklist

- [ ] Google Apps Script di-update dengan kode baru
- [ ] Google Apps Script di-re-deploy
- [ ] "Who has access" = "Anyone"
- [ ] Sheet ID sudah benar
- [ ] config.js sudah di-update dengan Web App URL
- [ ] Test Create → ✅
- [ ] Test Read → ✅
- [ ] Test Update → ✅
- [ ] Test Delete → ✅
- [ ] Tidak ada error CORS → ✅

## 🆘 Masih Ada Masalah?

1. **Baca** file `CORS_FIX.md` untuk detail lengkap
2. **Cek** browser console untuk error detail
3. **Cek** Google Apps Script execution log
4. **Pastikan** semua langkah di atas sudah dilakukan

---

**Selamat! Aplikasi Anda seharusnya sudah bekerja tanpa masalah CORS! 🎉**

