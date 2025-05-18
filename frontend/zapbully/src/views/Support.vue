<template>
  <div class="support-app">
    <!-- HERO -->
    <section class="hero" ref="heroSection">
      <h1>Support & Recovery Hub</h1>
      <p>Calm, step-by-step guidance for parents supporting their child from cyberbullying.</p>
    </section>

    <!-- Roadmap Selection -->
    <section class="section_roadmap_selection">
      <div class="section_heading">
        <h2>Select Recovery Plan Based on Severity</h2>
      </div>
      <div class="solution_cards_box">
        <div class="solution_card" @click="selectSeverity('mild')">
          <div class="hover_color_bubble"></div>
          <div class="solu_title"><h3>Mild Symptoms</h3></div>
          <div class="solu_description">
            <p>Subtle mood changes or light online teasing. Learn how to offer quick emotional support.</p>
            <button type="button" class="read_more_btn">View Steps</button>
          </div>
        </div>

        <div class="solution_card" @click="selectSeverity('moderate')">
          <div class="hover_color_bubble"></div>
          <div class="solu_title"><h3>Moderate Symptoms</h3></div>
          <div class="solu_description">
            <p>Ongoing teasing, sadness, or withdrawal. Learn deeper intervention strategies.</p>
            <button type="button" class="read_more_btn">View Steps</button>
          </div>
        </div>

        <div class="solution_card" @click="selectSeverity('severe')">
          <div class="hover_color_bubble"></div>
          <div class="solu_title"><h3>Severe Symptoms</h3></div>
          <div class="solu_description">
            <p>Serious threats, fear, or mental health concerns. Urgent support action plan.</p>
            <button type="button" class="read_more_btn">View Steps</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Steps -->
    <section class="timeline-section" v-if="selectedSteps.length > 0" ref="timelineSection">
      <div class="back-to-top-container">
        <button class="back-to-top-btn" @click="scrollToTop">
          ↑ Back to Top
        </button>
      </div>
      <h2>Recovery Steps for {{ selectedSeverityLabel }}</h2>
      <ul class="timeline">
        <li
          v-for="(step, index) in selectedSteps"
          :key="index"
          :class="{ 'timeline-inverted': index % 2 !== 0 }"
          :data-aos="index % 2 === 0 ? 'fade-up' : 'fade-down'"
          data-aos-duration="800"
        >
          <div class="timeline-image"
               :data-aos="index % 2 === 0 ? 'zoom-in-up' : 'zoom-in-down'"
               data-aos-delay="200"
               data-aos-duration="600">
            <div class="step-number">Step {{ index + 1 }}</div>
          </div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4 v-if="selectedSeverity === 'mild'">{{ mildDetails[index].title }}</h4>
              <h4 v-else-if="selectedSeverity === 'moderate'">{{ moderateDetails[index].title }}</h4>
              <h4 v-else-if="selectedSeverity === 'severe'">{{ severeDetails[index].title }}</h4>
              <div v-if="selectedSeverity === 'mild'" aria-label="Step description">
                <p>{{ mildDetails[index].desc }}</p>
              </div>
              <div v-else-if="selectedSeverity === 'moderate'" aria-label="Step description">
                <p>{{ moderateDetails[index].desc }}</p>
              </div>
              <div v-else-if="selectedSeverity === 'severe'" aria-label="Step description">
                <p>{{ severeDetails[index].desc }}</p>
              </div>
            </div>
          </div>
          <div class="line"></div>
        </li>
      </ul>
    </section>

    <section class="report-generator">
      <div class="form-group">
        <label for="target">Recipient:</label>
        <select id="target" v-model="target">
          <option value="school">School</option>
          <option value="police">Police</option>
          <option value="platform">Social Media Platform</option>
        </select>
      </div>

      <div class="form-group">
        <label for="platform">Platform Involved:</label>
        <select id="platform" v-model="platform">
          <option>Instagram</option>
          <option>TikTok</option>
          <option>Snapchat</option>
          <option>Facebook</option>
          <option>Other</option>
        </select>
      </div>

      <div class="form-group">
        <label>Type of Incident:</label>
        <div class="checkbox-group">
          <label v-for="option in typeOptions" :key="option.value">
            <input type="checkbox" v-model="incidentTypes" :value="option.value" />
            {{ option.label }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="date">Date of Incident:</label>
        <input type="date" id="date" v-model="incidentDate" />
      </div>

      <div class="form-group">
        <label for="note">Additional Notes :</label>
        <textarea id="note" v-model="additionalNote" placeholder="e.g. My child has shown signs of emotional distress and reluctance to attend school..."></textarea>
      </div>

      <div class="button-group">
        <button class="generate-btn" @click="generateReport">Generate Report</button>
      </div>

      <div class="report-output" v-if="report">
        <h3>Generated Report:</h3>
        <pre>{{ report }}</pre>
        <div class="button-group">
          <button class="copy-btn" @click="copyToClipboard">Copy Report</button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>Need urgent help? Contact Kids Helpline Australia (1800 55 1800)</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const target = ref('school')
const platform = ref('')
const incidentTypes = ref([])
const incidentDate = ref('')
const additionalNote = ref('')
const report = ref('')

const typeOptions = [
  { label: 'Abusive Language', value: 'Abusive Language' },
  { label: 'Malicious Image/Video Sharing', value: 'Malicious Image/Video Sharing' },
  { label: 'Personal Threats', value: 'Personal Threats' },
  { label: 'Social Exclusion', value: 'Social Exclusion' },
  { label: 'Impersonation', value: 'Impersonation' }
]

const generateReport = async () => {
  const apiUrl = 'https://report-production-3547.up.railway.app/generate-report'
  const rawPayload = {
    recipient: target.value,
    platform: platform.value,
    date: incidentDate.value,
    incidentTypes: [...incidentTypes.value],
    notes: additionalNote.value
  }

  console.log("Sending payload to backend:", rawPayload)

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rawPayload)
    })

    const data = await response.json()
    report.value = data.result || `❌ Error: ${data.error}`
  } catch (err) {
    report.value = `❌ Network Error: ${err.message}`
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(report.value)
    alert('Report content copied to clipboard!')
  } catch (e) {
    alert('Copy failed. Please copy manually.')
  }
}

