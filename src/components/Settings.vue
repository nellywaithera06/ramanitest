<!-- src/views/dashboard/Settings.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Settings</h1>
      <p class="text-gray-500 mt-1">Manage system preferences and configurations</p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <TabView v-model:activeIndex="activeTab">
        <!-- General Settings -->
        <TabPanel header="General">
          <div class="p-6">
            <div class="space-y-8">
              <!-- System Configuration -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">System Configuration</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                    <InputText v-model="generalSettings.systemName" class="w-full" />
                    <p class="text-xs text-gray-500 mt-1">Name displayed throughout the system</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">System Logo</label>
                    <FileUpload mode="basic" name="logo" accept="image/*" :maxFileSize="1000000" @upload="onLogoUpload" />
                    <p class="text-xs text-gray-500 mt-1">Recommended size: 200x50px</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">System Theme</label>
                    <Dropdown v-model="generalSettings.theme" :options="themes" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div class="flex gap-2 items-center">
                      <input type="color" v-model="generalSettings.primaryColor" class="w-12 h-10 rounded border" />
                      <InputText v-model="generalSettings.primaryColor" class="flex-1" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Regional Settings -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Regional Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                    <Dropdown v-model="generalSettings.language" :options="languages" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <Dropdown v-model="generalSettings.dateFormat" :options="dateFormats" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                    <Dropdown v-model="generalSettings.timeFormat" :options="timeFormats" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <Dropdown v-model="generalSettings.timezone" :options="timezones" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Country</label>
                    <Dropdown v-model="generalSettings.country" :options="countries" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <Dropdown v-model="generalSettings.currency" :options="currencies" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- Display Preferences -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Display Preferences</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                    <Dropdown v-model="generalSettings.itemsPerPage" :options="itemsPerPageOptions" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Dashboard View</label>
                    <Dropdown v-model="generalSettings.defaultDashboard" :options="dashboardViews" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Compact Mode</label>
                      <p class="text-xs text-gray-500">Reduce spacing and padding</p>
                    </div>
                    <InputSwitch v-model="generalSettings.compactMode" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Show Empty Fields</label>
                      <p class="text-xs text-gray-500">Display fields with no data</p>
                    </div>
                    <InputSwitch v-model="generalSettings.showEmptyFields" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Lease Settings -->
        <TabPanel header="Lease">
          <div class="p-6">
            <div class="space-y-8">
              <!-- Lease Defaults -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Lease Defaults</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Payment Cycle</label>
                    <Dropdown v-model="leaseSettings.defaultPaymentCycle" :options="paymentCycles" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Lease Duration (Years)</label>
                    <InputNumber v-model="leaseSettings.defaultDuration" :min="1" :max="99" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Lease ID Prefix</label>
                    <InputText v-model="leaseSettings.idPrefix" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Land Unit</label>
                    <Dropdown v-model="leaseSettings.defaultLandUnit" :options="landUnits" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Auto-generate Lease ID</label>
                      <p class="text-xs text-gray-500">Automatically generate lease numbers</p>
                    </div>
                    <InputSwitch v-model="leaseSettings.autoGenerateId" />
                  </div>
                </div>
              </div>

              <!-- Payment Settings -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Enable Late Fees</label>
                      <p class="text-xs text-gray-500">Apply late payment penalties</p>
                    </div>
                    <InputSwitch v-model="leaseSettings.enableLateFees" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Late Fee Percentage (%)</label>
                    <InputNumber v-model="leaseSettings.lateFeePercentage" :min="0" :max="100" suffix="%" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Grace Period (Days)</label>
                    <InputNumber v-model="leaseSettings.gracePeriod" :min="0" :max="30" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Reminder Days</label>
                    <InputNumber v-model="leaseSettings.paymentReminderDays" :min="1" :max="30" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Enable Interest Calculation</label>
                      <p class="text-xs text-gray-500">Calculate interest on outstanding amounts</p>
                    </div>
                    <InputSwitch v-model="leaseSettings.enableInterest" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <InputNumber v-model="leaseSettings.interestRate" :min="0" :max="100" suffix="%" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- Required Documents -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Required Lease Documents</h3>
                <div class="space-y-2">
                  <div v-for="doc in leaseSettings.requiredDocuments" :key="doc.name" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <i :class="doc.checked ? 'pi pi-check-circle text-green-500' : 'pi pi-circle'"></i>
                      <span>{{ doc.name }}</span>
                    </div>
                    <InputSwitch v-model="doc.checked" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- User Management Settings -->
        <TabPanel header="User Management">
          <div class="p-6">
            <div class="space-y-8">
              <!-- User Roles -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">User Roles & Permissions</h3>
                <DataTable :value="roles" class="p-datatable-sm">
                  <Column field="role" header="Role" sortable></Column>
                  <Column field="description" header="Description"></Column>
                  <Column field="users" header="Users"></Column>
                  <Column header="Actions">
                    <template #body="{ data }">
                      <Button icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editRole(data)" />
                      <Button icon="pi pi-copy" class="p-button-rounded p-button-text" @click="copyRole(data)" />
                    </template>
                  </Column>
                </DataTable>
                <Button label="Add New Role" icon="pi pi-plus" class="mt-4 p-button-outlined" />
              </div>

              <!-- User Account Settings -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">User Account Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                    <Dropdown v-model="userSettings.defaultRole" :options="roleOptions" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Allow User Registration</label>
                      <p class="text-xs text-gray-500">Let users create their own accounts</p>
                    </div>
                    <InputSwitch v-model="userSettings.allowRegistration" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Require Admin Approval</label>
                      <p class="text-xs text-gray-500">Admin must approve new accounts</p>
                    </div>
                    <InputSwitch v-model="userSettings.requireApproval" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Force Password Change</label>
                      <p class="text-xs text-gray-500">Require password change on first login</p>
                    </div>
                    <InputSwitch v-model="userSettings.forcePasswordChange" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Security Settings -->
        <TabPanel header="Security">
          <div class="p-6">
            <div class="space-y-8">
              <!-- Password Policy -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Password Policy</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                    <InputNumber v-model="securitySettings.minPasswordLength" :min="6" :max="20" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password Expiry (Days)</label>
                    <InputNumber v-model="securitySettings.passwordExpiry" :min="0" :max="365" class="w-full" />
                    <p class="text-xs text-gray-500">0 = never expire</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                    <InputNumber v-model="securitySettings.maxLoginAttempts" :min="3" :max="10" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Account Lock Duration (Minutes)</label>
                    <InputNumber v-model="securitySettings.lockDuration" :min="5" :max="120" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Require Uppercase</label>
                    </div>
                    <InputSwitch v-model="securitySettings.requireUppercase" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Require Numbers</label>
                    </div>
                    <InputSwitch v-model="securitySettings.requireNumbers" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Require Special Characters</label>
                    </div>
                    <InputSwitch v-model="securitySettings.requireSpecialChars" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Prevent Password Reuse</label>
                    <InputNumber v-model="securitySettings.preventReuse" :min="0" :max="10" class="w-full" />
                    <p class="text-xs text-gray-500">Number of previous passwords to remember</p>
                  </div>
                </div>
              </div>

              <!-- Session Management -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Session Management</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
                    <InputNumber v-model="securitySettings.sessionTimeout" :min="5" :max="120" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Remember Me Duration (Days)</label>
                    <InputNumber v-model="securitySettings.rememberMeDuration" :min="1" :max="90" class="w-full" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Single Session Only</label>
                      <p class="text-xs text-gray-500">Allow only one active session per user</p>
                    </div>
                    <InputSwitch v-model="securitySettings.singleSession" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Logout on Browser Close</label>
                    </div>
                    <InputSwitch v-model="securitySettings.logoutOnClose" />
                  </div>
                </div>
              </div>

              <!-- Two-Factor Authentication -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication (2FA)</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Enable 2FA</label>
                    </div>
                    <InputSwitch v-model="securitySettings.twoFactorAuth" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">2FA Method</label>
                    <Dropdown v-model="securitySettings.twoFactorMethod" :options="twoFactorMethods" class="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Notification Settings -->
        <TabPanel header="Notifications">
          <div class="p-6">
            <div class="space-y-8">
              <!-- Email Configuration -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">SMTP Configuration</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                    <InputText v-model="notificationSettings.smtpServer" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Port</label>
                    <InputNumber v-model="notificationSettings.smtpPort" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                    <Dropdown v-model="notificationSettings.encryption" :options="encryptionTypes" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                    <InputText v-model="notificationSettings.fromEmail" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <InputText v-model="notificationSettings.fromName" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- Notification Events -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Notification Events</h3>
                <DataTable :value="notificationEvents" class="p-datatable-sm">
                  <Column field="event" header="Event" sortable></Column>
                  <Column field="description" header="Description"></Column>
                  <Column header="Email" style="width: 80px">
                    <template #body="{ data }">
                      <InputSwitch v-model="data.email" />
                    </template>
                  </Column>
                  <Column header="SMS" style="width: 80px">
                    <template #body="{ data }">
                      <InputSwitch v-model="data.sms" />
                    </template>
                  </Column>
                  <Column header="In-app" style="width: 80px">
                    <template #body="{ data }">
                      <InputSwitch v-model="data.inApp" />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Backup Settings -->
        <TabPanel header="Backup">
          <div class="p-6">
            <div class="space-y-8">
              <!-- Automatic Backup -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Automatic Backup</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Enable Auto Backup</label>
                    </div>
                    <InputSwitch v-model="backupSettings.autoBackup" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <Dropdown v-model="backupSettings.frequency" :options="backupFrequencies" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Backup Time</label>
                    <Calendar v-model="backupSettings.backupTime" timeOnly hourFormat="24" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Backup Retention</label>
                    <InputNumber v-model="backupSettings.retention" :min="1" :max="365" suffix=" days" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Backup Location</label>
                    <Dropdown v-model="backupSettings.location" :options="backupLocations" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- Manual Backup -->
              <div class="border-b pb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Manual Backup</h3>
                <div class="flex gap-3">
                  <Button label="Create Backup Now" icon="pi pi-download" class="bg-blue-600" @click="createBackup" />
                  <Button label="Restore from Backup" icon="pi pi-upload" class="p-button-outlined" />
                </div>
                <p class="text-sm text-gray-500 mt-3">Last backup: {{ lastBackupDate || 'Never' }}</p>
              </div>

              <!-- Danger Zone -->
              <div>
                <h3 class="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <label class="font-medium text-red-800">Export All Data</label>
                      <p class="text-sm text-red-600">Download complete system data as JSON/CSV</p>
                    </div>
                    <Button label="Export" icon="pi pi-download" class="p-button-warning" />
                  </div>
                  <div class="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <label class="font-medium text-red-800">Delete All Data</label>
                      <p class="text-sm text-red-600">Permanently delete all system data (irreversible)</p>
                    </div>
                    <Button label="Delete Everything" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAll" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <!-- Action Buttons -->
      <div class="border-t p-6 flex justify-end gap-3">
        <Button label="Cancel" icon="pi pi-times" class="p-button-outlined" @click="resetSettings" />
        <Button label="Save Changes" icon="pi pi-check" class="bg-blue-600" @click="saveSettings" />
      </div>
    </div>

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import FileUpload from 'primevue/fileupload'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const confirm = useConfirm()
const toast = useToast()
const activeTab = ref(0)

