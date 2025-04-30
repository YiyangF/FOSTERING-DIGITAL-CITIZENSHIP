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
    <button class="carousel-control-prev" type="button" data-bs-target="#stats-carousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#stats-carousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
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

.carousel-caption {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
}
</style>
