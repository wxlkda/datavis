document.addEventListener('DOMContentLoaded', (event) => {
    var sortButton = document.getElementById("sortButton");
    var traverseButton = document.getElementById("traverseButton");
  
    var sortDiv = document.getElementById("sort");
    var traverseDiv = document.getElementById("traverse");
  
    var arraySize = document.getElementById("array-size");
    var minElementSize = document.getElementById("min-element-size");
    var maxElementSize = document.getElementById("max-element-size");


    var selected = 0;
  
    sortButton.addEventListener('click', toggleSortClass);
    traverseButton.addEventListener('click', toggleTraverseClass);

    arraySize.addEventListener("blur", () => {
      let value = parseInt(arraySize.value);
      if (isNaN(value) || value < 2) {
        value = 2;
      } else if (value > 100) {
        value = 100;
      }
      arraySize.value = value;
    });

    //Handling if min and max are in range of each other

    minElementSize.addEventListener("blur", () => {
      let value = parseInt(minElementSize.value);
      if (isNaN(value) || value >= maxElementSize.value) {
        value = maxElementSize.value - 1;
      }
      minElementSize.value = value;
    });

    maxElementSize.addEventListener("blur", () => {
      let value = parseInt(maxElementSize.value);
      if (isNaN(value) || value <= minElementSize.value) {
        value = minElementSize.value + 1;
      }
      maxElementSize.value = value;
    });
  
    function toggleSortClass() {
      selected = 0;
      updateButtonClasses();
    }
  
    function toggleTraverseClass() {
      selected = 1;
      updateButtonClasses();
    }
  
    function updateButtonClasses() {
      if (selected == 0) {
        sortButton.className = 'selection-button sort-selected';
        traverseButton.className = "selection-button traversal";
        sortDiv.style.display = "flex";
        traverseDiv.style.display = "none";
      } else if (selected == 1) {
        traverseButton.className = 'selection-button traversal-selected';
        sortButton.className = "selection-button sort";
        sortDiv.style.display = "none";
        traverseDiv.style.display = "flex";
      }
    }
  
    // Set initial button classes and div visibility
    updateButtonClasses();
  });
  