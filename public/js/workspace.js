let panel = {window:null,tabs:null,subtabs:[]};
const edit  = document.querySelector('button.edit');
edit.initPanel = (storedP)=>{
	panel.window = storedP ? 
		jsPanel.create(storedP) : (()=>{			
			return jsPanel.create({		
				content: httpPost('./control'),
				callback: ()=>{
					// tabbify breakPoints 
					panel.tabs = new Tabby('[data-tabs]');
					panel.assign(panel.tabs ,document.querySelectorAll('div.breakPoint')); 					
					// tabbify elem rules
					for (var i = 0; i < bp.index.length; i++){						
						panel.assignSub(bp.indexed[i],new Tabby(`[submenu=_${i}]`));
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

panel.assign = function(obj,divs){	
	const o = {};
	for (const e of divs) {
		const id = e.getAttribute('id');		
		o[id] = {
			div : e,
			li : document.querySelector(`[href='#${id}']`).parentElement,
			mediaQuery: e.getAttribute('mediaquery')
		}					
		obj.list = o;  	
	}	
}

panel.assignSub = function(mq,tab){
	for (const v in this.tabs.list) {
		if (this.tabs.list[v].mediaQuery == mq){
			this.tabs.list[v].submenu = tab;
			const divs = document.querySelectorAll(`div[mediaquery='${mq}'] > div`);
			this.assign(this.tabs.list[v].submenu,divs);		
		}
	}

}

function httpPost(theUrl){
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






