// --------------------- //
//     ~ VARIABLES ~     //
// --------------------- //


// Variables - Containers
var questionContainer = document.querySelector('.question-container');
var choicesContainer = document.querySelector('.choices-container');
var feedbackContainer = document.querySelector('.feedback-container');
var progressContainer = document.querySelector('.progress-container');
var nav = document.querySelector('section.multi-choice .nav');

// Variables - Buttons
var buttons = document.querySelectorAll('.choices-container a');
var imageButtons = document.querySelectorAll('.button-img');
var checkButtons = document.querySelectorAll('.button-check');
var resetButtons = document.querySelectorAll('.button-reset');
var dropzoneButtons = document.querySelectorAll('.drop-zone');
var dropdownButtons = document.querySelectorAll('.dropdown .button-menu');
var dropdownMenus = document.querySelectorAll('.dropdown .menu');
var dropdownOptions = document.querySelectorAll('.dropdown .button-menu-options');
var next = document.getElementById('next');
var previous = document.getElementById('previous');
var restart = document.getElementById('restart');
var positionButtons = progressContainer.children;

// Variables - Elements
var questions = document.querySelectorAll('.question');

// Variables - Pages
var pageNum = 1;
var pageCount = choicesContainer.childElementCount;

// Variables - Current Elements
var currentQuestion = document.getElementById('question' + pageNum);
var currentChoices = document.getElementById('choices' + pageNum);
var currentFeedbackTrue = document.getElementById('true' + pageNum);
var currentFeedbackFalse = document.getElementById('false' + pageNum);
var currentFeedbackHint = document.getElementById('hint' + pageNum);
var currentFeedbackSolution = document.getElementById('solution' + pageNum);
var currentPosition = document.getElementById('pos' + pageNum);
var currentDragGroup = document.querySelector('#drag-group' + pageNum);
var currentMenus = document.querySelectorAll('#choices' + pageNum + ' .select');

// Variables - Misc
var mouseOut;
var attempts = 0;
var maxAttempts = currentChoices.dataset.attempts;
var resetClicked = false;
var checkClicked = false;

// Variables - Iterators
var i;
var j;
var k;
var x; // Reserved for applyAll();




// -------------------- //
// ~ HELPER FUNCTIONS ~ //
// -------------------- //


// Check if element has class
var hasClass = function(elem, className) {
	return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' '); 
}

