document.getElementById("addCity").addEventListener('click', function(event){
	window.location.href = '/cities';
	event.preventDefault();
});


document.getElementById("addCharacter").addEventListener('click', function(event){
	window.location.href = '/chars';
	event.preventDefault();
});

document.getElementById("addBuilding").addEventListener('click', function(event){
	window.location.href = '/buildings';
	event.preventDefault();
});

document.getElementById("addOutfit").addEventListener('click', function(event){
	window.location.href = '/outfits';
	event.preventDefault();
});

document.getElementById("addItem").addEventListener('click', function(event){
	window.location.href = '/items';
	event.preventDefault();
});
