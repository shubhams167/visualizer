// SVG namespace
var svgNS = "http://www.w3.org/2000/svg";

// Constants
const boxHeight = 60;
const boxWidth = 60;
const gap = 5; // Gap between boxes in px
const unsortedBoxColor = "#DAE0E2";
const sortedBoxColor = "#26ae60";
const keyBoxColor = "#E74292";
const keyBoxColorAlternative = "#E5B143";

// Variables
var inputArray;

const getInputArray = () => {
	let input = $("#input-array").val();
	if (input === "") {
		alert("Error: Input array is empty");
		return false;
	}
	inputArray = input.trim().split(/, */);

	// Check if any element is empty
	let containsEmpty = inputArray.some(element => element === "");
	if (containsEmpty) {
		alert("Error: Invalid syntax for input array");
		return false;
	}
	// Check if any element in the array is NaN. If there is then don't parse the array
	let containsString = inputArray.some(element => isNaN(element));
	// If array does not contain any string then only try to parse the array
	if (!containsString) {
		inputArray = inputArray.map(element => {
			return parseFloat(element);
		});
	} else {
		inputArray = inputArray.map(element => {
			return element.trim();
		});
	}
	$(".btn-menu-close").click();
	return true;
};

const displayArray = arr => {
	let arrayWidth = (boxWidth + gap) * arr.length;
	let arrayHeight = boxHeight;

	let svg = $(document.createElementNS(svgNS, "svg")).attr({
		height: 200
	});
	$("#canvas").append(svg);

	let boxG = $(document.createElementNS(svgNS, "g")).attr({
		class: "g-boxes",
		fill: unsortedBoxColor
	});
	svg.append(boxG);

	let textG = $(document.createElementNS(svgNS, "g")).attr({
		class: "g-text",
		fill: "black",
		"font-size": 24
	});
	svg.append(textG);

	let x = svg.width() / 2 - arrayWidth / 2;
	let y = svg.height() / 2 - arrayHeight / 2;
	let i = 0;

	arr.forEach(element => {
		// Create a box for the array element
		let box = $(document.createElementNS(svgNS, "rect")).attr({
			class: `box-${i}`,
			x: x,
			y: y,
			height: boxHeight,
			width: boxWidth
		});
		// Append newly created box to group boxG
		boxG.append(box);

		// Add a text label on the box for the array element
		let text = $(document.createElementNS(svgNS, "text"))
			.attr({
				class: `text-${i}`,
				x: x + boxWidth / 2,
				y: y + boxHeight / 2,
				height: boxHeight,
				width: boxWidth,
				"dominant-baseline": "middle",
				"text-anchor": "middle"
			})
			.text(element.toString());
		// Append newly created box to group boxG
		textG.append(text);

		x += boxWidth + gap;
		i++;
	});
};

const clearCanvas = () => {
	$("#canvas")
		.empty()
		.css("display", "block");
};

const bubbleSort = arr => {
	$("#algo-name span").text("bubble sort");
	clearCanvas();
	// Display unsorted array
	displayArray(arr);
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				// Swap adjacent elements
				let temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
		displayArray(arr);
		// Color already sorted array
		for (let j = arr.length - 1; j >= arr.length - i - 1; j--) {
			$(`.box-${j}`)
				.eq(i + 1)
				.attr({ fill: sortedBoxColor });
		}
	}
};

