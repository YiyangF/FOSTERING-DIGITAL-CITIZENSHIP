<template>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-outline-primary" @click="prev">
          &lt;
        </button>
        <div class="d-flex justify-content-center flex-grow-1 overflow-hidden" style="gap: 1rem;">
          <div
            v-for="(column, index) in visibleColumns"
            :key="(startIndex + index - 1 + columns.length) % columns.length"
            class="border p-3 text-center rounded"
            :class="{
              'bg-light': index !== 1,
              'bg-white shadow': index === 1,
              'pointer-events-none opacity-50': index !== 1
            }"
            style="min-width: 150px;"
          >
            <div
              v-for="(item, i) in column"
              :key="i"
              class="mb-2"
            >
              <input
                type="checkbox"
                class="btn-check"
                :id="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
                :disabled="index !== 1 || (totalSelected >= 6 && !selections[(startIndex + index - 1 + columns.length) % columns.length][i])"
                v-model="selections[(startIndex + index - 1 + columns.length) % columns.length][i]"
                @change="validateSelection((startIndex + index - 1 + columns.length) % columns.length, i)"
                autocomplete="off"
              />
              <label 
                class="btn btn-outline-primary w-100" 
                :for="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
              >
                {{ item }}
              </label>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-primary" @click="next">
          &gt;
        </button>
      </div>
      
      <!-- Warning messages based on selection count -->
      <div v-if="totalSelected > 0 && totalSelected < 3" class="alert alert-warning mt-3" role="alert">
        Please select at least 3 options (currently selected: {{ totalSelected }})
      </div>
      <div v-if="totalSelected > 6" class="alert alert-danger mt-3" role="alert">
        You can select a maximum of 6 options (currently selected: {{ totalSelected }})
      </div>
      <div v-if="totalSelected >= 3 && totalSelected <= 6" class="alert alert-success mt-3" role="alert">
        Selection valid: {{ totalSelected }} option(s) selected
      </div>
      
      <!-- Submit button - centered and disabled when selection is invalid -->
      <div class="d-flex justify-content-center mt-4">
        <button 
          class="btn btn-primary btn-lg" 
          :disabled="totalSelected < 3 || totalSelected > 6"
          @click="submitSelection"
        >
          Submit
        </button>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        columns: [
          ["A1", "A2", "A3", "A4", "A5"],
          ["B1", "B2", "B3", "B4", "B5"],
          ["C1", "C2", "C3", "C4", "C5"],
          ["D1", "D2", "D3", "D4", "D5"],
          ["E1", "E2", "E3", "E4", "E5"]
        ],
        startIndex: 0,
        selections: Array.from({ length: 5 }, () => Array(5).fill(false)),
        fromResultPage: false
      };
    },
    computed: {
      visibleColumns() {
        const len = this.columns.length;
        // Show previous, current, next (with wrap-around)
        return [
          this.columns[(this.startIndex - 1 + len) % len],
          this.columns[this.startIndex],
          this.columns[(this.startIndex + 1) % len]
        ];
      },
      totalSelected() {
        // Count total number of selected checkboxes across all columns
        return this.selections.reduce((total, column) => {
          return total + column.filter(item => item).length;
        }, 0);
      },
      selectedItems() {
        // Get all selected items for submission
        const selected = [];
        this.selections.forEach((column, colIndex) => {
          column.forEach((isSelected, itemIndex) => {
            if (isSelected) {
              selected.push({
                text: this.columns[colIndex][itemIndex],
                column: colIndex,
                row: itemIndex
              });
            }
          });
        });
        return selected;
      }
    },
    methods: {
      prev() {
        const len = this.columns.length;
        this.startIndex = (this.startIndex - 1 + len) % len;
      },
      next() {
        const len = this.columns.length;
        this.startIndex = (this.startIndex + 1) % len;
      },
      validateSelection(columnIndex, itemIndex) {
        // If trying to select more than 6, prevent it
        if (this.totalSelected > 6) {
          this.selections[columnIndex][itemIndex] = false;
        }
        
        // Store current selections in sessionStorage (survives page refreshes but not closing the tab)
        this.saveSelectionsToStorage();
      },
      saveSelectionsToStorage() {
        sessionStorage.setItem('userSelections', JSON.stringify({
          selections: this.selections,
          startIndex: this.startIndex
        }));
        
        // Set a flag that we're in the selection process (not coming back)
        sessionStorage.setItem('selectionInProgress', 'true');
      },
      loadSelectionsFromStorage() {
        const savedData = sessionStorage.getItem('userSelections');
        if (savedData && !this.fromResultPage) {
          const data = JSON.parse(savedData);
          this.selections = data.selections;
          this.startIndex = data.startIndex;
        }
      },
      clearSelections() {
        this.selections = Array.from({ length: 5 }, () => Array(5).fill(false));
        sessionStorage.removeItem('userSelections');
        sessionStorage.removeItem('selectionInProgress');
      },
      submitSelection() {
        if (this.totalSelected >= 3 && this.totalSelected <= 6) {
          // Store selected items in sessionStorage for access on result page
          sessionStorage.setItem('finalSelections', JSON.stringify(this.selectedItems));
          
          // Set a flag that we're moving to the result page
          sessionStorage.setItem('selectionInProgress', 'false');
          sessionStorage.setItem('navigatedToResult', 'true');
          
          // Navigate to result page
          if (this.$router) {
            this.$router.push('/result');
          } else {
            window.location.href = '/result';
          }
        }
      },
      handlePageShow() {
        // This will be triggered when user navigates back from result page
        if (sessionStorage.getItem('navigatedToResult') === 'true') {
          // If we're coming back from the result page
          this.fromResultPage = true;
          this.clearSelections();
          sessionStorage.removeItem('navigatedToResult');
        }
      }
    },
    created() {
      // Load saved selections if they exist and we're not coming back from result
      this.loadSelectionsFromStorage();
    },
    mounted() {
      // Add event listener for back navigation
      window.addEventListener('pageshow', this.handlePageShow);
    },
    beforeDestroy() {
      // Clean up event listener
      window.removeEventListener('pageshow', this.handlePageShow);
    }
  };
  </script>
  <style scoped>
  .pointer-events-none {
    pointer-events: none;
  }
  
  /* Ensure Bootstrap's active states are visible */
  .btn-check:checked + .btn-outline-primary {
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
  }
  </style>