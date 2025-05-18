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
        <MDBCard
          class="h-100 hover-overlay hover-shadow zoom-card"
          @click="selectStory(story.id)"
          style="cursor: pointer; overflow: hidden; position: relative;"
        >
          <MDBCardImg
            :src="story.image"
            top
            alt="Story image"
            class="card-img"
          />
          <div class="animated-mask"></div>
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
          name: "Someone's Pretending to Be Me Online",
          description: "Someone pretending to be your 14-year-old daughter Maya on Instagram and posting nasty stuff. How will you help her? (~6 mins)",
          image: "/story1.png"
        },
        {
          id: 2,
          name: "Something's Wrong with My Son",
          description: "You, as James's mother, have recently noticed that he resists going to school. How will you find out what happened and solve it? (~10 mins)",
          image: "/story2.png"
        },
        {
          id: 3,
          name: "Teasing and Exclusion",
          description: "Your son John is unhappy in the new school. What happened between him and his classmates? How will you solve it and help your son? (~7 mins)",
          image: "/story3.png"
        },
        {
          id: 4,
          name: "Stereotype",
          description: "You have a game-loving daughter, May. But recently, she has looked depressed when gaming. What happened? How will you bring the happy girl back? (~10 mins)",
          image: "/story4.png"
        },
        {
          id: 5,
          name: "LGBTQ+ Bullying",
          description: "As Michael's (15) father, you recently found his secret, which has trapped him in rumours. How will you guide your kid on the right track? (~9 mins)",
          image: "/story5.png"
        },
        {
          id: 6,
          name: "My Son, the Cyberbully",
          description: "As the father of Greg (16), you recently received a call from school about Greg's online behaviour. What happened online and how to educate kids' online behaviour? (~10 mins)",
          image: "/story6.png"
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
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  
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

.zoom-card {
  transition: transform 0.3s ease;
  color: black;
}

.zoom-card:hover {
  transform: scale(1.05);
  color: white;
}

.zoom-card:hover .animated-mask {
  opacity: 1;
}

.animated-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    45deg,
    rgba(29, 236, 197, 0.5),
    rgba(91, 14, 214, 0.5)
  );
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  z-index: 1;
}

.card-img {
  position: relative;
  z-index: 0;
}

.zoom-card .card-body {
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}

</style>
