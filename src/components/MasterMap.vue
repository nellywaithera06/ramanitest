<template>
  <div class="master-map-container">
    <div class="map-header">
      <h2>Land Map Overview</h2>
      <p class="subtitle">View all parcels and conservancies on an interactive map</p>
    </div>

    <!-- Map Controls -->
    <div class="map-controls">
      <div class="control-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showParcels" @change="toggleLayer('parcels')">
          <span class="checkmark"></span>
          <span class="label-text">📍 Show Parcels</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showConservancies" @change="toggleLayer('conservancies')">
          <span class="checkmark"></span>
          <span class="label-text">🌳 Show Conservancies</span>
        </label>
      </div>
      <div class="stats-info">
        <div class="stat-badge parcels-stat">
          <i class="pi pi-map-marker"></i>
          <span>{{ parcels.length }} Parcels</span>
        </div>
        <div class="stat-badge conservancies-stat">
          <i class="pi pi-tree"></i>
          <span>{{ conservancies.length }} Conservancies</span>
        </div>
        <button class="refresh-btn" @click="refreshMap">
          <i class="pi pi-refresh"></i>
          Refresh Map
        </button>
      </div>
    </div>

    <!-- Map Container -->
    <div id="masterMap" class="master-map"></div>

    <!-- Legend -->
    <div class="map-legend">
      <h4>Legend</h4>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-marker parcel-marker"></div>
          <span>Parcels</span>
        </div>
        <div class="legend-item">
          <div class="legend-marker conservancy-marker"></div>
          <span>Conservancies</span>
        </div>
      </div>
    </div>

    <!-- Click Info Panel -->
    <div v-if="selectedItem" class="info-panel">
      <div class="info-header">
        <h4>{{ selectedItem.type === 'parcel' ? '📍 Parcel Details' : '🌳 Conservancy Details' }}</h4>
        <button class="close-info" @click="selectedItem = null">&times;</button>
      </div>
      <div class="info-content">
        <div v-if="selectedItem.type === 'parcel'">
          <p><strong>Owner:</strong> {{ selectedItem.owner }}</p>
          <p><strong>Location:</strong> {{ selectedItem.location }}</p>
          <p><strong>Size:</strong> {{ selectedItem.size }}</p>
          <p><strong>Plot No.:</strong> {{ selectedItem.plotNumber }}</p>
          <p><strong>Phone:</strong> {{ selectedItem.phoneNumber }}</p>
        </div>
        <div v-else>
          <p><strong>Name:</strong> {{ selectedItem.name }}</p>
          <p><strong>Location:</strong> {{ selectedItem.location }}</p>
          <p><strong>Size:</strong> {{ selectedItem.size }}</p>
          <p><strong>Established:</strong> {{ selectedItem.established }}</p>
        </div>
        <button class="view-details-btn" @click="viewDetails">View Full Details</button>
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
  name: 'MasterMap',
  data() {
    return {
      showParcels: true,
      showConservancies: true,
      map: null,
      parcelMarkers: [],
      conservancyMarkers: [],
      selectedItem: null,
      toastMessage: '',
      toastType: 'success',
      parcels: [],
      conservancies: []
    }
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.initMap()
    })
    
    // Listen for data updates from other components
    window.addEventListener('data-updated', this.handleDataUpdate)
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
    window.removeEventListener('data-updated', this.handleDataUpdate)
  },
  methods: {
    loadData() {
      // Load parcels from localStorage
      const savedParcels = localStorage.getItem('parcels')
      if (savedParcels && JSON.parse(savedParcels).length > 0) {
        this.parcels = JSON.parse(savedParcels)
        console.log('Loaded parcels:', this.parcels.length)
      } else {
        // Default parcels data
        this.parcels = [
          {
            id: 1,
            owner: 'Ann Wanjiru',
            phoneNumber: '+254712345678',
            location: 'Nairobi',
            size: '2.1Ha',
            plotNumber: '4393/19',
            lat: -1.283333,
            lng: 36.816667,
            type: 'parcel'
          },
          {
            id: 2,
            owner: 'Steve Ndirangu',
            phoneNumber: '+254712345678',
            location: 'Kajiado',
            size: '2.1Ha',
            plotNumber: '4393/19',
            lat: -1.85,
            lng: 36.783333,
            type: 'parcel'
          },
          {
            id: 3,
            owner: 'John Mwangi',
            phoneNumber: '+254723456789',
            location: 'Kiambu',
            size: '5.0Ha',
            plotNumber: '5678/20',
            lat: -1.166667,
            lng: 36.833333,
            type: 'parcel'
          },
          {
            id: 4,
            owner: 'Mary Wanjiku',
            phoneNumber: '+254734567890',
            location: 'Machakos',
            size: '3.5Ha',
            plotNumber: '6789/21',
            lat: -1.516667,
            lng: 37.266667,
            type: 'parcel'
          }
        ]
        // Save default data to localStorage
        localStorage.setItem('parcels', JSON.stringify(this.parcels))
      }

      // Load conservancies from localStorage
      const savedConservancies = localStorage.getItem('conservancies')
      if (savedConservancies && JSON.parse(savedConservancies).length > 0) {
        this.conservancies = JSON.parse(savedConservancies)
        console.log('Loaded conservancies:', this.conservancies.length)
      } else {
        // Default conservancies data
        this.conservancies = [
          {
            id: 1,
            name: 'La Courneuve Conservancy',
            location: 'La Courneuve',
            size: '5,000 Ha',
            established: '2010',
            lat: 48.931,
            lng: 2.396,
            type: 'conservancy'
          },
          {
            id: 2,
            name: 'Drancy Wildlife Area',
            location: 'Drancy',
            size: '3,200 Ha',
            established: '2012',
            lat: 48.925,
            lng: 2.444,
            type: 'conservancy'
          },
          {
            id: 3,
            name: 'Bobigny Nature Reserve',
            location: 'Bobigny',
            size: '4,500 Ha',
            established: '2008',
            lat: 48.910,
            lng: 2.439,
            type: 'conservancy'
          },
          {
            id: 4,
            name: 'Bondy Conservation',
            location: 'Bondy',
            size: '2,800 Ha',
            established: '2015',
            lat: 48.902,
            lng: 2.483,
            type: 'conservancy'
          }
        ]
        // Save default data to localStorage
        localStorage.setItem('conservancies', JSON.stringify(this.conservancies))
      }
    },
    
    handleDataUpdate() {
      console.log('Data update received, refreshing map...')
      this.loadData()
      this.refreshMap()
      this.showToast('Map updated with latest data!', 'success')
    },
    
    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    },
    
    initMap() {
      // Center map on Africa/Kenya
      const centerLat = -1.283333
      const centerLng = 36.816667
      
      this.map = L.map('masterMap').setView([centerLat, centerLng], 6)
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      }).addTo(this.map)
      
      this.addAllMarkers()
      this.showToast('Map loaded successfully!', 'success')
    },
    
    addAllMarkers() {
      this.addParcelMarkers()
      this.addConservancyMarkers()
    },
    
    addParcelMarkers() {
      // Clear existing markers
      this.parcelMarkers.forEach(marker => {
        if (this.map) this.map.removeLayer(marker)
      })
      this.parcelMarkers = []
      
      // Add new markers
      this.parcels.forEach(parcel => {
        if (parcel.lat && parcel.lng) {
          const customIcon = L.divIcon({
            html: '<div style="background-color: #f44336; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            className: 'custom-marker'
          })
          
          const marker = L.marker([parcel.lat, parcel.lng], { icon: customIcon })
            .bindPopup(`
              <b>📍 ${parcel.owner}</b><br>
              Location: ${parcel.location}<br>
              Size: ${parcel.size}<br>
              Plot: ${parcel.plotNumber}
            `)
          
          marker.on('click', () => {
            this.selectedItem = { ...parcel, type: 'parcel' }
          })
          
          if (this.showParcels) {
            marker.addTo(this.map)
          }
          
          this.parcelMarkers.push(marker)
        }
      })
      console.log('Added parcel markers:', this.parcelMarkers.length)
    },
    
    addConservancyMarkers() {
      // Clear existing markers
      this.conservancyMarkers.forEach(marker => {
        if (this.map) this.map.removeLayer(marker)
      })
      this.conservancyMarkers = []
      
      // Add new markers
      this.conservancies.forEach(conservancy => {
        if (conservancy.lat && conservancy.lng) {
          const customIcon = L.divIcon({
            html: '<div style="background-color: #4CAF50; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            className: 'custom-marker'
          })
          
          const marker = L.marker([conservancy.lat, conservancy.lng], { icon: customIcon })
            .bindPopup(`
              <b>🌳 ${conservancy.name}</b><br>
              Location: ${conservancy.location}<br>
              Size: ${conservancy.size}<br>
              Established: ${conservancy.established}
            `)
          
          marker.on('click', () => {
            this.selectedItem = { ...conservancy, type: 'conservancy' }
          })
          
          if (this.showConservancies) {
            marker.addTo(this.map)
          }
          
          this.conservancyMarkers.push(marker)
        }
      })
      console.log('Added conservancy markers:', this.conservancyMarkers.length)
    },
    
    toggleLayer(type) {
      if (type === 'parcels') {
        if (this.showParcels) {
          this.parcelMarkers.forEach(marker => marker.addTo(this.map))
        } else {
          this.parcelMarkers.forEach(marker => this.map.removeLayer(marker))
        }
      } else if (type === 'conservancies') {
        if (this.showConservancies) {
          this.conservancyMarkers.forEach(marker => marker.addTo(this.map))
        } else {
          this.conservancyMarkers.forEach(marker => this.map.removeLayer(marker))
        }
      }
    },
    
    refreshMap() {
      this.addParcelMarkers()
      this.addConservancyMarkers()
      this.showToast('Map refreshed!', 'success')
    },
    
    viewDetails() {
      if (this.selectedItem.type === 'parcel') {
        this.$parent.currentView = 'parcels'
      } else {
        this.$parent.currentView = 'conservancies'
      }
    },
    
    fitBounds() {
      const allMarkers = [...this.parcelMarkers, ...this.conservancyMarkers]
      if (allMarkers.length > 0) {
        const group = L.featureGroup(allMarkers)
        this.map.fitBounds(group.getBounds())
      }
    }
  }
}
</script>

