// Main Application Logic
class KuesionerApp {
    constructor() {
        this.currentView = 'dosen'; // 'dosen' or 'courses'
        this.currentDosen = null;
        this.allData = [];
        this.allDosenNames = []; // Store all dosen names for filtering
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
    }

    bindEvents() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showDosenView();
        });

        // Close modal button
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submit
        document.getElementById('updateForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveData();
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        searchInput.addEventListener('input', (e) => {
            this.filterDosenCards(e.target.value);
            // Show/hide clear button
            if (e.target.value.length > 0) {
                searchClear.classList.remove('hidden');
            } else {
                searchClear.classList.add('hidden');
            }
        });

        // Clear search
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.add('hidden');
            this.filterDosenCards('');
        });

        // Radio button change - show/hide pertemuan checkboxes
        document.getElementById('tugasYa').addEventListener('change', () => {
            if (document.getElementById('tugasYa').checked) {
                document.getElementById('pertemuanGroup').classList.remove('hidden');
            }
        });

        document.getElementById('tugasTidak').addEventListener('change', () => {
            if (document.getElementById('tugasTidak').checked) {
                document.getElementById('pertemuanGroup').classList.add('hidden');
                // Clear all checkboxes and sliders
                this.clearPertemuanSelection();
            }
        });

        // Close modal on background click
        document.getElementById('updateModal').addEventListener('click', (e) => {
            if (e.target.id === 'updateModal') {
                this.closeModal();
            }
        });
    }

    async loadData() {
        this.showLoading(true);
        this.hideMessages();

        try {
            const response = await fetch(`${CONFIG.API_URL}?action=read`);
            
            if (!response.ok) {
                throw new Error('Gagal memuat data');
            }

            const result = await response.json();
            
            if (result.success) {
                this.allData = result.data || [];
                this.displayDosenCards();
            } else {
                throw new Error(result.message || 'Gagal memuat data');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Gagal memuat data. Pastikan URL Google Apps Script sudah benar di config.js');
            this.allData = [];
            this.displayDosenCards();
        } finally {
            this.showLoading(false);
        }
    }

    displayDosenCards() {
        // Get unique dosen names and sort A-Z
        this.allDosenNames = [...new Set(this.allData.map(item => item.namaDosen).filter(Boolean))].sort();
        
        // Show search container
        document.getElementById('searchContainer').classList.remove('hidden');
        
        // Display all dosen cards
        this.filterDosenCards('');
    }

    filterDosenCards(searchTerm) {
        const dosenList = document.getElementById('dosenList');
        const emptyState = document.getElementById('emptyState');

        // Filter dosen names based on search term
        const filteredDosenNames = searchTerm.trim() === '' 
            ? this.allDosenNames 
            : this.allDosenNames.filter(namaDosen => 
                namaDosen.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (filteredDosenNames.length === 0) {
            dosenList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.innerHTML = `
                <div class="empty-icon">🔍</div>
                <h2>Tidak ditemukan</h2>
                <p>Tidak ada dosen yang cocok dengan "${this.escapeHtml(searchTerm)}"</p>
            `;
            return;
        }

        dosenList.classList.remove('hidden');
        emptyState.classList.add('hidden');

        dosenList.innerHTML = filteredDosenNames.map(namaDosen => 
            this.createDosenCardHTML(namaDosen)
        ).join('');

        // Bind click events
        filteredDosenNames.forEach(namaDosen => {
            document.getElementById(`dosenCard-${this.sanitizeId(namaDosen)}`).addEventListener('click', () => {
                this.showCourseList(namaDosen);
            });
        });
    }

    createDosenCardHTML(namaDosen) {
        const id = this.sanitizeId(namaDosen);
        return `
            <div class="dosen-card" id="dosenCard-${id}">
                <div class="dosen-card-content">
                    <h3 class="dosen-card-title">${this.escapeHtml(namaDosen)}</h3>
                    <span class="dosen-card-arrow">→</span>
                </div>
            </div>
        `;
    }

    showCourseList(namaDosen) {
        this.currentDosen = namaDosen;
        this.currentView = 'courses';

        // Hide dosen list, show course list
        document.getElementById('dosenList').classList.add('hidden');
        document.getElementById('courseList').classList.remove('hidden');
        document.getElementById('backBtn').classList.remove('hidden');
        document.getElementById('searchContainer').classList.add('hidden');
        document.getElementById('headerTitle').textContent = `📚 ${namaDosen}`;

        // Get courses for this dosen with full data
        const courses = this.allData
            .filter(item => item.namaDosen === namaDosen)
            .map(item => ({
                id: item.id,
                matakuliahKelas: item.matakuliahKelas || '',
                tugas: item.tugas || '',
                pertemuan1: item.pertemuan1 || '',
                pertemuan2: item.pertemuan2 || '',
                pertemuan3: item.pertemuan3 || '',
                pertemuan4: item.pertemuan4 || '',
                pertemuan5: item.pertemuan5 || '',
                pertemuan6: item.pertemuan6 || '',
                pertemuan7: item.pertemuan7 || ''
            }));

        const courseListContainer = document.getElementById('courseList');
        
        // Clear and rebuild course list structure
        courseListContainer.innerHTML = '';
        
        // Create title element
        const courseListTitle = document.createElement('h2');
        courseListTitle.className = 'section-title';
        courseListTitle.id = 'courseListTitle';
        courseListTitle.textContent = `Mata Kuliah Yang Diampu - ${namaDosen}`;
        courseListContainer.appendChild(courseListTitle);

        if (courses.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>Tidak ada mata kuliah untuk dosen ini</p>';
            courseListContainer.appendChild(emptyState);
            return;
        }

        // Create course items container
        const courseItemsContainer = document.createElement('div');
        courseItemsContainer.className = 'course-items';
        
        const courseItemsHTML = courses.map(course => 
            this.createCourseItemHTML(course)
        ).join('');
        
        courseItemsContainer.innerHTML = courseItemsHTML;
        courseListContainer.appendChild(courseItemsContainer);

        // Bind click events
        courses.forEach(course => {
            document.getElementById(`courseItem-${course.id}`).addEventListener('click', () => {
                this.openUpdateModal(course);
            });
        });
    }

    createCourseItemHTML(course) {
        // Calculate percentage of checked pertemuan
        const pertemuanList = [
            course.pertemuan1,
            course.pertemuan2,
            course.pertemuan3,
            course.pertemuan4,
            course.pertemuan5,
            course.pertemuan6,
            course.pertemuan7
        ];
        
        // Filter pertemuan that have values (handle string, number, or empty)
        const checkedCount = pertemuanList.filter(p => {
            if (p === null || p === undefined) return false;
            const value = String(p).trim();
            return value !== '';
        }).length;
        
        const percentage = checkedCount > 0 ? Math.round((checkedCount / 7) * 100) : 0;
        
        const tugasStatus = course.tugas || 'Belum diisi';
        const tugasClass = tugasStatus === 'Ya' ? 'status-ya' : tugasStatus === 'Tidak' ? 'status-tidak' : 'status-empty';
        
        return `
            <div class="course-item" id="courseItem-${course.id}">
                <div class="course-item-content">
                    <div class="course-item-main">
                        <h4 class="course-item-title">${this.escapeHtml(course.matakuliahKelas)}</h4>
                        <div class="course-item-details">
                            <div class="course-detail-item">
                                <span class="detail-label">Tugas:</span>
                                <span class="detail-value ${tugasClass}">${this.escapeHtml(tugasStatus)}</span>
                            </div>
                            ${tugasStatus === 'Ya' ? `
                            <div class="course-detail-item">
                                <span class="detail-label">Pertemuan:</span>
                                <span class="detail-value detail-percentage">${percentage}% (${checkedCount}/7)</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <span class="course-item-arrow">→</span>
                </div>
            </div>
        `;
    }

    showDosenView() {
        this.currentView = 'dosen';
        this.currentDosen = null;

        document.getElementById('dosenList').classList.remove('hidden');
        document.getElementById('courseList').classList.add('hidden');
        document.getElementById('backBtn').classList.add('hidden');
        document.getElementById('searchContainer').classList.remove('hidden');
        document.getElementById('headerTitle').textContent = '📋 Kuesioner Persentase Dosen yang Memberikan Tugas Mandiri';
        
        // Clear search when going back
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        searchInput.value = '';
        searchClear.classList.add('hidden');
        this.filterDosenCards('');
    }

    openUpdateModal(course) {
        const modal = document.getElementById('updateModal');
        const data = this.allData.find(item => item.id === course.id);

        if (!data) {
            this.showError('Data tidak ditemukan');
            return;
        }

        // Set hidden fields
        document.getElementById('dataId').value = data.id;
        document.getElementById('matakuliahKelas').value = data.matakuliahKelas || '';
        document.getElementById('matakuliahName').textContent = data.matakuliahKelas || '';

        // Set current tugas value if exists
        if (data.tugas) {
            if (data.tugas === 'Ya') {
                document.getElementById('tugasYa').checked = true;
                document.getElementById('pertemuanGroup').classList.remove('hidden');
            } else {
                document.getElementById('tugasTidak').checked = true;
                document.getElementById('pertemuanGroup').classList.add('hidden');
            }
        } else {
            // Reset form
            document.getElementById('tugasYa').checked = false;
            document.getElementById('tugasTidak').checked = false;
            document.getElementById('pertemuanGroup').classList.add('hidden');
        }

        // Generate pertemuan checkboxes
        this.generatePertemuanCheckboxes(data);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    generatePertemuanCheckboxes(data) {
        const container = document.getElementById('pertemuanCheckboxes');
        
        container.innerHTML = '';

        // Store data reference for event listeners
        const self = this;
        const dataRef = data;

        // Create checkboxes for Pertemuan 1-7
        for (let i = 1; i <= 7; i++) {
            const pertemuanKey = `pertemuan${i}`;
            const pertemuanValue = dataRef[pertemuanKey] || '';

            // Create wrapper div for checkbox and slider
            const wrapper = document.createElement('div');
            wrapper.className = 'pertemuan-item';
            wrapper.id = `pertemuanItem${i}`;

            // Create label element
            const label = document.createElement('label');
            label.className = 'checkbox-label';

            // Create checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `pertemuan${i}Checkbox`;
            checkbox.value = i;
            checkbox.setAttribute('data-pertemuan', i);

            // Create span for text
            const span = document.createElement('span');
            span.textContent = `Pertemuan ${i}`;

            // Append checkbox elements
            label.appendChild(checkbox);
            label.appendChild(span);
            wrapper.appendChild(label);

            // Set checkbox if pertemuan has value
            if (pertemuanValue) {
                checkbox.checked = true;
                self.showPercentageSlider(i, pertemuanValue, wrapper);
            }

            // Add event listener
            checkbox.addEventListener('change', function(e) {
                const pertemuanNum = parseInt(e.target.value);
                const itemWrapper = document.getElementById(`pertemuanItem${pertemuanNum}`);
                
                if (e.target.checked) {
                    // Get existing value from slider if it exists, otherwise use data value or default to 100
                    const existingSlider = document.getElementById(`sliderPertemuan${pertemuanNum}`);
                    let valueToUse = '100';
                    
                    if (existingSlider) {
                        valueToUse = existingSlider.value;
                    } else {
                        // Get value from data
                        const dataKey = `pertemuan${pertemuanNum}`;
                        valueToUse = dataRef[dataKey] || '100';
                    }
                    
                    self.showPercentageSlider(pertemuanNum, valueToUse, itemWrapper);
                } else {
                    self.hidePercentageSlider(pertemuanNum);
                }
            });

            container.appendChild(wrapper);
        }
    }

    showPercentageSlider(pertemuanNum, currentValue = '100', parentContainer = null) {
        const sliderId = `sliderPertemuan${pertemuanNum}`;
        const valueId = `valuePertemuan${pertemuanNum}`;

        // Check if slider already exists
        const existingSlider = document.getElementById(sliderId);
        if (existingSlider) {
            existingSlider.value = currentValue;
            const valueDisplay = document.getElementById(valueId);
            if (valueDisplay) {
                valueDisplay.textContent = `${currentValue}%`;
            }
            return;
        }

        // Use parent container if provided, otherwise find the pertemuan item wrapper
        if (!parentContainer) {
            parentContainer = document.getElementById(`pertemuanItem${pertemuanNum}`);
        }

        if (!parentContainer) {
            console.error('Parent container not found for pertemuan', pertemuanNum);
            return;
        }

        // Create slider group container
        const sliderGroup = document.createElement('div');
        sliderGroup.className = 'form-group slider-group';
        sliderGroup.id = `sliderGroup${pertemuanNum}`;

        // Create label
        const label = document.createElement('label');
        label.className = 'question-label';
        label.textContent = `Berapa persen Mahasiswa yang menyelesaikan Tugas? (Pertemuan ${pertemuanNum})`;

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        // Create range input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = sliderId;
        slider.className = 'percentage-slider';
        slider.min = '50';
        slider.max = '100';
        slider.value = currentValue;
        slider.step = '1';

        // Create value display
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.id = valueId;
        valueDisplay.textContent = `${currentValue}%`;

        // Append elements
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        sliderGroup.appendChild(label);
        sliderGroup.appendChild(sliderContainer);
        
        // Append slider group to parent container (right after the checkbox label)
        parentContainer.appendChild(sliderGroup);

        // Update value display when slider changes
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = `${e.target.value}%`;
        });
    }

    hidePercentageSlider(pertemuanNum) {
        const sliderGroup = document.getElementById(`sliderGroup${pertemuanNum}`);
        if (sliderGroup) {
            sliderGroup.remove();
        }
    }

    clearPertemuanSelection() {
        // Uncheck all checkboxes
        for (let i = 1; i <= 7; i++) {
            const checkbox = document.getElementById(`pertemuan${i}Checkbox`);
            if (checkbox) {
                checkbox.checked = false;
            }
            this.hidePercentageSlider(i);
        }
    }

    closeModal() {
        const modal = document.getElementById('updateModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async saveData() {
        const form = document.getElementById('updateForm');
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const dataId = document.getElementById('dataId').value;
        const tugas = document.querySelector('input[name="tugas"]:checked').value;

        // Collect pertemuan data
        const pertemuanData = {};
        for (let i = 1; i <= 7; i++) {
            const checkbox = document.getElementById(`pertemuan${i}Checkbox`);
            if (checkbox && checkbox.checked) {
                const slider = document.getElementById(`sliderPertemuan${i}`);
                if (slider) {
                    pertemuanData[`pertemuan${i}`] = slider.value;
                } else {
                    pertemuanData[`pertemuan${i}`] = '';
                }
            } else {
                pertemuanData[`pertemuan${i}`] = '';
            }
        }

        const formData = {
            id: dataId,
            tugas: tugas,
            ...pertemuanData
        };

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitText.textContent = 'Menyimpan...';
        submitText.classList.remove('hidden');
        submitSpinner.classList.remove('hidden');
        
        // Show loading overlay in modal
        this.showModalLoading(true);

        try {
            const payload = {
                action: 'update',
                data: JSON.stringify(formData)
            };
            const formBody = Object.keys(payload).map(key => 
                encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])
            ).join('&');
            
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan data');
            }

            const result = await response.json();

            if (result.success) {
                this.showSuccess('Data berhasil diupdate');
                this.closeModal();
                this.loadData(); // Reload data to get updated values
            } else {
                throw new Error(result.message || 'Gagal menyimpan data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            this.showError('Gagal menyimpan data. Pastikan URL Google Apps Script sudah benar.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitText.textContent = 'Update';
            submitText.classList.remove('hidden');
            submitSpinner.classList.add('hidden');
            this.showModalLoading(false);
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        const successMsg = document.getElementById('successMsg');
        successMsg.textContent = message;
        successMsg.classList.remove('hidden');
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 3000);
    }

    hideMessages() {
        document.getElementById('errorMsg').classList.add('hidden');
        document.getElementById('successMsg').classList.add('hidden');
    }

    showModalLoading(show) {
        const loadingOverlay = document.getElementById('modalLoadingOverlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.remove('hidden');
            } else {
                loadingOverlay.classList.add('hidden');
            }
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sanitizeId(text) {
        if (!text) return '';
        return text.replace(/[^a-zA-Z0-9]/g, '_');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KuesionerApp();
});
