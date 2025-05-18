<template>
  <div class="infographic-page">
    <!-- HERO -->
    <section class="hero fade">
      <h1>Understanding the Risk of Cyberbullying in Australian Youth</h1>
      <p>
        Cyberbullying is one of the leading concerns for parents across Australia. This page combines research, facts, and real data to highlight the risks and encourage informed action.
      </p>
    </section>


  <section class="slider-section">
  <SlidingStats />
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

    <!-- What Parents Can Do -->
    <section class="section_our_solution">
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 text-center">
      <h2 class="section_heading">
        Empower Your Child's Online Journey: <br> Here's How We Help Parents Take Action
      </h2>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="our_solution_category">
        <div class="solution_cards_box">

          <div class="solution_card" @click="goTo('/safety-simulations')">
            <div class="hover_color_bubble"></div>
            <div class="solu_title">
              <h3>Practice Digital Scenarios</h3>
            </div>
            <div class="solu_description">
              <p>Use real-case simulators to understand risks and guide your child effectively.</p>
              <button type="button" class="read_more_btn">Learn More</button>
            </div>
          </div>

          <div class="solution_card" @click="goTo('/faq')">
            <div class="hover_color_bubble"></div>
            <div class="solu_title">
              <h3>Access FAQs and Experiences</h3>
            </div>
            <div class="solu_description">
              <p>Explore FAQs, expert advice, and stories from parents facing similar challenges.</p>
              <button type="button" class="read_more_btn">Learn More</button>
            </div>
          </div>

          <div class="solution_card" @click="goTo('/message')">
            <div class="hover_color_bubble"></div>
            <div class="solu_title">
              <h3>Use Helpful Digital Tools</h3>
            </div>
            <div class="solu_description">
              <p>Scan messages, check links, and simplify privacy terms easily to stay safer.</p>
              <button type="button" class="read_more_btn">Learn More</button>
            </div>
          </div>

          <div class="solution_card" @click="goTo('/support')">
            <div class="hover_color_bubble"></div>
            <div class="solu_title">
              <h3>Get Step-by-Step Support</h3>
            </div>
            <div class="solu_description">
              <p>Follow clear, supportive actions when your child faces online challenges.</p>
              <button type="button" class="read_more_btn">Learn More</button>
            </div>
          </div>

          <div class="solution_card" @click="goTo('/symptom')">
            <div class="hover_color_bubble"></div>
            <div class="solu_title">
              <h3>Recognize Signs of Trouble</h3>
            </div>
            <div class="solu_description">
              <p>Learn to detect emotional distress early and open important conversations.</p>
              <button type="button" class="read_more_btn">Learn More</button>
            </div>
          </div>

        </div>
      </div>
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
import SlidingStats from '@/components/SlidingStats.vue';

export default {
  name: 'InfographicPage',
  components: {
    AwarenessChart,
    SlidingStats
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    }
  }
};
</script>


<style scoped>
.infographic-page {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  margin: 0;
  line-height: 1.6;
  overflow-x: hidden;
  background: url('@/assets/background_image.png') no-repeat center center fixed;
  background-size: cover;
}

.hero {
  background-image: url('@/assets/Cyberbullying.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 15px;
  text-align: center;
  position: relative;
  min-height: 300px;
  margin-bottom: 30px; 
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
.hero-fadeout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(230, 247, 255, 1));
  z-index: 2;
  pointer-events: none;
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
.slider-section {
  width: 70vw;
  margin: 0 auto;
  overflow: hidden;
  background:rgb(76, 80, 84);
  padding: 10px 0;
  display: flex;
  justify-content: center;
  z-index: 5;
  position: relative;
}

.parent-help-section {
  background: #e6f0ff;
  padding: 40px 20px;
  border-radius: 12px;
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
  flex: 0 0 calc(30% - 20px); /* Smaller width - 3 in one row */
  min-height: 220px;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
}

.solution_card:nth-child(4),
.solution_card:nth-child(5) {
  flex: 0 0 calc(45% - 20px); /* 2 cards slightly wider in next row */
}

@media (max-width: 768px) {
  .solution_card {
    flex: 0 0 90%; /* Stack nicely on mobile */
  }
}

.solution_card:hover {
  background:rgb(123, 170, 220);
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

.section_heading {
  font-size: 1.8rem;
  font-weight: 700;
  color: #003366;
  margin-bottom: 50px;
  line-height: 1.4;
}


@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.tooltip {
  position: absolute;
  display: none;
  background: #ffffff;
  padding: 10px 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  pointer-events: none;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  color: #222;
  z-index: 10000;
  transition: all 0.2s ease;
}

.tooltip strong {
  color: #007bff;
}
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0L4.5.75 7.25 3.5H0v1h7.25L4.5 7.25 5.25 8l4-4-4-4z' transform='scale(-1, 1) translate(-8, 0)'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  width: 2rem;
  height: 2rem;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M0 0v8l4-4-4-4z'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  width: 2rem;
  height: 2rem;
}

</style>
