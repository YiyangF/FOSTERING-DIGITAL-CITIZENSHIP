<template>
  <div class="container">
    <!-- Title Section -->
    <div class="title-box">
      Protect the child's online world,<br />
      starting here
    </div>

    <!-- Main Content Section -->
    <div class="main-section">
      <!-- Left Box -->
      <div class="left-box">
        <!-- <img src="/star-badge.svg" alt="Badge" class="badge" /> -->
        <p class="test-text">How much do I know about my child's online safety?</p>
        <button class="test-button">start test</button>
        <!-- <div class="dropdown-box"></div> -->
      </div>

      <!-- Right Box -->
      <div class="right-box">
        <div class="svg-wrapper">
          <svg class="banner-svg" width="200" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 L30 30 L50 50 L70 30 L90 50" stroke="#f2b705" stroke-width="4"/>
            <circle cx="30" cy="30" r="3" fill="#f2b705"/>
            <circle cx="50" cy="50" r="3" fill="#f2b705"/>
            <circle cx="70" cy="30" r="3" fill="#f2b705"/>
          </svg>
        </div>

        <p class="info-text">
          Your love is your child's greatest protection in the digital world.<br />
          "Learn, explore, and empower yourself to guide them safely through the online world."
        </p>
        <p class="info-note">
          Help parents understand online risks, access utilities, and improve digital literacy
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChildOnlineProtection',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');
.container {
  min-height: 100vh;
  padding: 60px 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.title-box {
  border: 2px solid #ffffff;
  padding: 20px;
  align-items: flex-start;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: bold;
  color: #111827;
  line-height: 1.4;
  font-family: 'Nunito', sans-serif;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
  width: 100%;
}

@media (min-width: 768px) {
  .main-section {
    flex-direction: row;
  }
}

.left-box {
  background-color: #2563eb;
  color: white;
  padding: 24px;
  border-radius: 30px;
  width: 45%;
  position: relative;
  box-sizing: border-box;
}

.badge {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
}

.test-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.test-button {
  background-color: #f97316;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background-color 0.3s ease;
}

.test-button:hover {
  background-color: #fb923c;
}


.right-box {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 24px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

/* .right-box {
  display: flex;
  flex-direction: column;
  align-items: center;
} */
.svg-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
}

.banner-svg {
  margin: 0 auto 20px;
  display: block;
}

.info-text {
  color: #1f2937;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 12px;
}

.info-note {
  color: #ef4444;
  font-size: 14px;
}
</style>
