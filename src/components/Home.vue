<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDataSheet = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const dataSheetFeatures = [
  'Complete land title management system',
  'GIS and interactive mapping integration',
  'Lease agreement tracking and management',
  'Beneficiary management system',
  'Document storage and retrieval',
  'Real-time dashboard analytics',
  'Multi-user role-based access control',
  'Export reports in multiple formats',
  'Automated payment tracking',
  'Land parcel visualization',
  'Titleholder records management',
  'Conservancy area mapping'
]

const technicalSpecs = [
  'Cloud-based SaaS platform',
  '99.9% uptime guarantee',
  '256-bit encryption security',
  'GDPR and local compliance',
  'API integration available',
  'Mobile responsive design'
]

const downloadDataSheet = () => {
  const content = `RAMANI LAND MANAGEMENT SYSTEM - DATA SHEET

Product Overview
Ramani is a comprehensive land information management system designed for enterprises to efficiently manage land records, leases, and beneficiaries.

Key Features:
${dataSheetFeatures.map(f => `- ${f}`).join('\n')}

Technical Specifications:
${technicalSpecs.map(s => `- ${s}`).join('\n')}

Contact Information:
Email: sales@ramani.com
Phone: +254 700 000 000
Website: www.ramani.com

© 2024 Ramani. All rights reserved.`

  const blob = new Blob([content], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'Ramani_Data_Sheet.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <div class="font-sans text-gray-800">
    <!-- HERO SECTION -->
    <section class="grid md:grid-cols-2 gap-10 px-6 md:px-10 py-16 md:py-20 items-center bg-gradient-to-br from-blue-50 to-white">
      <div>
        <div class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-6">
          <span>✨</span>
          <span>Trusted by 500+ Enterprises</span>
        </div>
        <h2 class="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Best Land Management Software for 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-600">Enterprise Land Records</span> & Workflow
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-blue-700 to-green-600 mb-6 rounded"></div>
        <p class="text-gray-500 text-lg mb-8">
          Made by Land Professionals, for Land Professionals
        </p>
        <div class="flex gap-4 flex-wrap">
          <Button label="Request Demo" @click="goToLogin" class="!bg-gradient-to-r !from-blue-700 !to-green-600 !border-none !px-6 !py-3" />
          <Button label="View data sheet" @click="showDataSheet = true" class="!bg-white !text-blue-700 !border-blue-700 !px-6 !py-3" />
        </div>
        <div class="flex gap-8 mt-8 pt-4 border-t">
          <div>
            <div class="text-2xl font-bold text-blue-700">10K+</div>
            <div class="text-sm text-gray-500">Land Parcels</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-700">500+</div>
            <div class="text-sm text-gray-500">Happy Clients</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-700">99.9%</div>
            <div class="text-sm text-gray-500">Uptime</div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" alt="Dashboard Preview" class="w-full h-auto object-cover">
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <div class="bg-white/90 rounded-full p-4">
              <i class="pi pi-play text-2xl text-blue-700"></i>
            </div>
          </div>
        </div>
        <div class="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
          <i class="pi pi-chart-line text-green-600"></i>
          <span class="text-sm font-semibold">Dashboard Preview</span>
        </div>
      </div>
    </section>

    <!-- TRUSTED BY SECTION -->
    <section class="px-6 md:px-10 py-10 bg-white border-b">
      <p class="text-center text-gray-400 text-sm uppercase tracking-wide mb-6">Trusted by industry leaders</p>
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
        <span class="text-xl font-semibold text-gray-500">🏢 Kenya Land Alliance</span>
        <span class="text-xl font-semibold text-gray-500">🌿 Wildlife Conservancies</span>
        <span class="text-xl font-semibold text-gray-500">🏛️ Ministry of Lands</span>
        <span class="text-xl font-semibold text-gray-500">🤝 NGO Partners</span>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="px-6 md:px-10 py-16 bg-white">
      <div class="text-center mb-12">
        <span class="text-green-600 font-semibold text-sm uppercase tracking-wide">Why Choose Us</span>
        <h3 class="text-3xl font-bold mt-2 mb-4">Complete Land Management Solution</h3>
        <p class="text-gray-500 max-w-2xl mx-auto">Everything you need to manage land records, leases, and beneficiaries in one place</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center p-6 rounded-xl hover:shadow-lg transition">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📄</span>
          </div>
          <h4 class="font-semibold text-xl mb-2">Agreement & Well Records</h4>
          <p class="text-sm text-gray-500">Centralizes all contract and well data in one secure location.</p>
        </div>

        <div class="text-center p-6 rounded-xl hover:shadow-lg transition">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h4 class="font-semibold text-xl mb-2">Team Collaboration</h4>
          <p class="text-sm text-gray-500">Streamline communication and workflow across your team.</p>
        </div>

        <div class="text-center p-6 rounded-xl hover:shadow-lg transition">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🗺️</span>
          </div>
          <h4 class="font-semibold text-xl mb-2">GIS Auto Mapping</h4>
          <p class="text-sm text-gray-500">Real-time mapping and analysis tools for land parcels.</p>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section class="px-6 md:px-10 py-16 bg-gray-50">
      <div class="text-center mb-12">
        <span class="text-green-600 font-semibold text-sm uppercase tracking-wide">Simple Process</span>
        <h3 class="text-3xl font-bold mt-2 mb-4">How Ramani Works</h3>
        <p class="text-gray-500 max-w-2xl mx-auto">Get started in 4 simple steps</p>
      </div>

      <div class="grid md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-700 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">1</div>
          <h4 class="font-semibold text-lg mb-2">Sign Up</h4>
          <p class="text-sm text-gray-500">Create your account and choose your plan</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-700 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">2</div>
          <h4 class="font-semibold text-lg mb-2">Upload Data</h4>
          <p class="text-sm text-gray-500">Import your land records and documents</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-700 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">3</div>
          <h4 class="font-semibold text-lg mb-2">Map Parcels</h4>
          <p class="text-sm text-gray-500">Visualize land on interactive GIS map</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-700 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">4</div>
          <h4 class="font-semibold text-lg mb-2">Manage & Grow</h4>
          <p class="text-sm text-gray-500">Track leases, beneficiaries, and analytics</p>
        </div>
      </div>
    </section>

    <!-- GROWTH SECTION -->
    <section class="px-6 md:px-10 py-16 bg-white">
      <div class="text-center mb-12">
        <h3 class="text-3xl font-bold mb-4">Ramani Scales with Your Growth</h3>
        <p class="text-gray-500">Powerful features that grow with your business needs</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop" alt="Titleholders" class="w-full h-48 object-cover group-hover:scale-105 transition">
          <div class="p-6">
            <h4 class="font-semibold text-xl mb-2">Titleholders</h4>
            <p class="text-sm text-gray-500">Manage all titleholders efficiently with complete records.</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop" alt="Map Viewing" class="w-full h-48 object-cover group-hover:scale-105 transition">
          <div class="p-6">
            <h4 class="font-semibold text-xl mb-2">Map Viewing</h4>
            <p class="text-sm text-gray-500">View land parcels easily on interactive maps.</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop" alt="Manage Parcels" class="w-full h-48 object-cover group-hover:scale-105 transition">
          <div class="p-6">
            <h4 class="font-semibold text-xl mb-2">Manage Parcels</h4>
            <p class="text-sm text-gray-500">Track and manage land parcels with ease.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS SECTION -->
    <section class="px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-center bg-gray-50">
      <div>
        <div class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-6">
          <span>🎯</span>
          <span>Key Benefits</span>
        </div>
        <h3 class="text-3xl font-bold mb-6">What Benefit Will You Get</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span class="text-green-600">✓</span></div>
            <span>24/7 customer support</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span class="text-blue-600">✓</span></div>
            <span>Actual Map view with GIS integration</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><span class="text-purple-600">✓</span></div>
            <span>Land parcel reports and analytics</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><span class="text-orange-600">✓</span></div>
            <span>Titleholders management</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><span class="text-red-600">✓</span></div>
            <span>Analytical dashboard with insights</span>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop" alt="Benefits Illustration" class="w-full h-96 object-cover">
        </div>
        <div class="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3">
          <i class="pi pi-chart-bar text-2xl text-green-600"></i>
        </div>
        <div class="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3">
          <i class="pi pi-map-marker text-2xl text-blue-600"></i>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="px-6 md:px-10 py-16 bg-gradient-to-r from-blue-700 to-green-600 text-white text-center">
      <h3 class="text-3xl font-bold mb-4">Ready to Transform Your Land Management?</h3>
      <p class="text-lg mb-8 opacity-90">Join 500+ enterprises already using Ramani</p>
      <div class="flex gap-4 justify-center flex-wrap">
        <Button label="Request Demo" @click="goToLogin" class="!bg-white !text-blue-700 !border-none !px-8 !py-3" />
        <Button label="Contact Sales" class="!bg-transparent !border-white !text-white !px-8 !py-3" />
      </div>
    </section>

    <!-- TESTIMONIAL + FORM SECTION -->
    <section class="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <div class="flex items-center gap-2 mb-6">
          <span class="text-4xl">⭐</span>
          <span class="text-4xl">⭐</span>
          <span class="text-4xl">⭐</span>
          <span class="text-4xl">⭐</span>
          <span class="text-4xl">⭐</span>
        </div>
        <h3 class="text-3xl font-bold mb-4">People are Saying About Ramani</h3>
        <p class="text-gray-300 text-lg mb-6 leading-relaxed">
          "We feel like Ramani really understands the needs of smaller independents. The platform has transformed how we manage our land records."
        </p>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">AM</div>
          <div>
            <p class="font-semibold">— Alex Mwangi</p>
            <p class="text-sm text-gray-400">Land Administrator</p>
          </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-700">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">JK</div>
            <div>
              <p class="font-semibold">— Jane Kamau</p>
              <p class="text-sm text-gray-400">Conservancy Manager</p>
            </div>
          </div>
          <p class="text-gray-300 text-sm mt-3 italic">"The GIS mapping feature alone has saved us countless hours. Highly recommended!"</p>
        </div>
      </div>

      <div class="bg-gray-800 p-8 rounded-2xl">
        <h4 class="text-2xl font-semibold mb-2">Get Started Today</h4>
        <p class="text-gray-400 mb-6">Request a demo and see how Ramani can help you</p>

        <div class="space-y-4">
          <InputText placeholder="Full name" class="w-full !bg-gray-700 !border-gray-600 !text-white" />
          <InputText placeholder="Email address" class="w-full !bg-gray-700 !border-gray-600 !text-white" />
          <InputText placeholder="Phone number" class="w-full !bg-gray-700 !border-gray-600 !text-white" />
          <Textarea placeholder="Tell us about your needs" rows="3" class="w-full !bg-gray-700 !border-gray-600 !text-white" />
          <Button label="Request Demo" @click="goToLogin" class="!bg-gradient-to-r !from-blue-600 !to-green-600 !border-none !w-full !py-3" />
        </div>
        <p class="text-xs text-gray-500 mt-4 text-center">No spam. Unsubscribe anytime.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-gray-900 text-gray-400 px-6 md:px-10 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🌍</span>
            <h1 class="text-white font-bold text-xl">ramani</h1>
          </div>
          <p class="text-sm mb-4">Best Land Management Software for Enterprise Land Records & Workflow</p>
          <div class="flex gap-3">
            <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
              <i class="pi pi-twitter"></i>
            </div>
            <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
              <i class="pi pi-linkedin"></i>
            </div>
            <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
              <i class="pi pi-github"></i>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Support</h4>
          <div class="space-y-2 text-sm">
            <p class="hover:text-white cursor-pointer">Help centre</p>
            <p class="hover:text-white cursor-pointer">Account info</p>
            <p class="hover:text-white cursor-pointer">Contact us</p>
            <p class="hover:text-white cursor-pointer">FAQs</p>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Help & Solution</h4>
          <div class="space-y-2 text-sm">
            <p class="hover:text-white cursor-pointer">Talk to support</p>
            <p class="hover:text-white cursor-pointer">Documentation</p>
            <p class="hover:text-white cursor-pointer">API Reference</p>
            <p class="hover:text-white cursor-pointer">System Status</p>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Product</h4>
          <div class="space-y-2 text-sm">
            <p class="hover:text-white cursor-pointer">Land management</p>
            <p class="hover:text-white cursor-pointer">GIS system</p>
            <p class="hover:text-white cursor-pointer">Land parcels</p>
            <p class="hover:text-white cursor-pointer">Lease tracking</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 pt-8 text-center text-sm">
        <p>&copy; 2024 Ramani. All rights reserved. Made by Land Professionals, for Land Professionals.</p>
      </div>
    </footer>

    <!-- Data Sheet Modal -->
    <Dialog v-model:visible="showDataSheet" header="Ramani - Product Data Sheet" :modal="true" :style="{ width: '550px' }" class="datasheet-dialog">
      <div class="space-y-4">
        <p class="text-gray-600">Ramani is a comprehensive land information management system designed for enterprises to efficiently manage land records, leases, and beneficiaries.</p>
        
        <h3 class="font-semibold text-lg text-gray-800">Key Features:</h3>
        <ul class="grid grid-cols-2 gap-2">
          <li v-for="feature in dataSheetFeatures" :key="feature" class="flex items-center gap-2 text-sm text-gray-600">
            <i class="pi pi-check-circle text-green-500"></i>
            {{ feature }}
          </li>
        </ul>
        
        <h3 class="font-semibold text-lg text-gray-800 mt-4">Technical Specifications:</h3>
        <ul class="grid grid-cols-2 gap-2">
          <li v-for="spec in technicalSpecs" :key="spec" class="flex items-center gap-2 text-sm text-gray-600">
            <i class="pi pi-check-circle text-blue-500"></i>
            {{ spec }}
          </li>
        </ul>
        
        <div class="bg-gray-50 p-4 rounded-lg mt-4">
          <p class="text-sm text-gray-600">For a complete data sheet with pricing, implementation guide, and custom quotes, please contact our sales team.</p>
          <div class="flex gap-4 mt-3">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <i class="pi pi-envelope"></i>
              sales@ramani.com
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <i class="pi pi-phone"></i>
              +254 700 000 000
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Download Data Sheet" icon="pi pi-download" @click="downloadDataSheet" class="!bg-gradient-to-r !from-blue-700 !to-green-600 !border-none" />
        <Button label="Close" icon="pi pi-times" @click="showDataSheet = false" class="p-button-text" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.p-inputtext) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.bg-white, .bg-gray-50 .rounded-xl {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-white:hover, .bg-gray-50 .rounded-xl:hover {
  transform: translateY(-5px);
}

:deep(.datasheet-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 1.5rem;
}

:deep(.datasheet-dialog .p-dialog-title) {
  color: white;
  font-weight: 600;
}

:deep(.datasheet-dialog .p-dialog-header-icon) {
  color: white;
}

:deep(.datasheet-dialog .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.datasheet-dialog .p-dialog-footer) {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>