// Add class to element
var addClass = function(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

// Remove class from element
var removeClass = function(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

// Get element siblings
var getSiblings = function(elem) {
	var siblings = [];
	var sibling = elem.parentNode.firstChild;
	while(sibling) {
		if (sibling.nodeType === 1 && sibling !== elem) {
			siblings.push(sibling);
		}
		sibling = sibling.nextSibling;
	}
	return siblings;
}

// Apply function to entire node list
var applyAll = function(elem, fn, className){
	for (x = 0; x < elem.length; x++) {
		fn(elem[x], className);
	}
}

// Reset placeholder text to default
var resetPlaceholderText = function(elem) {
	for (k = 0; k < elem.length; k++) {
		elem[k].innerHTML = elem[k].dataset.default;
	}
}




// ------------------------------ //
//    ~ BUTTON RANDOMIZATION ~    //
// ------------------------------ //


var randomize = function(elem) {
	// Populate array numbers equal to the number of match buttons
	var numberArray = [];
	for (i = 0; i < elem.length; i++) {
		numberArray.push(i + 1);
	}
	for (i = 0; i < elem.length; i++) {
		var number = numberArray[Math.floor(Math.random() * numberArray.length)];
		elem[i].style.order = number;
		for (j = 0; j < numberArray.length; j++) { 
			if (numberArray[j] === number) {
			numberArray.splice(j, 1); 
			}
		}
	}
}

// Randomize order of selected buttons
var randomizeButtons = function() {
	if (hasClass(currentChoices, 'randomize')) {
		if (hasClass(currentChoices, 'drag-drop')) {
			randomize(currentDragGroup.querySelectorAll('a'));
		} else {
			randomize(currentChoices.querySelectorAll('a'));
		}
	}
}




// --------------------------- //
//    ~ ON-LOAD FUNCTIONS ~    //
// --------------------------- //


// Hide progress-container if animation only has one page
if (pageCount <= 1) {
	addClass(nav, 'is-hidden');
}

// Populate progress-container to match pageCount
for (i = 0; i < pageCount; i++) {
	var newDiv = document.createElement('div');
	newDiv.id = 'pos' + (i + 1);
	if (i === 0) {
		addClass(newDiv, 'is-active');
	} else if (!hasClass(progressContainer, 'free-nav')) {
		addClass(newDiv, 'is-disabled');
	}
	progressContainer.append(newDiv);
}




// ------------------------------ //
//  ~ UPDATE CONTENT FUNCTIONS ~  //
// ------------------------------ //


// Update element variables to match current page
var updateVariables = function() {
	currentQuestion = document.getElementById('question' + pageNum);
	currentChoices = document.getElementById('choices' + pageNum);
	currentFeedbackTrue = document.getElementById('true' + pageNum);
	currentFeedbackFalse = document.getElementById('false' + pageNum);
	currentFeedbackHint = document.getElementById('hint' + pageNum);
	currentFeedbackSolution = document.getElementById('solution' + pageNum);
	currentPosition = document.getElementById('pos' + pageNum);
	currentDragGroup = document.querySelector('#drag-group' + pageNum);
	currentMenus = document.querySelectorAll('#choices' + pageNum + ' .menu');
	attempts = 0;
	maxAttempts = currentChoices.dataset.attempts;
	positionButtons = progressContainer.children;
	randomizeButtons();
	resetPlaceholderText(dropdownButtons);
}

updateVariables();

// Remove temporary classes from buttons
var clearButtons = function() {
	applyAll(buttons, removeClass, 'is-active');
	applyAll(buttons, removeClass, 'is-selected');
	applyAll(buttons, removeClass, 'is-focus');
	applyAll(buttons, removeClass, 'is-unfocus');
	applyAll(buttons, removeClass, 'is-false');
	applyAll(buttons, removeClass, 'flash-false');
}
	
// Remove temporary classes from false choice buttons
var clearButtonsFalse = function() {
	if (hasClass(currentChoices, 'multi-select') || hasClass(currentChoices, 'dropdown')) {
		var currentButtons = currentChoices.querySelectorAll('a.button-menu');
		// Store false choices
		var falseButtons = currentChoices.querySelectorAll('a.is-false');
		if (falseButtons.length !== 0) {
			applyAll(falseButtons, removeClass, 'is-active');
			applyAll(falseButtons, removeClass, 'is-selected');
			applyAll(falseButtons, removeClass, 'is-focus');
			applyAll(falseButtons, removeClass, 'is-unfocus');
			applyAll(buttons, removeClass, 'is-false');
			applyAll(buttons, removeClass, 'flash-false');
			// Reset placeholder text of false choice buttons to default
			for (i = 0; i < falseButtons.length; i++) {
				var falseButtonPlaceholder = falseButtons[i].parentNode.previousElementSibling;
				falseButtonPlaceholder.innerHTML = falseButtonPlaceholder.dataset.default;
			}
		} else {
			clearButtons();
			for (i = 0; i < currentButtons.length; i++) {
				currentButtons[i].innerHTML = currentButtons[i].dataset.default;
			}
		}
	}
}

// Reset draggable buttons to original container
var clearDrag = function() {
	applyAll(buttons, removeClass, 'was-dragged');
	var currentDragButtons = document.querySelectorAll('#drop-group' + pageNum + ' .button-drag');
	if (hasClass(currentChoices, 'drag-drop')){
		// Deleted duplicate draggable buttons from Drop Group
		if (hasClass(currentChoices, 'reusable-options')) {
			for (i = 0; i < currentDragButtons.length; i++){
				var nodeParent = currentDragButtons[i].parentNode;
				nodeParent.removeChild(currentDragButtons[i]);
			}
		// Return draggable buttons to original container
		} else {
			for (i = 0; i < currentDragButtons.length; i++){
				currentDragGroup.appendChild(currentDragButtons[i]);
			}
		}
	}
}

// Reset false draggable buttons to the original container
var clearDragFalse = function() {
	if (hasClass(currentChoices, 'drag-drop')) {
		var falseDragButtons = currentChoices.querySelectorAll('a.is-false');
		if (falseDragButtons.length !== 0) {
			applyAll(falseDragButtons, removeClass, 'was-dragged');
			applyAll(falseDragButtons, removeClass, 'is-false');
			applyAll(falseDragButtons, removeClass, 'flash-false');
			// Deleted duplicate draggable buttons from Drop Group
			if (hasClass(currentChoices, 'reusable-options')) {
				for (i = 0; i < falseDragButtons.length; i++) {
					var nodeParent = falseDragButtons[i].parentNode;
					nodeParent.removeChild(falseDragButtons[i]);
				}
			// Return draggable buttons to original container
			} else {
				for (i = 0; i < falseDragButtons.length; i++) {
					currentDragGroup.appendChild(falseDragButtons[i]);
				}
			}
		} else {
			clearDrag();
		}
	}
}

// Reset feedback container
var clearFeedback = function() {
	removeClass(feedbackContainer, 'is-true');
	removeClass(feedbackContainer, 'is-false');
}

// Reset content prior to moving to a new page
var resetContent = function() {
	addClass(feedbackContainer, 'is-hidden');
	applyAll(choicesContainer.children, addClass, 'is-hidden');
	applyAll(questionContainer.children, addClass, 'is-hidden');
	applyAll(feedbackContainer.children, addClass, 'is-hidden');
	applyAll(document.querySelectorAll('.feedback-specific p'), addClass, 'is-hidden');
	applyAll(progressContainer.children, removeClass, 'is-active');
	applyAll(dropdownMenus, removeClass, 'is-active');
	resetPlaceholderText(dropdownButtons);
	clearButtons();
	clearFeedback();
	clearDrag();
}

// Reveal new page content
var revealContent = function() {
	addClass(currentPosition, 'is-active');
	removeClass(currentQuestion, 'is-hidden');
	removeClass(currentChoices, 'is-hidden');
	minimizeDragLayout();
}




// -------------------------------- //
//  ~ NAVIGATION EVENT LISTENERS ~  //
// -------------------------------- //


// Next button functionality
next.addEventListener('click', function(){
	resetContent();
	// Enable previous button
	removeClass(previous, 'is-disabled');
	// Enable position button for completed page
	removeClass(currentPosition, 'is-disabled');
	// Disable next button for the following page
	addClass(next, 'is-disabled');
	pageNum = pageNum + 1;
	updateVariables();
	// Enable next button on previously completed pages
	if (hasClass(currentPosition, 'is-true') || hasClass(currentPosition, 'is-false')) {
		if (pageNum === pageCount) {
			removeClass(restart, 'is-disabled');
		} else {
			removeClass(next, 'is-disabled');
		}
	}
	revealContent();
});

// Previous button functionality
previous.addEventListener('click', function(){
	resetContent();
	pageNum = pageNum - 1;
	// Disable previous button on first page
	if (pageNum === 1) {
		addClass(previous, 'is-disabled');
	}
	// Disable restart button on all other pages
	if (pageNum !== pageCount) {
		addClass(restart, 'is-disabled');
	}
	updateVariables();
	// Enable next button on previously completed pages
	if (hasClass(currentPosition, 'is-true') || hasClass(currentPosition, 'is-false')) {
		removeClass(next, 'is-disabled');
	}
	revealContent();
});

// Restart button functionality
restart.addEventListener('click', function(){
	resetContent();
	// Reset progress bar tracking
	applyAll(progressContainer.children, removeClass, 'is-true');
	applyAll(progressContainer.children, removeClass, 'is-false');
	// Disable previous and restart buttons
	addClass(previous, 'is-disabled');
	addClass(restart, 'is-disabled')
	// Reset page number
	pageNum = 1;
	updateVariables();
	revealContent();
})

// Position buttons click functionality
for (i = 0; i < positionButtons.length; i++) {
	positionButtons[i].addEventListener("click", function(){
		resetContent();
		// Set page number to targeted page
		pageNum = Number(this.id.match(/\d+/));
		// Disable previous button on first page
		if (pageNum === 1) {
			addClass(previous, 'is-disabled');
		}
		// Disable restart and next button on all other pages
		if (pageNum !== pageCount) {
			addClass(restart, 'is-disabled');
		} else {
			addClass(next, 'is-disabled');
		}
		updateVariables();
		// Enable next button on previously completed pages
		if (hasClass(currentPosition, 'is-true') || hasClass(currentPosition, 'is-false')) {
			if (pageNum === pageCount) {
				removeClass(restart, 'is-disabled');
			} else {
				removeClass(next, 'is-disabled');
			}
		}
		revealContent();
	})
}




// --------------------------------------------- //
//  ~ USER INPUT VERIFICATION EVENT LISTENERS ~  //
// --------------------------------------------- //


// Check user input for single-select questions
for (i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", function(){
		var answer;
		var number = this.id.substring(this.id.length - 3);
		// Find parent of clicked button
		var parent;
		var findParent = function(element) {
			parent = element;
			for (j = 0; j < 20; j++) {
				if (parent.parentNode.id !== 'choices' + pageNum) {
					parent = parent.parentNode;
				} else {
					parent = parent.parentNode;
					return parent;
					break;
				}
			}
		}
		findParent(this);
		// Remove flash from all buttons
		applyAll(buttons, removeClass, 'flash-false');
		// Add 'is-active' to clicked button; not on multi-select or dropdown pages
		if (!hasClass(parent, 'multi-select') && !hasClass(parent, 'dropdown')) {
			addClass(this, 'is-active');
			// Remove 'is-active' from sibling buttons
			applyAll(getSiblings(this), removeClass, 'is-active');	
		}
		
		// Compares user input against answers array
		if (!hasClass(parent, 'multi-select') && !hasClass(parent, 'drag-drop') && !hasClass(parent, 'dropdown')) {
			attempts += 1;
			if (this.id === answers[pageNum - 1]) {
				trueAnswer();
			} else {
				if (currentFeedbackSolution) {
					if (attempts == maxAttempts) {
						solutionAnswer();
					} else {
						hintAnswer();
					}
				} else {
					falseAnswer();
				}
			}
					
		// If multi-select question, changes button behaviour to highlight selected
		} else if (hasClass(parent, 'multi-select')) {
			this.classList.toggle('is-selected');
			
		// if dropdown select question, reveal menu and select option	
		} else if (hasClass(parent, 'dropdown')) {			
			var targetedMenu;
			// Menu option buttons click events
			if (hasClass(this, 'button-menu-options')) {
				targetedMenu = this.parentNode;
				var targetedButton = targetedMenu.previousElementSibling;
				applyAll(getSiblings(this), removeClass, 'is-selected');
				addClass(this, 'is-selected');
				// Replace placeholder text with selection
				targetedButton.innerHTML = this.innerHTML;
				removeClass(targetedMenu, 'is-active');
				removeClass(targetedButton, 'is-active');
			
			// Menu button click events
			} else if (hasClass(this, 'button-menu')) {
				targetedMenu = this.nextElementSibling;
				if (!hasClass(targetedMenu, 'is-active')) {
					applyAll(dropdownButtons, removeClass, 'is-active');
					applyAll(dropdownMenus, removeClass, 'is-active');
					addClass(this, 'is-active');
					addClass(targetedMenu, 'is-active');
				} else {
					removeClass(this, 'is-active');
					removeClass(targetedMenu, 'is-active');
				}
			}			
		}
		
		if (hasClass(parent, 'option-feedback') && !hasClass(feedbackContainer, 'is-hidden')) {
			if (hasClass(feedbackContainer, 'is-true')) {
				answer = 'true';
			} else {
				answer = 'false';
			}			
			var specificFeedback = document.getElementById(answer + number);
			applyAll(getSiblings(specificFeedback), addClass, 'is-hidden');
			removeClass(specificFeedback, 'is-hidden');
		}
	});
}

