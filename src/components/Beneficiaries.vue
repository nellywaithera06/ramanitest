<template>
  <div class="beneficiaries-management">
    <div class="beneficiaries-header">
      <h2>Beneficiaries</h2>
      <p class="subtitle">Here is the Land information management system beneficiaries</p>
    </div>

    <!-- Search and Add Section -->
    <div class="search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search by name, ID number, or phone number..." 
          class="search-input"
        />
      </div>
      <button class="add-beneficiary-btn" @click="openAddModal">
        ➕ Add New
      </button>
    </div>

    <!-- Beneficiaries Table -->
    <div class="table-container">
      <table class="beneficiaries-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE</th>
            <th>ID NO.</th>
            <th>RELATIONSHIP</th>
            <th>AMOUNT (%)</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(beneficiary, index) in paginatedBeneficiaries" :key="beneficiary.id">
            <td class="name-cell">
              <div class="name-info">
                <span class="name-icon">👤</span>
                <span>{{ beneficiary.name }}</span>
              </div>
            </td>
            <td>{{ beneficiary.phoneNumber }}</td>
            <td>{{ beneficiary.idNumber }}</td>
            <td>
              <span class="relationship-badge" :class="getRelationshipClass(beneficiary.relationship)">
                {{ beneficiary.relationship }}
              </span>
            </td>
            <td class="amount-cell">
              <span class="amount-badge">{{ beneficiary.amount }}%</span>
            </td>
            <td class="action-buttons">
              <div class="menu-container">
                <button class="menu-trigger" @click.stop="toggleMenu(beneficiary.id)">
                  ⋮
                </button>
                <div v-if="activeMenuId === beneficiary.id" class="dropdown-menu">
                  <button class="dropdown-item view" @click="viewBeneficiary(beneficiary)">
                    👁️ View
                  </button>
                  <button class="dropdown-item edit" @click="openEditModal(beneficiary)">
                    ✏️ Edit
                  </button>
                  <button class="dropdown-item delete" @click="openDeleteModal(beneficiary.id, beneficiary.name)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedBeneficiaries.length === 0">
            <td colspan="6" class="no-data">
              📭
              <p>No beneficiaries found</p>
              <button class="add-first-btn" @click="openAddModal">Add First</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredBeneficiaries.length }}
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

    <!-- Add/Edit Beneficiary Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container add-modal">
        <div class="modal-header">
          <h3>{{ isEditing ? '✏️ Edit' : '➕ Add Beneficiary' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>👤 Full Name</label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Full name" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>📞 Phone</label>
              <input type="tel" v-model="formData.phoneNumber" class="form-input" placeholder="+254..." />
            </div>
            <div class="form-group half">
              <label>🆔 ID No.</label>
              <input type="text" v-model="formData.idNumber" class="form-input" placeholder="ID number" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>👨‍👩‍👧 Relationship</label>
              <select v-model="formData.relationship" class="form-input">
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group half">
              <label>💰 Amount (%)</label>
              <input type="number" v-model="formData.amount" class="form-input" placeholder="%" min="0" max="100" />
            </div>
          </div>
          <div class="total-percentage" v-if="!isEditing && formData.amount && totalPercentage > 100">
            <span class="warning">⚠️ Total will be {{ totalPercentage }}%</span>
          </div>
          <div class="total-percentage" v-if="isEditing && formData.amount && calculateEditTotal() > 100">
            <span class="warning">⚠️ Total will be {{ calculateEditTotal() }}%</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveBeneficiary">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>

    <!-- View Beneficiary Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3>👁️ Beneficiary Details</h3>
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
              <span class="detail-value">{{ viewData.phoneNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID No.:</span>
              <span class="detail-value">{{ viewData.idNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Relationship:</span>
              <span class="detail-value">
                <span class="relationship-badge" :class="getRelationshipClass(viewData.relationship)">
                  {{ viewData.relationship }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Allocation:</span>
              <span class="detail-value amount">{{ viewData.amount }}%</span>
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
          <p class="delete-message">Remove <strong>"{{ beneficiaryToDelete.name }}"</strong>?</p>
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
  name: 'Beneficiaries',
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
      beneficiaryToDelete: {
        id: null,
        name: ''
      },
      formData: {
        name: '',
        phoneNumber: '',
        idNumber: '',
        relationship: 'Mother',
        amount: ''
      },
      beneficiaries: [
        {
          id: 1,
          name: 'Ann Wanjiru',
          phoneNumber: '+254712345678',
          idNumber: '12345678',
          relationship: 'Mother',
          amount: 50
        },
        {
          id: 2,
          name: 'Steve Ndirangu',
          phoneNumber: '+254712345678',
          idNumber: '12345678',
          relationship: 'Brother',
          amount: 20
        },
        {
          id: 3,
          name: 'Ann Wanjiru',
          phoneNumber: '+254712345678',
          idNumber: '12345678',
          relationship: 'Mother',
          amount: 50
        },
        {
          id: 4,
          name: 'Steve Ndirangu',
          phoneNumber: '+254712345678',
          idNumber: '12345678',
          relationship: 'Brother',
          amount: 20
        }
      ]
    }
  },
  computed: {
    filteredBeneficiaries() {
      if (!this.searchTerm) {
        return this.beneficiaries;
      }
      const term = this.searchTerm.toLowerCase();
      return this.beneficiaries.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.idNumber.includes(term) ||
        b.phoneNumber.includes(term)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredBeneficiaries.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredBeneficiaries.length);
    },
    paginatedBeneficiaries() {
      return this.filteredBeneficiaries.slice(this.startIndex, this.endIndex);
    },
    totalPercentage() {
      let total = 0;
      this.beneficiaries.forEach(b => {
        total += b.amount;
      });
      if (this.formData.amount && !this.isEditing) {
        total += Number(this.formData.amount);
      }
      return total;
    }
  },
  methods: {
    getRelationshipClass(relationship) {
      const classes = {
        'Mother': 'mother-badge',
        'Father': 'father-badge',
        'Brother': 'brother-badge',
        'Sister': 'sister-badge',
        'Spouse': 'spouse-badge',
        'Child': 'child-badge'
      };
      return classes[relationship] || 'other-badge';
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
    calculateEditTotal() {
      let total = 0;
      this.beneficiaries.forEach(b => {
        if (b.id !== this.currentId) {
          total += b.amount;
        }
      });
      if (this.formData.amount) {
        total += Number(this.formData.amount);
      }
      return total;
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
      this.currentId = null;
      this.formData = {
        name: '',
        phoneNumber: '',
        idNumber: '',
        relationship: 'Mother',
        amount: ''
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    openEditModal(beneficiary) {
      this.isEditing = true;
      this.currentId = beneficiary.id;
      this.formData = {
        name: beneficiary.name,
        phoneNumber: beneficiary.phoneNumber,
        idNumber: beneficiary.idNumber,
        relationship: beneficiary.relationship,
        amount: beneficiary.amount
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    viewBeneficiary(beneficiary) {
      this.viewData = { ...beneficiary };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    editFromView() {
      this.closeViewModal();
      this.openEditModal(this.viewData);
    },
    saveBeneficiary() {
      if (!this.formData.name || !this.formData.phoneNumber || !this.formData.idNumber || !this.formData.amount) {
        this.showToast('Please fill all fields', 'error');
        return;
      }

      if (this.formData.amount < 0 || this.formData.amount > 100) {
        this.showToast('Percentage must be 0-100', 'error');
        return;
      }

      if (!this.isEditing && this.totalPercentage > 100) {
        if (!confirm(`⚠️ Total will be ${this.totalPercentage}%.\nContinue anyway?`)) {
          return;
        }
      }

      if (this.isEditing && this.calculateEditTotal() > 100) {
        if (!confirm(`⚠️ Total will be ${this.calculateEditTotal()}%.\nContinue anyway?`)) {
          return;
        }
      }

      if (this.isEditing) {
        const index = this.beneficiaries.findIndex(b => b.id === this.currentId);
        if (index !== -1) {
          this.beneficiaries[index] = {
            ...this.formData,
            id: this.currentId
          };
          this.showToast('Beneficiary updated!', 'success');
        }
      } else {
        const newId = this.beneficiaries.length > 0 ? Math.max(...this.beneficiaries.map(b => b.id)) + 1 : 1;
        this.beneficiaries.push({
          ...this.formData,
          id: newId
        });
        this.showToast('Beneficiary added!', 'success');
      }
      this.closeModal();
    },
    openDeleteModal(id, name) {
      this.beneficiaryToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.beneficiaryToDelete.id;
      this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
      this.showToast('Beneficiary deleted!', 'success');
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.beneficiaryToDelete = { id: null, name: '' };
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
.beneficiaries-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.beneficiaries-header h2 {
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

.add-beneficiary-btn {
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

.add-beneficiary-btn:hover {
  transform: translateY(-1px);
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.beneficiaries-table {
  width: 100%;
  border-collapse: collapse;
}

.beneficiaries-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.beneficiaries-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.beneficiaries-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.beneficiaries-table tr:hover {
  background: #f8f9fa;
}

.name-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.name-icon {
  font-size: 12px;
}

/* Relationship Badges */
.relationship-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
}

.mother-badge {
  background: #FCE4EC;
  color: #C2185B;
}

.father-badge {
  background: #E3F2FD;
  color: #1565C0;
}

.brother-badge {
  background: #E8F5E9;
  color: #2E7D32;
}

.sister-badge {
  background: #F3E5F5;
  color: #7B1FA2;
}

.spouse-badge {
  background: #FFF3E0;
  color: #E65100;
}

.child-badge {
  background: #E0F7FA;
  color: #006064;
}

.other-badge {
  background: #ECEFF1;
  color: #455A64;
}

.amount-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
}

.amount-cell {
  font-weight: 600;
}

/* Action Menu */
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

.dropdown-item.edit:hover {
  background: #E3F2FD;
  color: #1976D2;
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

.total-percentage {
  margin-top: 8px;
  padding: 5px 8px;
  background: #fff3cd;
  border-radius: 4px;
  font-size: 10px;
}

.total-percentage .warning {
  color: #856404;
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
  font-size: 11px;
}

.confirm-delete-btn:hover {
  background: #d32f2f;
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
  .beneficiaries-management {
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
  
  .add-beneficiary-btn {
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
  
  .beneficiaries-table th,
  .beneficiaries-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .delete-modal {
    width: 260px;
  }
}
</style>