<!-- src/components/Settings.vue -->
<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">Manage system preferences and configurations</p>
    </div>

    <div class="settings-tabs">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key">
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>

      <div class="tabs-content">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="tab-pane">
          <div class="settings-section">
            <h3>System Configuration</h3>
            <div class="settings-grid">
              <div class="setting-field">
                <label>System Name</label>
                <input type="text" v-model="generalSettings.systemName" class="setting-input" />
                <small class="field-hint">This name appears in the header and emails</small>
              </div>
              
              <div class="setting-field">
                <label>Default Language</label>
                <select v-model="generalSettings.language" class="setting-select">
                  <option>English</option>
                  <option>Swahili</option>
                  <option>French</option>
                </select>
              </div>
              
              <div class="setting-field">
                <label>Date Format</label>
                <select v-model="generalSettings.dateFormat" class="setting-select">
                  <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                  <option value="DD-MMM-YYYY">DD-MMM-YYYY (31-Dec-2024)</option>
                  <option value="MMMM DD, YYYY">MMMM DD, YYYY (December 31, 2024)</option>
                </select>
                <div class="format-preview">
                  <strong>Preview:</strong> {{ formatDatePreview(generalSettings.dateFormat) }}
                </div>
              </div>
              
              <div class="setting-field">
                <label>Time Zone</label>
                <select v-model="generalSettings.timezone" class="setting-select">
                  <option>Africa/Nairobi (EAT)</option>
                  <option>Africa/Johannesburg (SAST)</option>
                  <option>Africa/Cairo (EET)</option>
                </select>
              </div>
              
              <div class="setting-field">
                <label>Currency</label>
                <select v-model="generalSettings.currency" class="setting-select">
                  <option>KES (Kenyan Shilling)</option>
                  <option>USD (US Dollar)</option>
                  <option>EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Display Preferences</h3>
            <div class="settings-grid">
              <div class="setting-field">
                <label>Items Per Page</label>
                <select v-model="generalSettings.itemsPerPage" class="setting-select">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="generalSettings.compactMode" />
                  Compact Mode
                </label>
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="generalSettings.showEmptyFields" />
                  Show Empty Fields
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Lease Settings -->
        <div v-if="activeTab === 'lease'" class="tab-pane">
          <div class="settings-section">
            <h3>Lease Defaults</h3>
            <div class="settings-grid">
              <div class="setting-field">
                <label>Default Payment Cycle</label>
                <select v-model="leaseSettings.defaultPaymentCycle" class="setting-select">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Semi-Annually</option>
                  <option>Annually</option>
                </select>
              </div>
              
              <div class="setting-field">
                <label>Default Lease Duration (Years)</label>
                <input type="number" v-model="leaseSettings.defaultDuration" class="setting-input" />
              </div>
              
              <div class="setting-field">
                <label>Lease ID Prefix</label>
                <input type="text" v-model="leaseSettings.idPrefix" placeholder="L-" class="setting-input" />
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="leaseSettings.autoGenerateId" />
                  Auto-generate Lease ID
                </label>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Payment Settings</h3>
            <div class="settings-grid">
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="leaseSettings.enableLateFees" />
                  Enable Late Fees
                </label>
              </div>
              
              <div class="setting-field">
                <label>Late Fee Percentage (%)</label>
                <input type="number" v-model="leaseSettings.lateFeePercentage" class="setting-input" />
              </div>
              
              <div class="setting-field">
                <label>Grace Period (Days)</label>
                <input type="number" v-model="leaseSettings.gracePeriod" class="setting-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <div class="settings-section">
            <h3>Password Policy</h3>
            <div class="settings-grid">
              <div class="setting-field">
                <label>Minimum Password Length</label>
                <input type="number" v-model="securitySettings.minPasswordLength" class="setting-input" />
              </div>
              
              <div class="setting-field">
                <label>Password Expiry (Days)</label>
                <input type="number" v-model="securitySettings.passwordExpiry" class="setting-input" />
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="securitySettings.requireUppercase" />
                  Require Uppercase Letters
                </label>
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="securitySettings.requireNumbers" />
                  Require Numbers
                </label>
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="securitySettings.requireSpecialChars" />
                  Require Special Characters
                </label>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Session Management</h3>
            <div class="settings-grid">
              <div class="setting-field">
                <label>Session Timeout (Minutes)</label>
                <input type="number" v-model="securitySettings.sessionTimeout" class="setting-input" />
              </div>
              
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="securitySettings.twoFactorAuth" />
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Backup Settings -->
        <div v-if="activeTab === 'backup'" class="tab-pane">
          <div class="settings-section">
            <h3>Automatic Backup</h3>
            <div class="settings-grid">
              <div class="setting-field checkbox-field">
                <label>
                  <input type="checkbox" v-model="backupSettings.autoBackup" />
                  Enable Auto Backup
                </label>
              </div>
              
              <div class="setting-field">
                <label>Backup Frequency</label>
                <select v-model="backupSettings.frequency" class="setting-select">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              
              <div class="setting-field">
                <label>Backup Time</label>
                <select v-model="backupSettings.backupTime" class="setting-select">
                  <option>00:00 (Midnight)</option>
                  <option>01:00 (1 AM)</option>
                  <option>02:00 (2 AM)</option>
                  <option>03:00 (3 AM)</option>
                </select>
              </div>
              
              <div class="setting-field">
                <label>Backup Retention (Days)</label>
                <input type="number" v-model="backupSettings.retention" class="setting-input" />
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Manual Backup</h3>
            <div class="button-group">
              <button @click="createBackup" class="btn-primary">Create Backup Now</button>
              <button class="btn-secondary">Restore from Backup</button>
            </div>
            <p class="backup-info">Last backup: {{ lastBackupDate || 'Never' }}</p>
          </div>

          <div class="settings-section danger-zone">
            <h3>⚠️ Danger Zone</h3>
            <div class="danger-actions">
              <button @click="openDeleteConfirmDialog" class="btn-danger">Delete All Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button @click="openCancelConfirmDialog" class="btn-secondary">Cancel</button>
      <button @click="openSaveConfirmDialog" class="btn-primary">Save Changes</button>
    </div>

    <!-- Save Confirmation Modal -->
    <div v-if="showSaveModal" class="modal-overlay" @click.self="closeAllModals">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirm Save Changes</h3>
          <button class="modal-close" @click="closeAllModals">×</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-icon success">
            <i class="pi pi-save"></i>
          </div>
          <h4>Save Settings?</h4>
          <p>Are you sure you want to save all the changes you've made to the system settings?</p>
          <div class="changes-summary">
            <p><strong>Changes to be saved:</strong></p>
            <ul>
              <li v-for="change in pendingChanges" :key="change">{{ change }}</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeAllModals" class="btn-secondary">Cancel</button>
          <button @click="confirmSave" class="btn-primary">Yes, Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click.self="closeAllModals">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirm Cancel</h3>
          <button class="modal-close" @click="closeAllModals">×</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-icon warning">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <h4>Discard Changes?</h4>
          <p>You have unsaved changes. Are you sure you want to cancel? All your changes will be lost.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeAllModals" class="btn-secondary">Go Back</button>
          <button @click="confirmCancel" class="btn-danger">Yes, Discard Changes</button>
        </div>
      </div>
    </div>

    <!-- Delete All Data Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeAllModals">
      <div class="modal-container">
        <div class="modal-header">
          <h3>⚠️ Delete All Data</h3>
          <button class="modal-close" @click="closeAllModals">×</button>
        </div>
        <div class="modal-body">
          <div class="confirmation-icon danger">
            <i class="pi pi-trash"></i>
          </div>
          <h4>This action cannot be undone!</h4>
          <p>You are about to permanently delete ALL system data including:</p>
          <ul class="delete-list">
            <li>All lease records</li>
            <li>All lease holders information</li>
            <li>All documents</li>
            <li>All beneficiaries</li>
            <li>All user accounts</li>
            <li>All system settings</li>
          </ul>
          <div class="confirmation-input">
            <label>Type <strong>"DELETE"</strong> to confirm:</label>
            <input 
              type="text" 
              v-model="deleteConfirmationText" 
              placeholder="Type DELETE here"
              class="setting-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeAllModals" class="btn-secondary">Cancel</button>
          <button 
            @click="confirmDeleteAll" 
            class="btn-danger"
            :disabled="deleteConfirmationText !== 'DELETE'">
            Permanently Delete All Data
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      <div class="toast-content">
        <i :class="toastIcon"></i>
        <div>
          <h4>{{ toastTitle }}</h4>
          <p>{{ toastMessage }}</p>
        </div>
      </div>
      <button @click="showToast = false" class="toast-close">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'general',
      showSaveModal: false,
      showCancelModal: false,
      showDeleteModal: false,
      showToast: false,
      toastType: 'success',
      toastTitle: '',
      toastMessage: '',
      deleteConfirmationText: '',
      
      tabs: [
        { key: 'general', label: 'General', icon: '⚙️' },
        { key: 'lease', label: 'Lease', icon: '📄' },
        { key: 'security', label: 'Security', icon: '🔒' },
        { key: 'backup', label: 'Backup', icon: '💾' }
      ],
      
      // Original settings (for tracking changes)
      originalSettings: null,
      
      // Current settings
      generalSettings: {
        systemName: 'Ramani Land Management System',
        language: 'English',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Africa/Nairobi (EAT)',
        currency: 'KES (Kenyan Shilling)',
        itemsPerPage: 25,
        compactMode: false,
        showEmptyFields: true
      },
      
      leaseSettings: {
        defaultPaymentCycle: 'Annually',
        defaultDuration: 5,
        autoGenerateId: true,
        idPrefix: 'L-',
        enableLateFees: true,
        lateFeePercentage: 5,
        gracePeriod: 7
      },
      
      securitySettings: {
        minPasswordLength: 8,
        passwordExpiry: 90,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        sessionTimeout: 30,
        twoFactorAuth: false
      },
      
      backupSettings: {
        autoBackup: true,
        frequency: 'Weekly',
        backupTime: '02:00 (2 AM)',
        retention: 30
      },
      
      lastBackupDate: null
    }
  },
  computed: {
    pendingChanges() {
      const changes = []
      if (!this.originalSettings) return ['All settings will be saved']
      
      // Check general settings changes
      if (JSON.stringify(this.generalSettings) !== JSON.stringify(this.originalSettings.general)) {
        changes.push('General settings updated')
      }
      if (JSON.stringify(this.leaseSettings) !== JSON.stringify(this.originalSettings.lease)) {
        changes.push('Lease settings updated')
      }
      if (JSON.stringify(this.securitySettings) !== JSON.stringify(this.originalSettings.security)) {
        changes.push('Security settings updated')
      }
      if (JSON.stringify(this.backupSettings) !== JSON.stringify(this.originalSettings.backup)) {
        changes.push('Backup settings updated')
      }
      
      return changes.length ? changes : ['No changes detected']
    },
    
    toastIcon() {
      return this.toastType === 'success' ? '✓' : this.toastType === 'warning' ? '⚠️' : 'ℹ️'
    }
  },
  methods: {
    formatDatePreview(format) {
      const sampleDate = new Date(2024, 11, 31)
      const day = sampleDate.getDate()
      const month = sampleDate.getMonth() + 1
      const year = sampleDate.getFullYear()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      
      switch(format) {
        case 'DD/MM/YYYY':
          return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
        case 'MM/DD/YYYY':
          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`
        case 'YYYY-MM-DD':
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        case 'DD-MMM-YYYY':
          return `${day.toString().padStart(2, '0')}-${months[month-1]}-${year}`
        case 'MMMM DD, YYYY':
          return `${fullMonths[month-1]} ${day}, ${year}`
        default:
          return `${day}/${month}/${year}`
      }
    },
    
    // Save confirmation dialog
    openSaveConfirmDialog() {
      this.showSaveModal = true
    },
    
    // Cancel confirmation dialog
    openCancelConfirmDialog() {
      this.showCancelModal = true
    },
    
    // Delete confirmation dialog
    openDeleteConfirmDialog() {
      this.deleteConfirmationText = ''
      this.showDeleteModal = true
    },
    
    // Close all modals
    closeAllModals() {
      this.showSaveModal = false
      this.showCancelModal = false
      this.showDeleteModal = false
    },
    
    // Confirm save
    confirmSave() {
      this.saveSettings()
      this.closeAllModals()
      this.showToastMessage('success', 'Settings Saved', 'All settings have been saved successfully!')
    },
    
    // Confirm cancel
    confirmCancel() {
      this.resetSettings()
      this.closeAllModals()
      this.showToastMessage('warning', 'Changes Discarded', 'Your changes were not saved.')
    },
    
    // Confirm delete all
    confirmDeleteAll() {
      if (this.deleteConfirmationText === 'DELETE') {
        // Delete all data logic here
        this.lastBackupDate = null
        this.closeAllModals()
        this.showToastMessage('danger', 'Data Deleted', 'All system data has been permanently deleted.')
        this.deleteConfirmationText = ''
      }
    },
    
    // Show toast notification
    showToastMessage(type, title, message) {
      this.toastType = type
      this.toastTitle = title
      this.toastMessage = message
      this.showToast = true
      
      // Auto hide after 4 seconds
      setTimeout(() => {
        this.showToast = false
      }, 4000)
    },
    
    createBackup() {
      this.lastBackupDate = new Date().toLocaleString()
      this.showToastMessage('success', 'Backup Created', 'System backup completed successfully!')
    },
    
    saveSettings() {
      // Save original settings for tracking
      this.originalSettings = {
        general: JSON.parse(JSON.stringify(this.generalSettings)),
        lease: JSON.parse(JSON.stringify(this.leaseSettings)),
        security: JSON.parse(JSON.stringify(this.securitySettings)),
        backup: JSON.parse(JSON.stringify(this.backupSettings))
      }
      
      // Save to localStorage
      localStorage.setItem('systemSettings', JSON.stringify({
        general: this.generalSettings,
        lease: this.leaseSettings,
        security: this.securitySettings,
        backup: this.backupSettings
      }))
      
      console.log('Settings saved:', {
        general: this.generalSettings,
        lease: this.leaseSettings,
        security: this.securitySettings,
        backup: this.backupSettings
      })
    },
    
    resetSettings() {
      // Reload saved settings from localStorage or reset to defaults
      const savedSettings = localStorage.getItem('systemSettings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          this.generalSettings = settings.general
          this.leaseSettings = settings.lease
          this.securitySettings = settings.security
          this.backupSettings = settings.backup
        } catch(e) {
          console.error('Error loading settings')
        }
      }
    }
  },
  
  mounted() {
    // Load saved settings
    const savedSettings = localStorage.getItem('systemSettings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        this.generalSettings = settings.general
        this.leaseSettings = settings.lease
        this.securitySettings = settings.security
        this.backupSettings = settings.backup
      } catch(e) {
        console.error('Error loading settings')
      }
    }
    
    // Store original settings for tracking changes
    this.originalSettings = {
      general: JSON.parse(JSON.stringify(this.generalSettings)),
      lease: JSON.parse(JSON.stringify(this.leaseSettings)),
      security: JSON.parse(JSON.stringify(this.securitySettings)),
      backup: JSON.parse(JSON.stringify(this.backupSettings))
    }
  }
}
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
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
  padding: 14px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.confirmation-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.confirmation-icon.success {
  background: #d4edda;
  color: #28a745;
}

.confirmation-icon.warning {
  background: #fff3cd;
  color: #ffc107;
}

.confirmation-icon.danger {
  background: #f8d7da;
  color: #dc3545;
}

.modal-body h4 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #2c3e50;
}

.modal-body p {
  color: #6c757d;
  margin-bottom: 16px;
  font-size: 12px;
}

.changes-summary {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  margin-top: 12px;
}

.changes-summary p {
  font-size: 12px;
  margin-bottom: 8px;
}

.changes-summary ul {
  margin: 5px 0 0 18px;
  color: #495057;
  font-size: 11px;
}

.changes-summary li {
  margin: 4px 0;
}

.delete-list {
  text-align: left;
  margin: 12px 0;
  color: #dc3545;
  font-size: 12px;
}

.delete-list li {
  margin: 4px 0;
}

.confirmation-input {
  margin-top: 16px;
  text-align: left;
}

.confirmation-input label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #495057;
}

.confirmation-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 12px;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 280px;
  max-width: 360px;
  z-index: 1100;
  animation: slideInRight 0.3s ease;
  border-left: 3px solid;
}

.toast-notification.success {
  border-left-color: #28a745;
}

.toast-notification.warning {
  border-left-color: #ffc107;
}

.toast-notification.danger {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-content i {
  font-size: 20px;
  font-weight: bold;
}

.toast-notification.success .toast-content i {
  color: #28a745;
}

.toast-notification.warning .toast-content i {
  color: #ffc107;
}

.toast-notification.danger .toast-content i {
  color: #dc3545;
}

.toast-content h4 {
  margin: 0 0 2px;
  font-size: 14px;
  color: #2c3e50;
}

.toast-content p {
  margin: 0;
  font-size: 11px;
  color: #6c757d;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  margin-left: 12px;
}

.toast-close:hover {
  color: #333;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Main Settings Styles - REDUCED SIZE */
.settings-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.settings-header {
  margin-bottom: 20px;
}

.settings-title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
}

.settings-subtitle {
  color: #7f8c8d;
  font-size: 12px;
}

.settings-tabs {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  gap: 2px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0 12px;
}

.tab-btn {
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6c757d;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #4CAF50;
}

.tab-btn.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
}

.tabs-content {
  padding: 20px;
}

.settings-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-field label {
  font-size: 12px;
  font-weight: 500;
  color: #495057;
}

.setting-input,
.setting-select {
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 12px;
  transition: border-color 0.3s;
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.checkbox-field {
  flex-direction: row;
  align-items: center;
}

.checkbox-field label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
}

.field-hint {
  font-size: 10px;
  color: #6c757d;
  margin-top: 3px;
}

.format-preview {
  margin-top: 6px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 11px;
  color: #28a745;
  border-left: 2px solid #28a745;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 6px 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 6px 14px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  padding: 6px 14px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-danger:disabled {
  background: #e9a2aa;
  cursor: not-allowed;
}

.danger-zone {
  background: #fff5f5;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #fcc;
}

.danger-zone h3 {
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 12px;
}

.backup-info {
  margin-top: 10px;
  font-size: 11px;
  color: #6c757d;
}

.settings-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 12px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .modal-container {
    width: 95%;
    margin: 16px;
  }
  
  .toast-notification {
    left: 16px;
    right: 16px;
    min-width: auto;
  }
}
</style>