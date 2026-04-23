<!-- src/components/Settings.vue -->
<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">Manage system preferences and configurations</p>
    </div>

    <!-- Settings Tabs -->
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
              </div>
              <div class="setting-field">
                <label>System Theme</label>
                <select v-model="generalSettings.theme" class="setting-select">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System Default</option>
                </select>
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
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div class="setting-field">
                <label>Time Zone</label>
                <select v-model="generalSettings.timezone" class="setting-select">
                  <option>Africa/Nairobi</option>
                  <option>Africa/Johannesburg</option>
                  <option>Africa/Cairo</option>
                </select>
              </div>
              <div class="setting-field">
                <label>Currency</label>
                <select v-model="generalSettings.currency" class="setting-select">
                  <option>KES</option>
                  <option>USD</option>
                  <option>EUR</option>
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
                <input type="text" v-model="leaseSettings.idPrefix" class="setting-input" />
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
                  Require Uppercase
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
            <h3>Danger Zone</h3>
            <div class="danger-actions">
              <button @click="confirmDeleteAll" class="btn-danger">Delete All Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="settings-actions">
      <button @click="resetSettings" class="btn-secondary">Cancel</button>
      <button @click="saveSettings" class="btn-primary">Save Changes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'general',
      tabs: [
        { key: 'general', label: 'General', icon: 'pi pi-sliders-h' },
        { key: 'lease', label: 'Lease', icon: 'pi pi-file' },
        { key: 'security', label: 'Security', icon: 'pi pi-shield' },
        { key: 'backup', label: 'Backup', icon: 'pi pi-database' }
      ],
      // General Settings
      generalSettings: {
        systemName: 'Ramani Land Management System',
        theme: 'Light',
        language: 'English',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Africa/Nairobi',
        currency: 'KES',
        itemsPerPage: 25,
        compactMode: false,
        showEmptyFields: true
      },
      // Lease Settings
      leaseSettings: {
        defaultPaymentCycle: 'Annually',
        defaultDuration: 5,
        autoGenerateId: true,
        idPrefix: 'L-',
        enableLateFees: true,
        lateFeePercentage: 5,
        gracePeriod: 7
      },
      // Security Settings
      securitySettings: {
        minPasswordLength: 8,
        passwordExpiry: 90,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        sessionTimeout: 30,
        twoFactorAuth: false
      },
      // Backup Settings
      backupSettings: {
        autoBackup: true,
        frequency: 'Weekly',
        retention: 30
      },
      lastBackupDate: null
    }
  },
  methods: {
    createBackup() {
      this.lastBackupDate = new Date().toLocaleString()
      alert('Backup created successfully!')
    },
    saveSettings() {
      console.log('Saving settings:', {
        general: this.generalSettings,
        lease: this.leaseSettings,
        security: this.securitySettings,
        backup: this.backupSettings
      })
      alert('Settings saved successfully!')
    },
    resetSettings() {
      alert('Changes were not saved')
    },
    confirmDeleteAll() {
      if (confirm('WARNING: This will delete ALL data. This cannot be undone. Are you sure?')) {
        alert('All data has been deleted')
      }
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.settings-header {
  margin-bottom: 24px;
}

.settings-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.settings-subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.settings-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  gap: 4px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0 16px;
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
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
  padding: 24px;
}

.settings-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-field label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.setting-input,
.setting-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
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
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-danger:hover {
  background: #c82333;
}

.danger-zone {
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #fcc;
}

.danger-zone h3 {
  color: #dc3545;
}

.backup-info {
  margin-top: 12px;
  font-size: 13px;
  color: #6c757d;
}

.settings-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>