document.addEventListener('DOMContentLoaded', (event) => {
    var sortButton = document.getElementById("sortButton");
    var traverseButton = document.getElementById("traverseButton");
  
    var sortDiv = document.getElementById("sort");
    var traverseDiv = document.getElementById("traverse");
  
    var arraySize = document.getElementById("array-size");
    var minElementSize = 1;
    var maxElementSize = 100;

    var resetButton = document.getElementById("reset-button");

    var selected = 0;
    var arr = [];

    var canvas = document.getElementById("algo-frame");
    var ctx = canvas.getContext("2d");

    createArray();
    
    resetButton.addEventListener('click', createArray);
    sortButton.addEventListener('click', toggleSortClass);
    traverseButton.addEventListener('click', toggleTraverseClass);

    
    arraySize.addEventListener("input", () => {
      let value = parseInt(arraySize.value);
      if (isNaN(value) || value < 2) {
        value = 2;
      } else if (value > 100) {
        value = 100;
      }
      arraySize.value = value;
      createArray();
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
  
      arr = new Array(arraySizeValue)
        .fill(0)
        .map(() =>
          Math.floor(
            Math.random() * (maxElementSize - minElementSize + 1)
          ) + minElementSize
        );


      drawArray();
    }

    function drawArray()  {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      const barWidth = canvasWidth / arr.length;
      const maxBarHeight = maxElementSize;
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
  