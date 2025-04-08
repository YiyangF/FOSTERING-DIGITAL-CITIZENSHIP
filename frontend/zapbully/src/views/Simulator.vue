<template>
    <div class="main-container">
      <header>
        <h1>Select a Story</h1>
      </header>
  
      <div class="card-container">
        <div
          v-for="story in stories"
          :key="story.name"
          class="story-card"
          @click="selectStory(story.path)"
        >
          <h3>{{ story.name }}</h3>
          <p>{{ story.description }}</p>
        </div>
      </div>
  
      <div class="twine-container" v-if="selectedStory">
        <iframe
          :src="selectedStory"
          width="100%"
          height="600px"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stories: [
          {
            name: "Harassing",
            path: "public/story/story1/Harassing.html",
            description: "A story about harassment."
          },
          {
            name: "Story2",
            path: "public/story/story2/CyberBully.html",
            description: "CyberBully."
          }
        ],
        selectedStory: null
      };
    },
    methods: {
      selectStory(path) {
        this.selectedStory = path;
      }
    }
  };
  </script>
  
  <style scoped>
  .main-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .card-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .story-card {
    width: 250px;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 12px;
    cursor: pointer;
    background-color: #f9f9f9;
    transition: box-shadow 0.3s ease;
  }
  
  .story-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .twine-container {
    margin-top: 30px;
  }
  </style>  