<template>
  <div class="tableau-container">
    <div class="header">
      <h1>📊 Data Visualization</h1>
    </div>
    <div class="description">
      <p>
        Looking at the data, a clear pattern emerges. In 2011, melanoma incidence was relatively lower, but as UV levels gradually increased over the following years, so did the number of cases.
      </p>
      <p>
        Between 2012 and 2018, the fluctuations in UV exposure closely align with the rise in melanoma cases. In 2018, when mean UV levels saw a slight drop, the steady increase in melanoma cases also slowed in 2019, suggesting a possible link between reduced UV exposure and a decline in incidence.
      </p>
    </div>
    <div class="viz-scroll-wrapper">
  <div class="viz-card">
    <div ref="tableauContainer" class="tableauPlaceholder">
      <p v-if="loading" class="loading">Loading Tableau visualization...</p>
    </div>
  </div>
</div>


    <div class="description">
      <h2>Stay Informed & Protected with Our Website</h2>
      <ul>
        <li>🌞 <strong>Live UV Index Tracking</strong>: Instantly check real-time UV levels for your location to plan outdoor activities safely.</li>
        <li>🛡️ <strong>Personalized Sun Protection</strong>: Get tailored recommendations based on your skin type and UV exposure, helping you build sun-safe habits.</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true, 
    };
  },
  mounted() {
    this.loadTableau();
  },
  methods: {
    loadTableau() {
      let divElement = this.$refs.tableauContainer;
      divElement.innerHTML = `
        <div class='tableauPlaceholder' id='viz1742471030838' style='position: relative'>
          <noscript>
            <img alt='Dashboard 1' src='https://public.tableau.com/static/images/Me/MelanomaCancerIncidenceCountandMeanUVperyear/Dashboard1/1_rss.png' style='border: none' />
          </noscript>
          <object class='tableauViz' style='display:none;'>
            <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
            <param name='embed_code_version' value='3' />
            <param name='site_root' value='' />
            <param name='name' value='MelanomaCancerIncidenceCountandMeanUVperyear/Dashboard1' />
            <param name='tabs' value='no' />
            <param name='toolbar' value='yes' />
            <param name='static_image' value='https://public.tableau.com/static/images/Me/MelanomaCancerIncidenceCountandMeanUVperyear/Dashboard1/1.png' />
            <param name='animate_transition' value='yes' />
            <param name='display_static_image' value='yes' />
            <param name='display_spinner' value='yes' />
            <param name='display_overlay' value='yes' />
            <param name='display_count' value='yes' />
            <param name='language' value='en-US' />
            <param name='filter' value='publish=yes' />
          </object>
        </div>
      `;
      
      let vizElement = divElement.getElementsByTagName("object")[0];
      if (divElement.offsetWidth > 800) {
        vizElement.style.width = "1900px";
        vizElement.style.height = "927px";
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = "1900px";
        vizElement.style.height = "927px";
      } else {
        vizElement.style.width = "100%";
        vizElement.style.height = "727px";
      }
      
      let scriptElement = document.createElement("script");
      scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.tableau-container {
  text-align: center;
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, #87CEFA, #f0f8ff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header h1 {
  font-size: 28px;
  color: #333;
}


.viz-scroll-wrapper {
  width: 100%;
  overflow-x: auto; 
  white-space: nowrap; 
}


.viz-card {
  display: inline-block; 
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease-in-out;
  min-width: 1200px; 
  height: auto;
  transform: scale(0.6);
  text-align: center;
}


.viz-card object {
  width: 100%;
  min-width: 1200px; 
  height: 90vh;
  max-width: none;
}


@media (max-width: 1200px) {
  .viz-card object {
    height: 80vh !important;
  }
}

@media (max-width: 768px) {
  .viz-card object {
    height: 70vh !important;
  }
}

.description {
  margin-top: 30px;
  text-align: left;
  max-width: 900px;
  font-size: 16px;
  line-height: 1.5;
}

.loading {
  font-size: 18px;
  color: #007bff;
}
</style>
