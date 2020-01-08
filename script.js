// SVG namespace
var svgNS = "http://www.w3.org/2000/svg";

// Constants
const boxHeight = 60;
const boxWidth = 60;
const unsortedBoxColor = "#FF4848";
const sortedBoxColor = "#26ae60";

// Variables
var inputArray;

const displayArray = arr => {
	let gap = 5; // Gap between boxes in px
	let arrayWidth = (boxWidth + gap) * arr.length;
	let arrayHeight = boxHeight;

	let svg = $(document.createElementNS(svgNS, "svg")).attr({
		height: 200
	});
	$("#canvas").append(svg);

	let boxG = $(document.createElementNS(svgNS, "g")).attr({
		class: "g-boxes",
		fill: unsortedBoxColor,
		stroke: "black"
	});
	svg.append(boxG);

	let textG = $(document.createElementNS(svgNS, "g")).attr({
		class: "g-text",
		fill: "black",
		stroke: "black",
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
	$("#canvas").empty();
};

const bubbleSort = arr => {
	clearCanvas();
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

// Add event listeners
$("#btn-sorting-algo").on("click", () => {
	$("#menu-1").hide();
	$("#menu-2a").css("display", "flex");
});

$("#btn-menu-close").on("click", () => {
	$("#overlay").hide();
	$("#menu-container").animate(
		{
			height: "30px",
			width: "30px",
			top: "10px",
			left: "10px",
			"border-radius": "50%"
		},
		() => {
			$("#menu-container, .menu").hide();
			$("#btn-menu-open").show();
			$(this).css("box-shadow", "none");
		}
	);
	$("body").css("overflow", "auto");
});

$("#overlay").on("click", () => {
	$("#btn-menu-close").click();
});

$("#btn-menu-open").on("click", () => {
	$("body").css("overflow", "hidden");
	$("#overlay").show();
	$("#btn-menu-open").hide();
	$("#menu-container, #menu-1").show();
	$("#menu-container").animate({
		height: "80vh",
		width: "50vw",
		top: "10vh",
		left: "25vw",
		"border-radius": "10px"
	});
});

const getInputArray = () => {
	let input = $("#input-array").val();
	if (input === '') return false;
    inputArray = input.split(/[,\s]/);
    // Check if any element in the array is NaN. If there is then don't parse the array
	let containsString = inputArray.some(element => isNaN(element));
    // If array does not contain any string then only try to parse the array
    if(!containsString){
        inputArray = inputArray.map(element => {
            return parseFloat(element);
        });
    }
	// alert(input);
	$("#btn-menu-close").click();
	return true;
};

$("#btn-bubble-sort").on("click", () => {
	if (getInputArray()) {
		bubbleSort(inputArray);
	} else return false;
});

// bubbleSort([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// bubbleSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
