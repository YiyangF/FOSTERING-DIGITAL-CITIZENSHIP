<template>
  <div id="stats-carousel" class="carousel slide carousel-fade container" style="max-width: 90vw;" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-inner rounded overflow-hidden">
      <div
        v-for="(card, index) in statCards"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <img :src="card.image" class="d-block w-100 c-img" :alt="card.alt" />
        <div class="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
          <div class="p-4">
            <h2 class="display-4 fw-bold text-white mb-3">{{ card.percentage }}</h2>
            <p class="fs-5 text-white mb-2" v-html="card.text"></p>
            <small class="text-white">{{ card.source }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <!-- Controls -->
<button class="custom-carousel-btn left" type="button" data-bs-target="#stats-carousel" data-bs-slide="prev">
  ‹
</button>

<button class="custom-carousel-btn right" type="button" data-bs-target="#stats-carousel" data-bs-slide="next">
  ›
</button>


  </div>
</template>

<script>
export default {
  name: 'SlidingStats',
  data() {
    return {
      statCards: [
        {
          percentage: '53%',
          text: 'of parents see <strong>cyberbullying</strong> as a top health concern for children.',
          source: '— RCH National Child Health Poll, 2021',
          image: '/assets/worried_parent.jpg',
          alt: 'Worried parent representing cyberbullying concern'
        },
        {
          percentage: '44%',
          text: 'of Australian teens had a <strong>negative online experience</strong> within 6 months.',
          source: '— eSafety Commissioner, 2020',
          image: '/assets/online_negative.jpg',
          alt: 'Teen facing negative online experience'
        },
        {
          percentage: '42%',
          text: 'of teens report being <strong>bullied on Instagram</strong> — the most of any platform.',
          source: '— ACCC Family Zone Submission, 2023',
          image: '/assets/instagram_logo.jpg',
          alt: 'Instagram platform bullying issue'
        },
        {
          percentage: '3 Suicides Per Week',
          text: 'Cyberbullying is the cause of at least <strong>three youth suicides</strong> per week in Australia. It is the <strong>leading cause of death</strong> for youth aged 5–17.',
          source: '— ACCC, Rod Harris Submission (2019)',
          image: '/assets/suicide.jpg',
          alt: 'Impact of cyberbullying leading to suicides'
        }
      ]
    }
  }
}
</script>

<style scoped>
.carousel-inner {
  width: 100%;
  height: 480px;
}

.c-img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  filter: brightness(0.8) opacity(0.6);
}


.custom-arrow {
  font-size: 2.2rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: 50%;
}
.custom-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  border: none;
  font-size: 6rem;
  color: white;
  cursor: pointer;
  padding: 0 10px;
  transition: color 0.3s ease, transform 0.3s ease;
  user-select: none;
}

.custom-carousel-btn.left {
  left: 20px;
}

.custom-carousel-btn.right {
  right: 20px;
}

.custom-carousel-btn:hover {
  color: #42c3ca;
  transform: translateY(-50%) scale(1.1);
}

</style>
