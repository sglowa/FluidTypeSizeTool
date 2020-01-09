let panel = {window:null,tabs:null,subtabs:[]};
const edit  = document.querySelector('button.edit');
edit.initPanel = (storedP)=>{
	panel.window = storedP ? 
		jsPanel.create(storedP) : (()=>{
			const elemRules = pullElemRules(styles); 				
			return jsPanel.create({		
				content: httpPost('./control', elemRules, textProps),
				callback: ()=>{
					// tabbify breakPoints 
					panel.tabs = new Tabby('[data-tabs]');
					// tabbify elem rules
					for (var i = 0; i < bp.index.length; i++){
						panel.subtabs.push(new Tabby(`[submenu=_${i}]`))
					}
					panel.createInputs();
				}
			});					
		})()
		

	panel.window.options.onclosed = (p)=>{
				p.status = 'closed';
				edit.style.display = 'block'
				}
};

edit.onclick = (e)=>{
	e.target.initPanel();
	e.target.style.display = "none";
	e.target.onclick = ()=>{
		if (panel.window.status == 'closed'){
			e.target.initPanel(panel.window);
			e.target.style.display = "none";
		}
	}
};

function httpPost(theUrl,elemRules){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request, important for data flow
    xmlHttp.setRequestHeader("Content-type", "application/json");
    bp.indexRun();
    const data = {bp:bp,elemRules:elemRules,textProps:textProps.indexed()}
    xmlHttp.send(JSON.stringify(data));
	return xmlHttp.responseText;  
}

document.body.onload = ()=>{
	initSheet();
}