// Check user input for multi-select, drag and drop and dropdown questions
for (i = 0; i < checkButtons.length; i++) {
	checkButtons[i].addEventListener("click", function(){
		checkClicked = true;
		var isEqual = true;
		// Stores answer array
		var correctAnswers = answers[pageNum - 1];
		
		
		// Checks user selection for multi-select and dropdown questions
		if (hasClass(currentChoices, 'multi-select') || hasClass(currentChoices, 'dropdown')) {
			// Stores user selection
			var selected = document.querySelectorAll('#choices' + pageNum + ' .is-selected');
			var selectedIds = [];
			// Processes node list into an array of element ids
			for (j = 0; j < selected.length; j++) {
				selectedIds.push(selected[j].id);
			}
			// If number of selected does not match number of answers, set to false
			if (selectedIds.length !== correctAnswers.length) {
				isEqual = false;
			}
			// Compares both arrays to see if they match
			for (j = 0; j < selectedIds.length; j++) {
				var targetedOption = document.querySelector('#' + selectedIds[j]);
				if (hasClass(currentChoices, 'multi-select')) {
					if (!(correctAnswers.indexOf(selectedIds[j]) > -1)) {
						isEqual = false;
						// Preserve correct answers, by tagging false ones
						addClass(targetedOption, 'is-false');
						// Activate flash feedback on false choices
						addClass(targetedOption, 'flash-false');
					}
				} else if (hasClass(currentChoices, 'dropdown')) {
					if (selectedIds.length !== correctAnswers.length) {
						for (k = 0; k < correctAnswers.length; k++) {
							var currentDropButton = currentChoices.querySelectorAll('.dropdown .button-menu')[k];
							if (currentDropButton.innerHTML === currentDropButton.dataset.default) {
								// Activate flash feedback on buttons that are not selected
								addClass(currentDropButton, 'flash-false');
							}
						}
					} else {
						if (selectedIds[j] !== correctAnswers[j]) {
							isEqual = false;
							// Preserve correct answers, by tagging false ones
							addClass(targetedOption, 'is-false');
							// Activate flash feedback on false choices
							addClass(targetedOption.parentNode.previousElementSibling, 'flash-false');
						}
					}
				}
			}

			
		// Checks user selection for drag-drop questions
		} else if (hasClass(currentChoices, 'drag-drop')) {
			isEqual = true;
			var dropzones = document.querySelectorAll('#drop-group' + pageNum + ' .drop-zone');
			var dropzoneContent = [];
			// Stores user selection
			for (j = 0; j < dropzones.length; j++) {
				var dropzoneChildren = dropzones[j].children;
				var dropzoneChildrenIds = [];
				for (k = 0; k < dropzoneChildren.length; k++) {
					dropzoneChildrenIds.push(dropzoneChildren[k].id.toString());
				}
				dropzoneChildrenIds.sort();
				dropzoneContent.push(dropzoneChildrenIds);
			}
			// Compares both arrays to see if they match
			for (j = 0; j < dropzoneContent.length; j++) {
				var currentUserArray = dropzoneContent[j];
				var currentAnswerArray = correctAnswers[j];
				// Compares array length, returns false if unequal
				if (currentUserArray.length !== currentAnswerArray.length) {
					isEqual = false;
				}
				for (k = 0; k < currentUserArray.length; k++) {
					if (!(currentAnswerArray.indexOf(currentUserArray[k]) > -1)) {
						isEqual = false;
						var targetedDrop = document.querySelector('#drop' + pageNum + '-' + (j + 1));
						var targetedDragOption = targetedDrop.querySelector('#' + currentUserArray[k]);
						addClass(targetedDragOption, 'is-false');
						addClass(targetedDragOption, 'flash-false');
					}
				}
			}
		}
		
		
		// Returns true or false answer feedback
		attempts += 1;
		if (isEqual) {
			trueAnswer();
		} else {
			if (currentFeedbackSolution) {
				if (attempts == maxAttempts) {
					solutionAnswer();
				} else {
					hintAnswer();
				}
			} else {
				falseAnswer();
			}
		}
	});
}




