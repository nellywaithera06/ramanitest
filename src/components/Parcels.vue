<template>
  <div class="parcels-management">
    <div class="parcels-header">
      <h2>Parcels</h2>
      <p class="subtitle">Here is the Land information management system parcels</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search parcels..." 
          class="search-input"
        />
      </div>
      <button class="upload-btn" @click="triggerFileUpload">
        <i class="pi pi-upload"></i>
        Upload
      </button>
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept=".shp,.zip,.geojson" />
    </div>

    <!-- Stats Card -->
    <div class="stats-card">
      <div class="stats-icon">📍</div>
      <div class="stats-info">
        <h3>Total Parcels</h3>
        <p class="stats-number">{{ filteredParcels.length }}</p>
      </div>
    </div>

    <!-- Parcels Table -->
    <div class="table-container">
      <table class="parcels-table">
        <thead>
          <tr>
            <th>OWNER</th>
            <th>PHONE</th>
            <th>LOCATION</th>
            <th>SIZE</th>
            <th>PLOT NO.</th>
            <th>COORDINATES</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(parcel, index) in paginatedParcels" :key="parcel.id">
            <td class="owner-cell">
              <div class="owner-info">
                <i class="pi pi-user"></i>
                <span>{{ parcel.owner }}</span>
              </div>
            </td>
            <td>{{ parcel.phoneNumber }}</td>
            <td>{{ parcel.location }}</td>
            <td>{{ parcel.size }}</td>
            <td>{{ parcel.plotNumber }}</td>
            <td>
              <span class="coord-badge">{{ parcel.lat }}, {{ parcel.lng }}</span>
            </td>
            <td class="action-buttons">
              <div class="menu-container">
                <button class="menu-trigger" @click.stop="toggleMenu(parcel.id)">
                  ⋮
                </button>
                <div v-if="activeMenuId === parcel.id" class="dropdown-menu">
                  <button class="dropdown-item view" @click="viewParcel(parcel)">
                    👁️ View
                  </button>
                  <button class="dropdown-item edit" @click="openEditModal(parcel)">
                    ✏️ Edit
                  </button>
                  <button class="dropdown-item map" @click="showOnMap(parcel)">
                    🗺️ View on Map
                  </button>
                  <button class="dropdown-item delete" @click="openDeleteModal(parcel.id, parcel.owner)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedParcels.length === 0">
            <td colspan="7" class="no-data">
              📭
              <p>No parcels found</p>
              <button class="add-first-btn" @click="openAddModal">Add First</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Map Modal -->
    <div v-if="showMapModal" class="modal-overlay" @click.self="closeMapModal">
      <div class="modal-container map-modal">
        <div class="modal-header">
          <h3>🗺️ {{ mapParcel.owner }} - Map View</h3>
          <button class="close-btn" @click="closeMapModal">&times;</button>
        </div>
        <div class="modal-body map-body">
          <div id="parcelMap" class="parcel-map"></div>
          <div class="map-info">
            <div class="map-info-row">
              <span class="map-label">Owner:</span>
              <span class="map-value">{{ mapParcel.owner }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Phone:</span>
              <span class="map-value">{{ mapParcel.phoneNumber }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Location:</span>
              <span class="map-value">{{ mapParcel.location }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Size:</span>
              <span class="map-value">{{ mapParcel.size }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Plot No.:</span>
              <span class="map-value">{{ mapParcel.plotNumber }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Coordinates:</span>
              <span class="map-value">{{ mapParcel.lat }}, {{ mapParcel.lng }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="close-view-btn" @click="closeMapModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
      <div class="pagination-info">
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredParcels.length }}
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

    <!-- Add/Edit Parcel Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container add-modal">
        <div class="modal-header">
          <h3><i :class="isEditing ? 'pi pi-pencil' : 'pi pi-plus-circle'"></i> {{ isEditing ? 'Edit Parcel' : 'Add Parcel' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label><i class="pi pi-user"></i> Owner</label>
            <input type="text" v-model="formData.owner" class="form-input" placeholder="Owner name" />
          </div>
          <div class="form-group">
            <label><i class="pi pi-phone"></i> Phone</label>
            <input type="tel" v-model="formData.phoneNumber" class="form-input" placeholder="+254..." />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label><i class="pi pi-map-marker"></i> Location</label>
              <input type="text" v-model="formData.location" class="form-input" placeholder="Location" />
            </div>
            <div class="form-group half">
              <label><i class="pi pi-chart-line"></i> Size</label>
              <input type="text" v-model="formData.size" class="form-input" placeholder="Size" />
            </div>
          </div>
          <div class="form-group">
            <label><i class="pi pi-hashtag"></i> Plot No.</label>
            <input type="text" v-model="formData.plotNumber" class="form-input" placeholder="Plot number" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label><i class="pi pi-map"></i> Latitude</label>
              <input type="number" v-model="formData.lat" class="form-input" step="0.000001" placeholder="-1.283333" />
            </div>
            <div class="form-group half">
              <label><i class="pi pi-map"></i> Longitude</label>
              <input type="number" v-model="formData.lng" class="form-input" step="0.000001" placeholder="36.816667" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveParcel">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>

    <!-- View Parcel Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3><i class="pi pi-eye"></i> Parcel Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Owner:</span>
              <span class="detail-value">{{ viewData.owner }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ viewData.phoneNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ viewData.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Size:</span>
              <span class="detail-value">{{ viewData.size }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Plot No.:</span>
              <span class="detail-value">{{ viewData.plotNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Coordinates:</span>
              <span class="detail-value">{{ viewData.lat }}, {{ viewData.lng }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="map-view-btn" @click="showOnMap(viewData)">🗺️ View on Map</button>
          <button class="edit-from-view-btn" @click="editFromView">Edit</button>
          <button class="close-view-btn" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-container delete-modal">
        <div class="delete-header">
          <i class="pi pi-exclamation-triangle delete-icon"></i>
          <button class="delete-close-btn" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="delete-body">
          <p class="delete-title">Delete Parcel?</p>
          <p class="delete-message">Delete <strong>"{{ parcelToDelete.name }}"</strong>?</p>
          <p class="delete-warning">Cannot be undone!</p>
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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default {
  name: 'Parcels',
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      rowsPerPage: 10,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      showMapModal: false,
      isEditing: false,
      currentId: null,
      activeMenuId: null,
      toastMessage: '',
      toastType: 'success',
      viewData: {},
      mapParcel: {},
      mapInstance: null,
      parcelToDelete: {
        id: null,
        name: ''
      },
      formData: {
        owner: '',
        phoneNumber: '',
        location: '',
        size: '',
        plotNumber: '',
        lat: -1.283333,
        lng: 36.816667
      },
      parcels: [
        {
          id: 1,
          owner: 'Ann Wanjiru',
          phoneNumber: '+254712345678',
          location: 'Nairobi',
          size: '2.1Ha',
          plotNumber: '4393/19',
          lat: -1.283333,
          lng: 36.816667
        },
        {
          id: 2,
          owner: 'Steve Ndirangu',
          phoneNumber: '+254712345678',
          location: 'Kajiado',
          size: '2.1Ha',
          plotNumber: '4393/19',
          lat: -1.85,
          lng: 36.783333
        },
        {
          id: 3,
          owner: 'John Mwangi',
          phoneNumber: '+254723456789',
          location: 'Kiambu',
          size: '5.0Ha',
          plotNumber: '5678/20',
          lat: -1.166667,
          lng: 36.833333
        },
        {
          id: 4,
          owner: 'Mary Wanjiku',
          phoneNumber: '+254734567890',
          location: 'Machakos',
          size: '3.5Ha',
          plotNumber: '6789/21',
          lat: -1.516667,
          lng: 37.266667
        }
      ]
    }
  },
  computed: {
    filteredParcels() {
      if (!this.searchTerm) {
        return this.parcels;
      }
      const term = this.searchTerm.toLowerCase();
      return this.parcels.filter(parcel => 
        parcel.owner.toLowerCase().includes(term) ||
        parcel.location.toLowerCase().includes(term) ||
        parcel.plotNumber.toLowerCase().includes(term) ||
        parcel.phoneNumber.includes(term)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredParcels.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredParcels.length);
    },
    paginatedParcels() {
      return this.filteredParcels.slice(this.startIndex, this.endIndex);
    }
  },
  methods: {
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
    initMap(lat, lng, zoom = 13) {
      if (this.mapInstance) {
        this.mapInstance.remove();
      }
      const element = document.getElementById('parcelMap');
      if (element) {
        this.mapInstance = L.map('parcelMap').setView([lat, lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapInstance);
        L.marker([lat, lng]).addTo(this.mapInstance)
          .bindPopup(`<b>${this.mapParcel.owner}</b><br>${this.mapParcel.location}<br>Plot: ${this.mapParcel.plotNumber}<br>Size: ${this.mapParcel.size}`)
          .openPopup();
      }
    },
    showOnMap(parcel) {
      this.mapParcel = { ...parcel };
      this.showMapModal = true;
      this.activeMenuId = null;
      this.$nextTick(() => {
        this.initMap(parcel.lat, parcel.lng);
      });
    },
    closeMapModal() {
      this.showMapModal = false;
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.showToast(`"${file.name}" uploaded!`, 'success');
      }
      this.$refs.fileInput.value = '';
    },
    openAddModal() {
      this.isEditing = false;
      this.currentId = null;
      this.formData = {
        owner: '',
        phoneNumber: '',
        location: '',
        size: '',
        plotNumber: '',
        lat: -1.283333,
        lng: 36.816667
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    openEditModal(parcel) {
      this.isEditing = true;
      this.currentId = parcel.id;
      this.formData = {
        owner: parcel.owner,
        phoneNumber: parcel.phoneNumber,
        location: parcel.location,
        size: parcel.size,
        plotNumber: parcel.plotNumber,
        lat: parcel.lat,
        lng: parcel.lng
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    viewParcel(parcel) {
      this.viewData = { ...parcel };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    editFromView() {
      this.closeViewModal();
      this.openEditModal(this.viewData);
    },
    saveParcel() {
      if (!this.formData.owner || !this.formData.phoneNumber || !this.formData.location || !this.formData.size || !this.formData.plotNumber) {
        this.showToast('Please fill all fields', 'error');
        return;
      }

      if (this.isEditing) {
        const index = this.parcels.findIndex(p => p.id === this.currentId);
        if (index !== -1) {
          this.parcels[index] = {
            ...this.formData,
            id: this.currentId
          };
          this.showToast('Parcel updated!', 'success');
        }
      } else {
        const newId = this.parcels.length > 0 ? Math.max(...this.parcels.map(p => p.id)) + 1 : 1;
        this.parcels.push({
          ...this.formData,
          id: newId
        });
        this.showToast('Parcel added!', 'success');
      }
      
      // Save to localStorage and dispatch event for map update
      localStorage.setItem('parcels', JSON.stringify(this.parcels));
      window.dispatchEvent(new Event('data-updated'));
      
      this.closeModal();
    },
    openDeleteModal(id, name) {
      this.parcelToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.parcelToDelete.id;
      this.parcels = this.parcels.filter(p => p.id !== id);
      this.showToast('Parcel deleted!', 'success');
      
      // Save to localStorage and dispatch event for map update
      localStorage.setItem('parcels', JSON.stringify(this.parcels));
      window.dispatchEvent(new Event('data-updated'));
      
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.parcelToDelete = { id: null, name: '' };
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
    // Save default data to localStorage if not exists
    const savedParcels = localStorage.getItem('parcels');
    if (!savedParcels) {
      localStorage.setItem('parcels', JSON.stringify(this.parcels));
    } else {
      this.parcels = JSON.parse(savedParcels);
    }
    
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
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  }
}
</script>

<style scoped>
.parcels-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.parcels-header h2 {
  color: #2c3e50;
  margin-bottom: 2px;
  font-size: 20px;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 12px;
  font-size: 11px;
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

.upload-btn {
  background: linear-gradient(135deg, #2196F3, #1976D2);
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

.upload-btn:hover {
  transform: translateY(-1px);
}

.stats-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  padding: 6px 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.stats-icon {
  font-size: 20px;
}

.stats-info h3 {
  margin: 0;
  font-size: 10px;
  font-weight: 500;
  opacity: 0.9;
}

.stats-number {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.parcels-table {
  width: 100%;
  border-collapse: collapse;
}

.parcels-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.parcels-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.parcels-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.parcels-table tr:hover {
  background: #f8f9fa;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.owner-info i {
  color: #4CAF50;
  font-size: 11px;
}

.coord-badge {
  background: #e8f4f8;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 10px;
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
  min-width: 100px;
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

.dropdown-item.map:hover {
  background: #FFF3E0;
  color: #E65100;
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
}

.add-modal {
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
}

.view-modal {
  max-width: 400px;
}

.map-modal {
  width: 90%;
  max-width: 700px;
}

.delete-modal {
  max-width: 320px;
  text-align: center;
}

.parcel-map {
  height: 350px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
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

.map-body {
  padding: 16px;
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

.map-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.map-info-row {
  display: flex;
  padding: 6px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 11px;
}

.map-info-row:last-child {
  border-bottom: none;
}

.map-label {
  font-weight: 600;
  width: 90px;
  color: #2c3e50;
}

.map-value {
  flex: 1;
  color: #555;
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

.save-btn, .edit-from-view-btn, .map-view-btn {
  padding: 5px 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.save-btn:hover, .edit-from-view-btn:hover, .map-view-btn:hover {
  background: #45a049;
}

.delete-header {
  position: relative;
  padding: 12px 16px 0 16px;
}

.delete-icon {
  font-size: 32px;
  color: #f44336;
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
  .parcels-management {
    padding: 10px;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .upload-btn {
    width: 100%;
    justify-content: center;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
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
  
  .parcels-table th,
  .parcels-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .stats-number {
    font-size: 16px;
  }
  
  .parcel-map {
    height: 250px;
  }
}
</style>