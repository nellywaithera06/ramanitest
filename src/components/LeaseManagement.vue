<template>
  <div class="lease-management">
    <div class="lease-header">
      <h2>Lease</h2>
      <p class="subtitle">Here is the Land information management system lease</p>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-box">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search leases..." 
          class="search-input"
        />
      </div>
      <button class="add-lease-btn" @click="openAddModal">
        <i class="pi pi-plus"></i>
        Add New
      </button>
    </div>

    <!-- Leases Table -->
    <div class="table-container">
      <table class="leases-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>SIZE</th>
            <th>START DATE</th>
            <th>SIGNING DATE</th>
            <th>PAYMENT</th>
            <th>AMOUNT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(lease, index) in paginatedLeases" :key="lease.id">
            <td>{{ lease.name }}</td>
            <td>{{ lease.sizeOfLand }}</td>
            <td>{{ formatDate(lease.startDate) }}</td>
            <td>{{ formatDate(lease.signingDate) }}</td>
            <td>{{ lease.paymentCycle }}</td>
            <td>Ksh {{ formatAmount(lease.initialAmount) }}</td>
            <td class="action-buttons">
              <div class="menu-container">
                <button class="menu-trigger" @click.stop="toggleMenu(lease.id)">
                  ⋮
                </button>
                
                <div v-if="activeMenuId === lease.id" class="dropdown-menu">
                  <button class="dropdown-item edit" @click="openEditModal(lease)">
                    ✏️ Edit
                  </button>
                  <button class="dropdown-item view" @click="viewLease(lease)">
                    👁️ View
                  </button>
                  <button class="dropdown-item delete" @click="openDeleteModal(lease.id, lease.name)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedLeases.length === 0">
            <td colspan="7" class="no-data">
              📭
              <p>No lease records found</p>
              <button class="add-first-btn" @click="openAddModal">Add First</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredLeases.length }}
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

    <!-- Add/Edit Lease Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container add-modal">
        <div class="modal-header">
          <h3>
            {{ isEditing ? '✏️ Edit' : '➕ Add Lease' }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>👤 Name</label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Lessee name" />
          </div>
          <div class="form-group">
            <label>🗺️ Size</label>
            <input type="text" v-model="formData.sizeOfLand" class="form-input" placeholder="e.g., 2 Ha" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>📅 Start Date</label>
              <input type="date" v-model="formData.startDate" class="form-input" />
            </div>
            <div class="form-group half">
              <label>📅 Signing Date</label>
              <input type="date" v-model="formData.signingDate" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>⏰ Payment Cycle</label>
            <select v-model="formData.paymentCycle" class="form-input">
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
          <div class="form-group">
            <label>💰 Amount (Ksh)</label>
            <input type="number" v-model="formData.initialAmount" class="form-input" placeholder="Enter amount" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveLease">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>

    <!-- View Lease Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3>👁️ Lease Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Lessee:</span>
              <span class="detail-value">{{ viewData.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Land Size:</span>
              <span class="detail-value">{{ viewData.sizeOfLand }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">{{ formatDate(viewData.startDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Signing Date:</span>
              <span class="detail-value">{{ formatDate(viewData.signingDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Cycle:</span>
              <span class="detail-value">{{ viewData.paymentCycle }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value amount">Ksh {{ formatAmount(viewData.initialAmount) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="edit-from-view-btn" @click="editFromView">Edit</button>
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
          <p class="delete-message">Delete lease for <strong>"{{ leaseToDelete.name }}"</strong>?</p>
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
  name: 'LeaseManagement',
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      rowsPerPage: 10,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      currentLeaseId: null,
      activeMenuId: null,
      toastMessage: '',
      toastType: 'success',
      viewData: {},
      leaseToDelete: {
        id: null,
        name: ''
      },
      formData: {
        name: '',
        sizeOfLand: '',
        startDate: '',
        signingDate: '',
        paymentCycle: 'Annually',
        initialAmount: ''
      },
      leases: [
        {
          id: 1,
          name: 'Ann Wanjiru',
          sizeOfLand: '2 Ha',
          startDate: '2022-03-01',
          signingDate: '2022-01-24',
          paymentCycle: 'Annually',
          initialAmount: 2000000
        },
        {
          id: 2,
          name: 'John Mwangi',
          sizeOfLand: '5 Ha',
          startDate: '2022-06-15',
          signingDate: '2022-05-10',
          paymentCycle: 'Quarterly',
          initialAmount: 5000000
        },
        {
          id: 3,
          name: 'Mary Wanjiku',
          sizeOfLand: '3 Ha',
          startDate: '2023-01-10',
          signingDate: '2022-12-05',
          paymentCycle: 'Monthly',
          initialAmount: 1500000
        },
        {
          id: 4,
          name: 'Peter Ochieng',
          sizeOfLand: '10 Ha',
          startDate: '2021-09-20',
          signingDate: '2021-08-15',
          paymentCycle: 'Annually',
          initialAmount: 8000000
        },
        {
          id: 5,
          name: 'Sarah Kimani',
          sizeOfLand: '1.5 Ha',
          startDate: '2023-03-01',
          signingDate: '2023-02-20',
          paymentCycle: 'Monthly',
          initialAmount: 750000
        }
      ]
    }
  },
  computed: {
    filteredLeases() {
      if (!this.searchTerm) {
        return this.leases;
      }
      return this.leases.filter(lease => 
        lease.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lease.sizeOfLand.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredLeases.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredLeases.length);
    },
    paginatedLeases() {
      return this.filteredLeases.slice(this.startIndex, this.endIndex);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    },
    formatAmount(amount) {
      return amount.toLocaleString();
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
    viewLease(lease) {
      this.viewData = { ...lease };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    editFromView() {
      this.closeViewModal();
      this.openEditModal(this.viewData);
    },
    openDeleteModal(id, name) {
      this.leaseToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.leaseToDelete.id;
      this.leases = this.leases.filter(lease => lease.id !== id);
      this.showToast('Lease deleted!', 'success');
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.leaseToDelete = { id: null, name: '' };
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
        sizeOfLand: '',
        startDate: '',
        signingDate: '',
        paymentCycle: 'Annually',
        initialAmount: ''
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    openEditModal(lease) {
      this.isEditing = true;
      this.currentLeaseId = lease.id;
      this.formData = {
        name: lease.name,
        sizeOfLand: lease.sizeOfLand,
        startDate: lease.startDate,
        signingDate: lease.signingDate,
        paymentCycle: lease.paymentCycle,
        initialAmount: lease.initialAmount
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    saveLease() {
      if (!this.formData.name || !this.formData.sizeOfLand || !this.formData.initialAmount) {
        this.showToast('Please fill all fields', 'error');
        return;
      }

      if (this.isEditing) {
        const index = this.leases.findIndex(l => l.id === this.currentLeaseId);
        if (index !== -1) {
          this.leases[index] = {
            ...this.formData,
            id: this.currentLeaseId
          };
          this.showToast('Lease updated!', 'success');
        }
      } else {
        const newId = this.leases.length > 0 ? Math.max(...this.leases.map(l => l.id)) + 1 : 1;
        this.leases.push({
          ...this.formData,
          id: newId
        });
        this.showToast('Lease added!', 'success');
      }
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.currentLeaseId = null;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.viewData = {};
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
.lease-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.lease-header h2 {
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

.add-lease-btn {
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

.add-lease-btn:hover {
  transform: translateY(-1px);
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.leases-table {
  width: 100%;
  border-collapse: collapse;
}

.leases-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.leases-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.leases-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.leases-table tr:hover {
  background: #f8f9fa;
}

/* Hamburger Menu Styles */
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

.dropdown-item.edit:hover {
  background: #E3F2FD;
  color: #1976D2;
}

.dropdown-item.view:hover {
  background: #E8F5E9;
  color: #388E3C;
}

.dropdown-item.delete:hover {
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

.detail-value.amount {
  font-weight: 600;
  color: #4CAF50;
  font-size: 14px;
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

.save-btn, .edit-from-view-btn {
  padding: 5px 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.save-btn:hover, .edit-from-view-btn:hover {
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
  font-size: 30px;
}

.no-data p {
  font-size: 11px;
  margin-top: 6px;
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
  .lease-management {
    padding: 10px;
  }
  
  .leases-table th,
  .leases-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .add-lease-btn {
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
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .delete-modal {
    width: 260px;
  }
}
</style>