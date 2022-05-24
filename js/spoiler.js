var spoilerButtons = document.querySelectorAll('.spoiler-button');
var i;
//console.log(spoilerButtons);

for (i = 0; i < spoilerButtons.length; i++) {
	spoilerButtons[i].addEventListener('click', function(){
		this.classList.toggle('is-active');
		console.log(this.classList);
		var panel = this.nextElementSibling;
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + 'px';
			// Fix for brightspace iframe height resizing
			setTimeout(function(){
				panel.style.maxHeight = (panel.scrollHeight + 0.5) + 'px';
			}, 300);
		} 		
	}
)}