// ---------------------------------- //
//  ~ RESET BUTTON EVENT LISTENERS ~  //
// ---------------------------------- //


// Reset button functionality for multi-select and drag and drop questions
for (i = 0; i < resetButtons.length; i++) {
	resetButtons[i].addEventListener("click", function() {
		if (hasClass(currentChoices, 'multi-select') || hasClass(currentChoices, 'dropdown')) {
			if (checkClicked && hasClass(currentChoices, 'preserve-true')) {
				clearButtonsFalse();
				resetClicked = true;
			} else {
				clearButtons();
				// Reset placeholder text to default
				resetPlaceholderText(dropdownButtons);
				resetClicked = false;
			}
		} else if (hasClass(currentChoices, 'drag-drop')) {
			if (checkClicked && hasClass(currentChoices, 'preserve-true')) {
				clearDragFalse();
				clearButtons();
				resetClicked = true;
			} else {
				clearDrag();
				clearButtons();
				resetClicked = false;
			}
			if (hasClass(currentChoices, 'minimize')) {
				minimizeDragLayout();
			}
		}
		addClass(feedbackContainer, 'is-hidden');
		applyAll(feedbackContainer.children, addClass, 'is-hidden');
		applyAll(document.querySelectorAll('.feedback-specific p'), addClass, 'is-hidden');
		applyAll(checkButtons, removeClass, 'is-disabled');
		clearFeedback();
		checkClicked = false;
	})
}




