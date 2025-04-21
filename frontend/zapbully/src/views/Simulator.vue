<template>
  <div class="main-container" :class="{ 'story-selected': selectedStory }">
    <header v-if="!selectedStory">
      <h1>
        <span style="font-size: 32px; font-weight: bold; color: #f57c00;">Explore Safety Simulations</span><br />
        <span style="font-size: 18px; font-weight: normal; color: #555;">
          Experience real-life interactive stories to better understand how to navigate and respond to digital risks.
        </span>
      </h1>
    </header>

    <div class="card-container">
      <div
        v-for="story in stories"
        :key="story.name"
        class="story-card"
        @click="selectStory(story.path)"
      >
        <h2>{{ story.name }}</h2>
        <p>{{ story.description }}</p>
      </div>
    </div>

    <div class="twine-container" v-if="selectedStory">
      <button @click="selectedStory = null" class="back-btn">← Back to stories</button>
      <iframe
        :src="selectedStory"
        width="100%"
        height="700px"
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
          path: "/story/story1/Harassing.html",
          description: "Learn how to respond to online harassment effectively."
        },
        {
          name: "Cyberbullying",
          path: "/story/story2/Maya.html",
          description: "Understand cyberbullying situations and healthy coping strategies."
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
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  transition: all 0.3s ease;
}

header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 40px;
}

header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.card-container {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  transition: all 0.3s ease;
}

.story-card {
  width: 300px;
  padding: 24px;
  border-radius: 20px;
  border: none;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.story-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.story-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.story-card p {
  font-size: 14px;
  color: #444;
  line-height: 1.4;
}


.twine-container {
  margin-top: 30px;
}

/* When story is selected, layout becomes two-column */
.story-selected {
  display: flex;
  flex-direction: row;
}

.story-selected .card-container {
  flex-direction: column;
  width: 280px;
  align-items: flex-start;
  justify-content: flex-start;
}

.story-selected .story-card {
  width: 240px;
  padding: 16px;
  font-size: 14px;
  box-shadow: none;
  border: 1px solid #bbb;
}

.story-selected .story-card h2 {
  font-size: 16px;
}

.story-selected .twine-container {
  flex-grow: 1;
  margin-left: 40px;
  margin-top: 0;
}

.back-btn {
  margin-bottom: 16px;
  padding: 8px 14px;
  background-color: #ffa726;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #fb8c00;
}
</style>
