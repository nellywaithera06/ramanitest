<template>
  <div class="documents-management">
    <div class="documents-header">
      <h2>Documents</h2>
      <p class="subtitle">Here is the Land information management system documents</p>
    </div>

    <!-- Upload Section -->
    <div class="upload-section">
      <div class="upload-form">
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select v-model="uploadData.category" class="form-input">
              <option value="">Select category</option>
              <option value="Lease Agreement">Lease Agreement</option>
              <option value="Land Title">Land Title</option>
              <option value="ID Document">ID Document</option>
              <option value="Payment Receipt">Payment Receipt</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Upload date</label>
            <input type="date" v-model="uploadData.uploadDate" class="form-input" />
          </div>
        </div>

        <!-- Drag and Drop Area -->
        <div class="drag-drop-area" 
             @dragover.prevent 
             @drop.prevent="handleDrop"
             @click="triggerFileInput">
          <div class="upload-icon">📄</div>
          <p class="upload-text">Click or drag file to upload</p>
          <p class="upload-hint">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" />
          <button class="browse-btn">Browse</button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search documents..." 
          class="search-input"
        />
      </div>
      <button class="refresh-btn" @click="refreshDocuments">
        🔄 Refresh
      </button>
    </div>

    <!-- Documents Table -->
    <div class="table-container">
      <table class="documents-table">
        <thead>
          <tr>
            <th>DOCUMENT NAME</th>
            <th>TYPE</th>
            <th>UPLOAD DATE</th>
            <th>CUSTOMER</th>
            <th>SIZE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doc, index) in paginatedDocuments" :key="doc.id">
            <td class="doc-name-cell">
              <div class="doc-name-info">
                <span class="doc-icon" :style="{ color: doc.documentType === 'PDF' ? '#f44336' : '#2196F3' }">📄</span>
                <span>{{ doc.documentName }}</span>
              </div>
            </td>
            <td>
              <span class="doc-type-badge" :class="getDocTypeClass(doc.documentType)">
                {{ doc.documentType }}
              </span>
            </td>
            <td>{{ formatDate(doc.uploadDate) }}</td>
            <td>{{ doc.customer }}</td>
            <td>{{ doc.documentSize }}</td>
            <td class="action-buttons">
              <div class="menu-container">
                <button class="menu-trigger" @click.stop="toggleMenu(doc.id)">
                  ⋮
                </button>
                <div v-if="activeMenuId === doc.id" class="dropdown-menu">
                  <button class="dropdown-item view" @click="viewDocument(doc)">
                    👁️ View
                  </button>
                  <button class="dropdown-item download" @click="downloadDocument(doc)">
                    📥 Download
                  </button>
                  <button class="dropdown-item delete" @click="openDeleteModal(doc.id, doc.documentName)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedDocuments.length === 0">
            <td colspan="6" class="no-data">
              📭
              <p>No documents found</p>
              <button class="upload-first-btn" @click="triggerFileInput">Upload First</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredDocuments.length }}
      </div>
      <div class="pagination-controls">
        <div class="rows-per-page">
          <span>Rows:</span>
          <select v-model="rowsPerPage" @change="currentPage = 1">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="page-buttons">
          <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
            ◀ Prev
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
            Next ▶
          </button>
        </div>
      </div>
    </div>

    <!-- View Document Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3>📄 Document Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ viewData.documentName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">
                <span class="doc-type-badge" :class="getDocTypeClass(viewData.documentType)">
                  {{ viewData.documentType }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Upload Date:</span>
              <span class="detail-value">{{ formatDate(viewData.uploadDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Customer:</span>
              <span class="detail-value">{{ viewData.customer }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Size:</span>
              <span class="detail-value">{{ viewData.documentSize }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category:</span>
              <span class="detail-value">{{ viewData.category || 'Uncategorized' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="download-btn" @click="downloadDocument(viewData)">Download</button>
          <button class="close-view-btn" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-container delete-modal">
        <div class="delete-header">
          <span class="delete-icon">⚠️</span>
          <button class="delete-close-btn" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="delete-body">
          <p class="delete-title">Delete?</p>
          <p class="delete-message">Delete <strong>"{{ documentToDelete.name }}"</strong>?</p>
          <p class="delete-warning">Cannot be undone</p>
        </div>
        <div class="delete-footer">
          <button class="cancel-delete-btn" @click="closeDeleteModal">Cancel</button>
          <button class="confirm-delete-btn" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast" :class="toastType">
      {{ toastType === 'success' ? '✅' : '⚠️' }} {{ toastMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Documents',
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      rowsPerPage: 10,
      showViewModal: false,
      showDeleteModal: false,
      activeMenuId: null,
      toastMessage: '',
      toastType: 'success',
      viewData: {},
      documentToDelete: {
        id: null,
        name: ''
      },
      uploadData: {
        category: '',
        uploadDate: new Date().toISOString().split('T')[0]
      },
      documents: [
        {
          id: 1,
          documentName: 'KJ_PRESALES_AGREEMENT.pdf',
          documentType: 'PDF',
          uploadDate: '2022-01-12',
          customer: 'Alex Mwangi',
          documentSize: '123KB',
          category: 'Lease Agreement'
        },
        {
          id: 2,
          documentName: 'LAND_TITLE_DEED.pdf',
          documentType: 'PDF',
          uploadDate: '2022-01-12',
          customer: 'Alexandra Mwangi',
          documentSize: '123KB',
          category: 'Land Title'
        },
        {
          id: 3,
          documentName: 'ID_DOCUMENT.pdf',
          documentType: 'PDF',
          uploadDate: '2022-01-10',
          customer: 'John Mwangi',
          documentSize: '89KB',
          category: 'ID Document'
        },
        {
          id: 4,
          documentName: 'PAYMENT_RECEIPT.pdf',
          documentType: 'PDF',
          uploadDate: '2022-01-08',
          customer: 'Mary Wanjiku',
          documentSize: '45KB',
          category: 'Payment Receipt'
        },
        {
          id: 5,
          documentName: 'LEASE_RENEWAL.docx',
          documentType: 'DOCX',
          uploadDate: '2022-01-05',
          customer: 'Peter Ochieng',
          documentSize: '256KB',
          category: 'Lease Agreement'
        }
      ]
    }
  },
  computed: {
    filteredDocuments() {
      if (!this.searchTerm) {
        return this.documents;
      }
      const term = this.searchTerm.toLowerCase();
      return this.documents.filter(doc => 
        doc.documentName.toLowerCase().includes(term) ||
        doc.customer.toLowerCase().includes(term) ||
        doc.documentType.toLowerCase().includes(term)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredDocuments.length);
    },
    paginatedDocuments() {
      return this.filteredDocuments.slice(this.startIndex, this.endIndex);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    },
    getDocTypeClass(type) {
      const classes = {
        'PDF': 'pdf-badge',
        'DOCX': 'docx-badge',
        'JPG': 'image-badge',
        'PNG': 'image-badge'
      };
      return classes[type] || 'default-badge';
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    toggleMenu(id) {
      this.activeMenuId = this.activeMenuId === id ? null : id;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFileUpload(file);
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.processFileUpload(file);
      }
    },
    processFileUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.showToast('File size must be less than 10MB', 'error');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.showToast('Only PDF, DOC, DOCX, JPG, PNG allowed', 'error');
        return;
      }
      const fileExt = file.name.split('.').pop().toUpperCase();
      const newDocument = {
        id: this.documents.length + 1,
        documentName: file.name,
        documentType: fileExt,
        uploadDate: this.uploadData.uploadDate || new Date().toISOString().split('T')[0],
        customer: 'New Upload',
        documentSize: this.formatFileSize(file.size),
        category: this.uploadData.category || 'Uncategorized'
      };
      this.documents.unshift(newDocument);
      this.showToast(`"${file.name}" uploaded!`, 'success');
      this.uploadData.category = '';
      this.uploadData.uploadDate = new Date().toISOString().split('T')[0];
      this.$refs.fileInput.value = '';
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    viewDocument(doc) {
      this.viewData = { ...doc };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    downloadDocument(doc) {
      this.showToast(`Downloading "${doc.documentName}"...`, 'success');
      this.activeMenuId = null;
    },
    openDeleteModal(id, name) {
      this.documentToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.documentToDelete.id;
      this.documents = this.documents.filter(doc => doc.id !== id);
      this.showToast('Document deleted!', 'success');
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.documentToDelete = { id: null, name: '' };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.viewData = {};
    },
    refreshDocuments() {
      this.showToast('Documents refreshed', 'success');
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.menu-container')) {
        this.activeMenuId = null;
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', (event) => {
      if (!event.target.closest('.menu-container')) {
        this.activeMenuId = null;
      }
    });
  }
}
</script>

<style scoped>
.documents-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.documents-header h2 {
  color: #2c3e50;
  margin-bottom: 2px;
  font-size: 20px;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 12px;
  font-size: 11px;
}

.upload-section {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.upload-form {
  max-width: 100%;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 3px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 11px;
}

.form-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.drag-drop-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.drag-drop-area:hover {
  border-color: #4CAF50;
  background: #f0f8f0;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 10px;
  color: #999;
  margin-bottom: 10px;
}

.browse-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.3s;
}

.browse-btn:hover {
  background: #45a049;
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  max-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-size: 11px;
}

.search-input {
  width: 100%;
  padding: 6px 8px 6px 28px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.refresh-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: #1976D2;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.documents-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.documents-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.documents-table tr:hover {
  background: #f8f9fa;
}

.doc-name-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.doc-icon {
  font-size: 12px;
}

.doc-type-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
}

.pdf-badge {
  background: #FFEBEE;
  color: #F44336;
}

.docx-badge {
  background: #E3F2FD;
  color: #2196F3;
}

.image-badge {
  background: #E8F5E9;
  color: #4CAF50;
}

.default-badge {
  background: #F3E5F5;
  color: #9C27B0;
}

.action-buttons {
  position: relative;
}

.menu-container {
  position: relative;
  display: inline-block;
}

.menu-trigger {
  background: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  color: #555;
  font-size: 12px;
  font-weight: bold;
}

.menu-trigger:hover {
  background: #e0e0e0;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  min-width: 90px;
  z-index: 1000;
  overflow: hidden;
  margin-top: 3px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  width: 100%;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 11px;
  color: #555;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.view:hover {
  background: #E8F5E9;
  color: #388E3C;
}

.dropdown-item.download:hover {
  background: #E3F2FD;
  color: #1976D2;
}

.dropdown-item.delete:hover {
  background: #FFEBEE;
  color: #F44336;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 6px 0;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-info {
  color: #666;
  font-size: 11px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #666;
}

.rows-per-page select {
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
}

.page-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  padding: 3px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.page-btn:hover:not(:disabled) {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.view-modal {
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
}

.delete-modal {
  width: 280px;
  max-width: 90%;
  text-align: center;
  overflow: hidden;
}

.delete-header {
  position: relative;
  padding: 12px 16px 0 16px;
}

.delete-icon {
  font-size: 32px;
  display: inline-block;
}

.delete-close-btn {
  position: absolute;
  right: 10px;
  top: 6px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.delete-close-btn:hover {
  color: #333;
}

.delete-body {
  padding: 0 16px 10px 16px;
}

.delete-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
}

.delete-message {
  font-size: 11px;
  color: #555;
  margin-bottom: 5px;
}

.delete-message strong {
  color: #f44336;
}

.delete-warning {
  font-size: 10px;
  color: #999;
  margin-top: 6px;
}

.delete-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 8px 16px 12px 16px;
  border-top: 1px solid #e0e0e0;
}

.cancel-delete-btn {
  padding: 4px 12px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.cancel-delete-btn:hover {
  background: #d0d0d0;
}

.confirm-delete-btn {
  padding: 4px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.confirm-delete-btn:hover {
  background: #d32f2f;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 12px 16px;
}

.detail-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 11px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
}

.detail-value {
  color: #555;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #e0e0e0;
}

.close-view-btn {
  padding: 5px 12px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.close-view-btn:hover {
  background: #d0d0d0;
}

.download-btn {
  padding: 5px 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.download-btn:hover {
  background: #45a049;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 30px;
}

.no-data p {
  font-size: 11px;
  margin-top: 6px;
}

.upload-first-btn {
  margin-top: 8px;
  padding: 5px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 6px 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10000;
  animation: slideDown 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  font-size: 11px;
}

.toast.success {
  background: #4CAF50;
  color: white;
}

.toast.error {
  background: #f44336;
  color: white;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .documents-management {
    padding: 10px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
  
  .pagination-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  
  .rows-per-page {
    width: 100%;
    justify-content: space-between;
  }
  
  .page-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .documents-table th,
  .documents-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .delete-modal {
    width: 260px;
  }
}
</style>