panel.controllerList = function(){
	return document.querySelectorAll('div.controllerItem');
}
panel.createInputs = function(){
	for (el of this.controllerList()) {
		let child;
		switch (el.getAttribute('type')) {
			case 'colPicker':
				child = createColPicker();
				break;
			case 'equation':
				child = createEquation();
				break;
			case 'dropdown':
				child = createDropdown();
				break;
			case 'number':
				child = createNumber();
				break;
			default:
				// statements_def
				break;
		}
		console.log(el);
		console.log(child);
		el.appendChild(child);
	}

	function createColPicker(){
		const e = document.createElement('input');
		e.setAttribute('type', 'color');
		e.addEventListener('input', function(e){
			const sel = pullAttr(e.target);
			updateRuleVal(sel)
		})
		return e;
	}
	function createEquation(){
		const e = document.createElement('input');
		e.setAttribute('type', 'color');

		return e;
	}
	function createDropdown(){
		const e = document.createElement('select');
		e.innerHTML = `
		  <option value="one">one</option>
		  <option value="two">two</option>
		  <option value="three">three</option>
		  <option value="four">four</option>`
		return e;
	}
	function createNumber(){
		const e = document.createElement('input');
		e.setAttribute('type', 'number');
		return e;
	}

}
// gets attr that point to the rule corresponding to the controller item 
function pullAttr(target){	
	const o = {		
		v : target.value,
		mq : target.parentElement.getAttribute('mediaquery'),
		el : target.parentElement.getAttribute('elemrule'),
		p : target.parentElement.getAttribute('prop')
	}
	return o;
}
// updates rules based on mediaQuery,elements,property,value
function updateRuleVal({mq,el,p,v}){
	sheet.getRule('@global').getRule(mq).getRule(el).prop(p,v);
}
			