const selectedSeverity = ref('')
const heroSection = ref(null)

const mildDetails = [/*...*/]
const moderateDetails = [/*...*/]
const severeDetails = [/*...*/]

const selectedSteps = computed(() => {
  if (selectedSeverity.value === 'mild') return mildDetails
  if (selectedSeverity.value === 'moderate') return moderateDetails
  if (selectedSeverity.value === 'severe') return severeDetails
  return []
})

const selectedSeverityLabel = computed(() => {
  if (selectedSeverity.value === 'mild') return 'Mild Symptoms'
  if (selectedSeverity.value === 'moderate') return 'Moderate Symptoms'
  if (selectedSeverity.value === 'severe') return 'Severe Symptoms'
  return ''
})

const selectSeverity = (severity) => {
  selectedSeverity.value = severity
  nextTick(() => {
    const headerHeight = heroSection.value?.offsetHeight || 200
    window.scrollTo({ top: headerHeight, behavior: 'smooth' })
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.support-app {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  background: url('@/assets/background_image.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

/* HERO */
.hero {
  background-image: url('@/assets/hero_image.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 15px;
  text-align: center;
  position: relative;
  min-height: 150px;
  margin-bottom: 30px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero h1,
.hero p {
  position: relative;
  z-index: 2;
  text-shadow: 1px 1px 3px black;
}

/* RECOVERY PLAN CARDS */
.section_heading h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.solution_cards_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.solution_card {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 15px;
  flex: 0 0 calc(30% - 20px);
  min-height: 220px;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
}

.solution_card:hover {
  background: rgb(123, 170, 220);
  transform: scale(1.05);
  color: #ffffff;
}

.solution_card:hover .solu_title h3,
.solution_card:hover .solu_description p {
  color: #ffffff;
}

.hover_color_bubble {
  position: absolute;
  background: rgba(0, 123, 255, 0.12);
  width: 900px;
  height: 900px;
  top: 250px;
  left: -300px;
  border-radius: 50%;
  transition: 0.7s;
  z-index: 0;
}

.solution_card:hover .hover_color_bubble {
  top: -100px;
}

.solu_title h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #0a0a0a;
}

.solu_description p {
  font-size: 0.95rem;
  color: #555555;
  margin-bottom: 15px;
}

.read_more_btn {
  border: none;
  padding: 6px 16px;
  font-size: 0.9rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #42c3ca, #42c3ca);
  color: white;
  font-weight: bold;
  transition: 0.4s;
  z-index: 1;
  position: relative;
}

.solution_card:hover .read_more_btn {
  background: #ffffff !important;
  color: #007bff !important;
}

/* TIMELINE SECTION */
.timeline-section {
  margin-top: 60px;
  text-align: center;
  padding-top: 50px;
  position: relative;
}

.timeline-section h2 {
  margin-bottom: 80px;
}

.back-to-top-container {
  position: sticky;
  top: 20px;
  z-index: 100;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.back-to-top-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.back-to-top-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Main Timeline Layout */
.timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0;
  position: relative;
}

/* Timeline Item */
.timeline li {
  position: relative;
  width: 250px;
  min-height: 150px;
  margin: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Timeline Item Alternating */
.timeline li.timeline-inverted {
  flex-direction: column-reverse;
}

/* Timeline Image (Circle) */
.timeline-image {
  background: #007bff;
  border: 6px solid #fff;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

.step-number {
  color: white;
  font-weight: bold;
  font-size: 20px;
}

/* Timeline Panel (Card) */
.timeline-panel {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  text-align: center;
}

.timeline-heading h4 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #003366;
}

.timeline-body p {
  font-size: 1.5rem;
  color: #555;
  margin-top: 10px;
}

/* Connector Line */
.timeline li .line::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 5px;
  background-color: #007bff;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}

.timeline li:last-child .line::before {
  display: none; /* No line after last item */
}

.timeline li {
  position: relative;
  width: 360px;
  min-height: 300px;
  margin: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline {
    flex-direction: column;
  }
  .timeline li {
    margin: 40px 0;
    width: 100%;
  }
  .timeline li.timeline-inverted {
    flex-direction: column;
  }
  .timeline li .line::before {
    display: none;
  }
  .solution_card {
    flex: 0 0 100%;
  }
}

/* FOOTER */
.footer {
  text-align: center;
  margin-top: 60px;
  color: #666;
  font-size: 0.9rem;
  padding: 20px 0;
}

/* Report Generator Styles */
.report-generator {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: #333;
}

select,
input[type="date"],
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.3s ease;
}

select:focus,
input[type="date"]:focus,
textarea:focus {
  outline: none;
  border-color: #4f8ef7;
}

.checkbox-group label {
  display: block;
  font-weight: 500;
  margin-top: 6px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.generate-btn,
.copy-btn {
  background-color: #4f8ef7;
  color: #fff;
  padding: 12px 24px;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.generate-btn:hover,
.copy-btn:hover {
  background-color: #3a6fd9;
  transform: translateY(-2px);
}

.report-output {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

pre {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}
</style>
