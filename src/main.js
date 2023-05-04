document.addEventListener('DOMContentLoaded', (event) => {
    var sortButton = document.getElementById("sortButton");
    var traverseButton = document.getElementById("traverseButton");
  
    var sortDiv = document.getElementById("sort");
    var traverseDiv = document.getElementById("traverse");
  
    var selected = 0;
  
    sortButton.addEventListener('click', toggleSortClass);
    traverseButton.addEventListener('click', toggleTraverseClass);
  
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
  