// ------------------------------- //
//  ~ REVEAL FEEDBACK FUNCTIONS ~  //
// ------------------------------- //


var resetFeedback = function() {
	// Reveal feedback container
	removeClass(feedbackContainer, 'is-hidden');
	// Reset feedback container colour 
	removeClass(feedbackContainer, 'is-true');
	removeClass(feedbackContainer, 'is-false');
	removeClass(feedbackContainer, 'is-hint');
}

// Shows false answer feedback
var falseAnswer = function() {
	// Reveal target feedback, hide sibling feedback
	applyAll(getSiblings(currentFeedbackFalse), addClass, 'is-hidden');
	removeClass(currentFeedbackFalse, 'is-hidden');
	resetFeedback();
	// Set feedback container style
	addClass(feedbackContainer, 'is-false');
	// Track first user choice on progress bar
	if (!hasClass(currentPosition, 'is-true')) { 
		addClass(currentPosition, 'is-false'); 
	}
}

// Shows true answer feedback
var trueAnswer = function() {
	attempts += 1;
	// Reveal target feedback, hide sibling feedback
	applyAll(getSiblings(currentFeedbackTrue), addClass, 'is-hidden');
	removeClass(currentFeedbackTrue, 'is-hidden');
	resetFeedback();
	// Set feedback container style
	addClass(feedbackContainer, 'is-true');
	// Track first user choice on progress bar
	if (!hasClass(currentPosition, 'is-false')) { 
		addClass(currentPosition, 'is-true'); 
	}
	// Reveal next or restart button
	if (pageNum === pageCount) { 
		removeClass(restart, 'is-disabled'); 
	} else {
		removeClass(next, 'is-disabled');
	}
}

