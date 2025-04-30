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
            <button type="button" class="read_more_btn" @click.stop="selectSeverity('mild')">View Steps</button>
          </div>
        </div>

        <div class="solution_card" @click="selectSeverity('moderate')">
          <div class="hover_color_bubble"></div>
          <div class="solu_title"><h3>Moderate Symptoms</h3></div>
          <div class="solu_description">
            <p>Ongoing teasing, sadness, or withdrawal. Learn deeper intervention strategies.</p>
            <button type="button" class="read_more_btn" @click.stop="selectSeverity('moderate')">View Steps</button>
          </div>
        </div>

        <div class="solution_card" @click="selectSeverity('severe')">
          <div class="hover_color_bubble"></div>
          <div class="solu_title"><h3>Severe Symptoms</h3></div>
          <div class="solu_description">
            <p>Serious threats, fear, or mental health concerns. Urgent support action plan.</p>
            <button type="button" class="read_more_btn" @click.stop="selectSeverity('severe')">View Steps</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Steps -->
    <section class="timeline-section" v-if="selectedSteps.length > 0" ref="timelineSection">
      <div class="back-to-top-container">
        <button class="back-to-top-btn" @click="scrollToTop">
          <i class="fas fa-arrow-up"></i> Back to Top
        </button>
      </div>
      <h2>Recovery Steps for {{ selectedSeverityLabel }}</h2>
      <ul class="timeline">
        <li
          v-for="(step, index) in selectedSteps"
          :key="index"
          :class="{ 'timeline-inverted': index % 2 !== 0 }"
        >
          <div class="timeline-image">
            <div class="step-number">Step {{ index + 1 }}</div>
          </div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <h4>{{ step.title }}</h4>
              <p>{{ step.desc }}</p>
            </div>
          </div>
          <div class="line"></div>
        </li>
      </ul>
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
      mildDetails: [
        {
          title: 'Open Communication',
          desc: 'Engage in a non-judgmental conversation with your child about their online experiences. Reassure them of your support and understanding. Ask open-ended questions like "How did that make you feel?" and affirm their courage to talk about it.'
        },
        {
          title: 'Review Privacy Settings',
          desc: 'Guide your child through privacy settings on each platform. Set profiles to private, disable friend suggestions, restrict tagging permissions, and review who can comment or message. Visit safety centers of platforms like Instagram, TikTok, and YouTube for step-by-step tools.'
        },
        {
          title: 'Promote Positive Online Behavior',
          desc: 'Discuss online kindness and the ripple effect of digital behavior. Help them follow role models or educational pages. Use games or resources from eSafety to teach them how to stand up for others or safely respond to negativity.'
        },
        {
          title: 'Monitor Emotional Well-being',
          desc: 'Observe your child\'s sleep, appetite, or withdrawal from favorite activities. Keep daily conversations light and supportive. If emotional dips last more than two weeks, consult a GP or youth counselor such as through headspace.org.au.'
        },
        {
          title: 'Understand Reporting Options',
          desc: 'While not urgent, explore how to report users or block content on each platform. Visit esafety.gov.au/report to learn about what content can be formally reported in Australia. Store this as a "digital first-aid kit" for later use if needed.'
        }
      ],
      moderateDetails: [
        {
          title: 'Provide Emotional Support',
          desc: 'Let your child know you believe them. Avoid reacting in anger instead, validate their experience. Encourage healthy expression like journaling, art, or light physical activity. If anxiety or withdrawal continues, reach out to headspace (headspace.org.au), ReachOut, or speak to your GP for a mental health treatment plan.'
        },
        {
          title: 'Document Evidence',
          desc: 'Take clear screenshots of the abusive messages or harmful content. Record usernames, platform names, timestamps, and any visible threats or recurring patterns. Store these in a secure folder on your device and back it up to cloud or USB. If needed, use tools like Print to PDF or third-party screenshot tools to save from apps that block screen captures.'
        },
        {
          title: 'Report to Platforms',
          desc: 'Use the built-in "Report" feature in apps like Instagram, Snapchat, TikTok, and Discord. After submission, platforms typically issue a case reference — save this. If no action is taken within 24–48 hours, proceed to escalate to the eSafety Commissioner. You can also mute, block or restrict accounts using each platform\'s safety settings.'
        },
        {
          title: 'Engage Authorities',
          desc: 'Contact your child\'s class teacher, school wellbeing officer, or principal. Request a confidential meeting. Schools are required to take reports of bullying seriously and may involve behavior monitoring, mediation, or escalation. Follow up with written documentation and keep a log of who you speak to and when.'
        },
        {
          title: 'Escalate to eSafety',
          desc: 'If no resolution from the platform occurs in 48 hours, go to esafety.gov.au/report and submit all the documented material. Include screenshots, platform response (if any), and a description of the abuse. eSafety can demand content takedown or further investigate — especially when minors are involved.'
        }
      ],
      severeDetails: [
        {
          title: 'Seek Professional Help',
          desc: 'Severe distress requires urgent professional support. Contact your local GP, school counselor, or a clinical psychologist. For free 24/7 support, call Kids Helpline (1800 55 1800) or Lifeline. Services like Beyond Blue (1300 22 4636) and Headspace also offer telehealth and live chat options for teens.'
        },
        {
          title: 'Immediate Safety Measures',
          desc: 'If your child shows signs of severe distress, threats of self-harm, or expresses fear, ensure they\'re physically safe. Stay close, remove online access temporarily, and supervise their digital environment. Involve a trusted adult or family member to support you. For urgent mental health response, call Lifeline (13 11 14).' 
        },
        {
          title: 'Preserve Evidence',
          desc: 'Keep all offensive or threatening content. Don\'t delete messages or accounts. Screenshot texts, capture usernames, and save links. Use a dedicated folder and back up externally. If it involves threats, harassment, or non-consensual images, preserve as-is for law enforcement or eSafety case reporting.'
        },
        {
          title: 'Report to Authorities',
          desc: 'If the content involves threats of violence, sexual harm, or stalking, call 000 immediately. For non-emergency cases, report to your local police station and bring printed evidence. You can also file cyberbullying complaints at esafety.gov.au/report. Police may guide you on additional protection (e.g. AVO).' 
        },
        {
          title: 'Emergency Reporting',
          desc: 'If safety is at risk, call emergency services (000). Then report to the eSafety Commissioner. Provide evidence and your child\'s age to fast-track review. Involve a lawyer if legal protection (e.g. restraining order) may be required. For legal advice, contact Youth Law Australia or Legal Aid in your state.'
        }
      ]
    };
  },
  computed: {
    selectedSteps() {
      if (this.selectedSeverity === 'mild') return this.mildDetails;
      if (this.selectedSeverity === 'moderate') return this.moderateDetails;
      if (this.selectedSeverity === 'severe') return this.severeDetails;
      return [];
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
      this.$nextTick(() => {
        // Scroll to just below the header
        const headerHeight = this.$refs.heroSection?.offsetHeight || 200;
        window.scrollTo({
          top: headerHeight,
          behavior: 'smooth'
        });
      });
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-to-top-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.back-to-top-btn i {
  font-size: 14px;
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
</style>