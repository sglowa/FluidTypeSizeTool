let panel = {tabs:null};
const edit  = document.querySelector('button.edit');
edit.initPanel = (storedP)=>{
	panel = storedP ? 
		jsPanel.create(storedP) : (()=>{
			const elemRules = pullElemRules(styles); 				
			return jsPanel.create({		
				content: httpPost('./control', elemRules),
				callback: ()=>{
					panel.tabs = new Tabby('[data-tabs]');
				}
			});					
		})()
		

	panel.options.onclosed = (p)=>{
				p.status = 'closed';
				edit.style.display = 'block'
				}
};

edit.onclick = (e)=>{
	e.target.initPanel();
	e.target.style.display = "none";
	e.target.onclick = ()=>{
		if (panel.status == 'closed'){
			e.target.initPanel(panel);
			e.target.style.display = "none";
		}
	}
};

function httpPost(theUrl,elemRules){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request, important for data flow
    xmlHttp.setRequestHeader("Content-type", "application/json");
    const data = {bp:bp,elemRules:elemRules}
    xmlHttp.send(JSON.stringify(data));
	return xmlHttp.responseText;  
}

document.body.onload = ()=>{
	initSheet();
}