// Configuration file
// IMPORTANT: Replace this with your Google Apps Script Web App URL after deployment
const CONFIG = {
    // Ganti URL ini dengan URL Google Apps Script Web App Anda
    // Contoh: 'https://script.google.com/macros/s/AKfycby.../exec'
    API_URL: 'https://script.google.com/macros/s/AKfycbwkeVavq3bdpUqny623JL8tAmulYmX7H5wdyVC7IF4HW-kuToNQZFTqPVmMMSWuxe3-/exec'
};

// Helper function to show error if config is not set
if (!CONFIG.API_URL || CONFIG.API_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
    console.warn('⚠️ Peringatan: Silakan set URL Google Apps Script di config.js');
}

