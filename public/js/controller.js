import {ControllerItem, ControllerItemGlobal} from "./controllerClasses.js";
import {panel} from "./workspace.js";
import {showBP} from "./addRemoveBp.js"

panel.controllerList = function(){
	return document.querySelectorAll('div.controllerItem');
}

panel.createInputs = function(){
	let nonInheritable = ['font-size'];  	
	for (const el of this.controllerList()){
		const mq = el.getAttribute('mediaquery');

		const isGlobal = (mq === "@media");	
		console.count(`is global : ${isGlobal}`);	
		if (isGlobal && nonInheritable.includes(el.getAttribute('prop'))){
			el.parentNode.removeChild(el);
			continue;
		}

		const child = isGlobal ? new ControllerItemGlobal(el) : new ControllerItem(el);
		const nodes = child.createNodes();		
		if (Array.isArray(nodes)){
			for (const i in nodes) {
				el.appendChild(nodes[i])
			}
		}else{el.appendChild(nodes)}	

		this.buildControllerTree(child); 
		
		if (child.inheritGlobalBtn) {
			el.appendChild(child.createInheritGlobal());			
		}
	}
}

panel.buildControllerTree = function(ctrlr){
	const bp = ctrlr.breakPoint;
	const elem = ctrlr.elementRule.replace(/(\W|editable)/gm,"");
	const prop = ctrlr.property; 	
	this.tabs.list[bp].submenu.list[elem][prop] = ctrlr;
}

panel.showBP = showBP;







