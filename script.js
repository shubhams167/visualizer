// SVG namespace
var svgNS = "http://www.w3.org/2000/svg";

// Constants
const boxHeight = 60;
const boxWidth = 60;
const gap = 5; // Gap between boxes in px
const unsortedBoxColor = "#DAE0E2";
const sortedBoxColor = "#26ae60";
const keyBoxColor = "#E74292";

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
			.attr({ fill: keyBoxColor, y: keyBoxY - keyBoxHeight - 10 });
		// Change y position of key box's text
		$(`.text-${min_idx}`)
			.eq((i + 1) * 2 - 1)
			.attr({ y: keyBoxTextY - keyBoxHeight - 10 });

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
			.attr({ fill: keyBoxColor, y: keyBoxY - keyBoxHeight - 10 });
		// Change y position of key box's text
		$(`.text-${i}`)
			.eq(2 * i - 1)
			.attr({ y: keyBoxTextY - keyBoxHeight - 10 });

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
