<template>
  <div class="user-management-container">
    <div class="page-header">
      <h1 class="page-title">User Management</h1>
      <p class="page-subtitle">Manage users, roles, and permissions</p>
    </div>

    <!-- Stats Cards - Clickable -->
    <div class="stats-grid">
      <div class="stat-card" @click="filterByType('all')" :class="{ active: activeFilter === 'all' }">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>{{ users.length }}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div class="stat-card" @click="filterByType('admin')" :class="{ active: activeFilter === 'admin' }">
        <div class="stat-icon">👑</div>
        <div class="stat-info">
          <h3>{{ getAdminCount() }}</h3>
          <p>Administrators</p>
        </div>
      </div>
      <div class="stat-card" @click="filterByType('user')" :class="{ active: activeFilter === 'user' }">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <h3>{{ getUserCount() }}</h3>
          <p>Regular Users</p>
        </div>
      </div>
      <div class="stat-card" @click="filterByType('active')" :class="{ active: activeFilter === 'active' }">
        <div class="stat-icon">🟢</div>
        <div class="stat-info">
          <h3>{{ getActiveUserCount() }}</h3>
          <p>Active Users</p>
        </div>
      </div>
    </div>

    <!-- Active Filter Badge -->
    <div class="filter-badge" v-if="activeFilter !== 'all'">
      <span>Showing: {{ getFilterLabel() }}</span>
      <button @click="clearFilter" class="clear-filter">✕ Clear Filter</button>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <button @click="showAddModal = true" class="btn-primary">
        <i class="pi pi-plus"></i> Add New User
      </button>
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input type="text" v-model="searchQuery" placeholder="Search users...">
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="small-text">{{ user.id }}</td>
            <td>
              <div class="user-cell">
                <div class="user-avatar" :style="{ background: getAvatarColor(user.role) }">
                  {{ user.name.charAt(0) }}
                </div>
                <span class="user-name small-text">{{ user.name }}</span>
              </div>
            </td>
            <td class="small-text">{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role, 'small-badge']">{{ user.role }}</span>
            </td>
            <td>
              <span :class="['status-badge', user.status, 'small-badge']" @click="toggleStatus(user)" style="cursor: pointer;">
                {{ user.status }}
              </span>
            </td>
            <td class="small-text">{{ user.createdAt }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editUser(user)" class="btn-icon edit" title="Edit">
                  ✏️
                </button>
                <button @click="deleteUser(user.id)" class="btn-icon delete" title="Delete">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="no-data small-text">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" v-model="formData.name" required class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input type="email" v-model="formData.email" required class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Role *</label>
            <select v-model="formData.role" required class="form-input">
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="formData.status" class="form-input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      searchQuery: '',
      showAddModal: false,
      isEditing: false,
      activeFilter: 'all',
      formData: {
        id: null,
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        createdAt: ''
      }
    }
  },
  computed: {
    filteredUsers() {
      let filtered = this.users
      
      // Apply role/status filter
      if (this.activeFilter === 'admin') {
        filtered = filtered.filter(user => user.role === 'admin')
      } else if (this.activeFilter === 'user') {
        filtered = filtered.filter(user => user.role === 'user')
      } else if (this.activeFilter === 'active') {
        filtered = filtered.filter(user => user.status === 'active')
      }
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        )
      }
      
      return filtered
    }
  },
  methods: {
    loadUsers() {
      const savedUsers = localStorage.getItem('users')
      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
      } else {
        this.users = [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@ramani.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@ramani.com',
            role: 'user',
            status: 'active',
            createdAt: '2024-02-10'
          },
          {
            id: 3,
            name: 'Mike Chen',
            email: 'mike@ramani.com',
            role: 'manager',
            status: 'active',
            createdAt: '2024-01-20'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily@ramani.com',
            role: 'user',
            status: 'inactive',
            createdAt: '2024-03-01'
          },
          {
            id: 5,
            name: 'David Wilson',
            email: 'david@ramani.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-03-05'
          },
          {
            id: 6,
            name: 'Lisa Brown',
            email: 'lisa@ramani.com',
            role: 'user',
            status: 'suspended',
            createdAt: '2024-03-10'
          }
        ]
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    },
    getAdminCount() {
      return this.users.filter(user => user.role === 'admin').length
    },
    getUserCount() {
      return this.users.filter(user => user.role === 'user').length
    },
    getActiveUserCount() {
      return this.users.filter(user => user.status === 'active').length
    },
    getAvatarColor(role) {
      const colors = {
        admin: '#4CAF50',
        manager: '#2196F3',
        user: '#9E9E9E'
      }
      return colors[role] || '#667eea'
    },
    getFilterLabel() {
      const labels = {
        admin: 'Administrators',
        user: 'Regular Users',
        active: 'Active Users'
      }
      return labels[this.activeFilter] || ''
    },
    filterByType(type) {
      this.activeFilter = type
    },
    clearFilter() {
      this.activeFilter = 'all'
      this.searchQuery = ''
    },
    toggleStatus(user) {
      user.status = user.status === 'active' ? 'inactive' : 'active'
      this.saveToLocalStorage()
    },
    editUser(user) {
      this.isEditing = true
      this.formData = { ...user }
      this.showAddModal = true
    },
    deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter(user => user.id !== id)
        this.saveToLocalStorage()
      }
    },
    saveUser() {
      if (this.isEditing) {
        const index = this.users.findIndex(u => u.id === this.formData.id)
        if (index !== -1) {
          this.users[index] = { ...this.formData }
        }
      } else {
        const newUser = {
          id: Date.now(),
          ...this.formData,
          createdAt: new Date().toISOString().split('T')[0]
        }
        this.users.push(newUser)
      }
      this.saveToLocalStorage()
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.isEditing = false
      this.formData = {
        id: null,
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        createdAt: ''
      }
    }
  },
  mounted() {
    this.loadUsers()
  }
}
</script>