const selectionSort = arr => {
	$("#algo-name span").text("selection sort");
	clearCanvas();
	// Display unsorted array
	displayArray(arr);
	for (let i = 0; i < arr.length; i++) {
		let min_idx = i;
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[min_idx]) min_idx = j;
		}

		displayArray(arr);
		// Color already sorted array
		for (let j = 0; j < i; j++) {
			$(`.box-${j}`)
				.eq((i + 1) * 2 - 1)
				.attr({ fill: sortedBoxColor });
		}
		// Get y coordinate of key box's text
		let keyBoxTextY = parseFloat(
			$(`.text-${min_idx}`)
				.eq((i + 1) * 2 - 1)
				.attr("y")
		);
		// Get y coordinate of key box
		let keyBoxY = parseFloat(
			$(`.box-${min_idx}`)
				.eq((i + 1) * 2 - 1)
				.attr("y")
		);
		// Get height of key box
		let keyBoxHeight = parseFloat(
			$(`.box-${min_idx}`)
				.eq((i + 1) * 2 - 1)
				.attr("height")
		);
		// Color and change y position of key box
		$(`.box-${min_idx}`)
			.eq((i + 1) * 2 - 1)
			.attr({ fill: keyBoxColor, y: keyBoxY + keyBoxHeight / 2 });
		// Change y position of key box's text
		$(`.text-${min_idx}`)
			.eq((i + 1) * 2 - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });

		// Swap minimum element with first element of unsorted part
		let temp = arr[min_idx];
		arr[min_idx] = arr[i];
		arr[i] = temp;

		displayArray(arr);
		// Color already sorted array
		for (let j = 0; j <= i; j++) {
			$(`.box-${j}`)
				.eq((i + 1) * 2)
				.attr({ fill: sortedBoxColor });
		}
		// Color key box
		$(`.box-${i}`)
			.eq((i + 1) * 2)
			.attr({ fill: keyBoxColor });
	}
	// Display sorted array
	displayArray(arr);
	// Color last array elements
	let len = $(`.box-${0}`).length;
	for (let j = 0; j < arr.length; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({ fill: sortedBoxColor });
	}
};

const insertionSort = arr => {
	$("#algo-name span").text("insertion sort");
	clearCanvas();
	// Display unsorted array
	displayArray(arr);
	for (let i = 1; i < arr.length; i++) {
		let key = arr[i];
		let j = i - 1;

		displayArray(arr);
		// Color already sorted array
		for (let j = 0; j < i; j++) {
			$(`.box-${j}`)
				.eq(2 * i - 1)
				.attr({ fill: sortedBoxColor });
		}
		// Get y coordinate of key box's text
		let keyBoxTextY = parseFloat(
			$(`.text-${i}`)
				.eq(2 * i - 1)
				.attr("y")
		);
		// Get y coordinate of key box
		let keyBoxY = parseFloat(
			$(`.box-${i}`)
				.eq(2 * i - 1)
				.attr("y")
		);
		// Get height of key box
		let keyBoxHeight = parseFloat(
			$(`.box-${i}`)
				.eq(2 * i - 1)
				.attr("height")
		);
		// Color and change y position of key box
		$(`.box-${i}`)
			.eq(2 * i - 1)
			.attr({ fill: keyBoxColor, y: keyBoxY + keyBoxHeight / 2 });
		// Change y position of key box's text
		$(`.text-${i}`)
			.eq(2 * i - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });

		while (j >= 0 && arr[j] > key) {
			arr[j + 1] = arr[j];
			j = j - 1;
		}
		arr[j + 1] = key;

		displayArray(arr);
		// Color already sorted array
		for (let j = 0; j < i + 1; j++) {
			$(`.box-${j}`)
				.eq(2 * i)
				.attr({ fill: sortedBoxColor });
		}
		// Color key box
		$(`.box-${j + 1}`)
			.eq(2 * i)
			.attr({ fill: keyBoxColor });
	}
	// Display sorted array
	displayArray(arr);
	// Color last array elements
	let len = $(`.box-${0}`).length;
	for (let j = 0; j < arr.length; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({ fill: sortedBoxColor });
	}
};

