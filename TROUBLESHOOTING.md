# 🔧 Troubleshooting Guide

Panduan lengkap untuk mengatasi masalah umum.

## ❌ Error: "Cannot read properties of undefined (reading 'nama')"

### Penyebab
Data tidak ter-parse dengan benar dari form-urlencoded ke object JavaScript.

### Solusi ✅

1. **Pastikan Google Apps Script sudah di-update** dengan kode terbaru dari `google-apps-script.js`
2. **Re-deploy Google Apps Script** dengan versi baru
3. **Clear browser cache** (Ctrl+Shift+R)

### Verifikasi

1. Buka Google Apps Script
2. Klik "Executions" di sidebar kiri
3. Lihat execution log untuk melihat error detail
4. Pastikan data ter-parse dengan benar

## ❌ Error: "Data tidak valid atau tidak ditemukan"

### Penyebab
Struktur data yang dikirim tidak sesuai dengan yang diharapkan.

### Solusi

1. **Cek browser console** (F12) untuk melihat data yang dikirim
2. **Cek Google Apps Script execution log** untuk melihat data yang diterima
3. **Pastikan** struktur data sesuai:
   ```javascript
   {
     action: "create",
     data: {
       id: null,
       nama: "...",
       email: "...",
       umur: 25,
       kota: "...",
       keterangan: "..."
     }
   }
   ```

## ❌ Error: CORS Policy

### Penyebab
Browser memblokir request karena CORS policy.

### Solusi ✅

**Sudah diperbaiki!** Aplikasi menggunakan `application/x-www-form-urlencoded` untuk menghindari CORS preflight.

Jika masih ada masalah:

1. **Pastikan Google Apps Script sudah di-update** dengan kode terbaru
2. **Re-deploy** dengan versi baru
3. **Pastikan "Who has access" = "Anyone"**
4. **Clear browser cache**

## ❌ Data tidak tersimpan

### Penyebab
- Sheet ID tidak benar
- Google Apps Script tidak ter-authorize
- Error di execution

### Solusi

1. **Cek Sheet ID** di Google Apps Script:
   ```javascript
   var SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
   Pastikan Sheet ID sudah diisi dengan benar.

2. **Authorize Google Apps Script**:
   - Deploy → Manage deployments
   - Klik "Authorize access"
   - Pilih akun Google
   - Klik "Allow"

3. **Cek Execution Log**:
   - Klik "Executions" di sidebar
   - Lihat execution terakhir
   - Cek apakah ada error

## ❌ Error: "ID tidak ditemukan" saat Update/Delete

### Penyebab
ID tidak terkirim dengan benar atau tidak ada di sheet.

### Solusi

1. **Cek ID di sheet** - pastikan ID sudah ada
2. **Cek browser console** - pastikan ID terkirim dengan benar
3. **Cek Google Apps Script execution log** - pastikan ID diterima dengan benar

## 🔍 Debug Tips

### 1. Cek Browser Console

Buka Developer Tools (F12) → Console tab:
- Lihat error messages
- Cek network requests
- Lihat data yang dikirim

### 2. Cek Google Apps Script Execution Log

1. Buka Google Apps Script
2. Klik "Executions" di sidebar
3. Lihat execution terakhir
4. Klik execution untuk melihat detail
5. Cek Logger output

### 3. Test Manual Google Apps Script

1. Buka Google Apps Script
2. Pilih function `handleRead`
3. Klik "Run"
4. Lihat hasil di Logger

### 4. Test API Langsung

Test dengan curl atau Postman:

```bash
# Test Read
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=read"

# Test Create (form-urlencoded)
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "action=create&data={\"nama\":\"Test\",\"email\":\"test@test.com\",\"umur\":25,\"kota\":\"Jakarta\"}"
```

## 📋 Checklist Debugging

- [ ] Browser console tidak ada error JavaScript
- [ ] Network requests berhasil (status 200)
- [ ] Google Apps Script execution log tidak ada error
- [ ] Sheet ID sudah benar
- [ ] Google Apps Script sudah ter-authorize
- [ ] Deployment status "Active"
- [ ] "Who has access" = "Anyone"
- [ ] Data terkirim dengan format yang benar
- [ ] Data ter-parse dengan benar di Google Apps Script

## 🆘 Masih Ada Masalah?

1. **Cek semua file** sudah di-update dengan versi terbaru
2. **Re-deploy** Google Apps Script
3. **Clear browser cache**
4. **Cek execution log** untuk error detail
5. **Test dengan data sederhana** terlebih dahulu

---

**Jika masih ada masalah, buat issue dengan detail error message dan step untuk reproduce!**

