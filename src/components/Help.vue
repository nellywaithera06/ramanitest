<template>
  <div class="help-container">
    <div class="help-header">
      <h1 class="help-title">Help Center</h1>
      <p class="help-subtitle">How can we help you today?</p>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-box-large">
        <i class="pi pi-search"></i>
        <input type="text" v-model="searchQuery" placeholder="Search for help articles, guides, and FAQs...">
      </div>
    </div>

    <!-- Quick Links / Categories -->
    <div class="categories-grid">
      <div class="category-card" @click="scrollToSection('getting-started')">
        <i class="pi pi-rocket"></i>
        <h3>Getting Started</h3>
        <p>New to Ramani? Start here</p>
      </div>
      <div class="category-card" @click="scrollToSection('faqs')">
        <i class="pi pi-question-circle"></i>
        <h3>FAQs</h3>
        <p>Common questions answered</p>
      </div>
      <div class="category-card" @click="scrollToSection('support')">
        <i class="pi pi-headphones"></i>
        <h3>Contact Support</h3>
        <p>Get help from our team</p>
      </div>
    </div>

    <!-- 1. Getting Started Guides -->
    <section id="getting-started" class="help-section">
      <div class="section-header">
        <i class="pi pi-rocket section-icon"></i>
        <h2>Getting Started Guides</h2>
      </div>
      <div class="guides-grid">
        <div class="guide-card" @click="toggleGuide('login')">
          <div class="guide-header">
            <i class="pi pi-sign-in"></i>
            <h4>How to Log In</h4>
            <i class="pi pi-chevron-down" :class="{ rotated: openGuides.login }"></i>
          </div>
          <div v-if="openGuides.login" class="guide-content">
            <ol>
              <li>Navigate to the Ramani login page</li>
              <li>Enter your registered email address</li>
              <li>Enter your password</li>
              <li>Click the "Login" button</li>
              <li>You will be redirected to your dashboard</li>
            </ol>
            <div class="tip-box">
              <i class="pi pi-info-circle"></i>
              <span>Tip: Use "Forgot Password" if you can't remember your credentials</span>
            </div>
          </div>
        </div>

        <div class="guide-card" @click="toggleGuide('dashboard')">
          <div class="guide-header">
            <i class="pi pi-home"></i>
            <h4>Understanding the Dashboard</h4>
            <i class="pi pi-chevron-down" :class="{ rotated: openGuides.dashboard }"></i>
          </div>
          <div v-if="openGuides.dashboard" class="guide-content">
            <ul>
              <li><strong>Stats Cards:</strong> Shows key metrics (land size, leases, titleholders)</li>
              <li><strong>Map View:</strong> Interactive map displaying land parcels</li>
              <li><strong>Charts:</strong> Visual representation of camp distribution and revenue</li>
              <li><strong>Lease Agreements:</strong> Recent lease documents</li>
            </ul>
          </div>
        </div>

        <div class="guide-card" @click="toggleGuide('sidebar')">
          <div class="guide-header">
            <i class="pi pi-bars"></i>
            <h4>Navigating the Sidebar Menu</h4>
            <i class="pi pi-chevron-down" :class="{ rotated: openGuides.sidebar }"></i>
          </div>
          <div v-if="openGuides.sidebar" class="guide-content">
            <ul>
              <li><strong>Dashboard:</strong> Overview of your land management system</li>
              <li><strong>Master Map:</strong> Full interactive map view</li>
              <li><strong>Lease Management:</strong> Manage leases and lease holders</li>
              <li><strong>Documents:</strong> Upload and access land documents</li>
              <li><strong>Land Management:</strong> Manage parcels and conservancies</li>
              <li><strong>User Management:</strong> Add and manage system users</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. FAQs Section -->
    <section id="faqs" class="help-section">
      <div class="section-header">
        <i class="pi pi-question-circle section-icon"></i>
        <h2>Frequently Asked Questions</h2>
      </div>
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
          <div class="faq-question">
            <i class="pi pi-question-circle"></i>
            <span>{{ faq.question }}</span>
            <i class="pi pi-chevron-down" :class="{ rotated: openFaqs[index] }"></i>
          </div>
          <div v-if="openFaqs[index]" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. User Role Explanations -->
    <section id="user-roles" class="help-section">
      <div class="section-header">
        <i class="pi pi-users section-icon"></i>
        <h2>User Role Explanations</h2>
      </div>
      <div class="roles-grid">
        <div class="role-card admin-role">
          <div class="role-icon">👑</div>
          <h3>Administrator</h3>
          <p>Full system access with all permissions</p>
          <ul>
            <li>✅ Create, edit, delete all users</li>
            <li>✅ Manage all land parcels and leases</li>
            <li>✅ Access system settings</li>
            <li>✅ View all reports and analytics</li>
            <li>✅ Approve/Reject document submissions</li>
          </ul>
        </div>
        <div class="role-card manager-role">
          <div class="role-icon">📊</div>
          <h3>Manager</h3>
          <p>Limited administrative capabilities</p>
          <ul>
            <li>✅ Create and edit leases</li>
            <li>✅ Manage documents</li>
            <li>✅ View reports</li>
            <li>✅ Add regular users</li>
            <li>❌ Cannot delete system data</li>
          </ul>
        </div>
        <div class="role-card user-role">
          <div class="role-icon">👤</div>
          <h3>Regular User</h3>
          <p>Basic access for daily operations</p>
          <ul>
            <li>✅ View assigned parcels</li>
            <li>✅ Upload documents</li>
            <li>✅ View lease information</li>
            <li>❌ Cannot manage other users</li>
            <li>❌ Cannot delete records</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 4. Technical Support Contact -->
    <section id="support" class="help-section">
      <div class="section-header">
        <i class="pi pi-headphones section-icon"></i>
        <h2>Technical Support</h2>
      </div>
      <div class="support-grid">
        <div class="support-card">
          <i class="pi pi-envelope"></i>
          <h3>Email Support</h3>
          <a href="mailto:support@ramani.com">support@ramani.com</a>
          <p>Response within 24 hours</p>
        </div>
        <div class="support-card">
          <i class="pi pi-phone"></i>
          <h3>Phone Support</h3>
          <p class="phone-number">+254 700 123 456</p>
          <p>Mon-Fri, 8AM - 6PM EAT</p>
        </div>
        <div class="support-card">
          <i class="pi pi-whatsapp"></i>
          <h3>WhatsApp</h3>
          <p class="phone-number">+254 712 345 678</p>
          <p>24/7 Chat Support</p>
        </div>
        <div class="support-card">
          <i class="pi pi-clock"></i>
          <h3>Office Hours</h3>
          <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
          <p>Saturday: 9:00 AM - 1:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </section>

    <!-- 5. Documentation Downloads -->
    <section id="documentation" class="help-section">
      <div class="section-header">
        <i class="pi pi-download section-icon"></i>
        <h2>Documentation & Downloads</h2>
      </div>
      <div class="docs-grid">
        <div class="doc-card" @click="downloadDoc('user-manual')">
          <i class="pi pi-file-pdf"></i>
          <div class="doc-info">
            <h4>User Manual</h4>
            <p>Complete guide to using Ramani system</p>
            <span class="file-size">PDF, 2.5 MB</span>
          </div>
          <button class="download-btn">Download</button>
        </div>
        <div class="doc-card" @click="downloadDoc('quick-guide')">
          <i class="pi pi-file-pdf"></i>
          <div class="doc-info">
            <h4>Quick Reference Card</h4>
            <p>One-page summary of key features</p>
            <span class="file-size">PDF, 0.8 MB</span>
          </div>
          <button class="download-btn">Download</button>
        </div>
        <div class="doc-card" @click="downloadDoc('privacy-policy')">
          <i class="pi pi-shield"></i>
          <div class="doc-info">
            <h4>Data Privacy Policy</h4>
            <p>How we protect your information</p>
            <span class="file-size">PDF, 1.2 MB</span>
          </div>
          <button class="download-btn">Download</button>
        </div>
      </div>
    </section>

    <!-- 6. Release Notes / Changelog -->
    <section id="releases" class="help-section">
      <div class="section-header">
        <i class="pi pi-megaphone section-icon"></i>
        <h2>Release Notes & What's New</h2>
      </div>
      <div class="releases-list">
        <div class="release-card" v-for="release in releases" :key="release.version">
          <div class="release-header">
            <span class="version">v{{ release.version }}</span>
            <span class="date">{{ release.date }}</span>
            <span :class="['badge', release.type]">{{ release.type }}</span>
          </div>
          <h4>{{ release.title }}</h4>
          <ul>
            <li v-for="item in release.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 7. Legal & Compliance -->
    <section id="legal" class="help-section">
      <div class="section-header">
        <i class="pi pi-shield section-icon"></i>
        <h2>Legal & Compliance</h2>
      </div>
      <div class="legal-grid">
        <div class="legal-card" @click="showLegalModal('terms')">
          <i class="pi pi-file"></i>
          <h3>Terms of Service</h3>
          <p>Terms and conditions for using Ramani system</p>
        </div>
        <div class="legal-card" @click="showLegalModal('privacy')">
          <i class="pi pi-lock"></i>
          <h3>Privacy Policy</h3>
          <p>How we collect and protect your data</p>
        </div>
        <div class="legal-card" @click="showLegalModal('compliance')">
          <i class="pi pi-check-circle"></i>
          <h3>GDPR Compliance</h3>
          <p>Data protection regulations compliance</p>
        </div>
        <div class="legal-card" @click="showLegalModal('security')">
          <i class="pi pi-shield"></i>
          <h3>Security Guidelines</h3>
          <p>Best practices for data security</p>
        </div>
      </div>
    </section>

    <!-- Legal Modal -->
    <div v-if="legalModal.show" class="modal-overlay" @click="legalModal.show = false">
      <div class="legal-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ legalModal.title }}</h3>
          <button @click="legalModal.show = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-html="legalModal.content"></div>
        </div>
        <div class="modal-footer">
          <button @click="legalModal.show = false" class="btn-primary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data() {
    return {
      searchQuery: '',
      openGuides: {
        login: false,
        dashboard: false,
        sidebar: false
      },
      openFaqs: {},
      faqs: [
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and you'll receive a password reset link. Follow the instructions to create a new password."
        },
        {
          question: "Why isn't the map loading?",
          answer: "Check your internet connection. Clear your browser cache and refresh the page. Make sure you have the latest version of your browser (Chrome, Firefox, or Safari)."
        },
        {
          question: "How do I add a new lease agreement?",
          answer: "Go to Lease Management > Leases. Click 'Add New Lease'. Fill in the required information (lease holder, parcel details, start/end dates). Upload supporting documents and click Save."
        },
        {
          question: "What file types can I upload for documents?",
          answer: "Supported file types: PDF (max 10MB), Images (JPG, PNG - max 5MB), Word Documents (DOC, DOCX - max 5MB), Excel (XLS, XLSX - max 5MB)."
        },
        {
          question: "How do I change a user's role?",
          answer: "Go to User Management, find the user, click Edit, select the new role from the dropdown, and click Save. Only Administrators can change user roles."
        },
        {
          question: "Can I export data from the system?",
          answer: "Yes. Administrators and Managers can export data. Go to Reports section, select the data range and format (CSV or Excel), and click Export."
        }
      ],
      releases: [
        {
          version: "2.1.0",
          date: "March 15, 2024",
          type: "feature",
          title: "Enhanced Map Features",
          items: [
            "Added interactive parcel boundaries",
            "New satellite view option",
            "Improved marker clustering",
            "Export map data to KML format"
          ]
        },
        {
          version: "2.0.0",
          date: "February 1, 2024",
          type: "major",
          title: "Major System Update",
          items: [
            "Complete UI redesign",
            "Added User Management system",
            "New document management features",
            "Enhanced reporting dashboard",
            "Mobile-responsive design"
          ]
        },
        {
          version: "1.5.0",
          date: "December 10, 2023",
          type: "update",
          title: "Lease Management Improvements",
          items: [
            "Bulk lease upload feature",
            "Automated lease reminders",
            "Improved search and filters",
            "Lease history tracking"
          ]
        },
        {
          version: "1.4.0",
          date: "November 5, 2023",
          type: "bugfix",
          title: "Bug Fixes & Performance",
          items: [
            "Fixed document upload issues",
            "Improved map loading speed",
            "Resolved login timeout problems",
            "Fixed mobile view alignment"
          ]
        }
      ],
      legalModal: {
        show: false,
        title: '',
        content: ''
      }
    }
  },
  computed: {
    filteredFaqs() {
      if (!this.searchQuery) return this.faqs
      return this.faqs.filter(faq => 
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    toggleGuide(guide) {
      this.openGuides[guide] = !this.openGuides[guide]
    },
    toggleFaq(index) {
      this.$set(this.openFaqs, index, !this.openFaqs[index])
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    downloadDoc(docType) {
      alert(`Downloading ${docType}...\n\nIn production, this would download the actual PDF file.`)
    },
    showLegalModal(type) {
      const legalContent = {
        terms: {
          title: 'Terms of Service',
          content: `
            <h4>1. Acceptance of Terms</h4>
            <p>By accessing and using the Ramani Land Management System, you agree to be bound by these Terms of Service.</p>
            
            <h4>2. User Responsibilities</h4>
            <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p>
            
            <h4>3. Data Accuracy</h4>
            <p>Users must ensure all land and lease information entered is accurate and up-to-date.</p>
            
            <h4>4. Prohibited Activities</h4>
            <p>Unauthorized access, data manipulation, or sharing of sensitive information is strictly prohibited.</p>
            
            <h4>5. Termination</h4>
            <p>Ramani reserves the right to suspend or terminate accounts that violate these terms.</p>
          `
        },
        privacy: {
          title: 'Privacy Policy',
          content: `
            <h4>Data Collection</h4>
            <p>We collect user information necessary for system operation including names, email addresses, and role assignments.</p>
            
            <h4>Data Usage</h4>
            <p>Your data is used solely for land management operations and will not be shared with third parties without consent.</p>
            
            <h4>Data Protection</h4>
            <p>All data is encrypted and stored securely. Regular security audits are performed.</p>
            
            <h4>Your Rights</h4>
            <p>You have the right to access, correct, or request deletion of your personal data.</p>
          `
        },
        compliance: {
          title: 'GDPR Compliance',
          content: `
            <h4>GDPR Compliance Statement</h4>
            <p>Ramani Land Management System is fully compliant with GDPR regulations.</p>
            
            <h4>Data Processing</h4>
            <p>We process personal data only for legitimate business purposes related to land management.</p>
            
            <h4>Data Retention</h4>
            <p>User data is retained only as long as necessary for operational and legal requirements.</p>
            
            <h4>Data Subject Rights</h4>
            <p>Users can request data export or deletion by contacting support@ramani.com.</p>
          `
        },
        security: {
          title: 'Security Guidelines',
          content: `
            <h4>Password Security</h4>
            <p>Use strong passwords with at least 8 characters including numbers and special characters. Change passwords every 90 days.</p>
            
            <h4>Account Protection</h4>
            <p>Never share your login credentials. Always log out when finished, especially on shared computers.</p>
            
            <h4>Data Backup</h4>
            <p>System automatically backs up data daily. Manual backups can be initiated from Settings.</p>
            
            <h4>Security Incidents</h4>
            <p>Report any suspicious activity immediately to support@ramani.com.</p>
          `
        }
      }
      
      const content = legalContent[type]
      if (content) {
        this.legalModal.title = content.title
        this.legalModal.content = content.content
        this.legalModal.show = true
      }
    }
  },
  watch: {
    searchQuery(newQuery) {
      if (newQuery && this.filteredFaqs.length > 0) {
        this.scrollToSection('faqs')
      }
    }
  },
  mounted() {
    this.faqs.forEach((_, index) => {
      this.$set(this.openFaqs, index, false)
    })
  }
}
</script>

<style scoped>
.help-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.help-header {
  text-align: center;
  margin-bottom: 24px;
}

.help-title {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 6px 0;
}

.help-subtitle {
  color: #7f8c8d;
  font-size: 12px;
}

/* Search Section */
.search-section {
  max-width: 500px;
  margin: 0 auto 24px;
}

.search-box-large {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 40px;
  padding: 8px 16px;
  gap: 10px;
  transition: all 0.3s;
}

.search-box-large:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.search-box-large i {
  color: #999;
  font-size: 14px;
}

.search-box-large input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 12px;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.category-card {
  background: white;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.category-card i {
  font-size: 24px;
  color: #667eea;
  margin-bottom: 8px;
  display: inline-block;
}

.category-card h3 {
  font-size: 13px;
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.category-card p {
  font-size: 10px;
  color: #7f8c8d;
  margin: 0;
}

/* Help Sections */
.help-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-icon {
  font-size: 20px;
  color: #667eea;
}

.section-header h2 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
}

/* Guides */
.guides-grid {
  display: grid;
  gap: 10px;
}

.guide-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #fafafa;
  transition: background 0.2s;
}

.guide-header:hover {
  background: #f5f5f5;
}

.guide-header i:first-child {
  color: #667eea;
  font-size: 14px;
}

.guide-header h4 {
  flex: 1;
  margin: 0;
  font-size: 13px;
  color: #2c3e50;
}

.guide-header .pi-chevron-down {
  transition: transform 0.3s;
  font-size: 12px;
}

.guide-header .pi-chevron-down.rotated {
  transform: rotate(180deg);
}

.guide-content {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  line-height: 1.5;
}

.guide-content ul, .guide-content ol {
  margin: 0 0 10px 0;
  padding-left: 18px;
}

.guide-content li {
  margin-bottom: 6px;
}

.tip-box {
  background: #e8f5e9;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #2e7d32;
}

/* FAQs */
.faq-list {
  display: grid;
  gap: 8px;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #fafafa;
}

.faq-question i:first-child {
  color: #ff9800;
  font-size: 14px;
}

.faq-question span {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #2c3e50;
}

.faq-question .pi-chevron-down {
  transition: transform 0.3s;
  font-size: 12px;
}

.faq-question .pi-chevron-down.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  line-height: 1.5;
  color: #555;
}

/* Roles Grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.role-card {
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid;
}

.role-card.admin-role {
  border-left-color: #4caf50;
  background: linear-gradient(135deg, #f1f8e9 0%, #fff 100%);
}

.role-card.manager-role {
  border-left-color: #2196f3;
  background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
}

.role-card.user-role {
  border-left-color: #9e9e9e;
  background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
}

.role-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.role-card h3 {
  font-size: 15px;
  margin: 0 0 6px 0;
  color: #2c3e50;
}

.role-card p {
  font-size: 11px;
  color: #666;
  margin-bottom: 10px;
}

.role-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 11px;
}

.role-card li {
  margin-bottom: 5px;
}

/* Support Grid */
.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.support-card {
  text-align: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: transform 0.2s;
}

.support-card:hover {
  transform: translateY(-2px);
}

.support-card i {
  font-size: 28px;
  color: #667eea;
  margin-bottom: 10px;
  display: inline-block;
}

.support-card h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.support-card a, .phone-number {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 6px;
  display: inline-block;
}

.support-card p {
  font-size: 10px;
  color: #7f8c8d;
  margin: 3px 0;
}

/* Documentation */
.docs-grid {
  display: grid;
  gap: 10px;
}

.doc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.doc-card:hover {
  background: #f9f9f9;
  border-color: #2f50e2;
}

.doc-card i {
  font-size: 28px;
  color: #f44336;
}

.doc-info {
  flex: 1;
}

.doc-info h4 {
  font-size: 13px;
  margin: 0 0 3px 0;
  color: #2c3e50;
}

.doc-info p {
  font-size: 11px;
  color: #666;
  margin: 0 0 3px 0;
}

.file-size {
  font-size: 10px;
  color: #999;
}

.download-btn {
  padding: 5px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #5a67d8;
}

/* Releases */
.releases-list {
  display: grid;
  gap: 12px;
}

.release-card {
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.release-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.version {
  font-weight: bold;
  font-size: 13px;
  color: #2c3e50;
}

.date {
  font-size: 11px;
  color: #999;
}

.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.badge.feature {
  background: #e8f5e9;
  color: #4caf50;
}

.badge.major {
  background: #ffebee;
  color: #f44336;
}

.badge.update {
  background: #e3f2fd;
  color: #2196f3;
}

.badge.bugfix {
  background: #fff3e0;
  color: #ff9800;
}

.release-card h4 {
  font-size: 13px;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.release-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 11px;
}

.release-card li {
  margin-bottom: 5px;
  color: #555;
}

/* Legal Grid */
.legal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.legal-card {
  padding: 14px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.legal-card:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.legal-card i {
  font-size: 24px;
  color: #667eea;
  margin-bottom: 8px;
  display: inline-block;
}

.legal-card h3 {
  font-size: 12px;
  margin: 0 0 6px 0;
  color: #2c3e50;
}

.legal-card p {
  font-size: 10px;
  color: #7f8c8d;
  margin: 0;
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

.legal-modal {
  background: white;
  border-radius: 10px;
  width: 450px;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  font-size: 12px;
  line-height: 1.5;
}

.modal-body h4 {
  color: #2c3e50;
  margin: 12px 0 6px 0;
  font-size: 13px;
}

.modal-body p {
  margin: 0 0 10px 0;
  color: #555;
}

.modal-footer {
  padding: 12px 18px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
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

/* Responsive */
@media (max-width: 768px) {
  .help-container {
    padding: 12px;
  }
  
  .help-title {
    font-size: 20px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .roles-grid,
  .support-grid,
  .legal-grid {
    grid-template-columns: 1fr;
  }
  
  .doc-card {
    flex-direction: column;
    text-align: center;
  }
  
  .release-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .legal-modal {
    width: 95%;
  }
}
</style>