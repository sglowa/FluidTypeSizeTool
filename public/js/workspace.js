import {bp,textProps,elemRules} from "./parseCSSalt.js"
import {showBP,adjustBP} from "./addRemoveBp.js"
import {buildUi} from './controllerUX.js'



window.panel = {window:null,tabs:null};
panel.buildUi = buildUi;
panel.adjustBP = adjustBP;
panel.showBP = showBP;

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
					panel.showBP(4);
					panel.buildUi();
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
		let key = e.getAttribute('id');	
		let id = e.getAttribute('id');	
		let mq = e.getAttribute('mediaquery');
		if (mq==null){ //checking if mq tab or elem tab
			key = e.getAttribute("elemrule").replace(/(\W|editable)/gm,"");
		}
		o[key] = {
			div : e,
			li : document.querySelector(`[href='#${id}']`).parentElement
		}
		if (mq != null){
			o[key].mediaQuery = mq;
			o[key].sheetRule = sheet.getRule(mq); 
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

window.extractBP = (str)=>{
	const bp = str.match(/(\d+)/g) ? str.match(/(\d+)/g) : 'global'
	return bp;
}

window.parseBP = (rangeArr)=>{
	if (!Array.isArray(rangeArr)){
		console.log(`${rangeArr} is not an array`);
		return;
	}
	const mqArr = [];	
	if(Array.isArray(rangeArr[0])){ // if 2D arr
		for (const i in rangeArr) {
			mqArr.push(parseRange(rangeArr[i]));			
		}
		return mqArr;
	}
	return parseRange(rangeArr); // if 1D arr

	function parseRange(r){
		if (isNaN(r[0])&&isNaN(r[1])){
			console.log('isNaN');
			return; 
		}
		if (r[0]>r[1]){
			console.log(`min-width:${r[0]} can't be greater than max-width:${r[1]}!`);
			return;
		} 
		let media = '@media ';
		const min = !isNaN(r[0]) ? `(min-width: ${r[0]}px)` : '';
		const and = !isNaN(r[0]) && !isNaN(r[1]) ? ' and ' : '';
		const max = !isNaN(r[1]) ? `(max-width: ${r[1]}px)` : '';
		media = media + min + and + max;
		return media;
	}
}

// putting here to make globally accessible
// this should be added to the node prototype btw
window.setAttributes = (el, attrs)=>{
  for(const key in attrs){
    el.setAttribute(key, attrs[key]);
  }
  return el;
}





