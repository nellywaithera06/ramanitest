<template>
  <div class="user-management-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">Manage system users, roles, and permissions</p>
      </div>

      <div class="header-actions">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search users..."
        />
        <button class="add-btn" @click="openAddUserModal">
          <i class="pi pi-plus"></i>
          Add User
        </button>
      </div>
    </div>

    <div v-if="message" class="message-box" :class="messageType">
      {{ message }}
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p>{{ users.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Admins</h3>
        <p>{{ adminCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Users</h3>
        <p>{{ activeCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Inactive Users</h3>
        <p>{{ inactiveCount }}</p>
      </div>
    </div>

    <div class="card">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ getInitials(user.name) }}</div>
                <span>{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status }}
              </span>
            </td>
            <td>{{ user.lastLogin }}</td>
            <td>
              <button class="action-btn edit" @click="editUser(user)">Edit</button>
              <button class="action-btn delete" @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingUser ? 'Edit User' : 'Add User' }}</h2>

        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" type="text" />
          <small v-if="errors.name" class="error-text">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" />
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label>Role</label>
          <select v-model="form.role">
            <option value="">Select role</option>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="user">user</option>
          </select>
          <small v-if="errors.role" class="error-text">{{ errors.role }}</small>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="">Select status</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <small v-if="errors.status" class="error-text">{{ errors.status }}</small>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="save-btn" @click="saveUser">
            {{ editingUser ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      editingUser: null,
      message: '',
      messageType: '',
      messageTimer: null,
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2026-08-01 09:15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'manager',
          status: 'active',
          lastLogin: '2026-08-02 14:20'
        },
        {
          id: 3,
          name: 'Peter Brown',
          email: 'peter@example.com',
          role: 'user',
          status: 'inactive',
          lastLogin: '2026-07-28 11:05'
        }
      ],
      form: {
        name: '',
        email: '',
        role: '',
        status: ''
      },
      errors: {}
    }
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      )
    },
    adminCount() {
      return this.users.filter(user => user.role === 'admin').length
    },
    activeCount() {
      return this.users.filter(user => user.status === 'active').length
    },
    inactiveCount() {
      return this.users.filter(user => user.status === 'inactive').length
    }
  },
  methods: {
    showMessage(text, type = 'success') {
      this.message = text
      this.messageType = type
      if (this.messageTimer) clearTimeout(this.messageTimer)
      this.messageTimer = setTimeout(() => {
        this.message = ''
        this.messageType = ''
      }, 3000)
    },
    getInitials(name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
    openAddUserModal() {
      this.editingUser = null
      this.form = {
        name: '',
        email: '',
        role: '',
        status: ''
      }
      this.errors = {}
      this.showModal = true
    },
    editUser(user) {
      this.editingUser = user
      this.form = { ...user }
      this.errors = {}
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingUser = null
      this.errors = {}
    },
    validateForm() {
      this.errors = {}

      if (!this.form.name || this.form.name.trim().length < 2) {
        this.errors.name = 'Name must be at least 2 characters.'
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.errors.email = 'Email is required.'
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Enter a valid email address.'
      }

      if (!this.form.role) {
        this.errors.role = 'Please select a role.'
      }

      if (!this.form.status) {
        this.errors.status = 'Please select a status.'
      }

      return Object.keys(this.errors).length === 0
    },
    saveUser() {
      if (!this.validateForm()) {
        this.showMessage('Please fix the errors in the form.', 'error')
        return
      }

      if (this.editingUser) {
        const index = this.users.findIndex(u => u.id === this.editingUser.id)
        if (index !== -1) {
          this.users[index] = {
            ...this.form,
            id: this.editingUser.id,
            lastLogin: this.editingUser.lastLogin
          }
          this.showMessage('User updated successfully!', 'success')
        }
      } else {
        this.users.push({
          id: Date.now(),
          ...this.form,
          lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
        })
        this.showMessage('User added successfully!', 'success')
      }

      this.closeModal()
    },
    deleteUser(id) {
      const confirmDelete = confirm('Are you sure you want to delete this user?')
      if (confirmDelete) {
        this.users = this.users.filter(user => user.id !== id)
        this.showMessage('User deleted successfully!', 'success')
      }
    }
  },
  beforeUnmount() {
    if (this.messageTimer) {
      clearTimeout(this.messageTimer)
    }
  }
}
</script>

<style scoped>
.user-management-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 6px;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  min-width: 240px;
  outline: none;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
}

.message-box {
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
}

.message-box.success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.message-box.error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.stat-card h3 {
  color: #7f8c8d;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-card p {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.users-table th,
.users-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eef1f5;
  font-size: 14px;
}

.users-table th {
  color: #7f8c8d;
  font-weight: 600;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.role-badge,
.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #e3f2fd;
  color: #1565c0;
}

.role-badge.manager {
  background: #fff3e0;
  color: #ef6c00;
}

.role-badge.user {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #ffebee;
  color: #c62828;
}

.action-btn {
  border: none;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 6px;
}

.action-btn.edit {
  background: #2196F3;
  color: white;
}

.action-btn.delete {
  background: #e74c3c;
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  padding: 20px;
}

.modal h2 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #34495e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
}

.error-text {
  display: block;
  margin-top: 5px;
  color: #c62828;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.cancel-btn,
.save-btn {
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background: #bdc3c7;
  color: white;
}

.save-btn {
  background: #4CAF50;
  color: white;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .search-input {
    min-width: 0;
    width: 100%;
  }

  .modal {
    max-width: 100%;
  }
}
</style>