// Shows solution feedback
var solutionAnswer = function() {
	// Reveal target feedback, hide sibling feedback
	applyAll(getSiblings(currentFeedbackSolution), addClass, 'is-hidden');
	removeClass(currentFeedbackSolution, 'is-hidden');
	resetFeedback();
	// Set feedback container style
	addClass(feedbackContainer, 'is-false');
	// Disable Check My Answer button
	if (hasClass(currentChoices, 'multi-select') || hasClass(currentChoices, 'drag-drop') || hasClass(currentChoices, 'dropdown')) {
		addClass(currentQuestion.querySelector('.button-check') , 'is-disabled');
	}
	// Reveal next or restart button
	if (pageNum === pageCount) { 
		removeClass(restart, 'is-disabled'); 
	} else {
		removeClass(next, 'is-disabled');
	}
}

// Shows hint feedback
var hintAnswer = function() {
	// Reveal target feedback, hide sibling feedback
	applyAll(getSiblings(currentFeedbackHint), addClass, 'is-hidden');
	removeClass(currentFeedbackHint, 'is-hidden');
	resetFeedback();
	// Set feedback container style
	addClass(feedbackContainer, 'is-hint');
	// Track first user choice on progress bar
	if (!hasClass(currentPosition, 'is-true')) { 
		addClass(currentPosition, 'is-false'); 
	}
}

