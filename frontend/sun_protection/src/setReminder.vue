<template>
  <div class="reminder-widget">
    <!-- Header with Minimize Button -->
    <div class="reminder-header">
      <h1>Set a Reminder</h1>
      <button class="minimize-btn" @click="toggleMinimize">
        {{ isMinimized ? '🔼' : '🔽' }}
      </button>
    </div>

    <!-- Reminder content (hidden when minimized) -->
    <div v-if="!isMinimized">
      <div class="reminder-input">
        <input v-model="reminder" placeholder="Enter reminder name..." />
        <input v-model.number="hours" type="number" placeholder="Hours" min="0" />
        <input v-model.number="minutes" type="number" placeholder="Minutes" min="0" />
      </div>

      <!-- Buttons placed in the same row -->
      <div class="button-group">
        <button class="add-btn" @click="addReminder">Add Reminder</button>
        <button class="clear-btn" @click="clearReminders">Clear All</button>
      </div>

      <ul class="reminder-list">
        <li v-for="(item, index) in reminders" :key="index" class="reminder-item">
          {{ item.text }} ({{ item.hours }}h {{ item.minutes }}m)
          <button class="clear-btn" @click="removeReminder(index)">Clear</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Reactive variables
const reminder = ref('');
const reminders = reactive([]);
const hours = ref(null);
const minutes = ref(null);
const isMinimized = ref(false); // Track if the widget is minimized

// Function to add a reminder
const addReminder = () => {
  if (reminder.value.trim() && (hours.value > 0 || minutes.value > 0)) {
    let newReminder = {
      text: reminder.value,
      hours: hours.value,
      minutes: minutes.value,
    };

    // Add the new reminder to the list
    reminders.push(newReminder);

    // Set up an alert notification when time is up
    setTimeout(() => {
      alert(`Reminder: ${newReminder.text}, Time to re-apply sunscreen!`);
      removeReminder(reminders.indexOf(newReminder));
    }, (hours.value * 60 + minutes.value) * 60 * 1000);

    // Clear input fields
    reminder.value = '';
    hours.value = null;
    minutes.value = null;
  } else {
    alert('Please enter a reminder and set a valid time!');
  }
};

// Function to clear all reminders
const clearReminders = () => {
  reminders.length = 0;
};

// Function to remove a specific reminder
const removeReminder = (index) => {
  reminders.splice(index, 1);
};

// Toggle minimize state
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};
</script>

<style>
/* Keep the reminder box fixed in the bottom right corner */
.reminder-widget {
  position: fixed;
  bottom: 10px;
  right: 20px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  transition: height 0.3s ease-in-out;
}

/* Header section with minimize button */
.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1{
  font-size: 20px;
}

/* Minimize button */
.minimize-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* Remove black borders from input fields */
.reminder-input input {
  padding: 8px;
  width: 100%;
  border: 1px solid #ddd; /* Light gray border */
  border-radius: 5px;
  outline: none;
}

/* Arrange buttons in a single row */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* Style buttons with blue and red colors */
button {
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

/* Add Reminder button (blue) */
.add-btn {
  background-color: #007bff;
  color: white;
}

/* Clear buttons (red) */
.clear-btn {
  background-color: #ff4d4d;
  color: white;
}

/* Button hover effect */
button:hover {
  opacity: 0.8;
}

/* Style the reminder list */
.reminder-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.reminder-item {
  background: #f9f9f9;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