// General Settings
const generalSettings = ref({
  systemName: 'Ramani Land Management System',
  theme: 'Light',
  primaryColor: '#3B82F6',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24-hour',
  timezone: 'Africa/Nairobi',
  country: 'Kenya',
  currency: 'KES',
  itemsPerPage: 25,
  defaultDashboard: 'Summary',
  compactMode: false,
  showEmptyFields: true
})

// Lease Settings
const leaseSettings = ref({
  defaultPaymentCycle: 'Annually',
  defaultDuration: 5,
  autoGenerateId: true,
  idPrefix: 'L-',
  defaultLandUnit: 'Hectares',
  enableLateFees: true,
  lateFeePercentage: 5,
  gracePeriod: 7,
  paymentReminderDays: 7,
  enableInterest: false,
  interestRate: 12,
  requiredDocuments: [
    { name: 'ID Copy', checked: true },
    { name: 'Land Title Deed', checked: true },
    { name: 'Survey Report', checked: true },
    { name: 'Passport Photo', checked: true },
    { name: 'KRA PIN Certificate', checked: false },
    { name: 'Lease Agreement', checked: true }
  ]
})

// User Settings
const userSettings = ref({
  defaultRole: 'Viewer',
  allowRegistration: false,
  requireApproval: true,
  forcePasswordChange: true
})