// ----------------------------------------------------- //
//  ~ OPTION/TARGET-SPECIFIC FEEDBACK EVENT LISTENERS ~  //
// ----------------------------------------------------- //


// Enable option/target-specific feedback functionality
for (i = 0; i < dropzoneButtons.length; i++) {
	dropzoneButtons[i].previousElementSibling.addEventListener("click", function(){
		// Find parent of clicked button
		var parent;
		var findParent = function(element) {
			parent = element;
			for (j = 0; j < 20; j++) {
				if (parent.parentNode.id !== 'choices' + pageNum) {
					parent = parent.parentNode;
				} else {
					parent = parent.parentNode;
					return parent;
					break;
				}
			}
		}
		findParent(this);
		// Reveal target-specific feedback on click
		if (hasClass(parent, 'drag-drop') && hasClass(parent, 'target-feedback')) {
			if (!hasClass(feedbackContainer, 'is-hidden')) {
				var answer;
				var number = this.nextElementSibling.id.substring(4);
				if (hasClass(feedbackContainer, 'is-true')) {
					answer = 'true';
				} else {
					answer = 'false';
				}
				var specificFeedback = document.getElementById(answer + number);
				applyAll(getSiblings(specificFeedback), addClass, 'is-hidden');
				removeClass(specificFeedback, 'is-hidden');
			}
		}
	})
}




// ------------------------------------------------------- //
//  ~ IMAGE BUTTON MOUSEOVER/MOUSELEAVE EVENT LISTENERS ~  //
// ------------------------------------------------------- //


// Mouseover functionality for image buttons
for (i = 0; i < imageButtons.length; i++) {
	imageButtons[i].addEventListener("mouseover", function(){
		// Store current mouse position
		mouseOut = false;
		// Remove 'unfocus' from current target
		removeClass(this, 'is-unfocus');
		// Add 'focus' to current target
		addClass(this, 'is-focus');
		// Remove 'focus' from current target's siblings
		applyAll(getSiblings(this), removeClass, 'is-focus');
		var siblings = getSiblings(this);
		// Add 'unfocus' to current target's siblings if unselected
		for (j = 0; j < siblings.length; j++) {
			if (!hasClass(siblings[j], 'is-selected')) {
				addClass(siblings[j], 'is-unfocus');
			}
		}
	})
}

