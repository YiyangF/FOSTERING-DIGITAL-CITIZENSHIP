<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Your Selections</h1>
      
      <div v-if="selectedItems.length > 0" class="card">
        <div class="card-body">
          <h5 class="card-title">You selected {{ selectedItems.length }} items:</h5>
          <ul class="list-group mt-3">
            <li v-for="(item, index) in selectedItems" :key="index" class="list-group-item">
              {{ item.text }} (Column: {{ item.column + 1 }}, Row: {{ item.row + 1 }})
            </li>
          </ul>
        </div>
      </div>
      
      <div v-else class="alert alert-warning">
        No selections found. Please go back and make your selections.
      </div>
      
      <div class="d-flex justify-content-center mt-4">
        <button class="btn btn-secondary" @click="goBack">
          Back to Selection
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedItems: []
      };
    },
    created() {
      // Load selections from sessionStorage
      const savedSelections = sessionStorage.getItem('finalSelections');
      if (savedSelections) {
        this.selectedItems = JSON.parse(savedSelections);
      }
      
      // Mark that we're on the result page
      sessionStorage.setItem('navigatedToResult', 'true');
    },
    methods: {
      goBack() {
        // Navigate back to symptom page instead of home page
        if (this.$router) {
          this.$router.push('/symptom');
        } else {
          // Fallback for non-router setup
          window.location.href = '/symptom';
        }
      }
    }
  };
  </script>