// Merge sort code starts from here
const merge = (arr, l, m, r) => {
	let sizeL = m - l + 1;
	let sizeR = r - m;
	let left = new Array(sizeL);
	let right = new Array(sizeR);

	// Display array before sorting and highlight left and right part
	displayArray(arr);
	// Get number of rows drawn on canvas
	let len = $(`.box-${0}`).length;
	// Get y coordinate of key box's text
	let keyBoxTextY = parseFloat(
		$(`.text-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get y coordinate of key box
	let keyBoxY = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get height of key box
	let keyBoxHeight = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("height")
	);
	// Color and change pos of left array
	for (let j = l; j <= m; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({ fill: keyBoxColor, y: keyBoxY + keyBoxHeight / 2 });
		// Change y position of key box's text
		$(`.text-${j}`)
			.eq(len - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });
	}
	// Color and change pos of right array
	for (let j = m + 1; j <= r; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({
				fill: keyBoxColorAlternative,
				y: keyBoxY + keyBoxHeight / 2
			});
		// Change y position of key box's text
		$(`.text-${j}`)
			.eq(len - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });
	}

	// Array to maintain after locations of elements
	afterLoc = {};

	// Copy data to temporary left and right arrays
	for (let i = 0; i < sizeL; i++) left[i] = arr[l + i];
	for (let i = 0; i < sizeR; i++) right[i] = arr[m + 1 + i];

	// Merge temporary arrays back into arr
	let i = 0;
	let j = 0;
	let k = l;

	// Merge left and right array
	while (i < sizeL && j < sizeR) {
		if (left[i] <= right[j]) {
			arr[k] = left[i];
			afterLoc[k] = "left";
			i++;
		} else {
			arr[k] = right[j];
			afterLoc[k] = "right";
			j++;
		}
		k++;
	}

	// Copy the remaining elements of left
	while (i < sizeL) {
		arr[k] = left[i];
		afterLoc[k] = "left";
		i++;
		k++;
	}

	// Copy the remaining elements of right
	while (j < sizeR) {
		arr[k] = right[j];
		afterLoc[k] = "right";
		j++;
		k++;
	}

	// Display sorted array with left and right array elements colored
	displayArray(arr);
	// Get number of rows drawn on canvas
	len = $(`.box-${0}`).length;
	for (let j = 0; j < arr.length; j++) {
		if (afterLoc[j]) {
			if (afterLoc[j] == "left") {
				$(`.box-${j}`)
					.eq(len - 1)
					.attr({ fill: keyBoxColor });
			} else {
				$(`.box-${j}`)
					.eq(len - 1)
					.attr({ fill: keyBoxColorAlternative });
			}
		}
	}

	// Display sorted left and right array
	displayArray(arr);
	// Get number of rows drawn on canvas
	len = $(`.box-${0}`).length;
	for (let j = l; j <= r; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({ fill: sortedBoxColor });
	}
};

const mergeSort = (arr, l, r) => {
	if (l < r) {
		let m = Math.floor(l + (r - l) / 2);
		mergeSort(arr, l, m);
		mergeSort(arr, m + 1, r);
		merge(arr, l, m, r);
	}
};
// Merge sort code ends here

// Quick sort code starts here
var isSorted = {}; // Keeps track of sorted pivot positions

const partition = (arr, l, r) => {
	let pivot = arr[r]; // pivot element
	let i = l - 1; // Index of smaller element

	// Display array before partitioning
	displayArray(arr);
	// Get number of rows drawn on canvas
	let len = $(`.box-${0}`).length;
	// Get y coordinate of key box's text
	let keyBoxTextY = parseFloat(
		$(`.text-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get y coordinate of key box
	let keyBoxY = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get height of key box
	let keyBoxHeight = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("height")
	);
	// Color and change pos of array elements from index l to r
	for (let j = l; j <= r; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({
				fill: keyBoxColorAlternative,
				y: keyBoxY + keyBoxHeight / 2
			});
		// Change y position of key box's text
		$(`.text-${j}`)
			.eq(len - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });
	}
	$(`.box-${r}`)
		.eq(len - 1)
		.attr({
			fill: keyBoxColor
		});
	// Color sorted elements of the array
	for (let j = 0; j < arr.length; j++) {
		if (isSorted[j]) {
			$(`.box-${j}`)
				.eq(len - 1)
				.attr({
					fill: sortedBoxColor
				});
		}
	}

	for (let j = l; j <= r - 1; j++) {
		if (arr[j] < pivot) {
			i++; // increment index of smaller element
			let temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
	}
	let temp = arr[i + 1];
	arr[i + 1] = arr[r];
	arr[r] = temp;

	// Display array after partitioning
	displayArray(arr);
	// Get number of rows drawn on canvas
	len = $(`.box-${0}`).length;
	// Get y coordinate of key box's text
	keyBoxTextY = parseFloat(
		$(`.text-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get y coordinate of key box
	keyBoxY = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("y")
	);
	// Get height of key box
	keyBoxHeight = parseFloat(
		$(`.box-${0}`)
			.eq(len - 1)
			.attr("height")
	);
	// Color and change pos array elements from index l to r
	for (let j = l; j <= r; j++) {
		$(`.box-${j}`)
			.eq(len - 1)
			.attr({
				fill: keyBoxColorAlternative,
				y: keyBoxY + keyBoxHeight / 2
			});
		// Change y position of key box's text
		$(`.text-${j}`)
			.eq(len - 1)
			.attr({ y: keyBoxTextY + keyBoxHeight / 2 });
	}
	// Color pivot
	$(`.box-${i + 1}`)
		.eq(len - 1)
		.attr({
			fill: keyBoxColor
		});
	// Color sorted elements of the array
	for (let j = 0; j < arr.length; j++) {
		if (isSorted[j]) {
			$(`.box-${j}`)
				.eq(len - 1)
				.attr({
					fill: sortedBoxColor
				});
		}
	}
	// Element at index i + 1 is now at its sorted pos
	isSorted[i + 1] = true;
	return i + 1;
};

const quickSort = (arr, l, r) => {
	if (l <= r) {
		let p = partition(arr, l, r);
		quickSort(arr, l, p - 1);
		quickSort(arr, p + 1, r);
	}
};
// Quick sort code ends here

// Add event listeners
$(".btn-menu-back").on("click", () => {
	$(".btn-menu-back").addClass("hidden");
	$(".menu")
		.hide()
		.eq(0)
		.fadeIn();
});

$(".btn-menu-close").on("click", () => {
	$("#overlay").fadeOut();
	$(".menu-container").toggleClass("hidden");
	$(".btn-menu-open").toggleClass("show");
});

$("#overlay").on("click", () => {
	$(".btn-menu-close").click();
});

$("#btn-sorting-algo").on("click", () => {
	$("#menu-1").hide();
	$("#menu-2a")
		.fadeIn()
		.css("display", "flex");
	$(".btn-menu-back").removeClass("hidden");
});

$(".btn-menu-open").on("click", () => {
	$("#overlay").fadeIn();
	$(".btn-menu-open").toggleClass("show");
	$(".menu-container").toggleClass("hidden");
});

$("#btn-bubble-sort").on("click", () => {
	if (getInputArray()) {
		bubbleSort(inputArray);
	} else {
		return false;
	}
});

$("#btn-selection-sort").on("click", () => {
	if (getInputArray()) {
		selectionSort(inputArray);
	} else {
		return false;
	}
});

$("#btn-insertion-sort").on("click", () => {
	if (getInputArray()) {
		insertionSort(inputArray);
	} else {
		return false;
	}
});

$("#btn-merge-sort").on("click", () => {
	if (getInputArray()) {
		$("#algo-name span").text("merge sort");
		clearCanvas();
		displayArray(inputArray);
		mergeSort(inputArray, 0, inputArray.length - 1);
	} else {
		return false;
	}
});

$("#btn-quick-sort").on("click", () => {
	if (getInputArray()) {
		$("#algo-name span").text("quick sort");
		clearCanvas();
		displayArray(inputArray);
		quickSort(inputArray, 0, inputArray.length - 1);
		displayArray(inputArray);
		// Get number of rows drawn on canvas
		let len = $(`.box-${0}`).length;
		// Color sorted elements of the array
		for (let j = 0; j < inputArray.length; j++) {
			if (isSorted[j]) {
				$(`.box-${j}`)
					.eq(len - 1)
					.attr({
						fill: sortedBoxColor
					});
			}
		}
		isSorted = {}; // Reset isSorted
	} else {
		return false;
	}
});
