document.addEventListener('DOMContentLoaded', (event) => {
    var sortButton = document.getElementById("sortButton");
    var traverseButton = document.getElementById("traverseButton");
  
    var sortDiv = document.getElementById("sort");
    var traverseDiv = document.getElementById("traverse");
  
    var arraySize = document.getElementById("array-size");
    var minElementSize = document.getElementById("min-element-size");
    var maxElementSize = document.getElementById("max-element-size");

    var selected = 0;
    var arr = [];

    var canvas = document.getElementById("algo-frame");
    var ctx = canvas.getContext("2d");

  
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
      createArray();
    });

    //Handling if min and max are in range of each other

    minElementSize.addEventListener("blur", () => {
      let value = parseInt(minElementSize.value);
      if (isNaN(value) || value >= maxElementSize.value) {
        value = maxElementSize.value - 1;
      } else if (value < 1) {
        value = 1;
      }
      minElementSize.value = value;
    });

    maxElementSize.addEventListener("blur", () => {
      let value = parseInt(maxElementSize.value);
      if (isNaN(value) || value <= minElementSize.value) {
        value = minElementSize.value + 1;
      } else if (value < 5) {
        value = 5;
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
  
    function createArray() {
      const arraySizeValue = parseInt(arraySize.value);
      const minElementSizeValue = parseInt(minElementSize.value);
      const maxElementSizeValue = parseInt(maxElementSize.value);
  
      arr = new Array(arraySizeValue)
        .fill(0)
        .map(() =>
          Math.floor(
            Math.random() * (maxElementSizeValue - minElementSizeValue + 1)
          ) + minElementSizeValue
        );

      console.log(arr);
      drawArray();
    }

    function drawArray()  {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      const barWidth = canvasWidth / arr.length;
      const maxBarHeight = Math.max(...arr);
      const heightFactor = canvasHeight / maxBarHeight;
  
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
      arr.forEach((value, index) => {
        const barHeight = value * heightFactor;
        ctx.fillStyle = "#ccd6f6";
        ctx.fillRect(
          index * barWidth,
          canvasHeight - barHeight,
          barWidth - 1,
          barHeight
        );
      });
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
  