<style scoped>
.master-map-container {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100vh;
  position: relative;
}

.map-header h2 {
  color: #2c3e50;
  margin-bottom: 4px;
  font-size: 22px;
}

.map-header .subtitle {
  color: #7f8c8d;
  margin-bottom: 16px;
  font-size: 13px;
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.control-group {
  display: flex;
  gap: 20px;
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #2c3e50;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4CAF50;
}

.stats-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.stat-badge.parcels-stat {
  background: #FFEBEE;
  color: #f44336;
}

.stat-badge.conservancies-stat {
  background: #E8F5E9;
  color: #4CAF50;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: #1976D2;
  transform: translateY(-1px);
}

.master-map {
  height: 550px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1;
  background: #e8f4f8;
}

.map-legend {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}

.map-legend h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #2c3e50;
}

.legend-items {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #555;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-marker.parcel-marker {
  background: #f44336;
  border: 1px solid white;
  box-shadow: 0 0 2px rgba(0,0,0,0.3);
}

.legend-marker.conservancy-marker {
  background: #4CAF50;
  border: 1px solid white;
  box-shadow: 0 0 2px rgba(0,0,0,0.3);
}

.info-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  width: 280px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px 12px 0 0;
  color: white;
}

.info-header h4 {
  margin: 0;
  font-size: 14px;
}

.close-info {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.info-content {
  padding: 12px 16px;
}

.info-content p {
  margin: 6px 0;
  font-size: 12px;
  color: #555;
}

.info-content p strong {
  color: #2c3e50;
}

.view-details-btn {
  width: 100%;
  margin-top: 12px;
  padding: 6px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.view-details-btn:hover {
  background: #45a049;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10000;
  animation: slideDown 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 12px;
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
  .master-map-container {
    padding: 12px;
  }
  
  .map-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    justify-content: center;
  }
  
  .stats-info {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .master-map {
    height: 400px;
  }
  
  .map-legend {
    bottom: 10px;
    right: 10px;
    padding: 6px 12px;
  }
  
  .info-panel {
    bottom: 10px;
    left: 10px;
    right: 10px;
    width: auto;
  }
}
</style>