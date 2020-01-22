panel.controllerList = function(){
	return document.querySelectorAll('div.controllerItem');
}

panel.createInputs = function(){
	let nonInheritable = ['font-size'];  	
	for (el of this.controllerList()){
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

class ControllerItem {
	constructor(parent){
		this.type = parent.getAttribute('type');
		this.property = parent.getAttribute('prop');
		this.mediaQuery = parent.getAttribute('mediaquery');
		this.breakPoint = parent.parentElement.parentElement.getAttribute('id');
		this.elementRule = parent.getAttribute('elemrule');		
		this.inputs = {};
		this.storedVals = {};
		this.inheritGlobalBtn = true;
	}
	getValue = ()=>{ //this is the default
		let r = ''; //result & value
		let v = '';
		for (const k in this.inputs) {
			v = this.inputs[k].value;				
			v += ''; //stringifying just in case
			v = v.trim();
			r += v + " ";//space between v in case many v
		}
		return r.trim();
	};
	updateRuleValue = () => {
		sheet.getRule('@global')
		.getRule(this.mediaQuery)
		.getRule(this.elementRule)
		.prop(this.property,this.getValue());
		// console.log(`updating style at ${this.mediaQuery} ${this.elementRule} ${this.property} ${this.getValue()}`)	
	}	
	// this is where HTML will be stored
	// 1. based on type create right elements
	// 2. add tracked elements to input
	// 3. define getValue
	// 4. addEventListener
	// 5. add Inherit from global
	createNodes = ()=>{
		switch (this.type) {
			case 'colPicker':
				return createColPicker(this);
				break;
			case 'equation':
				return createEquation(this);
				break;
			// case 'colPicker':
			// 	// statements_1
			// 	break;
			// case 'colPicker':
			// 	// statements_1
			// 	break;
			default:
				return createError(this);
				break;
		}
	}

	trackByGlobalController = (bool)=>{// here i look for the corresponding global controller and push it to this.globalController
		const prop = this.property;
		const elem = this.elementRule.replace(/(\W|editable)/gm,"");
		const trackAr = panel.tabs.list.global.submenu.list[elem][prop].tracked;
		return bool ?
			trackAr.push(this) :
			trackAr.indexOf(this)!=-1 ?
			trackAr.splice(trackAr.indexOf(this),1) :
			console.warn("the prop isn't tracked, can't untrack");
		 // but will it blend? so looong...
	}

	createInheritGlobal = ()=>{
		let node = this.inheritGlobalBtn = document.createElement('input');
		node = setAttributes(node, {type:'button',checked:true,class:'inheritGlobal',value:'global'});
		node.addEventListener('click', (event)=>{
			event.preventDefault();
			if (node.checked){
				// turn off
				for (const k in this.inputs) {
					this.inputs[k].value = this.storedVals[k]};
					this.trackByGlobalController(false);
					// splice this from tracked array.
			}else{
				// turn on					
				for (const k in this.inputs){
					this.storedVals[k] = this.inputs[k].value;						
					this.inputs[k].value = this.getGlobal();
					//hook it up to global so that it keeps watching
				}
				this.trackByGlobalController(true);					
			}
			node.checked = !node.checked;
			this.updateRuleValue();
		})
		return node;
	}
	getGlobal = ()=>{
		// !! do i need to rewrite to pull from obj, not the stylesheet? 
		const r = sheet.getRule('@global')
		.getRule('@media')
		.getRule(this.elementRule)
		.prop(this.property); 
		return r;
	} 		
}

// alter createInheritGlobal > track items switched to
// create array X of tracked items (push whole objects),
// eventListener on other items, push to array X
// addEventListener on inputs > tracked.getGlobal 
class ControllerItemGlobal extends ControllerItem {
	constructor(parent){
		super(parent);
		this.inheritGlobalBtn = false;
		this.tracked = [];
	}

	trickleVals = ()=>{
		if (this.tracked.length){
			for (const item of this.tracked){
				for (const k in item.inputs){
					item.inputs[k].value = item.getGlobal();					
				}
				item.updateRuleValue();
			}
		}
	}

	updateRuleValue = () => {
		sheet.getRule('@global')
		.getRule(this.mediaQuery)
		.getRule(this.elementRule)
		.prop(this.property,this.getValue());
		this.trickleVals();
	}	

	// here we need an array,
	// the array is part of the global controllerItem
	// on globalInherit of mq controllerItem push the controller Item into the array
	// hookup the trickle down function to updateRuleValue()
	//		create additional function for trickle down
	//		and modify updateRuleValue();    
}

function createColPicker(obj){
		// remember, from right to left;
		let node = obj.inputs.color = document.createElement('input');		
		node.setAttribute('type', 'color');
		node.addEventListener('input', function(){
			obj.updateRuleValue();
			obj.inheritGlobalBtn.checked = false;
		})
		return node;		
}

function createEquation(obj){
	obj.inheritGlobalBtn = false;
	obj.getValue = ()=>{ // overwriting getValue...
		const min = obj.inputs.min.value;
		const max = obj.inputs.max.value;		
		return calcFluidT(min,max,obj.mediaQuery);		
	}
	const f = document.createElement('form');
	const iMin = obj.inputs.min = document.createElement('input');
	iMin.setAttribute('type', 'number');
	const iMax = obj.inputs.max = iMin.cloneNode(true)
	iMin.setAttribute('placeholder', 'min size')
	iMax.setAttribute('placeholder', 'max size')
	f.appendChild(iMin);	
	f.appendChild(iMax);
	const b = document.createElement('input');
	b.setAttribute('type','button');
	setAttributes(b,{type:'button',value:'update'}) // creating the DOM branch	
	b.addEventListener('click',function(event){
			if(iMin.value <= iMax.value){				
				obj.updateRuleValue();				
			}
		})
	f.appendChild(b);
	return f;
}

function calcFluidT(minFS,maxFS,mq){
	const bp = extractBP(mq);
	const r = 'calc('+minFS+'px + ('+maxFS+' - '+minFS+') * ((100vw - '+bp[0]+'px) / ('+bp[1]+' - '+bp[0]+')))';
	return r;	
}	

function createError(obj){
	let node = document.createElement('div');
	node.innerText =  `oops! "${obj.type}" not recognized!`;
	// console.count(`couldn't recognize controller item's type : ${this.type}`);
	return node;
}

// this should be added to the node prototype btw
function setAttributes(el, attrs) {
  for(const key in attrs){
    el.setAttribute(key, attrs[key]);
  }
  return el;
}

