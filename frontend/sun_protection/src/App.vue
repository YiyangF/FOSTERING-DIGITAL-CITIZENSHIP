<script setup>
import Navigation from './components/Navigation.vue';
</script>

<template>
  <div class="main-container">
    <header>
      <Navigation/>

    </header>

    <main class="main-box">
      <router-view></router-view>
    </main>


    <footer class="footer">
      <div class="footer-container">
        <p>© {{ new Date().getFullYear() }} Help parents understand online risks access utilities and improve digital literacy</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* header {
  line-height: 1.5;
}

.mian-container {
  position: relative;
  z-index: 1;
  overflow: hidden;
}


.main-container::before::before {
  content: "";
  position: absolute;
  top: -300px;
  left: -300px;
  width: 1000px;
  height: 1000px;
  background-color: #fdec7f;
  border-radius: 50%;
  z-index: -1;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 30px;
}

.footer-container {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}

.footer-links {
  margin-top: 10px;
}

.footer-links a {
  color: #007bff;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  text-decoration: underline;
}

</style>


