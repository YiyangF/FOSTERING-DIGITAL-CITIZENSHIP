<template>
  <div class="support-app">
    <!-- HERO -->
    <section class="hero">
      <h1>Support & Recovery Hub</h1>
      <p>Calm, step-by-step guidance for parents supporting their child after cyberbullying.</p>
    </section>

    <!-- Roadmap Selection -->
    <section class="section_roadmap_selection">
      <div class="section_heading">
        <h2>Select Recovery Plan Based on Severity</h2>
      </div>
      <div class="solution_cards_box">
        <div class="solution_card" @click="selectSeverity('mild')">
          <h3>Mild Symptoms</h3>
          <p>Subtle mood changes or light online teasing. Learn how to offer quick emotional support.</p>
          <button type="button" class="read_more_btn">View Steps</button>
        </div>

        <div class="solution_card" @click="selectSeverity('moderate')">
          <h3>Moderate Symptoms</h3>
          <p>Ongoing teasing, sadness, or withdrawal. Learn deeper intervention strategies.</p>
          <button type="button" class="read_more_btn">View Steps</button>
        </div>

        <div class="solution_card" @click="selectSeverity('severe')">
          <h3>Severe Symptoms</h3>
          <p>Serious threats, fear, or mental health concerns. Urgent support action plan.</p>
          <button type="button" class="read_more_btn">View Steps</button>
        </div>
      </div>
    </section>

    <!-- Timeline Steps -->
    <section class="timeline-section" v-if="selectedSteps.length > 0">
      <h2>Recovery Steps for {{ selectedSeverityLabel }}</h2>
      <div class="timeline">
        <div
          v-for="(step, index) in selectedSteps"
          :key="index"
          :class="['timeline-item', { 'top': index % 2 === 0, 'bottom': index % 2 !== 0 }]"
        >
          <div class="timeline-card">
            <h3>Step {{ index + 1 }}</h3>
            <p>{{ step }}</p>
          </div>
          <div class="circle"></div>
        </div>
        <div class="horizontal-line"></div>
      </div>
    </section>

    <footer class="footer">
      <p>Need urgent help? Contact Kids Helpline Australia (1800 55 1800)</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSeverity: '',
      steps: {
        mild: [
          'Reassure your child that they are safe and loved.',
          'Discuss what happened without judgment.',
          'Help them adjust privacy settings online.',
          'Encourage positive online behavior and time offline.',
          'Keep an eye on emotional well-being over the next few weeks.'
        ],
        moderate: [
          'Document evidence: screenshots, messages.',
          'Block or report abusive content immediately.',
          'Contact school authorities if relevant.',
          'Provide emotional reassurance and safe activities.',
          'Seek counseling if distress persists.'
        ],
        severe: [
          'Preserve all threatening evidence.',
          'Report to authorities or cyber support agencies.',
          'Suspend digital activity if necessary.',
          'Engage professional counseling urgently.',
          'Maintain open emotional support and monitoring.'
        ]
      }
    };
  },
  computed: {
    selectedSteps() {
      return this.steps[this.selectedSeverity] || [];
    },
    selectedSeverityLabel() {
      if (this.selectedSeverity === 'mild') return 'Mild Symptoms';
      if (this.selectedSeverity === 'moderate') return 'Moderate Symptoms';
      if (this.selectedSeverity === 'severe') return 'Severe Symptoms';
      return '';
    }
  },
  methods: {
    selectSeverity(severity) {
      this.selectedSeverity = severity;
    }
  }
};
</script>

<style scoped>
.support-app {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  background: url('@/assets/background_image.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 50px 20px;
  background: #dceeff;
  border-radius: 12px;
  margin-bottom: 30px;
}
.hero h1 {
  font-size: 2rem;
  font-weight: bold;
}
.hero p {
  font-size: 1.1rem;
  color: #333;
  margin-top: 10px;
}

.section_heading h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 30px;
}
.solution_cards_box {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.solution_card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: left;
  width: 300px;
  transition: 0.3s;
  cursor: pointer;
}
.solution_card:hover {
  transform: translateY(-5px);
}
.read_more_btn {
  background: #42c3ca;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  margin-top: 10px;
  font-weight: bold;
  cursor: pointer;
}
.read_more_btn:hover {
  background: #007bff;
}

.timeline-section {
  margin-top: 60px;
  text-align: center;
}
.timeline-section h2 {
  margin-bottom: 40px;
}

.timeline {
  position: relative;
  padding: 40px 0;
}
.horizontal-line {
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 4px;
  background-color: #007bff;
  z-index: 1;
}
.timeline-item {
  position: relative;
  width: 18%;
  display: inline-block;
  vertical-align: top;
  margin: 0 1%;
}
.timeline-item.top {
  transform: translateY(-120%);
}
.timeline-item.bottom {
  transform: translateY(30%);
}
.timeline-card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  z-index: 2;
}
.timeline-card h3 {
  font-size: 1rem;
  color: #003366;
}
.timeline-card p {
  font-size: 0.9rem;
  color: #555;
}
.circle {
  width: 16px;
  height: 16px;
  background: #007bff;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
  z-index: 3;
}

.footer {
  text-align: center;
  margin-top: 60px;
  color: #666;
  font-size: 0.9rem;
}
</style>
