<template>
  <div class="bg">
    <div class="container">
      <h1>🧴 Sunscreen Usage Calculator</h1>
      <p class="subtitle">Get your personal sun protection suggestion here!</p>

      <!-- Gender Selection -->
      <div class="form-group">
        <label>Gender:</label>
        <select v-model="gender" class="form-control">
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      <div class="divider"></div>

      <!-- Exposed Skin Area Selection -->
      <div class="form-group">
        <label>Exposed Skin Areas:</label>
        <div class="checkbox-group">
          <label><input type="checkbox" v-model="exposedAreas" value="face"/> Face</label>
          <label><input type="checkbox" v-model="exposedAreas" value="body"/> Body</label>
        </div>
      </div>

      <div class="divider"></div>

      <!-- UV Level Selection -->
      <div class="form-group">
        <label>UV Level:</label>
        <select v-model="uvLevel" class="form-control">
          <option value="0-2">Low (0-2)</option>
          <option value="3-5">Moderate (3-5)</option>
          <option value="6-7">High (6-7)</option>
          <option value="8+">Very High (8+)</option>
        </select>
      </div>

      <div class="divider"></div>

      <!-- Skin Type Selection -->
      <div class="form-group">
        <label>Select Your Skin Type:</label>
        <div class="skin-types">
          <div
            v-for="(type, index) in skinTypes"
            :key="index"
            :class="['skin-box', { selected: selectedSkinType === type.name }]"
            @click="selectSkinType(type)"
          >
            <div class="color-circle" :style="{ background: type.color }"></div>
            <p>{{ type.name }}</p>
          </div>
        </div>
        <p v-if="!selectedSkinType" class="warning">Please select your skin type!</p>
      </div>

      <div class="divider"></div>

      <!-- Calculation Button -->
      <button class="btn-calculate" @click="calculateSunscreen">Calculate Sunscreen Usage</button>

      <div class="divider"></div>

      <!-- Results Display -->
      <div v-if="result">
        <h2>Sunscreen Usage</h2>
        <p v-if="result.face">Face: {{ result.face }} ml ({{ result.faceTeaspoons }} teaspoons)</p>
        <p v-if="result.body">Body: {{ result.body }} ml ({{ result.bodyTeaspoons }} teaspoons)</p>

        <div class="divider"></div>

        <h2>Sunscreen Recommendation</h2>
        <p>{{ result.advice }}</p>
      </div>
    </div>
  </div>
</template>

  
<script>
  import { ref, computed } from "vue";
  
  export default {
    setup() {
      const gender = ref("");
      const exposedAreas = ref([]);
      const uvLevel = ref("");
      const selectedSkinType = ref(null);
  
      // Skin type list
      const skinTypes = ref([
        { name: "Type I", color: "#FCE1C9", category: "pale skin" },
        { name: "Type II", color: "#F8D2A4", category: "pale skin" },
        { name: "Type III", color: "#E0A885", category: "darker white skin" },
        { name: "Type IV", color: "#B47A5F", category: "darker white skin" },
        { name: "Type V", color: "#7C4A35", category: "darker skin" },
        { name: "Type VI", color: "#4A2D21", category: "darker skin" },
      ]);
  
      const selectedCategory = computed(() => {
        const selected = skinTypes.value.find((type) => type.name === selectedSkinType.value);
        return selected ? selected.category : null;
      });
  
      const result = ref(null);
  
      const calculateSunscreen = () => {
        if (!selectedSkinType.value) {
      alert("*Please select your skin type first!");
      return;
    }
  

    let totalFace = 0, totalFaceTeaspoons = 0;
    let totalBody = 0, totalBodyTeaspoons = 0;
    let advice = "";
  
    let uvFactor = 1;
    if (uvLevel.value === "3-5") uvFactor = 1.1;
    if (uvLevel.value === "6-7") uvFactor = 1.2;
    if (uvLevel.value === "8+") uvFactor = 1.3;
  
    if (exposedAreas.value.includes("face")) {
      totalFace = 3.73 * uvFactor;
      totalFaceTeaspoons = 0.7 * uvFactor;
    }
  
    if (exposedAreas.value.includes("body")) {
      if (gender.value === "female") {
        totalBody = 34 * uvFactor;
        totalBodyTeaspoons = 7 * uvFactor;
      } else {
        totalBody = 38 * uvFactor;
        totalBodyTeaspoons = 8 * uvFactor;
      }
    }
  
    if (selectedCategory.value === "pale skin") {
     if (uvLevel.value === "0-2") {
       advice = "Use SPF 30-50.";
     } else {
       advice = "Use SPF 50 and avoid prolonged sun exposure.";
     }
   } else if (selectedCategory.value === "darker white skin") {
    if (uvLevel.value === "0-2") {
       advice = "Use SPF 15-30.";
     } if (uvLevel.value == "3-5") {
       advice = "Use SPF 30-50 and ware hat and sunglasses.";
     }
       else {
         advice = "Use SPF 50 and avoid prolonged sun exposure.";
       }
     }
    else if (selectedCategory.value === "darker skin") {
     if (uvLevel.value === "0-2") {
       advice = "Sunscreen is optional, but SPF 15 is recommended.";
     } else {
       advice = "Use SPF 30 if needed.";
     } if (uvLevel.value == "6-7"||uvLevel.value == "8+") {
       advice = "Use SPF 50 and avoid prolonged sun exposure.";
     }
   }


  
    result.value = {
      face: totalFace ? totalFace.toFixed(2) : null,
      faceTeaspoons: totalFaceTeaspoons ? totalFaceTeaspoons.toFixed(2) : null,
      body: totalBody ? totalBody.toFixed(2) : null,
      bodyTeaspoons: totalBodyTeaspoons ? totalBodyTeaspoons.toFixed(2) : null,
      advice,
    };
  };
  
      const selectSkinType = (type) => {
        selectedSkinType.value = type.name;
      };
  
      return {
        gender,
        exposedAreas,
        uvLevel,
        skinTypes,
        selectedSkinType,
        selectedCategory,
        result,
        calculateSunscreen,
        selectSkinType,
      };
    },
  };
</script>
  
<style scoped>
.bg {
  background: linear-gradient(to bottom, #87CEFA, #f0f8ff);
}

/*   body {
  background: linear-gradient(to bottom, #a8c0ff, #3f2b96);
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  } */

/* Container */
.container {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  text-align: center;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 10px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  appearance: auto;
}

.skin-types {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 10px;
}

/* Skin Box Styling */
.skin-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.skin-box.selected {
  border-color: #007bff;
}

/* Skin Type Color Circle */
.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-bottom: 5px;
}

/* Form Group Styling */
.form-group {
  text-align: left;
  margin-bottom: 20px;
}
.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

/* Error Message */
.warning {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

/* Button Styling */
.btn-calculate {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

.btn-calculate:hover {
  background-color: #0056b3;
}

/* Divider */
.divider {
  border-top: 1px solid #ddd;
  margin: 20px 0;
}
</style>
  
  
  