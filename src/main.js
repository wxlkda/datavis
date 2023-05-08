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

    var sortingInProgress = false;
    var resetRequested = false;

    var arr = [];

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
          "space": 'n'
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
          'time': ['n', 'n * n!', '∞'],
          "space": '1'
        }
      };

      arraySize.value = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
      createArray();
      

    
    
    resetButton.addEventListener('click', resetArray);
    sortButton.addEventListener('click', toggleSortClass);
    traverseButton.addEventListener('click', toggleTraverseClass);
    startButton.addEventListener("click", sortArray);

    
    
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

    delay.addEventListener("blur", function() {
      let value = delay.value;
      if (isNaN(value) || value < 10) {
        value = 10;
      } else if (value > 60) {
        value = 60;
      }
    });

    algoSelect.addEventListener("change", function() {
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
            await selectionSort(arr);
            break;
          case "radix":
            disableInput()
            await radixSort(arr);
            break;
          case "bogo":
            disableInput()
            await bogoSort(arr);
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
      await mergeSort(arr, 0, arr.length - 1);
      sortingInProgress = false;
    }

    async function startQuickSort(arr) {
      sortingInProgress = true;
      await quickSort(arr, 0, arr.length - 1);
      sortingInProgress = false;
    }

    async function startBubbleSort(arr) {
      sortingInProgress = true;
      await bubbleSort(arr);
      sortingInProgress = false;
    }

    async function startInsertionSort(arr) {
      sortingInProgress = true;
      await insertionSort(arr);
      sortingInProgress = false;
    }
    

    async function insertionSort(arr) {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
    
        while (j >= 0 && arr[j] > key) {
          if (resetRequested) {
            resetRequested = false;
            return;
          }
    
          arr[j + 1] = arr[j];
          j = j - 1;
          
          drawArray(insertion = [true, j + 1]);
          await sleep(delay.value);
        }
        arr[j + 1] = key;
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
    
    

    
    async function bubbleSort(arr) {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            if (resetRequested) {
              resetRequested = false;
              return;
            }
            // Swap elements
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
  
            drawArray(bubble = [true, j + 1]);
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

    async function partition(arr, low, high) {
      let pivot = arr[high];
      let i = low - 1;
    
      for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          drawArray();
          await sleep(delay.value);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      drawArray();
      await sleep(delay.value);
    
      return i + 1;
    }

    
    async function merge(arr, left, mid, right) {
      const n1 = mid - left + 1;
      const n2 = right - mid;
    
      let leftArr = new Array(n1);
      let rightArr = new Array(n2);
    
      for (let i = 0; i < n1; i++) {
        leftArr[i] = arr[left + i];
      }
      for (let j = 0; j < n2; j++) {
        rightArr[j] = arr[mid + 1 + j];
      }
    
      let i = 0;
      let j = 0;
      let k = left;
    
      while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
    
      while (i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
    
      while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    
        await sleep(delay.value);
        drawArray();
      }
    }
    
  
  
    async function selectionSort(arr) {
      // ... (selectionSort implementation) ...
    }
  
    async function radixSort(arr) {
      // ... (radixSort implementation) ...
    }
  
    async function bogoSort(arr) {
      // ... (bogoSort implementation) ...
    }
    
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
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

    function resetArray() {
      if (sortingInProgress) {
        resetRequested = true;
        sortingInProgress = false;
      }
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
    
    function drawArray(bubble = [false, 0], quick = false, merge = false, insertion = false, selection = false, radix = false, bogo = false)  {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
    
      const barWidth = canvasWidth / arr.length;
      const maxBarHeight = maxElementSize;
      const heightFactor = canvasHeight / maxBarHeight;
    
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
      arr.forEach((value, index) => {
        const barHeight = value * heightFactor;
        ctx.fillStyle = "#ccd6f6"; // Move this line here
        if (bubble[0]) {
          if (index === bubble[1]) {
            ctx.fillStyle = "red";
          }
        }
        
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
  