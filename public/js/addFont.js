function addFontHandler(){
	const dropZone = document.querySelector('div.fontdrop-area');
	dropZone.addEventListener('drop', function(e){
		e.preventDefault();
		processFile(e);
	})	
	dropZone.addEventListener('click', function(){
		console.log('green clicked');
	})
	dropZone.addEventListener('dragover',function(e){
		console.log('File(s) in drop zone'); 
	  	// Prevent default behavior (Prevent file from being opened)
	  	e.preventDefault();
	})
}


function processFile(ev){	
	let file;
	if (ev.dataTransfer.items){
	    // Use DataTransferItemList interface to access the file(s)
	    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
	      // If dropped items aren't files, reject them
	      if (ev.dataTransfer.items[i].kind === 'file') {
	        file = ev.dataTransfer.items[i].getAsFile();
	        console.log('... file[' + i + '].name = ' + file.name);
	      }
	    }
	} else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			file = ev.dataTransfer.files[i];
		  	console.log('... file[' + i + '].name = ' + file.name);
		}
	}
	// console.log(file);
	// async function

	// 	console.log(await toBase64(file));	
	
	
	
}



function toBase64(file){
	new Promise((resolve, reject) => {
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = () => resolve(reader.result);
	    reader.onerror = error => reject(error);
	});	
}



export {addFontHandler};