// Accomodate lightbox images that are taller than the brighspace viewport
window.addEventListener('hashchange', function(){
	var id = window.location.hash;
	if (id !== '#_' || !id) {
		var imageHeight = document.querySelector(id + ' img').naturalHeight;
		document.querySelector('body').style.minHeight = (imageHeight + 200) + 'px'; 
	} else {
		document.querySelector('body').style.minHeight = null;
	}
}, false)