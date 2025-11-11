// Google Apps Script Backend untuk CRUD Operations
// Copy paste kode ini ke Google Apps Script Editor
// https://script.google.com

// ID Google Sheet Anda (akan diisi setelah membuat sheet)
// Format: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
var SHEET_ID = 'YOUR_SHEET_ID_HERE';
var SHEET_NAME = 'Data'; // Nama sheet/tab

// Column mapping (A-K)
// A: ID
// B: Nama Dosen
// C: Matakuliah - Kelas
// D: Tugas
// E: Pertemuan 1
// F: Pertemuan 2
// G: Pertemuan 3
// H: Pertemuan 4
// I: Pertemuan 5
// J: Pertemuan 6
// K: Pertemuan 7

// Function yang dipanggil saat web app diakses
function doGet(e) {
    return handleRequest(e, 'GET');
}

function doPost(e) {
    return handleRequest(e, 'POST');
}

// Handle semua request (GET dan POST)
function handleRequest(e, method) {
    try {
        var action;
        var parsedData = {};
        
        if (method === 'GET') {
            // GET request - read from parameters
            action = e.parameter.action;
        } else {
            // POST request - support both JSON and form-urlencoded
            var postData = e.postData;
            var contentType = (postData && postData.type) ? postData.type.toLowerCase() : '';
            
            // Check if it's JSON
            if (contentType.indexOf('application/json') !== -1 && postData && postData.contents) {
                // JSON format
                try {
                    parsedData = JSON.parse(postData.contents);
                    action = parsedData.action;
                } catch (parseError) {
                    return createResponse(false, 'Error parsing JSON: ' + parseError.toString(), null);
                }
            } else {
                // Form-urlencoded format - read from e.parameter
                action = e.parameter.action;
                
                // Try to parse data parameter as JSON (from form-urlencoded)
                if (e.parameter.data) {
                    try {
                        // Parse the JSON string to get the data object
                        var dataObj = JSON.parse(e.parameter.data);
                        // Create structure: {action: "...", data: {...}}
                        parsedData = {
                            action: action,
                            data: dataObj
                        };
                    } catch (parseError) {
                        // If parsing fails, construct from individual parameters
                        parsedData = {
                            action: action,
                            data: {
                                id: e.parameter.id || null,
                                nama: e.parameter.nama || '',
                                email: e.parameter.email || '',
                                umur: e.parameter.umur ? parseInt(e.parameter.umur) : null,
                                kota: e.parameter.kota || '',
                                keterangan: e.parameter.keterangan || ''
                            }
                        };
                    }
                } else {
                    // Simple parameters (for delete or simple requests)
                    parsedData = {
                        action: action,
                        id: e.parameter.id || null
                    };
                }
            }
        }
        
        // Store parsed data in e object for handlers
        e.parsedData = parsedData;
        
        switch(action) {
            case 'read':
                return handleRead();
            case 'create':
                return handleCreate(e);
            case 'update':
                return handleUpdate(e);
            case 'delete':
                return handleDelete(e);
            default:
                return createResponse(false, 'Action tidak valid: ' + (action || 'null'), null);
        }
    } catch (error) {
        return createResponse(false, 'Error: ' + error.toString(), null);
    }
}

// READ - Ambil semua data
function handleRead() {
    try {
        var sheet = getSheet();
        var data = getDataFromSheet(sheet);
        return createResponse(true, 'Data berhasil diambil', data);
    } catch (error) {
        return createResponse(false, 'Error membaca data: ' + error.toString(), null);
    }
}

// CREATE - Tidak digunakan lagi, aplikasi hanya untuk update
function handleCreate(e) {
    return createResponse(false, 'Fitur tambah data tidak tersedia. Aplikasi ini hanya untuk update data.', null);
}

