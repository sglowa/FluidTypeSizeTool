/*jshint esversion:6*/
import {createColPicker,createEquation
	,createError,createNumber,createBoxVals,createDropdown} from "./controllerItemsInits.js";

class ControllerItem {
	constructor(parent){
		this.parent = parent;
		this.type = parent.getAttribute('type');
		this.property = parent.getAttribute('prop');
		this.mediaQuery = parent.getAttribute('mediaquery');
		this.breakPoint = parent.parentElement.parentElement.getAttribute('id');
		this.elementRule = parent.getAttribute('elemrule');		
		this.inputs = {};
		this.storedVals = {};
		this.inheritGlobalBtn = true;
	}

	updatemq = (mq) => {
		mq = mq == undefined ? parent.getAttribute('mediaquery') : mq;
		this.parent.setAttribute('mediaquery',mq);
		this.mediaQuery = mq;
	}

	getValue = () => {
	//this is the default
		let r = ''; //result & value
		let v = '';
		for (const k in this.inputs) {
			v = this.inputs[k].value;				
			v += ''; //stringifying just in case
			v = v.trim();
			r += v + " ";//space between v in case many v
		}
		return r.trim();
	}	

	updateRuleValue = (v) => {		
		let val = v==null ? this.getValue() : v;
		sheet.getRule(this.mediaQuery)
		.getRule(this.elementRule)
		.prop(this.property,val);
		// console.log(`updating style at ${this.mediaQuery} ${this.elementRule} ${this.property} ${this.getValue()}`)	
	};

	resetInputValues = ()=>{
		for (const k in this.inputs) {
			this.inputs[k].value = "";							
		}
	};

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
			case 'number':
				return createNumber(this);
				break;
			case 'box-vals':
				return createBoxVals(this);
				break;
			case 'dropdown':
				return createDropdown(this);
				break;	
			default:
				return createError(this);
				break;
		}
	};

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
	};

	createInheritGlobal = ()=>{
		this.inheritGlobalBtn = document.createElement('input');
		this.inheritGlobalBtn = setAttributes(this.inheritGlobalBtn, {type:'button',checked:true,class:'inheritGlobal',value:'global'});
		this.inheritGlobalBtn.addEventListener('click', (event)=>{
			let node = this.inheritGlobalBtn;
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
				}
				this.trackByGlobalController(true);					
			}
			node.checked = !node.checked;
			this.updateRuleValue();
		})
		return this.inheritGlobalBtn;
	}
	getGlobal = ()=>{
		// !! do i need to rewrite to pull from obj, not the stylesheet? 
		const r = sheet.getRule('@media')
		.getRule(this.elementRule)
		.prop(this.property); 
		return r;
	};
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

	updateRuleValue = (v) => {
		let val = v==null ? this.getValue() : v;
		sheet.getRule(this.mediaQuery)
		.getRule(this.elementRule)
		.prop(this.property,val);
		this.trickleVals();
	}	

	// here we need an array,
	// the array is part of the global controllerItem
	// on globalInherit of mq controllerItem push the controller Item into the array
	// hookup the trickle down function to updateRuleValue()
	//		create additional function for trickle down
	//		and modify updateRuleValue();    
}

export {ControllerItem, ControllerItemGlobal}