// Security Settings
const securitySettings = ref({
  minPasswordLength: 8,
  passwordExpiry: 90,
  maxLoginAttempts: 5,
  lockDuration: 30,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,
  sessionTimeout: 30,
  rememberMeDuration: 30,
  singleSession: false,
  logoutOnClose: true,
  twoFactorAuth: false,
  twoFactorMethod: 'Authenticator App'
})

// Notification Settings
const notificationSettings = ref({
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  encryption: 'TLS',
  fromEmail: 'noreply@ramani.com',
  fromName: 'Ramani System'
})

// Backup Settings
const backupSettings = ref({
  autoBackup: true,
  frequency: 'Weekly',
  backupTime: null,
  retention: 30,
  location: 'Cloud'
})

const lastBackupDate = ref('2024-01-15 14:30:00')

// Dropdown Options
const themes = ['Light', 'Dark', 'System Default']
const languages = ['English', 'Swahili', 'French']
const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const timeFormats = ['12-hour', '24-hour']
const timezones = ['Africa/Nairobi', 'Africa/Johannesburg', 'Africa/Cairo']
const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi']
const currencies = ['KES', 'USD', 'EUR', 'GBP']
const itemsPerPageOptions = [10, 25, 50, 100]
const dashboardViews = ['Summary', 'Detailed', 'Custom']
const paymentCycles = ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually']
const landUnits = ['Hectares', 'Acres', 'Square Meters']
const roleOptions = ['Super Admin', 'Admin', 'Lease Manager', 'Finance Officer', 'Document Controller', 'Viewer']
const twoFactorMethods = ['Authenticator App', 'SMS', 'Email']
const encryptionTypes = ['TLS', 'SSL', 'None']
const backupFrequencies = ['Daily', 'Weekly', 'Monthly']
const backupLocations = ['Local', 'Cloud', 'External Drive']