// UPDATE - Update data yang sudah ada
function handleUpdate(e) {
    try {
        var parsedData = e.parsedData;
        var data = parsedData && parsedData.data ? parsedData.data : null;
        
        // Validate data
        if (!data || typeof data !== 'object') {
            return createResponse(false, 'Data tidak valid atau tidak ditemukan', null);
        }
        
        var id = data.id;
        if (!id) {
            return createResponse(false, 'ID tidak ditemukan', null);
        }
        
        var sheet = getSheet();
        var dataRows = sheet.getDataRange().getValues();
        
        // Cari baris dengan ID yang sesuai
        var found = false;
        for (var i = 1; i < dataRows.length; i++) {
            if (dataRows[i][0] == id) {
                // Update kolom Tugas (kolom D, index 3)
                if (data.tugas !== undefined) {
                    sheet.getRange(i + 1, 4).setValue(data.tugas);
                }
                
                // Update kolom Pertemuan 1-7 (kolom E-K, index 4-10)
                for (var j = 1; j <= 7; j++) {
                    var pertemuanKey = 'pertemuan' + j;
                    if (data[pertemuanKey] !== undefined) {
                        // Kolom E (Pertemuan 1) = index 4, F (Pertemuan 2) = index 5, dst
                        sheet.getRange(i + 1, 4 + j).setValue(data[pertemuanKey] || '');
                    }
                }
                
                found = true;
                break;
            }
        }
        
        if (!found) {
            return createResponse(false, 'Data tidak ditemukan', null);
        }
        
        return createResponse(true, 'Data berhasil diupdate', { id: id });
    } catch (error) {
        return createResponse(false, 'Error update data: ' + error.toString(), null);
    }
}

// DELETE - Tidak digunakan lagi
function handleDelete(e) {
    return createResponse(false, 'Fitur hapus data tidak tersedia. Aplikasi ini hanya untuk update data.', null);
}

// Helper function untuk mendapatkan sheet
function getSheet() {
    var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Jika sheet tidak ada, buat sheet baru
    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        // Tambah header sesuai struktur baru (A-K)
        sheet.getRange(1, 1, 1, 11).setValues([[
            'ID', 
            'Nama Dosen', 
            'Matakuliah - Kelas', 
            'Tugas', 
            'Pertemuan 1', 
            'Pertemuan 2', 
            'Pertemuan 3', 
            'Pertemuan 4', 
            'Pertemuan 5', 
            'Pertemuan 6', 
            'Pertemuan 7'
        ]]);
        // Format header
        sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
        sheet.getRange(1, 1, 1, 11).setBackground('#4a90e2');
        sheet.getRange(1, 1, 1, 11).setFontColor('#ffffff');
    }
    
    return sheet;
}

// Helper function untuk mengambil data dari sheet
function getDataFromSheet(sheet) {
    var dataRows = sheet.getDataRange().getValues();
    var data = [];
    
    // Skip header (baris pertama)
    for (var i = 1; i < dataRows.length; i++) {
        var row = dataRows[i];
        if (row[0]) { // Skip baris kosong
            data.push({
                id: row[0] || '',
                namaDosen: row[1] || '',
                matakuliahKelas: row[2] || '',
                tugas: row[3] || '',
                pertemuan1: row[4] || '',
                pertemuan2: row[5] || '',
                pertemuan3: row[6] || '',
                pertemuan4: row[7] || '',
                pertemuan5: row[8] || '',
                pertemuan6: row[9] || '',
                pertemuan7: row[10] || ''
            });
        }
    }
    
    return data;
}

// Helper function untuk generate ID unik
function generateId() {
    return 'ID' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Helper function untuk create response dengan CORS headers
function createResponse(success, message, data) {
    var response = {
        success: success,
        message: message,
        data: data
    };
    
    // Create output dengan CORS headers
    var output = ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    
    return output;
}

// Function untuk setup awal (opsional, bisa dipanggil manual)
function setupSheet() {
    var sheet = getSheet();
    // Sheet sudah dibuat dengan header di getSheet()
    Logger.log('Sheet sudah disiapkan');
}

