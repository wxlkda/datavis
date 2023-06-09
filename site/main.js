document.addEventListener('DOMContentLoaded', (event) => {
    var sortButton = document.getElementById("sortButton");
    var traverseButton = document.getElementById("traverseButton");
    var sortDiv = document.getElementById("sort");
    var traverseDiv = document.getElementById("traverse");
    var arraySize = document.getElementById("array-size");
    var algoSelect = document.getElementById("algo-select");
    var resetButton = document.getElementById("reset-button");
    var startButton = document.getElementById("start-button")
    var canvas = document.getElementById("algo-frame");
    var delay = document.getElementById("delay");

    var ctx = canvas.getContext("2d");

    var minElementSize = 1;
    var maxElementSize = 100;
    var selected = 0;
    var timeTaken = 0;

    var sortingInProgress = false;
    var resetRequested = false;

    var arr = [];
    var metrics = {
      algoName: "Bubble Sort",
      comparisons: 0,
      time: 0,
      arrayAccess: 0,
    };

    var algoInfo =
      {
        "bubble": {
          "desc":'Bubble Sort is an elementary sorting algorithm that work by repeatedly stepping through the list, comparing each pair of adjacent elements, and swapping them if they are in the wrong order. The algorithm gets its name from the  way smaller elements "bubble" to the top of the list  as the larger elements "sink" to the bottom . The process is repeated until the entire list is sorted.',
          "time":['n', 'n^2', 'n^2'],
          "space":"1"
        },
        "quick": {
          "desc":'Quick sort is an efficient sorting algorithm that uses divide-and-conquer to organize elements in a list or array. It works by selecting a pivot element, partitioning the array into two sub-arrays (elements less than the pivot and elements greater than the pivot), and then recursively sorting the sub-arrays. The process is repeated until the entire list is sorted. Due to its efficiency, quick sort is commonly used in various applications and programming languages.',
          "time": ['n * log(n)', 'n * log(n)', 'n^2'],
          "space": 'log(n)'
        },
        'merge': {
          "desc":'Merge sort is a stable, comparison-based sorting algorithm that employs the divide-and-conquer approach to sort a list or array. It works by recursively splitting the input into two equal halves, sorting each half individually, and then merging the sorted halves back together. Merge sort is known for its predictable O(n log n) time complexity and is widely used in various applications and programming languages.',
          "time": ['n * log(n)', 'n * log(n)', 'n * log(n)'],
          "space": 'n'
        },
        'insertion':{
          "desc":'Insertion sort is a simple, comparison-based sorting algorithm that builds a sorted output one element at a time. It iterates through the input list, comparing each element with its predecessor, and shifting the elements until the correct position for the current element is found. Although insertion sort has a worst-case time complexity of O(n^2), it performs well on small or partially sorted lists and is widely used in various applications.',
          "time": ['n', 'n^2', 'n^2'],
          "space": '1'
        },
        'selection': {
          "desc":'Selection sort is a straightforward, comparison-based sorting algorithm that sorts a list or array by repeatedly selecting the smallest or largest element from the unsorted part and moving it to the end of the sorted part. Its worst-case time complexity is O(n^2), making it inefficient for large lists, but it can be useful for small-scale sorting tasks or as a learning tool.',
          "time": ['n^2', 'n^2', 'n^2'],
          "space": '1'
        },
        'radix': {
          "desc":'Radix sort is a non-comparative, integer-based sorting algorithm that processes elements digit by digit, from least significant to most significant or vice versa. It uses counting sort or bucket sort as a subroutine for sorting individual digits. Radix sort is particularly efficient when working with large sets of numbers with a small range of digits and has a time complexity of O(nk), where n is the number of elements and k is the number of digits.',
          "time": ['n*k', 'n*k', 'n*k'],
          "space": 'n+k'
        },
        'bogo': {
          "desc": 'Bogo sort, also known as "stupid sort" or "slow sort", is a highly inefficient sorting algorithm that works by generating random permutations of the input list until it finds a sorted one. The algorithm is mostly used for educational or entertainment purposes, as it has an unbounded worst-case time complexity, making it impractical for real-world use.',
          'time': ['n', '∞', 'n * n!'],
          "space": '1'
        }
      };

    
      

    
    
    resetButton.addEventListener('click', resetArray);
    sortButton.addEventListener('click', toggleSortClass);
    traverseButton.addEventListener('click', toggleTraverseClass);
    startButton.addEventListener("click", sortArray);

    
    
    arraySize.addEventListener("input", () => {
      metrics.algoName = `${algoSelect.value.substring(0,1).toUpperCase()}${algoSelect.value.substring(1)} Sort`;
      let value = parseInt(arraySize.value);
      if (isNaN(value) || value < 2) {
        value = 2;
      } else if (value > 100) {
        value = 100;
      }
      arraySize.value = value;
      createArray();
    });

    delay.addEventListener("blur", () => {
      let value = parseInt(delay.value);
      if (isNaN(value) || value < 0) {
        value = 0;
      } else if (value > 60) {
        value = 60;
      }
      delay.value = value;
    });

    algoSelect.addEventListener("change", function() {
      metrics.algoName = `${algoSelect.value.substring(0,1).toUpperCase()}${algoSelect.value.substring(1)} Sort`;
      resetArray();
      document.getElementById("algo-desc").innerHTML= 
      `
          <div id="algo-name">
              ${algoSelect.value.substring(0,1).toUpperCase()}${algoSelect.value.substring(1)} Sort: 
          </div>
          ${algoInfo[algoSelect.value]["desc"]}
        `;
      
      document.getElementById('best-case').innerText = `\\(\\Omega(${algoInfo[algoSelect.value]['time'][0]})\\)`;
      document.getElementById('average-case').innerText = `\\(\\mathcal{O}(${algoInfo[algoSelect.value]['time'][2]})\\)`;
      document.getElementById('worst-case').innerText = `\\(\\Theta(${algoInfo[algoSelect.value]['time'][1]})\\)`;
      document.getElementById('space-worst').innerText = `\\(\\mathcal{O}(${algoInfo[algoSelect.value]['space']})\\)`;

      MathJax.typesetPromise();
    });

  
    function toggleSortClass() {
      selected = 0;
      updateButtonClasses();
    }
  
    function toggleTraverseClass() {
      selected = 1;
      updateButtonClasses();
    }
  
    async function sortArray() {
      const selectedAlgorithm = algoSelect.value;
      if (!sortingInProgress) {
        switch (selectedAlgorithm) {
          
          case "bubble":
            disableInput()
            await startBubbleSort(arr);
            enableInput();
            break;
          case "quick":
            disableInput()
            await startQuickSort(arr);
            enableInput();
            break;
          case "merge":
            disableInput();
            await startMergeSort(arr);
            enableInput();
            break;
          case "insertion":
            disableInput()
            await startInsertionSort(arr);
            enableInput();
            break;
          case "selection":
            disableInput()
            await startSelectionSort(arr);
            enableInput();
            break;
          case "radix":
            disableInput()
            await startRadixSort();
            enableInput();
            break;
          case "bogo":
            disableInput()
            await startBogoSort(arr);
            enableInput();
            break;
        }
      }
      drawArray();
    }

    function disableInput() {
      algoSelect.disabled = true;
      arraySize.disabled = true;
      delay.disabled = true;
      startButton.disabled = true;
    }

    function enableInput() {
      algoSelect.disabled = false;
      arraySize.disabled = false;
      delay.disabled = false;
      startButton.disabled = false;
    }

    async function startMergeSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await mergeSort(arr, 0, arr.length - 1);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startQuickSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await quickSort(arr, 0, arr.length - 1);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startBubbleSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await bubbleSort(arr);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startInsertionSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await insertionSort(arr);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startSelectionSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await selectionSort(arr);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startRadixSort() {
      sortingInProgress = true;
      resetMetrics();
      await radixSort(arr);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function startBogoSort(arr) {
      sortingInProgress = true;
      resetMetrics();
      await bogoSort(arr);
      if (isSorted(arr)) {
        await markArraySorted();
      }
      sortingInProgress = false;
    }

    async function markArraySorted() {
      for (let i = 0; i < arr.length; i++) {
        if (resetRequested) {
          resetRequested = false;
          return;
        }
        drawArray(i);
        await sleep(20);
      }
    }
    function resetMetrics() {
      metrics = {
        algoName: `${algoSelect.value.substring(0,1).toUpperCase()}${algoSelect.value.substring(1)} Sort`,
        comparisons: 0,
        time: 0,
        arrayAccess: 0,
      };
      timeTaken = 0;
    }

    /* --SORTING ALGORITHMS -- */
    async function bubbleSort(arr) {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          metrics.comparisons++;

          if (arr[j] > arr[j + 1]) {
            if (resetRequested) {
              resetRequested = false;
              resetMetrics();
              return;
            }
            
            metrics.arrayAccess += 2;
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
  
            drawArray(true, j + 1);
            await sleep(delay.value);
          }
        }
        if (!swapped) break;
      }
    }

    async function quickSort(arr, low, high) {
  
      if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
      }
    }

    async function mergeSort(arr, left, right) {
      if (left < right) {
        const middle = Math.floor((left + right) / 2);
        await mergeSort(arr, left, middle);
        await mergeSort(arr, middle + 1, right);
        await merge(arr, left, middle, right);
      }
    }

    async function insertionSort(arr) {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        metrics.arrayAccess++;
        let j = i - 1;
    
        while (j >= 0 && arr[j] > key) {
          metrics.arrayAccess++;
          metrics.comparisons++;
          if (resetRequested) {
            resetRequested = false;
            resetMetrics();
            return;
          }
    
          arr[j + 1] = arr[j];
          metrics.arrayAccess++;
          j = j - 1;
          
          drawArray(true, j + 1);
          await sleep(delay.value);
        }
        arr[j + 1] = key;
      }
    }

    async function selectionSort(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (resetRequested) {
            resetRequested = false;
            resetMetrics();
            return;
          }
          metrics.arrayAccess++;
          if (arr[j] < arr[minIdx]) {
            metrics.comparisons++;
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          metrics.arrayAccess += 2;
    
          drawArray();
          await sleep(delay.value);
        }
      }
    }

    async function radixSort(arr) {
      let maxVal = Math.max(...arr);
      let maxExponent = Math.floor(Math.log10(maxVal)) + 1;
    
      for (let exponent = 0; exponent < maxExponent; exponent++) {
        if (resetRequested) {
          resetRequested = false;
          resetMetrics();
          return;
        }
        let buckets = Array.from({ length: 10 }, () => []);
        for (let number of arr) {
          let digit = Math.floor((number / Math.pow(10, exponent)) % 10);
          buckets[digit].push(number);
        }
        let newArray = [].concat(...buckets);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = newArray[i];
          metrics.arrayAccess++;
        }
        drawArray();
        await sleep(delay.value);
      }
    }

    async function bogoSort(arr) {
      while (!isSorted(arr)) {
        if (resetRequested) {
          resetRequested = false;
          resetMetrics();
          return;
        }
        arr = shuffle(arr);
        drawArray();
        await sleep(delay.value);
      }
    }



    /* -- METHODS USED IN ALGOS -- */
    async function partition(arr, low, high) {
      let pivot = arr[high];
      metrics.arrayAccess++;
      let i = low - 1;
      if (resetRequested) {
        resetRequested = false;
        resetMetrics();
        return;
      }
      for (let j = low; j <= high - 1; j++) {
        if (resetRequested) {
          resetRequested = false;
          resetMetrics();
          return;
        }
        metrics.comparisons++;
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          metrics.arrayAccess += 2;
          if (resetRequested) {
            resetRequested = false;
            resetMetrics();
            return;
          }
          drawArray(true, high, i, j);
          await sleep(delay.value);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      metrics.arrayAccess += 2;
      if (resetRequested) {
        resetRequested = false;
        resetMetrics();
        return;
      }
      drawArray();
      await sleep(delay.value);
    
      return i + 1;
    }

    function isSorted(arr) {
      for (let i = 1; i < arr.length; i++) {
        metrics.arrayAccess++;
        metrics.comparisons++;
        if (arr[i - 1] > arr[i]) {
          return false;
        }
      }
      return true;
    }
    
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        metrics.arrayAccess += 2;
      }
      return arr;
    }
    
    async function merge(arr, left, mid, right) {
      const n1 = mid - left + 1;
      const n2 = right - mid;
    
      let leftArr = new Array(n1);
      let rightArr = new Array(n2);
    
      for (let i = 0; i < n1; i++) {
        leftArr[i] = arr[left + i];
        metrics.arrayAccess++;
      }
      for (let j = 0; j < n2; j++) {
        rightArr[j] = arr[mid + 1 + j];
        metrics.arrayAccess++;
      }
    
      let i = 0;
      let j = 0;
      let k = left;
    
      while (i < n1 && j < n2) {
        metrics.comparisons++;
        metrics.arrayAccess++;
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          metrics.arrayAccess++;
          i++;
        } else {
          arr[k] = rightArr[j];
          metrics.arrayAccess++;
          j++;
        }
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
      metrics.comparisons++;
      while (i < n1) {
        arr[k] = leftArr[i];
        metrics.arrayAccess++;
        i++;
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
      metrics.comparisons++;
      while (j < n2) {
        arr[k] = rightArr[j];
        metrics.arrayAccess++;
        j++;
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
    }
    

    /* -- ASYNC SLEEP FUNC -- */
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }


    // FUNCTIONS TO DEALING WITH THE CANVAS
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

    function createRandomArray() {
      arraySize.value = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
    }

    function resetArray() {
      if (sortingInProgress) {
        resetRequested = true;
        sortingInProgress = false;
      }

      resetMetrics();
      const arraySizeValue = parseInt(arraySize.value);
  
      arr = new Array(arraySizeValue)
        .fill(0)
        .map(() =>
          Math.floor(
            Math.random() * (maxElementSize - minElementSize + 1)
          ) + minElementSize
        );


      drawArray();
      enableInput();
    }

    function drawText() {
      const textHeight = 50;
      const textY = textHeight - 30; // Adjust the vertical position of the text
      ctx.font = "bold 20px NTR-Regular";
    
      // Draw algorithm name
      ctx.fillStyle = "#ccd6f6";
      ctx.fillText(`${metrics.algoName} - `, 10, textY);
    
      // Measure the width of the algorithm name text
      const algoNameWidth = ctx.measureText(`${metrics.algoName} - `).width;
    
      // Draw comparisons label
      ctx.font = "20px NTR-Regular";
      ctx.fillText("Comparisons: ", 10 + algoNameWidth, textY);
    
      // Measure the width of the comparisons label
      const comparisonsLabelWidth = ctx.measureText("Comparisons: ").width;
    
      // Draw comparisons value in blue
      ctx.fillStyle = "#61dafb";
      ctx.font = "bold 20px NTR-Regular";
      ctx.fillText(metrics.comparisons, 10 + algoNameWidth + comparisonsLabelWidth, textY);
    
      // Measure the width of the comparisons value
      const comparisonsWidth = ctx.measureText(metrics.comparisons).width;
    
      // Draw time taken label
      ctx.fillStyle = "#ccd6f6";
      ctx.font = "20px NTR-Regular";
      ctx.fillText(", Time Taken: ", 10 + algoNameWidth + comparisonsLabelWidth + comparisonsWidth, textY);
    
      // Measure the width of the time taken label
      const timeTakenLabelWidth = ctx.measureText(", Time Taken: ").width;
    
      ctx.fillStyle = "#61dafb";
      ctx.font = "bold 20px NTR-Regular";

      let displayTimeTaken = timeTaken;
      let timeUnit = "ms";
      if (timeTaken > 1000) {
        displayTimeTaken = timeTaken / 1000;
        timeUnit = "s";
      }

      ctx.fillText(displayTimeTaken.toFixed(2) + timeUnit, 10 + algoNameWidth + comparisonsLabelWidth + comparisonsWidth + timeTakenLabelWidth, textY);

      // Measure the width of the time taken value
      const timeTakenWidth = ctx.measureText(displayTimeTaken.toFixed(2) + timeUnit).width;

    
      // Draw array access label
      ctx.fillStyle = "#ccd6f6";
      ctx.font = "20px NTR-Regular";
      ctx.fillText(", Array Accesses: ", 10 + algoNameWidth + comparisonsLabelWidth + comparisonsWidth + timeTakenLabelWidth + timeTakenWidth, textY);
    
      // Measure the width of the array access label
      const arrayAccessLabelWidth = ctx.measureText(", Array Accesses: ").width;
    
      // Draw array access value in blue
      ctx.fillStyle = "#61dafb";
      ctx.font = "bold 20px NTR-Regular";
      ctx.fillText(metrics.arrayAccess, 10 + algoNameWidth + comparisonsLabelWidth + comparisonsWidth + timeTakenLabelWidth + timeTakenWidth + arrayAccessLabelWidth, textY);
    }

    
    function drawArray(...options) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height - 30; 
    
      const barWidth = canvasWidth / arr.length;
      const maxBarHeight = maxElementSize;
      const heightFactor = canvasHeight / maxBarHeight;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawText();
    
      arr.forEach((value, index) => {
        const barHeight = value * heightFactor;
        ctx.fillStyle = "#ccd6f6";
        if (options.length == 4) {
          if (options[0] && index == options[2]) {
            ctx.fillStyle = "red";
          }
          if (options[0] && index == options[3]) {
            ctx.fillStyle = "red";
          }
          if (options[0] && index == options[1]) {
            ctx.fillStyle = "gray"; //pivot to gray
          }
        }
        if (options.length == 2) {
          if (options[0] && index === options[1]) { //Case where only 1 bar needs to be red
            ctx.fillStyle = "red";
          }
        }
        if (options.length == 1) {
          if (index === options[0]) { //Only 1 arg passed in, "check mode"
            ctx.fillStyle = "green";
          }
        }

    
        ctx.fillRect(
          index * barWidth,
          canvas.height - barHeight, 
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

    updateButtonClasses();
    createRandomArray();
    drawText();
    createArray();
  });
  