// Roles table data
const roles = ref([
  { role: 'Super Admin', description: 'Full system access', users: 1 },
  { role: 'Admin', description: 'All except system settings', users: 3 },
  { role: 'Lease Manager', description: 'Manage leases only', users: 5 },
  { role: 'Finance Officer', description: 'Payment and invoices only', users: 2 },
  { role: 'Document Controller', description: 'Document management only', users: 2 },
  { role: 'Viewer', description: 'Read-only access', users: 10 }
])

// Notification events
const notificationEvents = ref([
  { event: 'Lease Created', description: 'When a new lease is created', email: true, sms: false, inApp: true },
  { event: 'Lease Expiring Soon', description: '30 days before lease expiry', email: true, sms: true, inApp: true },
  { event: 'Lease Expired', description: 'When lease expires', email: true, sms: true, inApp: true },
  { event: 'Payment Due', description: '7 days before payment due', email: true, sms: true, inApp: true },
  { event: 'Payment Received', description: 'When payment is received', email: true, sms: false, inApp: true },
  { event: 'Payment Late', description: 'When payment is overdue', email: true, sms: true, inApp: true },
  { event: 'Document Uploaded', description: 'When a document is uploaded', email: true, sms: false, inApp: true },
  { event: 'User Account Created', description: 'When new user account is created', email: true, sms: false, inApp: true },
  { event: 'Password Changed', description: 'When user changes password', email: true, sms: false, inApp: true },
  { event: 'New Login Detected', description: 'Login from new device', email: true, sms: false, inApp: true }
])

const onLogoUpload = (event) => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logo uploaded successfully', life: 3000 })
}

const createBackup = () => {
  toast.add({ severity: 'info', summary: 'Backup Started', detail: 'Creating system backup...', life: 3000 })
  setTimeout(() => {
    lastBackupDate.value = new Date().toLocaleString()
    toast.add({ severity: 'success', summary: 'Backup Complete', detail: 'System backup created successfully', life: 3000 })
  }, 2000)
}

const editRole = (role) => {
  toast.add({ severity: 'info', summary: 'Edit Role', detail: `Editing ${role.role} permissions`, life: 3000 })
}

const copyRole = (role) => {
  toast.add({ severity: 'info', summary: 'Copy Role', detail: `Copying ${role.role} role`, life: 3000 })
}

const saveSettings = () => {
  console.log('Saving settings:', {
    general: generalSettings.value,
    lease: leaseSettings.value,
    user: userSettings.value,
    security: securitySettings.value,
    notification: notificationSettings.value,
    backup: backupSettings.value
  })
  toast.add({ severity: 'success', summary: 'Settings Saved', detail: 'All settings have been saved successfully', life: 3000 })
}

const resetSettings = () => {
  toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Changes were not saved', life: 3000 })
}

const confirmDeleteAll = () => {
  confirm.require({
    message: 'This action will permanently delete ALL system data. This cannot be undone. Are you absolutely sure?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({ severity: 'error', summary: 'Data Deleted', detail: 'All system data has been deleted', life: 5000 })
    }
  })
}
</script>

<style scoped>
:deep(.p-tabview-nav) {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  color: #4b5563;
  padding: 1rem 1.5rem;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}
</style>