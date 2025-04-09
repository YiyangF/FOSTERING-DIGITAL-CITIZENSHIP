<template>
    <div class="infographic-page">
      <!-- HERO -->
      <section class="hero fade">
        <h1>Understanding the Risk of Cyberbullying in Australian Youth</h1>
        <p>
          Cyberbullying is one of the leading concerns for parents across Australia. This page combines research, facts, and real data to highlight the risks and encourage informed action.
        </p>
      </section>
  
      <!-- RCH Poll Stat -->
      <section class="stat-highlight red fade card">
        <div class="text-content">
          <h2>53%</h2>
          <p>of parents see <strong>cyberbullying</strong> as a top health concern for children.</p>
          <small>— RCH National Child Health Poll, 2021</small>
          <!-- <a href="https://www.rchpoll.org.au/wp-content/uploads/2021/03/NCHP20-Poll-report-A4_FA.pdf" target="_blank">View Full Report →</a> -->
        </div>
        <img src="@/assets/worried_parent.jpeg" alt="Worried Parent Illustration" class="section-img" />
      </section>
  
      <!-- eSafety Stat -->
      <section class="stat-highlight blue fade card">
        <div class="text-content">
          <h2>44%</h2>
          <p>of Australian teens had a <strong>negative online experience</strong> within 6 months.</p>
          <small>— eSafety Commissioner, 2020</small>
        </div>
        <img src="@/assets/online_negative.jpg" alt="Negative Online Experience" class="section-img" />
      </section>
  
      <!-- Instagram Bullying Stat -->
      <section class="stat-highlight purple fade card">
        <div class="text-content">
          <h2>42%</h2>
          <p>of teens report being <strong>bullied on Instagram</strong> — the most of any platform.</p>
          <small>— ACCC Family Zone Submission, 2023</small>
          <!-- <a href="https://www.accc.gov.au/system/files/DPB%20-%20DPSI%20-%20September%202023%20report%20-%20Submission%20-%20Family%20Zone%20-%20Public.pdf" target="_blank">Read Full Report →</a> -->
        </div>
        <img src="@/assets/instagram_logo.jpeg" alt="Instagram Logo" class="section-img" />
      </section>
  
      <!-- Transition to Victoria -->
      <section class="transition fade">
        <h2>Zooming In: A Closer Look at Victoria</h2>
        <p>
          While national statistics highlight the growing concern around cyberbullying, it's equally important to explore how these trends manifest at the state level. Victoria, like many parts of Australia, has seen a concerning rise in digital abuse among youth. The data below, sourced from the Victorian Child and Adolescent Monitoring System (VCAMS), offers valuable insights into regional mental health impacts.
        </p>
      </section>
  
      <!-- Chart Section -->
      <section class="charts fade">
        <AwarenessChart />
      </section>
  
      <!-- Suicide Stat -->
      <section class="stat-highlight dark fade card">
        <div class="text-content">
          <h2>3 Suicides Per Week</h2>
          <p>Cyberbullying is the cause of at least <strong>three youth suicides</strong> per week in Australia.</p>
          <p>It is the <strong>leading cause of death</strong> for youth aged 5–17.</p>
          <small>— ACCC, Rod Harris Submission (2019)</small>
          <!-- <a href="https://www.accc.gov.au/system/files/Rod%20Harris%20%28February%202019%29.PDF" target="_blank">Read Full Report →</a> -->
        </div>
      </section>
  
      <!-- What Parents Can Do -->
      <!-- Actionable Resource Cards for Parents -->
  <section class="parent-help-section fade">
    <h2>What Can Parents Do?</h2>
  
    <div class="resource-cards">
  
      <div class="card" @click="$router.push('/safety-simulations')">
        <h3>Practice Digital Scenarios</h3>
        <p>Use real-case simulators to make choices and see consequences. Learn how to guide your child effectively.</p>
      </div>
        
      <div class="card" @click="goTo('/resources')">
        <h3>Access FAQs and Other Parents Experiences</h3>
        <p>Browse curated FAQs, expert advice, and articles covering everything from cyberbullying to online education.</p>
      </div>
  
      <div class="card" @click="goTo('/tools')">
        <h3>Use Helpful Digital Tools</h3>
        <p>Try our tone checker, harmful link scanner, and terms simplifier to help your child stay safe online.</p>
      </div>
  
      <div class="card" @click="goTo('/support-guide')">
        <h3>Get Step-by-Step Support</h3>
        <p>If your child is being cyberbullied, follow our guided help path to take action, offer support, and report abuse.</p>
      </div>
  
      <div class="card" @click="goTo('/signs-of-distress')">
        <h3>Recognize Signs of Trouble</h3>
        <p>Learn the subtle cues and behaviors that may indicate your child is struggling online, and what to do next.</p>
      </div>
    </div>
  </section>
  
  
      <footer class="footer">
        <p>This page was developed as part of a digital citizenship initiative to raise awareness on cyberbullying and youth wellbeing in Australia.</p>
      </footer>
    </div>
  </template>
  
  <script>
  import AwarenessChart from '@/components/AwarenessChart.vue';
  
  export default {
    name: 'InfographicPage',
    components: {
      AwarenessChart
    }
  };
  </script>
  
  <style scoped>
  .infographic-page {
    font-family: 'Segoe UI', sans-serif;
    padding: 20px;
    max-width: 1000px;
    margin: auto;
    line-height: 1.6;
  }
  .hero {
    background-image: url('@/assets/Cyberbullying.jpg');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 80px 20px;
    text-align: center;
    position: relative;
    min-height: 300px;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  .hero h1, .hero p {
    position: relative;
    z-index: 2;
    text-shadow: 1px 1px 3px black;
  }
  .stat-highlight {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
    transition: all 0.5s ease-in-out;
    background: #fef2f2;
    border-left: 6px solid #e02424;
  }
  .stat-highlight img.section-img {
    width: 120px;
    height: auto;
  }
  .stat-highlight .text-content {
    flex: 1;
    text-align: left;
  }
  .stat-highlight.blue {
    background: #e6f2ff;
    border-left-color: #4c9aff;
  }
  .stat-highlight.dark {
    background: #fbeae9;
    border-left-color: #cc2f2f;
  }
  .stat-highlight.purple {
    background: #f3eaff;
    border-left-color: #8a4de8;
  }
  .stat-highlight h2 {
    font-size: 3rem;
    margin: 0;
  }
  .stat-highlight p {
    font-size: 1.1rem;
    margin: 10px 0;
  }
  .stat-highlight a {
    display: block;
    margin-top: 8px;
    color: #0066cc;
    font-weight: bold;
  }
  .stat-highlight small {
    display: block;
    color: #555;
    font-size: 0.85rem;
    margin-top: 5px;
  }
  .awareness-text {
    background: #fff8dc;
    border-left: 5px solid #ff4c4c;
    padding: 20px;
    margin-top: 40px;
    transition: all 0.5s ease-in-out;
  }
  .awareness-text ul {
    padding-left: 20px;
    margin-top: 10px;
  }
  .awareness-text ul li {
    margin-bottom: 6px;
  }
  .awareness-text a {
    color: #0077cc;
    font-weight: bold;
  }
  .transition {
    background-color: #f0f8ff;
    border-left: 5px solid #4c9aff;
    padding: 20px;
    margin: 40px 0 20px;
    border-radius: 6px;
    animation: fadeIn 1s ease forwards;
  }
  .transition h2 {
    margin-top: 0;
    font-size: 1.6rem;
  }
  .footer {
    text-align: center;
    font-size: 0.9rem;
    margin-top: 60px;
    color: #666;
    transition: opacity 0.5s ease-in-out;
  }
  .fade {
    opacity: 0;
    animation: fadeIn 1s ease forwards;
  }
  .parent-help-section {
    background: #fff8dc;
    border-left: 5px solid #ff4c4c;
    padding: 20px;
    margin-top: 40px;
  }
  
  .resource-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    background: white;
    border-left: 5px solid #4c9aff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .card h3 {
    margin-top: 0;
    color: #1e3a8a;
  }
  
  .card p {
    margin-top: 8px;
    color: #333;
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  </style>