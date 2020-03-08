/*jshint esversion:6*/
function addFontHandler(){
	const dropZone = document.querySelector('div.fontdrop-area');
	dropZone.addEventListener('drop', function(e){
		e.preventDefault();
		processFile(e);
	});	
	dropZone.addEventListener('click', function(){
		console.log('green clicked');
	});
	dropZone.addEventListener('dragover',function(e){
		console.log('File(s) in drop zone'); 
	  	// Prevent default behavior (Prevent file from being opened)
	  	e.preventDefault();
	});
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
	        if (isFont(file.name)) toBase64(file, fontType(file.name)); 
	      }
	    }
	} else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			file = ev.dataTransfer.files[i];
		  	console.log('... file[' + i + '].name = ' + file.name);
		  	if (isFont(file.name)) toBase64(file, fontType(file.name));
		}
	}	
}

function isFont(filename){
	let is = filename.match(/\.(woff|otf|ttf)/gm);
	is = is == undefined ? false : true;
	return is;
}

function fontType(filename){
	let type = filename.match(/\.(woff|otf|ttf)/gm)[0].split(".")[1];
	type = type == "ttf" ? "truetype" :
		type == "otf" ? "opentype" :
		type;
	return type;
}

function toBase64(file,type){
	const prom = new Promise((resolve, reject) => {
	    const reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = () => resolve(reader.result);
	    reader.onerror = error => reject(error);
	});
	// returns BASE64 encoded file
    prom.then((val)=>{
    	const name = file.name.split(".")[0];
        generateFontFace(val,name,type);
        console.log(file);
    });	
}


function generateFontFace(val,name,type){

	// worksss
	
	// check if font already loaded; 

	let new_font = new FontFace(name, `url(${val}) format('${type}')`);
	new_font.load().then((loaded_face)=>{
		document.fonts.add(loaded_face);
		panel.fonts.push(name);
		let event = new Event('font');
		window.dispatchEvent(event);
		// console.log(name);
		// console.log(loaded_face);
	});

	// this needs to pass over the name of the font and
	// the style (search for bold and italic and thin) 

}

export {addFontHandler};