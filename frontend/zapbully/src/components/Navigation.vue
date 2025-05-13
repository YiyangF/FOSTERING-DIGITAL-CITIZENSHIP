<script setup lang="ts">
import {ref} from 'vue'
const showDropdown = ref(false);
const mobileMenu = ref(false);
// const closeMobileMenu = () => {
//   mobileMenu.value = false;
//   showDropdown.value = false;
// }; ç

</script>

<template>
  <header class="nav-wrapper">
    <div class="logo-box">
      <!-- <img src="@/assets/logo.png" alt="zapbully-Logo" class="logo-img" /> -->
      <router-link to="/" exact-active-class="active-link">
      <img src="@/assets/logo.png" alt="zapbully-Logo" class="logo-img" />
      </router-link>
    </div>
    <button class="mobileMenu-button" @click="mobileMenu= !mobileMenu">
      ☰
    </button>
  <nav :class="['custom-nav',{'mobileMenu':!mobileMenu}]">
      <router-link to="/" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Home</router-link>
      <router-link to="/data-insights" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Data Insights</router-link>
      <router-link to="/safety-simulations" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Safety Simulations</router-link>
    <div class="dropdown-wrapper" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
      <router-link to="/support" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Parental Support</router-link>
      <ul v-show ="showDropdown" class ="dropdown-menu">
        <li><router-link to="/faq" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">FAQ</router-link></li>
        <li><router-link to="/symptom" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Symptom Checker</router-link></li>
        <li><router-link to="/support" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Guide</router-link></li>
        <li><router-link to="/emoji" @click="mobileMenu = false" exact-active-class="active-link" class="nav-item-link">Emoji</router-link></li>
      </ul>
    </div>
  </nav>
</header>

</template>

<style scoped>
.nav-wrapper {
  /* float: right; */
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 16px 40px;
  background: transparent;
  flex-wrap: wrap;
  margin: 0 auto;
  /* border-bottom: 1px solid #eee; */
}

.logo-box {
/* margin-right: 100px; */
  /* flex: 0 0 auto; */
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  width: 100px;
  object-fit: contain;
}

.custom-nav {
  display: flex;
  gap: 40px;
  font-size: 16px;
  font-weight: 600;
}

.mobileMenu-button{
  display:none
}
.nav-item-link {
  position: relative;
  color: #070000;
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

/* dropdown menu setting  */
.dropdown-wrapper{
  position: relative;
  display: inline;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  background-color: #e8bb73;
  padding: 0;
  margin: 0;
  display: none;
  min-width: 160px;
  z-index: 100;
}

.dropdown-link {
  display: block;
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
}

.dropdown-link:hover {
  background-color: rgb(241, 235, 235)}

.dropdown-wrapper:hover .dropdown-menu {
  display: block;
}

/* mobile button */
@media (max-width: 768px) {
  .mobileMenu-button {
    display: block;
    background: transparent;
  }

  .custom-nav {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: #333;
  }

  .custom-nav.mobileMenu{
    display: flex;
  }

  .nav-item-link {
    padding: 1rem;
    border-top: 1px solid #555;
  }

  .dropdown-menu {
    background-color: #444;
  }
}

</style>


