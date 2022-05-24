// JavaScript Document

var i;

// Video stop function
function stopVideoTabs(elem) {
	var iframes = elem.querySelectorAll('iframe');
	var videos = elem.querySelectorAll('video');
	if (iframes) {
		for (i = 0; i < iframes.length; i++) {
			var iframeSrc = iframes[i].src;
			iframes[i].src = iframeSrc;
		}
	}
	if (videos) {
		for (i = 0; i < videos.length; i++) {
			videos[i].pause();
		}
	}
}

var animation = document.querySelector('.tabs');
var tabButtons = document.querySelectorAll('.tabs nav ul li');
var tabCount = document.querySelector('.tabs nav ul').childElementCount;
var tabContent = document.querySelectorAll('.tabs .content > div');

//Set first tab as active
tabButtons[0].classList.add('is-active');
tabContent[0].classList.add('is-visible');

// Adds a click event listener to each tab buttons
for (i = 0; i < tabButtons.length; i++) {
	tabButtons[i].addEventListener("click", tabSwitch);
}

function tabSwitch() {
	// Stores the number digits of the targeted tab button id
	var targetNumber = this.id.slice(-2);
	var targetContent = document.querySelector('#content' + targetNumber);
	var targetButton = document.querySelector('#tab' + targetNumber);
	// Pause videos in sibling tabs
	stopVideoTabs(animation);
	// Resets active and hidden states
	for (i = 0; i < tabButtons.length; i++) {
		tabButtons[i].classList.remove('is-active');
		tabContent[i].classList.remove('is-visible');
	}
	// Sets targeted tab button to active
	targetButton.classList.add('is-active');
	// Reveals targeted tab content
	targetContent.classList.add('is-visible');
}