panel.controllerList = function(){
	return document.querySelectorAll('div.controllerItem');
}

panel.createInputs = function(){
	for (el of this.controllerList()){		
		const child = new ControllerItem(el);
		const nodes = child.createNodes();
		if (nodes.length){
			for (const i in arr) {
				el.appendChild(arr[i])
			}
		}else{el.appendChild(nodes)}	
		el.appendChild(child.createInheritGlobal());				
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
		this.getValue = ()=>{ //this is the default
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
		this.updateRuleValue = () => {
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
		this.createNodes = ()=>{
			switch (this.type) {
				case 'colPicker':
					return createColPicker(this);
					break;
				// case 'colPicker':
				// 	// statements_1
				// 	break;
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
		this.createInheritGlobal = ()=>{
			let node = this.inheritGlobalBtn = document.createElement('input');
			node = setAttributes(node, {type:'button',checked:true,class:'inheritGlobal'});
			node.addEventListener('click', (event)=>{
				event.preventDefault();
				if (node.checked){
					for (const k in this.inputs) {
						this.inputs[k].value = this.storedVals[k]};											
				}else{					
					for (const k in this.inputs){
						this.storedVals[k] = this.inputs[k].value;						
						this.inputs[k].value = this.getGlobal();;							
					}					
				}
				node.checked = !node.checked;
				this.updateRuleValue();
			})
			return node;
		}
		this.getGlobal = ()=>{
			const r = sheet.getRule('@global')
			.getRule('@media')
			.getRule(this.elementRule)
			.prop(this.property); 
			return r;
		} 		
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

