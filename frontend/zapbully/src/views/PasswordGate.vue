<template>
    <div class="password-background">
      <div class="password-gate">
        <h2>Enter Access Password</h2>
        <input v-model="inputPassword" type="password" placeholder="Enter password" />
        <button @click="submitPassword">Submit</button>
        <p v-if="error" class="text-danger">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const inputPassword = ref('')
  const error = ref('')
  const PASSWORD = 'TP31'
  
  const submitPassword = () => {
    if (inputPassword.value === PASSWORD) {
      sessionStorage.setItem('authenticated', 'true')
      router.push('/')
    } else {
      error.value = 'Incorrect password'
    }
  }
  </script>
  
  <style scoped>
  .password-background {
    background: url('@/assets/background_image.png') no-repeat center center fixed;
    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .password-gate {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  
  input {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007BFF;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .text-danger {
    color: red;
    margin-top: 10px;
  }
  </style>
  