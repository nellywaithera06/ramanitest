<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()

// Form state
const isLoginMode = ref(true)
const isForgotPasswordMode = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const resetEmail = ref('')
const resetCode = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const resetStep = ref(1)

// Handle Login
const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    const user = registeredUsers[email.value]
    
    if (user && user.password === password.value) {
      const userData = {
        email: email.value,
        name: user.name,
        role: user.role || 'user',
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('currentUser', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Invalid email or password. Please try again or register a new account.'
      loading.value = false
    }
  }, 500)
}

// Handle Registration
const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    
    if (registeredUsers[email.value]) {
      errorMessage.value = 'User with this email already exists. Please login instead.'
      loading.value = false
      return
    }
    
    registeredUsers[email.value] = {
      name: fullName.value,
      email: email.value,
      password: password.value,
      role: 'user',
      registeredAt: new Date().toISOString()
    }
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    
    successMessage.value = 'Registration successful! Please login with your credentials.'
    
    fullName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    
    setTimeout(() => {
      isLoginMode.value = true
      successMessage.value = ''
    }, 2000)
    
    loading.value = false
  }, 500)
}

// Forgot Password - Request Reset
const requestPasswordReset = () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!resetEmail.value) {
    errorMessage.value = 'Please enter your email address'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(resetEmail.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    const user = registeredUsers[resetEmail.value]
    
    if (!user) {
      errorMessage.value = 'No account found with this email address'
      loading.value = false
      return
    }
    
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    localStorage.setItem('resetCode_' + resetEmail.value, generatedCode)
    localStorage.setItem('resetEmail_' + resetEmail.value, resetEmail.value)
    
    successMessage.value = `A reset code has been sent to ${resetEmail.value}. Code: ${generatedCode} (Demo)`
    resetStep.value = 2
    loading.value = false
  }, 500)
}

// Verify Reset Code and Reset Password
const verifyAndResetPassword = () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!resetCode.value) {
    errorMessage.value = 'Please enter the reset code'
    return
  }
  
  if (!newPassword.value || !confirmNewPassword.value) {
    errorMessage.value = 'Please enter new password'
    return
  }
  
  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return
  }
  
  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    const storedCode = localStorage.getItem('resetCode_' + resetEmail.value)
    const storedEmail = localStorage.getItem('resetEmail_' + resetEmail.value)
    
    if (!storedCode || !storedEmail) {
      errorMessage.value = 'Reset session expired. Please request a new reset code.'
      resetStep.value = 1
      loading.value = false
      return
    }
    
    if (resetCode.value !== storedCode) {
      errorMessage.value = 'Invalid reset code. Please try again.'
      loading.value = false
      return
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    
    if (registeredUsers[resetEmail.value]) {
      registeredUsers[resetEmail.value].password = newPassword.value
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      
      localStorage.removeItem('resetCode_' + resetEmail.value)
      localStorage.removeItem('resetEmail_' + resetEmail.value)
      
      successMessage.value = 'Password reset successfully! Please login with your new password.'
      
      setTimeout(() => {
        isForgotPasswordMode.value = false
        resetStep.value = 1
        resetEmail.value = ''
        resetCode.value = ''
        newPassword.value = ''
        confirmNewPassword.value = ''
        successMessage.value = ''
        email.value = resetEmail.value
      }, 2000)
    }
    
    loading.value = false
  }, 500)
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  isForgotPasswordMode.value = false
  resetStep.value = 1
  errorMessage.value = ''
  successMessage.value = ''
  fullName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  resetEmail.value = ''
  resetCode.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

