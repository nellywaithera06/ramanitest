import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    roles: [],
    currentAdmin: null,
    permissions: []
  }),

  getters: {
    getAllUsers: (state) => state.users,
    getAllRoles: (state) => state.roles,
    getAdminUsers: (state) => state.users.filter(user => user.role === 'admin'),
    getRegularUsers: (state) => state.users.filter(user => user.role === 'user'),
    getUserCount: (state) => ({
      total: state.users.length,
      admins: state.users.filter(u => u.role === 'admin').length,
      users: state.users.filter(u => u.role === 'user').length
    })
  },

  actions: {
    initializeData() {
      // Predefined roles with hierarchy levels
      this.roles = [
        { id: 1, name: 'Super Admin', level: 3, permissions: ['all'] },
        { id: 2, name: 'Admin', level: 2, permissions: ['create', 'read', 'update', 'delete'] },
        { id: 3, name: 'Manager', level: 1, permissions: ['create', 'read', 'update'] },
        { id: 4, name: 'User', level: 0, permissions: ['read'] }
      ]

      // Sample users
      this.users = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john@ramani.com',
          role: 'admin',
          roleLevel: 2,
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2024-03-20',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@ramani.com',
          role: 'user',
          roleLevel: 0,
          status: 'active',
          createdAt: '2024-02-10',
          lastLogin: '2024-03-19',
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
          id: 3,
          name: 'Mike Chen',
          email: 'mike@ramani.com',
          role: 'manager',
          roleLevel: 1,
          status: 'active',
          createdAt: '2024-01-20',
          lastLogin: '2024-03-18',
          avatar: 'https://i.pravatar.cc/150?img=3'
        }
      ]
    },

    addUser(userData) {
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        status: 'active'
      }
      this.users.push(newUser)
    },

    updateUser(userId, updatedData) {
      const index = this.users.findIndex(u => u.id === userId)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updatedData }
      }
    },

    deleteUser(userId) {
      this.users = this.users.filter(u => u.id !== userId)
    },

    updateUserStatus(userId, status) {
      const user = this.users.find(u => u.id === userId)
      if (user) user.status = status
    }
  }
})