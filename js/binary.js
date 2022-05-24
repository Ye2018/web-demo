// --------------------- //
//     ~ VARIABLES ~     //
// --------------------- //


// Variables - Containers
var questionContainer = document.querySelector('.question-container');
var feedbackContainer = document.querySelector('.feedback-container');
var progressContainer = document.querySelector('.progress-container');
var buttonGroupRight = document.querySelector('#button-group-right');
var buttonGroupLeft = document.querySelector('#button-group-left');

// Variables - Elements
var questions = document.querySelectorAll('.question');
var feedback = document.querySelectorAll('.feedback-container div');

// Variables - Buttons
var buttons = document.querySelectorAll('.interactive a');
var next = document.querySelector('#next');
var previous = document.querySelector('#previous');
var restart = document.querySelector('#restart');
var positionButtons = progressContainer.children;

// Variables - Iterators
var i;
var j;

// Variables - Pages
var pageNum = 1;
var pageCount = questions.length;

// Variables - Current Elements
var currentQuestion;
var currentFeedbackTrue;
var currentFeedbackFalse;
var currentPosition;




// ------------------------- //
//    ~ HELPER FUNCTIONS ~   //
// ------------------------- //


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
	for (i = 0; i < elem.length; i++) {
		fn(elem[i], className);
	}
}




// --------------------------- //
//    ~ ON-LOAD FUNCTIONS ~    //
// --------------------------- //


// Resize text if over established character count
for (i = 0; i < questions.length; i++) {
	var questionText = questions[i].querySelectorAll('p');
	var textStringLength = 0;
	for (j = 0; j < questionText.length; j++) {
		var textString = questionText[j].innerHTML;
		textStringLength = textStringLength + textString.length;
	}
	if (textStringLength > 300) {
		applyAll(questionText, addClass, 'small');
	}
}

// Hide progress-container if animation only has one page
if (pageCount <= 1) {
	addClass(progressContainer, 'is-hidden');
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




// -------------------------------- //
//    ~ RESET/REVEAL FUNCTIONS ~    //
// -------------------------------- //


// Reset feedback container
var clearFeedback = function() {
	removeClass(feedbackContainer, 'is-true');
	removeClass(feedbackContainer, 'is-false');
	applyAll(feedback, addClass, 'is-hidden');
}

// Reset content prior to moving to a new page
var resetContent = function() {
	addClass(feedbackContainer, 'is-hidden');
	questionContainer.style.paddingTop = '2rem';
	applyAll(questionContainer.children, addClass, 'is-hidden');
	applyAll(progressContainer.children, removeClass, 'is-active');
	applyAll(buttons, removeClass, 'is-active');
	setTimeout(function(){
		applyAll(feedbackContainer.children, addClass, 'is-hidden');
	}, 200);
}

// Update element variables to match current page
var updateVariables = function() {
	currentQuestion = document.getElementById('question' + pageNum);
	currentFeedbackTrue = document.getElementById('true' + pageNum);
	currentFeedbackFalse = document.getElementById('false' + pageNum);
	currentPosition = document.getElementById('pos' + pageNum);
}

// Reveal new page content
var revealContent = function() {
	addClass(currentPosition, 'is-active');
	removeClass(currentQuestion, 'is-hidden');
}

// Reveal navigational buttons
var revealButtons = function() {
	
	// First page
	if (pageNum === 1) {
		if (hasClass(currentQuestion, 'is-answered')) {
			removeClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			addClass(restart, 'is-hidden');
			removeClass(next, 'is-hidden');
		} else {
			addClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			setTimeout(function(){
				addClass(restart, 'is-hidden');
				removeClass(next, 'is-hidden');
			}, 200)
		}
		addClass(buttonGroupLeft, 'is-disabled');
		
	// Last page
	} else if (pageNum === pageCount) {
		if (hasClass(currentQuestion, 'is-answered')) {
			removeClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			addClass(next, 'is-hidden');
			removeClass(restart, 'is-hidden');
		} else {
			addClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			setTimeout(function(){
				addClass(next, 'is-hidden');
				removeClass(restart, 'is-hidden');
			}, 200)
		}
		removeClass(buttonGroupLeft, 'is-disabled');
		
	// Inner pages
	} else {
		if (hasClass(currentQuestion, 'is-answered')) {
			removeClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			addClass(restart, 'is-hidden');
			removeClass(next, 'is-hidden');
		} else {
			addClass(buttonGroupRight, 'is-disabled');
			// Switch restart button to next button
			setTimeout(function(){
				addClass(restart, 'is-hidden');
				removeClass(next, 'is-hidden');
			}, 200)
		}
		removeClass(buttonGroupLeft, 'is-disabled');
	}
}




// -------------------------------- //
//    ~ CHOICE EVENT LISTENERS ~    //
// -------------------------------- //


for (i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", function(){
		var buttonId = this.id;
		buttonId = buttonId.slice(3);
		clearFeedback();
		if (buttonId == answers[pageNum - 1]) {
			addClass(feedbackContainer, 'is-true');
			removeClass(currentFeedbackTrue, 'is-hidden');
			// Track first user choice on progress bar
			if (!hasClass(currentPosition, 'is-false')) { 
				addClass(currentPosition, 'is-true'); 
			}
		} else {
			addClass(feedbackContainer, 'is-false');
			removeClass(currentFeedbackFalse, 'is-hidden');
			// Track first user choice on progress bar
			if (!hasClass(currentPosition, 'is-true')) { 
				addClass(currentPosition, 'is-false'); 
			}
		}
		removeClass(feedbackContainer, 'is-hidden');
		removeClass(buttonGroupRight, 'is-disabled');
		// Set selected button to active
		applyAll(getSiblings(this), removeClass, 'is-active');
		addClass(this, 'is-active');
		// Set current question to answered
		addClass(currentQuestion, 'is-answered');
		// Enable position button for completed page
		removeClass(currentPosition, 'is-disabled');
		// Stretch container to accommodate feedback
		var feedbackContainerHeight = feedbackContainer.offsetHeight;		
		questionContainer.style.paddingTop = 'calc(2rem + ' + feedbackContainerHeight + 'px)';
	})
}




// -------------------------------- //
//  ~ NAVIGATION EVENT LISTENERS ~  //
// -------------------------------- //


// Next button functionality
next.addEventListener('click', function(){
	resetContent();
	// Enable previous button
	removeClass(buttonGroupLeft, 'is-disabled');
	pageNum = pageNum + 1;
	updateVariables();
	revealButtons();
	revealContent();
});

// Previous button functionality
previous.addEventListener('click', function(){
	resetContent();
	pageNum = pageNum - 1;
	updateVariables();
	revealButtons();
	revealContent();
});

// Restart button functionality
restart.addEventListener('click', function(){
	resetContent();
	// Reset progress bar tracking
	applyAll(progressContainer.children, removeClass, 'is-true');
	applyAll(progressContainer.children, removeClass, 'is-false');
	// Enable previous button
	addClass(buttonGroupLeft, 'is-disabled');
	pageNum = 1;
	updateVariables();
	applyAll(questions, removeClass, 'is-answered');
	revealButtons();
	revealContent();
});

// Position buttons click functionality
for (i = 0; i < positionButtons.length; i++) {
	positionButtons[i].addEventListener("click", function(){
		resetContent();
		// Set page number to targeted page
		pageNum = Number(this.id.match(/\d+/));
		updateVariables();
		revealButtons();
		revealContent();
	})
}




updateVariables();