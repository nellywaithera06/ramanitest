<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo" v-if="!isSidebarCollapsed">
          <span class="logo-icon">🌍</span>
          <span class="logo-text">ramani</span>
        </div>
        <div class="logo-icon-only" v-else>
          <span class="logo-icon">🌍</span>
        </div>
        <button @click="toggleSidebar" class="toggle-btn">
          <i :class="isSidebarCollapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
        </button>
      </div>

      <div class="menu-label" v-if="!isSidebarCollapsed">MENU</div>
      
      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <div class="nav-item" :class="{ active: currentView === 'dashboard' }" @click="currentView = 'dashboard'">
          <i class="pi pi-home nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Dashboard</span>
        </div>

        <!-- Master Map -->
        <div class="nav-item" :class="{ active: currentView === 'masterMap' }" @click="currentView = 'masterMap'">
          <i class="pi pi-map nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Master Map</span>
        </div>

        <!-- Lease Management Dropdown -->
        <div class="nav-item dropdown-toggle" @click="toggleLeaseDropdown">
          <i class="pi pi-file-pdf nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Lease Management</span>
          <i v-if="!isSidebarCollapsed" class="pi pi-chevron-down dropdown-arrow" :class="{ 'rotated': leaseDropdownOpen }"></i>
        </div>
        
        <div class="dropdown-menu" v-if="leaseDropdownOpen && !isSidebarCollapsed">
          <div class="dropdown-item" :class="{ active: currentView === 'lease' }" @click="selectSubMenu('lease')">
            <i class="pi pi-book"></i>
            <span>Leases</span>
          </div>
          <div class="dropdown-item" :class="{ active: currentView === 'leaseHolders' }" @click="selectSubMenu('leaseHolders')">
            <i class="pi pi-users"></i>
            <span>Lease Holders</span>
          </div>
        </div>

        <!-- Documents -->
        <div class="nav-item" :class="{ active: currentView === 'documents' }" @click="currentView = 'documents'">
          <i class="pi pi-folder nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Documents</span>
        </div>

        <!-- Beneficiaries -->
        <div class="nav-item" :class="{ active: currentView === 'beneficiaries' }" @click="currentView = 'beneficiaries'">
          <i class="pi pi-heart nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Beneficiaries</span>
        </div>

        <!-- Land Management Dropdown -->
        <div class="nav-item dropdown-toggle" @click="toggleLandManagementDropdown">
          <i class="pi pi-map-marker nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Land Management</span>
          <i v-if="!isSidebarCollapsed" class="pi pi-chevron-down dropdown-arrow" :class="{ 'rotated': landManagementDropdownOpen }"></i>
        </div>
        
        <div class="dropdown-menu" v-if="landManagementDropdownOpen && !isSidebarCollapsed">
          <div class="dropdown-item" :class="{ active: currentView === 'parcels' }" @click="selectLandMenu('parcels')">
            <i class="pi pi-map-marker"></i>
            <span>Parcels</span>
          </div>
          <div class="dropdown-item" :class="{ active: currentView === 'conservancies' }" @click="selectLandMenu('conservancies')">
            <i class="pi pi-tree"></i>
            <span>Conservancies</span>
          </div>
        </div>

        <!-- Settings - LINKED -->
        <div class="nav-item" :class="{ active: currentView === 'settings' }" @click="currentView = 'settings'">
          <i class="pi pi-cog nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Settings</span>
        </div>

        <!-- User Management -->
        <div class="nav-item" :class="{ active: currentView === 'userManagement' }" @click="currentView = 'userManagement'">
          <i class="pi pi-users nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">User Management</span>
        </div>

        <!-- Help -->
        <div class="nav-item" :class="{ active: currentView === 'help' }" @click="currentView = 'help'">
          <i class="pi pi-question-circle nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Help</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="nav-item" @click="handleLogout">
          <i class="pi pi-sign-out nav-icon"></i>
          <span class="nav-label" v-if="!isSidebarCollapsed">Logout</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'content-expanded': isSidebarCollapsed }">
      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="dashboard-container">
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">Here is the Land information management system dashboard</p>
          </div>
          <div class="user-info">
            <div class="avatar">
              <img :src="`https://ui-avatars.com/api/?background=4CAF50&color=fff&name=${userName}`" alt="Avatar" class="avatar-img">
            </div>
            <span class="user-name">Welcome, {{ userName }}</span>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </div>
        </div>

        <!-- Stats Cards with Icons -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🌾</div>
            <div class="stat-content">
              <h3>Size of land</h3>
              <p class="stat-value">40,988ha</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div class="stat-content">
              <h3>Assigned lease</h3>
              <p class="stat-value">10,999 lease</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>Titleholders</h3>
              <p class="stat-value">12,900 people</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>Amount disbursed</h3>
              <p class="stat-value">Ksh 20,999,999</p>
            </div>
          </div>
        </div>

        <!-- Map View and Legend Row -->
        <div class="two-columns">
          <div class="card">
            <h3>🗺️ Map view</h3>
            <p>Here is an interactive map of the land you have leased</p>
            <div id="dashboardMap" class="dashboard-map"></div>
          </div>

          <div class="card">
            <h3>📍 Legend</h3>
            <div class="legend-list">
              <div class="legend-item"><span class="legend-color" style="background: #4CAF50;"></span> Colombes</div>
              <div class="legend-item"><span class="legend-color" style="background: #2196F3;"></span> Genevilliers</div>
              <div class="legend-item"><span class="legend-color" style="background: #FF9800;"></span> La Courneuve</div>
              <div class="legend-item"><span class="legend-color" style="background: #9C27B0;"></span> Drancy</div>
              <div class="legend-item"><span class="legend-color" style="background: #F44336;"></span> Livre-Gargant</div>
              <div class="legend-item"><span class="legend-color" style="background: #009688;"></span> Bobigny</div>
              <div class="legend-item"><span class="legend-color" style="background: #795548;"></span> Bondy</div>
              <div class="legend-item"><span class="legend-color" style="background: #607D8B;"></span> Rosny</div>
              <div class="legend-item"><span class="legend-color" style="background: #E91E63;"></span> Sous-Bois</div>
              <div class="legend-item"><span class="legend-color" style="background: #3F51B5;"></span> Fontenay-sous-Bois</div>
              <div class="legend-item"><span class="legend-color" style="background: #8BC34A;"></span> Champigny-sur-Marne</div>
            </div>
          </div>
        </div>

        <!-- Pie Chart and Lease Agreements Row -->
        <div class="two-columns">
          <div class="card">
            <h3>📊 Camp Distribution - Pie Chart</h3>
            <div class="pie-chart-container">
              <canvas id="campPieChart" width="400" height="400"></canvas>
              <div class="pie-legend">
                <div><span class="pie-color" style="background: #FF6B6B;"></span> Masaai mara camp: 40M (52.6%)</div>
                <div><span class="pie-color" style="background: #4ECDC4;"></span> Serengeti camp: 20M (26.3%)</div>
                <div><span class="pie-color" style="background: #45B7D1;"></span> Kongoni camp: 15M (19.7%)</div>
                <div><span class="pie-color" style="background: #96CEB4;"></span> Kajiado camp: 100K (0.1%)</div>
                <div><span class="pie-color" style="background: #FFEAA7;"></span> Taita hills: 700K (0.9%)</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>📋 Lease agreements</h3>
            <p>Here are some of your listed lease agreements</p>
            <div class="lease-agreements">
              <div class="lease-item">
                <div class="lease-icon">📄</div>
                <div class="lease-info">
                  <div class="lease-code">WPH01123456U983</div>
                  <div class="lease-name">Masaai mara camp</div>
                </div>
              </div>
              <div class="lease-item">
                <div class="lease-icon">📄</div>
                <div class="lease-info">
                  <div class="lease-code">WPH01123456U983</div>
                  <div class="lease-name">Masaai mara camp</div>
                </div>
              </div>
              <div class="lease-item">
                <div class="lease-icon">📄</div>
                <div class="lease-info">
                  <div class="lease-code">WPH01123456U984</div>
                  <div class="lease-name">Serengeti camp</div>
                </div>
              </div>
              <div class="lease-item">
                <div class="lease-icon">📄</div>
                <div class="lease-info">
                  <div class="lease-code">WPH01123456U985</div>
                  <div class="lease-name">Kongoni camp</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card full-width">
          <h3>📈 Revenue Distribution - Donut Chart</h3>
          <div class="pie-chart-container">
            <canvas id="revenueDonutChart" width="400" height="400"></canvas>
            <div class="pie-legend">
              <div><span class="pie-color" style="background: #FF6B6B;"></span> Masaai mara camp: 40M (52.6%)</div>
              <div><span class="pie-color" style="background: #4ECDC4;"></span> Serengeti camp: 20M (26.3%)</div>
              <div><span class="pie-color" style="background: #45B7D1;"></span> Kongoni camp: 15M (19.7%)</div>
              <div><span class="pie-color" style="background: #96CEB4;"></span> Kajiado camp: 100K (0.1%)</div>
              <div><span class="pie-color" style="background: #FFEAA7;"></span> Taita hills: 700K (0.9%)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Master Map View -->
      <MasterMap v-else-if="currentView === 'masterMap'" />

      <!-- Settings View -->
      <Settings v-else-if="currentView === 'settings'" />

      <!-- User Management View -->
      <UserManagement v-else-if="currentView === 'userManagement'" />

      <!-- Other Views -->
      <LeaseManagement v-else-if="currentView === 'lease'" />
      <LeaseHolders v-else-if="currentView === 'leaseHolders'" />
      <Documents v-else-if="currentView === 'documents'" />
      <Beneficiaries v-else-if="currentView === 'beneficiaries'" />
      <Parcels v-else-if="currentView === 'parcels'" />
      <Conservancies v-else-if="currentView === 'conservancies'" />

      <div v-else class="coming-soon">
        <div class="coming-soon-image">
          <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="Coming Soon">
        </div>
        <i class="pi pi-info-circle"></i>
        <h2>{{ getPageTitle() }}</h2>
        <p>This page is under construction...</p>
      </div>
    </div>
  </div>
