var newLoc = String(window.location).replace(/https\:\/\/docs\.oracle\.com\/javase\/[678]/g, "https://docs.oracle.com/javase/8");
if(newLoc != String(window.location)){
	window.location = newLoc;
}