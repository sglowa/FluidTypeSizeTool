panel.controllerList = function(){
	return document.querySelectorAll('div.controllerItem');
}

panel.createInputs = function(){
	let nonInheritable = ['font-size'];  	
	for (el of this.controllerList()){
		const mq = el.parentElement.parentElement
			.getAttribute('mediaquery');

		const isGlobal = (mq === "@media");
		if (isGlobal && nonInheritable.includes(el.getAttribute('prop'))){
			console.log('nonInheritable');
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

		if (child.inheritGlobalBtn) {
			el.appendChild(child.createInheritGlobal());	
		}						
	}
}

class ControllerItem {
	constructor(parent){
		this.type = parent.getAttribute('type');
		this.property = parent.getAttribute('prop');
		this.mediaQuery = parent.getAttribute('mediaquery');
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
		console.log(`updating style at ${this.mediaQuery} ${this.elementRule} ${this.property} ${this.getValue()}`)	
	}	
	//this is where HTML will be stored
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
	createInheritGlobal = ()=>{
		let node = this.inheritGlobalBtn = document.createElement('input');
		node = setAttributes(node, {type:'button',checked:true,class:'inheritGlobal',value:'global'});
		node.addEventListener('click', (event)=>{
			event.preventDefault();
			if (node.checked){
				// turn off
				for (const k in this.inputs) {
					this.inputs[k].value = this.storedVals[k]};
					// splice this from tracked array.
			}else{
				// turn on					
				for (const k in this.inputs){
					this.storedVals[k] = this.inputs[k].value;						
					this.inputs[k].value = this.getGlobal();
					//hook it up to global so that it keeps watching
				}					
			}
			node.checked = !node.checked;
			this.updateRuleValue();
		})
		return node;
	}
	getGlobal = ()=>{
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
	}

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
	console.log(`couldn't recognize controller item's type : ${this.type}`);
	return node;
}

// this should be added to the node prototype btw
function setAttributes(el, attrs) {
  for(const key in attrs){
    el.setAttribute(key, attrs[key]);
  }
  return el;
}