</template>

<script>
import LeaseManagement from '../components/LeaseManagement.vue'
import LeaseHolders from '../components/LeaseHolders.vue'
import Documents from '../components/Documents.vue'
import Beneficiaries from '../components/Beneficiaries.vue'
import Parcels from '../components/Parcels.vue'
import Conservancies from '../components/Conservancies.vue'
import MasterMap from '../components/MasterMap.vue'
import Settings from '../components/Settings.vue'
import UserManagement from '../components/UserManagement.vue'
import Chart from 'chart.js/auto'
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
  name: 'DashboardView',
  components: {
    LeaseManagement,
    LeaseHolders,
    Documents,
    Beneficiaries,
    Parcels,
    Conservancies,
    MasterMap,
    Settings,
    UserManagement
  },
  data() {
    return {
      userName: '',
      currentView: 'dashboard',
      leaseDropdownOpen: false,
      landManagementDropdownOpen: false,
      isSidebarCollapsed: false,
      campPieChart: null,
      revenueDonutChart: null,
      dashboardMap: null
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
    checkAuth() {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated || isAuthenticated !== 'true') {
        this.$router.push('/login');
        return false;
      }
      
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.userName = user.name || 'User';
        } catch (e) {
          console.error('Error parsing user data', e);
          this.userName = 'User';
        }
      } else {
        this.$router.push('/login');
        return false;
      }
      return true;
    },
    getPageTitle() {
      const titles = {
        settings: 'Settings',
        userManagement: 'User Management',
        help: 'Help',
        leaseHolders: 'Lease Holders',
        documents: 'Documents',
        beneficiaries: 'Beneficiaries',
        parcels: 'Parcels',
        conservancies: 'Conservancies',
        masterMap: 'Master Map'
      };
      return titles[this.currentView] || 'Page';
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleLeaseDropdown() {
      this.leaseDropdownOpen = !this.leaseDropdownOpen;
    },
    toggleLandManagementDropdown() {
      this.landManagementDropdownOpen = !this.landManagementDropdownOpen;
    },
    selectSubMenu(view) {
      this.currentView = view;
      this.leaseDropdownOpen = false;
    },
    selectLandMenu(view) {
      this.currentView = view;
      this.landManagementDropdownOpen = false;
    },
    initDashboardMap() {
      const mapElement = document.getElementById('dashboardMap');
      if (mapElement && !this.dashboardMap) {
        // Center on Africa/Kenya
        this.dashboardMap = L.map('dashboardMap').setView([-1.283333, 36.816667], 6);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        }).addTo(this.dashboardMap);
        
        // Add sample markers for demonstration
        const sampleLocations = [
          { lat: -1.283333, lng: 36.816667, name: 'Nairobi - Central Hub', type: 'parcel' },
          { lat: -1.85, lng: 36.783333, name: 'Kajiado - Conservancy', type: 'conservancy' },
          { lat: -1.166667, lng: 36.833333, name: 'Kiambu - Farmlands', type: 'parcel' },
          { lat: -1.516667, lng: 37.266667, name: 'Machakos - Agricultural Zone', type: 'parcel' },
          { lat: 48.931, lng: 2.396, name: 'La Courneuve Conservancy', type: 'conservancy' }
        ];
        
        sampleLocations.forEach(location => {
          const markerColor = location.type === 'parcel' ? '#f44336' : '#4CAF50';
          const customIcon = L.divIcon({
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            className: 'dashboard-marker'
          });
          
          L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(this.dashboardMap)
            .bindPopup(`<b>${location.name}</b><br>Type: ${location.type === 'parcel' ? '📍 Parcel' : '🌳 Conservancy'}`);
        });
      }
    },
    initCharts() {
      if (this.campPieChart) {
        this.campPieChart.destroy();
      }
      if (this.revenueDonutChart) {
        this.revenueDonutChart.destroy();
      }

      const campCtx = document.getElementById('campPieChart')?.getContext('2d');
      if (campCtx) {
        this.campPieChart = new Chart(campCtx, {
          type: 'pie',
          data: {
            labels: ['Masaai mara camp', 'Serengeti camp', 'Kongoni camp', 'Kajiado camp', 'Taita hills'],
            datasets: [{
              data: [40000000, 20000000, 15000000, 100000, 700000],
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 10 } } },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: Ksh ${(value/1000000).toFixed(1)}M (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }

      const revenueCtx = document.getElementById('revenueDonutChart')?.getContext('2d');
      if (revenueCtx) {
        this.revenueDonutChart = new Chart(revenueCtx, {
          type: 'doughnut',
          data: {
            labels: ['Masaai mara camp', 'Serengeti camp', 'Kongoni camp', 'Kajiado camp', 'Taita hills'],
            datasets: [{
              data: [40000000, 20000000, 15000000, 100000, 700000],
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
              borderWidth: 2,
              borderColor: '#fff',
              cutout: '60%'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 10 } } },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: Ksh ${(value/1000000).toFixed(1)}M (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }
  },
  mounted() {
    this.checkAuth();
    this.$nextTick(() => {
      this.initCharts();
      this.initDashboardMap();
    });
  },
  beforeUnmount() {
    if (this.campPieChart) {
      this.campPieChart.destroy();
    }
    if (this.revenueDonutChart) {
      this.revenueDonutChart.destroy();
    }
    if (this.dashboardMap) {
      this.dashboardMap.remove();
    }
  },
  watch: {
    isSidebarCollapsed() {
      this.$nextTick(() => {
        this.initCharts();
        setTimeout(() => {
          if (this.dashboardMap) {
            this.dashboardMap.invalidateSize();
          }
        }, 300);
      });
    }
  }
}
</script>

<style scoped>
/* Layout with Sidebar */
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  z-index: 100;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo, .logo-icon-only {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
}

.toggle-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 5px;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background: rgba(255,255,255,0.3);
}

.menu-label {
  padding: 20px 20px 10px 20px;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255,255,255,0.8);
  white-space: nowrap;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255,255,255,0.2);
  color: white;
  border-left: 4px solid #4CAF50;
}

/* Dropdown Toggle - keeps alignment */
.dropdown-toggle {
  justify-content: space-between;
}

.dropdown-arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
  font-size: 12px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  padding-left: 56px;
  background: rgba(0, 0, 0, 0.2);
  margin: 5px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
}

.dropdown-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.dropdown-item.active {
  background: rgba(255,255,255,0.15);
  color: white;
  border-left: 3px solid #4CAF50;
}

.nav-icon {
  font-size: 18px;
  min-width: 24px;
}

.nav-label {
  font-size: 14px;
}

.sidebar-footer {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 0;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  background: #f5f7fa;
  transition: margin-left 0.3s ease;
  width: calc(100% - 260px);
}

.content-expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Dashboard Styles */
.dashboard-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.dashboard-title {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 24px;
}

.dashboard-subtitle {
  color: #7f8c8d;
  font-size: 13px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.logout-btn {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-card h3 {
  color: #7f8c8d;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

/* Two Columns */
.two-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
}

/* Dashboard Map Styles */
.dashboard-map {
  height: 250px;
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
  z-index: 1;
  background: #e8f4f8;
}

/* Legend */
.legend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #555;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
}

/* Pie Chart */
.pie-chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

canvas {
  max-width: 250px;
  max-height: 250px;
}

.pie-legend {
  flex: 1;
  min-width: 160px;
}

.pie-legend div {
  margin-bottom: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pie-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* Lease Agreements */
.lease-agreements {
  margin-top: 12px;
}

.lease-item {
  background: #f8f9fa;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 3px solid #4CAF50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lease-icon {
  font-size: 16px;
}

.lease-info {
  flex: 1;
}

.lease-code {
  font-family: monospace;
  font-size: 10px;
  color: #7f8c8d;
  margin-bottom: 2px;
}

.lease-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
}

.full-width {
  grid-column: 1 / -1;
}

/* Coming Soon */
.coming-soon {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  margin: 20px;
}

.coming-soon-image img {
  width: 80px;
  height: 80px;
}

.coming-soon i {
  font-size: 50px;
  color: #4CAF50;
  margin-bottom: 15px;
  display: block;
}

.coming-soon h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.coming-soon p {
  font-size: 13px;
  color: #7f8c8d;
}

/* Scrollbar */
.sidebar::-webkit-scrollbar {
  width: 5px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
  }
  
  .content-expanded {
    margin-left: 0;
    width: 100%;
  }
  
  .dashboard-container {
    padding: 12px;
  }
  
  .two-columns {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  canvas {
    max-width: 200px;
    max-height: 200px;
  }
  
  .dashboard-map {
    height: 200px;
  }
}
</style>