const openForgotPassword = () => {
  isForgotPasswordMode.value = true
  errorMessage.value = ''
  successMessage.value = ''
  resetStep.value = 1
  resetEmail.value = ''
  resetCode.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

const closeForgotPassword = () => {
  isForgotPasswordMode.value = false
  resetStep.value = 1
  errorMessage.value = ''
  successMessage.value = ''
  resetEmail.value = ''
  resetCode.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

const checkAuth = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (isAuthenticated === 'true') {
    router.push('/dashboard')
  }
}

checkAuth()
</script>

<template>
  <div class="min-h-screen flex">
    <!-- LEFT SIDE (IMAGE SECTION) -->
    <div class="hidden md:flex w-1/2 relative">
      <!-- Sunset over Farmland -->
      <img
        src="https://images.pexels.com/photos/1566124/pexels-photo-1566124.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Sunset over farmland - Beautiful landscape"
        class="absolute inset-0 w-full h-full object-cover"
        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'"
      />
      
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/75 to-green-900/75"></div>
      <div class="relative z-10 text-white p-12 flex flex-col justify-between h-full">
        <div class="flex items-center gap-2">
          <span class="text-3xl">🌍</span>
          <div class="text-2xl font-bold tracking-wide">Ramani</div>
        </div>
        <div>
          <h2 class="text-4xl font-bold mb-4 leading-tight">
            Smart Land<br />
            Management Solution
          </h2>
          <p class="text-base text-gray-200 max-w-md leading-relaxed">
            Digitize your land records, manage leases efficiently, and track beneficiaries all in one platform.
          </p>
          <div class="mt-8 flex gap-6">
            <div>
              <div class="text-2xl font-bold">10K+</div>
              <div class="text-xs text-gray-300">Land Parcels</div>
            </div>
            <div>
              <div class="text-2xl font-bold">500+</div>
              <div class="text-xs text-gray-300">Happy Clients</div>
            </div>
            <div>
              <div class="text-2xl font-bold">99.9%</div>
              <div class="text-xs text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE (FORM SECTION) -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 relative">
      
      <!-- Login/Register Mode -->
      <div v-if="!isForgotPasswordMode">
        <div class="flex justify-between text-sm text-gray-500 mb-10">
          <router-link to="/" class="cursor-pointer hover:text-black">← Return Home</router-link>
          <span>
            {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
            <a href="#" class="font-semibold text-black hover:underline" @click.prevent="toggleMode">
              {{ isLoginMode ? "Register Now" : "Login Here" }}
            </a>
          </span>
        </div>

        <div class="max-w-md w-full mx-auto">
          <h2 class="text-2xl font-bold text-center mb-2">
            {{ isLoginMode ? "WELCOME BACK!" : "CREATE ACCOUNT" }}
          </h2>
          <p class="text-center text-gray-500 mb-8 text-sm">
            {{ isLoginMode ? "LOGIN TO ACCESS YOUR DASHBOARD" : "REGISTER TO GET STARTED" }}
          </p>

          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <div class="space-y-4">
            <div v-if="!isLoginMode" class="relative">
              <i class="pi pi-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
              <InputText v-model="fullName" placeholder="Full Name" class="w-full pl-10" />
            </div>

            <div class="relative">
              <i class="pi pi-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
              <InputText
                v-model="email"
                type="email"
                :placeholder="isLoginMode ? 'Enter your email' : 'Email address'"
                class="w-full pl-10"
                @keyup.enter="isLoginMode ? handleLogin() : handleRegister()"
              />
            </div>

            <div class="relative">
              <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
              <Password
                v-model="password"
                :placeholder="isLoginMode ? 'Enter your password' : 'Create password (min. 6 characters)'"
                toggleMask
                :feedback="!isLoginMode"
                class="w-full"
                inputClass="w-full pl-10"
                @keyup.enter="isLoginMode ? handleLogin() : handleRegister()"
              />
            </div>

            <div v-if="!isLoginMode" class="relative">
              <i class="pi pi-check-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
              <Password
                v-model="confirmPassword"
                placeholder="Confirm password"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full pl-10"
                @keyup.enter="handleRegister"
              />
            </div>

            <Button
              :label="loading ? (isLoginMode ? 'Logging in...' : 'Registering...') : (isLoginMode ? 'Login →' : 'Register →')"
              class="w-full bg-blue-800 border-none hover:bg-blue-900"
              :disabled="loading"
              @click="isLoginMode ? handleLogin() : handleRegister()"
            />

            <div v-if="isLoginMode" class="text-center">
              <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline" @click.prevent="openForgotPassword">
                Forgot Password?
              </a>
            </div>
          </div>

          <div class="mt-6 text-xs text-gray-500 text-center bg-blue-50 p-3 rounded">
            <span class="font-semibold">First time?</span> Click "Register Now" to create your own account
          </div>
        </div>
      </div>

      <!-- Forgot Password Mode -->
      <div v-else>
        <div class="flex justify-between text-sm text-gray-500 mb-10">
          <a href="#" class="cursor-pointer hover:text-black" @click.prevent="closeForgotPassword">← Back to Login</a>
        </div>

        <div class="max-w-md w-full mx-auto">
          <h2 class="text-2xl font-bold text-center mb-2">RESET PASSWORD</h2>
          <p class="text-center text-gray-500 mb-8 text-sm">
            {{ resetStep === 1 ? "Enter your email to receive a reset code" : "Enter the reset code and your new password" }}
          </p>

          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <div class="space-y-4">
            <template v-if="resetStep === 1">
              <div class="relative">
                <i class="pi pi-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                <InputText
                  v-model="resetEmail"
                  type="email"
                  placeholder="Enter your email address"
                  class="w-full pl-10"
                  @keyup.enter="requestPasswordReset"
                />
              </div>

              <Button
                :label="loading ? 'Sending...' : 'Send Reset Code →'"
                class="w-full bg-blue-800 border-none hover:bg-blue-900"
                :disabled="loading"
                @click="requestPasswordReset"
              />
            </template>

            <template v-else>
              <div class="relative">
                <i class="pi pi-key absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                <InputText
                  v-model="resetCode"
                  type="text"
                  placeholder="Enter 6-digit reset code"
                  class="w-full pl-10"
                  maxlength="6"
                />
              </div>

              <div class="relative">
                <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                <Password
                  v-model="newPassword"
                  placeholder="New password (min. 6 characters)"
                  toggleMask
                  :feedback="true"
                  class="w-full"
                  inputClass="w-full pl-10"
                />
              </div>

              <div class="relative">
                <i class="pi pi-check-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                <Password
                  v-model="confirmNewPassword"
                  placeholder="Confirm new password"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full pl-10"
                />
              </div>

              <Button
                :label="loading ? 'Resetting...' : 'Reset Password →'"
                class="w-full bg-blue-800 border-none hover:bg-blue-900"
                :disabled="loading"
                @click="verifyAndResetPassword"
              />
            </template>
          </div>

          <div class="mt-6 text-xs text-gray-500 text-center bg-blue-50 p-3 rounded">
            <span class="font-semibold">Note:</span> For demo purposes, the reset code is displayed on screen
          </div>
        </div>
      </div>

      <div class="absolute bottom-6 left-8 text-xs text-gray-400">Copyright 2024 Ramani. All rights Reserved</div>
      <div class="absolute bottom-6 right-8 text-xs text-gray-400">Need help?</div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) { padding: 0.75rem; }
:deep(.p-password) { display: block; width: 100%; }
:deep(.p-password input) { width: 100%; padding: 0.75rem; }
:deep(.p-password .p-input-icon-right) { width: 100%; }
:deep(.p-button) { padding: 0.75rem; font-weight: 600; }
:deep(.p-button:disabled) { opacity: 0.7; cursor: not-allowed; }
</style>