// Mouseout functionality for image buttons
for (i = 0; i < imageButtons.length; i++) {
	imageButtons[i].addEventListener("mouseleave", function(){
		mouseOut = true;
		var imageButtonsPage = document.querySelectorAll('#choices' + pageNum + ' .button-img');
		var active = false;
		var activeButton;
		var selected = false;
		var unselectedButtons = [];
		// Store current active button and set state to active
		for (j = 0; j < imageButtonsPage.length; j++) {
			if (hasClass(imageButtonsPage[j], 'is-active')) {
				activeButton = imageButtonsPage[j];
				active = true;
			}
		}
		// Store unselected buttons and set state to selected
		for (j = 0; j < imageButtonsPage.length; j++) {
			if (hasClass(imageButtonsPage[j], 'is-selected')) {
				selected = true;
			} else {
				var currentUnselected = imageButtonsPage[j];
				unselectedButtons.push(currentUnselected);
			}
		}
		// Timed delay to avoid running function while mousing between buttons
		setTimeout(function(){
			// Resets image buttons to initial state, if active state is false
			if (mouseOut && !active) {
				applyAll(imageButtonsPage, removeClass, 'is-focus');
				applyAll(imageButtonsPage, removeClass, 'is-unfocus');
			// Set active button's siblings to 'unfocus', remove classes from active button
			} else if (mouseOut && active && !selected) {
				removeClass(activeButton, 'is-unfocus');
				applyAll(getSiblings(activeButton), addClass, 'is-unfocus');
				applyAll(imageButtonsPage, removeClass, 'is-focus');
			}
			// Set unselected buttons to 'unfocus', remove classes from selected buttons
			if (mouseOut && selected) {
				applyAll(imageButtonsPage, removeClass, 'is-focus');
				applyAll(unselectedButtons, addClass, 'is-unfocus');
			}
		}, 100)
	})
}




// ------------------------------- //
//  ~ DRAG & DROP FUNCTIONALITY ~  //
// ------------------------------- //


function dragstart_handler(ev) {
	// Remove flash from all buttons
	applyAll(currentChoices.querySelectorAll('a'), removeClass, 'flash-false');
	// Set the drag's format and data. Use the event target's id for the data 
	ev.dataTransfer.setData("text", ev.target.id);
}

function dragover_handler(ev) {
	ev.preventDefault();
}

function drop_handler(ev) {
	ev.preventDefault();
	// Get the data, which is the id of the drop target
	var data = ev.dataTransfer.getData("text");
	var node = document.getElementById(data);
	// Duplicates dragged button for questions with 'reusable options' functionality
	if (hasClass(node.parentNode.parentNode, 'reusable-options')) {
		var dupNode = node.cloneNode(true);
		currentDragGroup.insertBefore(dupNode, node);
	}
	ev.target.appendChild(node);
	// Change the source element's background color and spacing
	addClass(node, 'was-dragged');
	// Clear the drag data cache (for all formats/types)
	ev.dataTransfer.clearData();
	if (hasClass(currentChoices, 'minimize')) {
		minimizeDragLayout();
	}
}




// -------------------------------------- //
//  ~ MINIMIZE DRAG-DROP BUTTON LAYOUT ~  //
// -------------------------------------- //


// Set max-height for minimized drag group container to achieve masonry layout
var minimizeDragLayout = function() {
	if (hasClass(currentChoices, 'minimize')) {
		var numCol = 3;
		var numElem = currentDragGroup.children.length;
		var elemArray = [];
		for (i = 0; i < currentDragGroup.children.length; i++) {
			elemArray.push(currentDragGroup.children[i].offsetHeight);
		}
		var elemMargin = window.getComputedStyle(currentDragGroup.firstElementChild).getPropertyValue('margin');
		elemMargin = parseFloat(elemMargin);
		elemMargin *= 2;
		var totalHeight = 0;
		for (i = 0; i < elemArray.length; i++) {
			totalHeight += elemArray[i];
			totalHeight += elemMargin;
		}
		var maxColHeight = 0;
		maxColHeight = Math.ceil(totalHeight/numCol + totalHeight/(numElem + 1));
		currentDragGroup.style.maxHeight = maxColHeight + 'px';
	}
}

// Run if first page has minimize activated
if (pageNum === 1 && hasClass(currentChoices, 'minimize')) {
	minimizeDragLayout();
}


		