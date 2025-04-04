<template>
    <div class="container">
      <div class="header">
        <h1>Get UV Index</h1>
        <div class="search-bar">
          <input type="text" v-model="city" placeholder="Enter city name" class="search-input"/>
          <button @click="searchByCity" class="search-button">Search</button>
        </div>
      </div>
      
      <main>
        <div v-if="uvIndex !== null"> 
          <h2>
            {{ locationName }}
          </h2>
          <p>UV Index: {{ uvIndex }}</p>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "UVIndex",
    data() {
      return {
        city: "",
        locationName: "",
        uvIndex: null,
        locationData: [
          { city: "Melbourne", lat: -37.8136, lon: 144.9631 },
          { city: "Sydney", lat: -33.8688, lon: 151.2093 },
          { city: "Brisbane", lat: -27.4698, lon: 153.0251 },
          { city: "Perth", lat: -31.9505, lon: 115.8605 }
        ]
      };
    },
    methods: {
      async getUVIndex(lat, lon) {
        const apiKey = "openuv-g7rm828lpnj-io"; // Replace with your actual API Key
        const url = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`;
        try {
          const response = await axios.get(url, {
            headers: {
              "x-access-token": apiKey
            }
          });
          return response.data.result.uv;
        } catch (error) {
          console.error("Error fetching UV index:", error);
          return null;
        }
      },
      async searchByCity() {
        if (!this.city) return;
        const location = this.locationData.find(loc => loc.city.toLowerCase() === this.city.toLowerCase());
        if (location) {
          this.uvIndex = await this.getUVIndex(location.lat, location.lon);
          this.locationName = location.city;
        } else {
          console.error("City not found in local database");
        }
        this.city = "";
      }
    }
  };
  </script>  