<template>
  <div class="main-container" :class="{ 'story-selected': selectedStory }">
    <header v-if="!selectedStory">
      <h1>
        <span style="font-size: 32px; font-weight: bold; color: #f57c00;">Step Into Their Shoes</span><br />
        <span style="font-size: 18px; font-weight: normal; color: #555;">
          Experience real-life interactive digital scenarios. Learn how to guide your kids through online challenges such as harassment and cyberbullying.
        </span><br />
        <span style="font-size: 18px; font-weight: bold; color: #f57c00;">Please select one story to start. Make choices, and see the consequences.</span>
      </h1>
    </header>

    <MDBRow :cols="['1', 'md-3']" class="g-4">
      <MDBCol v-for="story in stories" :key="story.id">
        <MDBCard class="h-100" @click="selectStory(story.id)" style="cursor: pointer;">
          <MDBCardImg
            :src="story.image"
            top
            alt="Story image"
          />
          <MDBCardBody>
            <MDBCardTitle>{{ story.name }}</MDBCardTitle>
            <MDBCardText>{{ story.description }}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </div>
</template>

<script>
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImg
} from 'mdb-vue-ui-kit';

export default {
  components: {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImg
  },
  data() {
    return {
      stories: [
        {
          id: 1,
          name: "Harassing",
          description: "Learn how to respond to online harassment effectively.",
          image: "https://mdbootstrap.com/img/new/standard/city/041.webp"
        },
        {
          id: 2,
          name: "Cyberbullying",
          description: "Understand cyberbullying situations and healthy coping strategies.",
          image: "https://mdbootstrap.com/img/new/standard/city/042.webp"
        },
        {
          id: 3,
          name: "Catfishing",
          description: "Spot signs of online deception and identity misuse.",
          image: "https://mdbootstrap.com/img/new/standard/city/043.webp"
        },
        {
          id: 4,
          name: "Scams",
          description: "Learn how to identify and avoid online scams.",
          image: "https://mdbootstrap.com/img/new/standard/city/044.webp"
        },
        {
          id: 5,
          name: "Privacy Invasion",
          description: "Understand digital privacy and how to protect personal data.",
          image: "https://mdbootstrap.com/img/new/standard/city/045.webp"
        }
      ]
    };
  },
  methods: {
    selectStory(storyId) {
      this.$router.push({ name: 'Story', params: { storyId } });
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
