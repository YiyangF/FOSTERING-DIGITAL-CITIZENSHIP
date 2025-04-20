<script setup lang="ts">
</script>

<template>
  <header class="nav-wrapper">
    <div class="logo-box">
      <!-- <img src="@/assets/logo.png" alt="zapbully-Logo" class="logo-img" /> -->
      <router-link to="/" exact-active-class="active-link">
      <img src="@/assets/logo.png" alt="zapbully-Logo" class="logo-img" />
      </router-link>
    </div>
  <nav class="custom-nav">
      <router-link to="/" exact-active-class="active-link" class="nav-item-link">Home</router-link>
      <router-link to="/data-insights" exact-active-class="active-link" class="nav-item-link">Data Insights</router-link>
      <router-link to="/safety-simulations" exact-active-class="active-link" class="nav-item-link">Safety Simulations</router-link>
      <router-link to="/parental-support" exact-active-class="active-link" class="nav-item-link">Parental Support</router-link>
      <router-link to="/symptom" exact-active-class="active-link" class="nav-item-link">Symptom Checker</router-link>
  </nav>
</header>
</template>

<style scoped>
.nav-wrapper {
  /* float: right; */
  display: flex;
  justify-content: space-between;
  width: 28000px;
  align-items: center;
  padding: 16px 40px;
  background-color: transparent;
  /* border-bottom: 1px solid #eee; */
}

.logo-box {
  margin-right: 100px;
  /* flex: 0 0 auto; */
  display: flex;
  align-items: center;
}

.logo-img {
  height: 45px;
  object-fit: contain;
}

.custom-nav {
  display: flex;
  gap: 40px;
  font-size: 16px;
  font-weight: 600;
}

.nav-item-link {
  position: relative;
  color: #000;
  text-decoration: none;
  padding-bottom: 5px;
  transition: all 0.2s ease-in-out;
}

.nav-item-link::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #f9a825;
  transition: width 0.3s ease-in-out;
}

.nav-item-link:hover::after,
.active-link::after {
  width: 100%;
}


</style>


