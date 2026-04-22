<template>
  <div class="leaseholders-management">
    <div class="leaseholders-header">
      <h2>Leaseholders</h2>
      <p class="subtitle">Here is the Land information management system leaseholders</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search by name, ID number, or phone number..." 
          class="search-input"
        />
      </div>
      <button class="add-leaseholder-btn" @click="openAddModal">
        <i class="pi pi-plus"></i>
        Add New
      </button>
    </div>

    <!-- Leaseholders Table -->
    <div class="table-container">
      <table class="leaseholders-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>LAND PARCEL</th>
            <th>ID NO.</th>
            <th>BANK</th>
            <th>BRANCH</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(holder, index) in paginatedLeaseholders" :key="holder.id">
            <td class="name-cell">
              <div class="name-info">
                <i class="pi pi-user"></i>
                <span>{{ holder.name }}</span>
              </div>
            </td>
            <td>{{ holder.phoneNo }}</td>
            <td>{{ holder.landParcel }}</td>
            <td>{{ holder.idNumber }}</td>
            <td>
              <span class="bank-badge" :class="getBankClass(holder.bank)">
                {{ holder.bank }}
              </span>
            </td>
            <td>{{ holder.branch }}</td>
            <td class="action-buttons">
              <div class="action-menu">
                <button class="action-menu-btn" @click="toggleActionMenu(holder.id)">
                  ⋮
                </button>
                <div v-if="activeMenuId === holder.id" class="action-dropdown">
                  <button class="action-item edit" @click="openEditModal(holder)">
                    ✏️ Edit
                  </button>
                  <button class="action-item view" @click="viewLeaseholder(holder)">
                    👁️ View
                  </button>
                  <button class="action-item delete" @click="openDeleteModal(holder.id, holder.name)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedLeaseholders.length === 0">
            <td colspan="7" class="no-data">
              <i class="pi pi-inbox"></i>
              <p>No leaseholders found</p>
              <button class="add-first-btn" @click="openAddModal">Add First</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredLeaseholders.length }}
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

    <!-- Add/Edit Leaseholder Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container add-modal">
        <div class="modal-header">
          <h3>
            <i :class="isEditing ? 'pi pi-pencil' : 'pi pi-plus-circle'"></i>
            {{ isEditing ? 'Edit' : 'Add Leaseholder' }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label><i class="pi pi-user"></i> Full Name</label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Full name" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label><i class="pi pi-phone"></i> Phone</label>
              <input type="tel" v-model="formData.phoneNo" class="form-input" placeholder="0712345678" />
            </div>
            <div class="form-group half">
              <label><i class="pi pi-id-card"></i> ID No.</label>
              <input type="text" v-model="formData.idNumber" class="form-input" placeholder="ID number" />
            </div>
          </div>
          <div class="form-group">
            <label><i class="pi pi-map"></i> Land Parcel</label>
            <input type="text" v-model="formData.landParcel" class="form-input" placeholder="e.g., 12Ha" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label><i class="pi pi-building"></i> Bank</label>
              <select v-model="formData.bank" class="form-input">
                <option value="ABSA Bank">ABSA Bank</option>
                <option value="KCB Bank">KCB Bank</option>
                <option value="Equity Bank">Equity Bank</option>
                <option value="Cooperative Bank">Cooperative Bank</option>
                <option value="Stanbic Bank">Stanbic Bank</option>
                <option value="Standard Chartered">Standard Chartered</option>
              </select>
            </div>
            <div class="form-group half">
              <label><i class="pi pi-location"></i> Branch</label>
              <input type="text" v-model="formData.branch" class="form-input" placeholder="Branch" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveLeaseholder">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>

    <!-- View Leaseholder Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3><i class="pi pi-eye"></i> Leaseholder Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ viewData.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ viewData.phoneNo }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID No.:</span>
              <span class="detail-value">{{ viewData.idNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Land Parcel:</span>
              <span class="detail-value">{{ viewData.landParcel }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Bank:</span>
              <span class="detail-value">
                <span class="bank-badge" :class="getBankClass(viewData.bank)">
                  {{ viewData.bank }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Branch:</span>
              <span class="detail-value">{{ viewData.branch }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="edit-btn" @click="editFromView">Edit</button>
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
          <p class="delete-message">Delete <strong>"{{ leaseholderToDelete.name }}"</strong>?</p>
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
      <i :class="toastType === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaseHolders',
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      rowsPerPage: 10,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      currentId: null,
      activeMenuId: null,
      toastMessage: '',
      toastType: 'success',
      viewData: {},
      leaseholderToDelete: {
        id: null,
        name: ''
      },
      formData: {
        name: '',
        phoneNo: '',
        landParcel: '',
        idNumber: '',
        bank: 'KCB Bank',
        branch: ''
      },
      leaseholders: [
        {
          id: 1,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '12345678',
          bank: 'ABSA Bank',
          branch: 'Garden City'
        },
        {
          id: 2,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '124345678',
          bank: 'KCB Bank',
          branch: 'Moi avenue, CBD'
        },
        {
          id: 3,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '12345678',
          bank: 'Equity Bank',
          branch: 'Moi avenue, CBD'
        },
        {
          id: 4,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '12345678',
          bank: 'KCB Bank',
          branch: 'Moi avenue, CBD'
        },
        {
          id: 5,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '12345678',
          bank: 'ABSA Bank',
          branch: 'Moi avenue, CBD'
        },
        {
          id: 6,
          name: 'Ann Wanjiru',
          phoneNo: '0712345678',
          landParcel: '12Ha',
          idNumber: '12345678',
          bank: 'ABSA Bank',
          branch: 'Moi avenue, CBD'
        }
      ]
    }
  },
  computed: {
    filteredLeaseholders() {
      if (!this.searchTerm) {
        return this.leaseholders;
      }
      const term = this.searchTerm.toLowerCase();
      return this.leaseholders.filter(holder => 
        holder.name.toLowerCase().includes(term) ||
        holder.phoneNo.includes(term) ||
        holder.idNumber.includes(term) ||
        holder.bank.toLowerCase().includes(term)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredLeaseholders.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredLeaseholders.length);
    },
    paginatedLeaseholders() {
      return this.filteredLeaseholders.slice(this.startIndex, this.endIndex);
    }
  },
  methods: {
    getBankClass(bank) {
      return {
        'ABSA Bank': 'absa-badge',
        'KCB Bank': 'kcb-badge',
        'Equity Bank': 'equity-badge'
      }[bank] || 'default-badge';
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    toggleActionMenu(id) {
      this.activeMenuId = this.activeMenuId === id ? null : id;
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
    },
    openAddModal() {
      this.isEditing = false;
      this.formData = {
        name: '',
        phoneNo: '',
        landParcel: '',
        idNumber: '',
        bank: 'KCB Bank',
        branch: ''
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    openEditModal(holder) {
      this.isEditing = true;
      this.currentId = holder.id;
      this.formData = { ...holder };
      this.showModal = true;
      this.activeMenuId = null;
    },
    viewLeaseholder(holder) {
      this.viewData = { ...holder };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    editFromView() {
      this.closeViewModal();
      this.openEditModal(this.viewData);
    },
    saveLeaseholder() {
      if (!this.formData.name || !this.formData.phoneNo || !this.formData.idNumber) {
        this.showToast('Please fill all fields', 'error');
        return;
      }

      if (this.isEditing) {
        const index = this.leaseholders.findIndex(l => l.id === this.currentId);
        if (index !== -1) {
          this.leaseholders[index] = { ...this.formData, id: this.currentId };
          this.showToast('Leaseholder updated!', 'success');
        }
      } else {
        const newId = this.leaseholders.length > 0 ? Math.max(...this.leaseholders.map(l => l.id)) + 1 : 1;
        this.leaseholders.push({ ...this.formData, id: newId });
        this.showToast('Leaseholder added!', 'success');
      }
      this.closeModal();
    },
    openDeleteModal(id, name) {
      this.leaseholderToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.leaseholderToDelete.id;
      this.leaseholders = this.leaseholders.filter(holder => holder.id !== id);
      this.showToast('Leaseholder deleted!', 'success');
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.leaseholderToDelete = { id: null, name: '' };
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.currentId = null;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.viewData = {};
    }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.action-menu')) {
        this.activeMenuId = null;
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', (event) => {
      if (!event.target.closest('.action-menu')) {
        this.activeMenuId = null;
      }
    });
  }
}
</script>

<style scoped>
.leaseholders-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.leaseholders-header h2 {
  color: #2c3e50;
  margin-bottom: 2px;
  font-size: 20px;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 12px;
  font-size: 11px;
}

/* Search Section */
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

.add-leaseholder-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.add-leaseholder-btn:hover {
  transform: translateY(-1px);
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.leaseholders-table {
  width: 100%;
  border-collapse: collapse;
}

.leaseholders-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.leaseholders-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.leaseholders-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.leaseholders-table tr:hover {
  background: #f8f9fa;
}

.name-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.name-info i {
  color: #4CAF50;
  font-size: 11px;
}

/* Bank Badges */
.bank-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
}

.absa-badge {
  background: #E3F2FD;
  color: #1565C0;
}

.kcb-badge {
  background: #E8F5E9;
  color: #2E7D32;
}

.equity-badge {
  background: #FFF3E0;
  color: #E65100;
}

.default-badge {
  background: #F3E5F5;
  color: #6A1B9A;
}

/* Action Menu */
.action-buttons {
  position: relative;
}

.action-menu {
  position: relative;
}

.action-menu-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 4px;
  transition: all 0.3s;
  color: #555;
  font-size: 14px;
  font-weight: bold;
}

.action-menu-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.action-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  min-width: 100px;
  z-index: 1000;
  overflow: hidden;
  margin-top: 3px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  width: 100%;
  border: none;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s;
  font-size: 11px;
  color: #555;
}

.action-item:hover {
  background: #f5f5f5;
}

.action-item.edit:hover {
  background: #E3F2FD;
  color: #1976D2;
}

.action-item.view:hover {
  background: #E8F5E9;
  color: #388E3C;
}

.action-item.delete:hover {
  background: #FFEBEE;
  color: #F44336;
}

/* Pagination */
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

/* Modal Overlay */
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
}

.add-modal {
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
}

.view-modal {
  width: 90%;
  max-width: 400px;
}

.delete-modal {
  width: 280px;
  max-width: 90%;
  text-align: center;
  overflow: hidden;
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
  display: flex;
  align-items: center;
  gap: 5px;
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

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 3px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 11px;
}

.form-group label i {
  margin-right: 3px;
  color: #4CAF50;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-group.half {
  flex: 1;
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

.cancel-btn, .close-view-btn {
  padding: 5px 12px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.cancel-btn:hover, .close-view-btn:hover {
  background: #d0d0d0;
}

.save-btn, .edit-btn {
  padding: 5px 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.save-btn:hover, .edit-btn:hover {
  background: #45a049;
}

/* Delete Modal */
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
  font-size: 11px;
}

.confirm-delete-btn {
  padding: 4px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

/* No Data */
.no-data {
  text-align: center;
  padding: 30px;
  color: #999;
}

.no-data i {
  font-size: 30px;
  margin-bottom: 8px;
  display: block;
}

.add-first-btn {
  margin-top: 8px;
  padding: 5px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

/* Toast */
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

/* Responsive */
@media (max-width: 768px) {
  .leaseholders-management {
    padding: 10px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .add-leaseholder-btn {
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
  
  .leaseholders-table th,
  .leaseholders-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .delete-modal {
    width: 260px;
  }
}
</style>