<style scoped>
.user-management-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  color: #2c3e50;
  margin: 0 0 6px 0;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 12px;
  margin: 0;
}

/* Stats Grid - REDUCED SIZE */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 10px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.stat-card.active {
  border: 1px solid #667eea;
  background: linear-gradient(135deg, #f5f3ff 0%, #fff 100%);
}

.stat-icon {
  font-size: 24px;
}

.stat-info h3 {
  font-size: 18px;
  margin: 0;
  color: #2c3e50;
}

.stat-info p {
  margin: 2px 0 0;
  color: #7f8c8d;
  font-size: 10px;
}

/* Filter Badge */
.filter-badge {
  background: #e8eaf6;
  padding: 6px 12px;
  border-radius: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.filter-badge span {
  color: #5c6bc0;
  font-weight: 500;
}

.clear-filter {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}

.clear-filter:hover {
  background: rgba(244, 67, 54, 0.1);
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 12px;
  gap: 6px;
}

.search-box i {
  color: #999;
  font-size: 12px;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 12px;
  width: 200px;
}

/* Users Table */
.users-table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.users-table th {
  background: #fafafa;
  font-weight: 600;
  color: #2c3e50;
  font-size: 12px;
}

.users-table tbody tr:hover {
  background: #f9f9f9;
}

.small-text {
  font-size: 12px;
  color: #555;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
  font-size: 12px;
}

.role-badge {
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #e8f5e9;
  color: #4caf50;
}

.role-badge.manager {
  background: #e3f2fd;
  color: #2196f3;
}

.role-badge.user {
  background: #f5f5f5;
  color: #757575;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #e8f5e9;
  color: #4caf50;
}

.status-badge.inactive {
  background: #ffebee;
  color: #f44336;
}

.status-badge.suspended {
  background: #fff3e0;
  color: #ff9800;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-icon {
  padding: 4px 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-icon.edit:hover {
  background: #e3f2fd;
  transform: scale(1.05);
}

.btn-icon.delete:hover {
  background: #ffebee;
  transform: scale(1.05);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 12px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 450px;
  max-width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.form-group {
  padding: 12px 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 12px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .user-management-container {
    padding: 12px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .stat-icon {
    font-size: 20px;
  }
  
  .stat-info h3 {
    font-size: 16px;
  }
  
  .stat-info p {
    font-size: 9px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .users-table th,
  .users-table td {
    padding: 8px;
    font-size: 11px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
}
</style>