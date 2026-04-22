<template>
  <div class="conservancies-management">
    <div class="conservancies-header">
      <h2>Conservancies</h2>
      <p class="subtitle">Here is the Land information management system conservancies</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search conservancies..." 
          class="search-input"
        />
      </div>
      <button class="add-conservancy-btn" @click="openAddModal">
        <i class="pi pi-plus"></i>
        Add New
      </button>
    </div>

    <!-- Stats Card -->
    <div class="stats-card">
      <div class="stats-icon">🌳</div>
      <div class="stats-info">
        <h3>Total Conservancies</h3>
        <p class="stats-number">{{ filteredConservancies.length }}</p>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="two-columns">
      <!-- Conservancies Table -->
      <div class="table-container">
        <table class="conservancies-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>LOCATION</th>
              <th>SIZE</th>
              <th>ESTABLISHED</th>
              <th>COORDINATES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(conservancy, index) in paginatedConservancies" :key="conservancy.id">
              <td class="name-cell">
                <div class="name-info">
                  <i class="pi pi-globe"></i>
                  <span>{{ conservancy.name }}</span>
                </div>
              </td>
              <td>{{ conservancy.location }}</td>
              <td>{{ conservancy.size }}</td>
              <td>{{ conservancy.established }}</td>
              <td>
                <span class="coord-badge">{{ conservancy.lat }}, {{ conservancy.lng }}</span>
              </td>
              <td class="action-buttons">
                <div class="menu-container">
                  <button class="menu-trigger" @click.stop="toggleMenu(conservancy.id)">
                    ⋮
                  </button>
                  <div v-if="activeMenuId === conservancy.id" class="dropdown-menu">
                    <button class="dropdown-item view" @click="viewConservancy(conservancy)">
                      👁️ View
                    </button>
                    <button class="dropdown-item edit" @click="openEditModal(conservancy)">
                      ✏️ Edit
                    </button>
                    <button class="dropdown-item map" @click="showOnMap(conservancy)">
                      🗺️ View on Map
                    </button>
                    <button class="dropdown-item delete" @click="openDeleteModal(conservancy.id, conservancy.name)">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedConservancies.length === 0">
              <td colspan="6" class="no-data">
                📭
                <p>No conservancies found</p>
                <button class="add-first-btn" @click="openAddModal">Add First</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Location List (Legend) -->
      <div class="location-list-card">
        <h3>📍 Locations</h3>
        <div class="location-list">
          <div class="location-group">
            <h4>Main Areas</h4>
            <ul>
              <li v-for="location in mainLocations" :key="location">
                <span class="location-dot"></span>
                {{ location }}
              </li>
            </ul>
          </div>
          <div class="location-group">
            <h4>Arrondissements</h4>
            <ul>
              <li v-for="arrondissement in arrondissements" :key="arrondissement">
                <span class="location-dot"></span>
                {{ arrondissement }}
              </li>
            </ul>
          </div>
          <div class="location-group">
            <h4>Paris</h4>
            <ul>
              <li>
                <span class="location-dot"></span>
                Paris
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Modal -->
    <div v-if="showMapModal" class="modal-overlay" @click.self="closeMapModal">
      <div class="modal-container map-modal">
        <div class="modal-header">
          <h3>🗺️ {{ mapConservancy.name }} - Map View</h3>
          <button class="close-btn" @click="closeMapModal">&times;</button>
        </div>
        <div class="modal-body map-body">
          <div id="conservancyMap" class="conservancy-map"></div>
          <div class="map-info">
            <div class="map-info-row">
              <span class="map-label">Name:</span>
              <span class="map-value">{{ mapConservancy.name }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Location:</span>
              <span class="map-value">{{ mapConservancy.location }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Size:</span>
              <span class="map-value">{{ mapConservancy.size }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Established:</span>
              <span class="map-value">{{ mapConservancy.established }}</span>
            </div>
            <div class="map-info-row">
              <span class="map-label">Coordinates:</span>
              <span class="map-value">{{ mapConservancy.lat }}, {{ mapConservancy.lng }}</span>
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
        {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredConservancies.length }}
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

    <!-- Add/Edit Conservancy Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container add-modal">
        <div class="modal-header">
          <h3>{{ isEditing ? '✏️ Edit' : '➕ Add Conservancy' }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label><i class="pi pi-globe"></i> Conservancy Name</label>
            <input type="text" v-model="formData.name" class="form-input" placeholder="Enter conservancy name" />
          </div>
          <div class="form-group">
            <label><i class="pi pi-map-marker"></i> Location</label>
            <input type="text" v-model="formData.location" class="form-input" placeholder="Enter location" />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label><i class="pi pi-chart-line"></i> Size (Ha)</label>
              <input type="text" v-model="formData.size" class="form-input" placeholder="e.g., 5000Ha" />
            </div>
            <div class="form-group half">
              <label><i class="pi pi-calendar"></i> Established</label>
              <input type="text" v-model="formData.established" class="form-input" placeholder="e.g., 2015" />
            </div>
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
          <button class="save-btn" @click="saveConservancy">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>
    </div>

    <!-- View Conservancy Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3>🌳 Conservancy Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ viewData.name }}</span>
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
              <span class="detail-label">Established:</span>
              <span class="detail-value">{{ viewData.established }}</span>
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
          <span class="delete-icon">⚠️</span>
          <button class="delete-close-btn" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="delete-body">
          <p class="delete-title">Delete?</p>
          <p class="delete-message">Delete <strong>"{{ conservancyToDelete.name }}"</strong>?</p>
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
  name: 'Conservancies',
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
      mapConservancy: {},
      mapInstance: null,
      conservancyToDelete: {
        id: null,
        name: ''
      },
      formData: {
        name: '',
        location: '',
        size: '',
        established: '',
        lat: -1.283333,
        lng: 36.816667
      },
      mainLocations: [
        'La Courneuve',
        'Drancy',
        'Bobigny',
        'Bondy',
        'Gagny',
        'Rosny-sous-Bois',
        'Fontenay-sous-Bois',
        'Noisy',
        'Champigny-sur-Marne'
      ],
      arrondissements: [
        '18th ARRONDISSEMENT',
        '20th ARRONDISSEMENT'
      ],
      conservancies: [
        {
          id: 1,
          name: 'La Courneuve Conservancy',
          location: 'La Courneuve',
          size: '5,000 Ha',
          established: '2010',
          lat: 48.931,
          lng: 2.396
        },
        {
          id: 2,
          name: 'Drancy Wildlife Area',
          location: 'Drancy',
          size: '3,200 Ha',
          established: '2012',
          lat: 48.925,
          lng: 2.444
        },
        {
          id: 3,
          name: 'Bobigny Nature Reserve',
          location: 'Bobigny',
          size: '4,500 Ha',
          established: '2008',
          lat: 48.910,
          lng: 2.439
        },
        {
          id: 4,
          name: 'Bondy Conservation',
          location: 'Bondy',
          size: '2,800 Ha',
          established: '2015',
          lat: 48.902,
          lng: 2.483
        }
      ]
    }
  },
  computed: {
    filteredConservancies() {
      if (!this.searchTerm) {
        return this.conservancies;
      }
      const term = this.searchTerm.toLowerCase();
      return this.conservancies.filter(cons => 
        cons.name.toLowerCase().includes(term) ||
        cons.location.toLowerCase().includes(term)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredConservancies.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.rowsPerPage, this.filteredConservancies.length);
    },
    paginatedConservancies() {
      return this.filteredConservancies.slice(this.startIndex, this.endIndex);
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
      const element = document.getElementById('conservancyMap');
      if (element) {
        this.mapInstance = L.map('conservancyMap').setView([lat, lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapInstance);
        L.marker([lat, lng]).addTo(this.mapInstance)
          .bindPopup(`<b>${this.mapConservancy.name}</b><br>${this.mapConservancy.location}<br>Size: ${this.mapConservancy.size}<br>Est: ${this.mapConservancy.established}`)
          .openPopup();
      }
    },
    showOnMap(conservancy) {
      this.mapConservancy = { ...conservancy };
      this.showMapModal = true;
      this.activeMenuId = null;
      this.$nextTick(() => {
        this.initMap(conservancy.lat, conservancy.lng);
      });
    },
    closeMapModal() {
      this.showMapModal = false;
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.currentId = null;
      this.formData = {
        name: '',
        location: '',
        size: '',
        established: '',
        lat: -1.283333,
        lng: 36.816667
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    openEditModal(conservancy) {
      this.isEditing = true;
      this.currentId = conservancy.id;
      this.formData = {
        name: conservancy.name,
        location: conservancy.location,
        size: conservancy.size,
        established: conservancy.established,
        lat: conservancy.lat,
        lng: conservancy.lng
      };
      this.showModal = true;
      this.activeMenuId = null;
    },
    viewConservancy(conservancy) {
      this.viewData = { ...conservancy };
      this.showViewModal = true;
      this.activeMenuId = null;
    },
    editFromView() {
      this.closeViewModal();
      this.openEditModal(this.viewData);
    },
    saveConservancy() {
      if (!this.formData.name || !this.formData.location || !this.formData.size) {
        this.showToast('Please fill all fields', 'error');
        return;
      }

      if (this.isEditing) {
        const index = this.conservancies.findIndex(c => c.id === this.currentId);
        if (index !== -1) {
          this.conservancies[index] = {
            ...this.formData,
            id: this.currentId
          };
          this.showToast('Conservancy updated!', 'success');
        }
      } else {
        const newId = this.conservancies.length > 0 ? Math.max(...this.conservancies.map(c => c.id)) + 1 : 1;
        this.conservancies.push({
          ...this.formData,
          id: newId
        });
        this.showToast('Conservancy added!', 'success');
      }
      
      // Save to localStorage and dispatch event for map update
      localStorage.setItem('conservancies', JSON.stringify(this.conservancies));
      window.dispatchEvent(new Event('data-updated'));
      
      this.closeModal();
    },
    openDeleteModal(id, name) {
      this.conservancyToDelete = { id, name };
      this.showDeleteModal = true;
      this.activeMenuId = null;
    },
    confirmDelete() {
      const id = this.conservancyToDelete.id;
      this.conservancies = this.conservancies.filter(c => c.id !== id);
      this.showToast('Conservancy deleted!', 'success');
      
      // Save to localStorage and dispatch event for map update
      localStorage.setItem('conservancies', JSON.stringify(this.conservancies));
      window.dispatchEvent(new Event('data-updated'));
      
      this.closeDeleteModal();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.conservancyToDelete = { id: null, name: '' };
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
    const savedConservancies = localStorage.getItem('conservancies');
    if (!savedConservancies) {
      localStorage.setItem('conservancies', JSON.stringify(this.conservancies));
    } else {
      this.conservancies = JSON.parse(savedConservancies);
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
.conservancies-management {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.conservancies-header h2 {
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

.add-conservancy-btn {
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

.add-conservancy-btn:hover {
  transform: translateY(-1px);
}

/* Stats Card */
.stats-card {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 8px;
  padding: 8px 12px;
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

/* Two Column Layout */
.two-columns {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 12px;
  margin-bottom: 12px;
}

/* Table Styles */
.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.conservancies-table {
  width: 100%;
  border-collapse: collapse;
}

.conservancies-table thead {
  background: linear-gradient(135deg, #f8f9fa, #f0f2f5);
}

.conservancies-table th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  font-size: 11px;
  border-bottom: 1px solid #e0e0e0;
}

.conservancies-table td {
  padding: 6px 10px;
  text-align: left;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.conservancies-table tr:hover {
  background: #f8f9fa;
}

.name-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.name-info i {
  color: #2ecc71;
  font-size: 11px;
}

.coord-badge {
  background: #e8f4f8;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 10px;
}

/* Location List Card */
.location-list-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: fit-content;
}

.location-list-card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e0e0e0;
}

.location-group {
  margin-bottom: 12px;
}

.location-group h4 {
  color: #2ecc71;
  font-size: 11px;
  margin-bottom: 6px;
  font-weight: 600;
}

.location-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.location-group li {
  padding: 5px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}

.location-group li:last-child {
  border-bottom: none;
}

.location-dot {
  width: 5px;
  height: 5px;
  background: #2ecc71;
  border-radius: 50%;
  display: inline-block;
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

/* Modal Styles */
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

.map-modal {
  width: 90%;
  max-width: 700px;
}

.delete-modal {
  width: 280px;
  max-width: 90%;
  text-align: center;
  overflow: hidden;
}

.conservancy-map {
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
  color: #2ecc71;
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
  border-color: #2ecc71;
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
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
}

.save-btn:hover, .edit-from-view-btn:hover, .map-view-btn:hover {
  background: #27ae60;
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
  color: #e74c3c;
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
  background: #e74c3c;
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
  background: #2ecc71;
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
  background: #2ecc71;
  color: white;
}

.toast.error {
  background: #e74c3c;
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
  .conservancies-management {
    padding: 10px;
  }
  
  .two-columns {
    grid-template-columns: 1fr;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .add-conservancy-btn {
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
  
  .conservancies-table th,
  .conservancies-table td {
    padding: 5px 6px;
    font-size: 10px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .delete-modal {
    width: 260px;
  }
  
  .conservancy-map {
    height: 250px;
  }
}
</style>