document.getElementById("addEntity").addEventListener('click', function(event){
	window.location.href = '/addEntity';
	event.preventDefault();
});

document.getElementById("addRelationship").addEventListener('click', function(event){
	window.location.href ='/addRelationship';
	event.preventDefault();
});

document.getElementById("filterCity").addEventListener('click', function(event){
	window.location.href ='/filterCity';
	event.preventDefault();
});
