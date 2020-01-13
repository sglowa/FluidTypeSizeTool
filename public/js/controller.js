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
			case 'font-dropdown':
				child = createDropdown();
				break;
			case 'number':
				child = createNumber();
				break;
			case 'box-vals':
				child = createMargin();
				break;
			case 'text-align':
				child = createTextAlign();
				break;
			default:
				child = document.createElement('dev');
				child.innerText =  `oops! "${el.getAttribute('type')}" not recognized!`;
				console.log("couldn't recognize controller item's type");
				break;
		}
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
		const f = document.createElement('form');
		const iMin = document.createElement('input');
		iMin.setAttribute('type', 'number');
		const iMax = iMin.cloneNode(true)
		iMin.setAttribute('placeholder', 'min size')
		iMax.setAttribute('placeholder', 'max size')
		f.appendChild(iMin);	
		f.appendChild(iMax);
		const b = document.createElement('input');
		b.setAttribute('type','button');
		b.innerText = 'update';
		b.addEventListener('click',function(event){
			if(iMin.value <= iMax.value){
				//NOW±NOW±NOW get this done !!!				
				const mStr = f.parentElement.getAttribute('mediaquery');
				const m = extractBP(mStr);
				let val = calcFluidT(iMin.value,iMax.value,m[0],m[1]);
				let sel = pullAttr(f,val)
				updateRuleVal(sel);	
			}
		})
		f.appendChild(b);  
		return f;

		function calcFluidT(minFS,maxFS,minV,maxV){
			const r = 'calc('+minFS+'px + ('+maxFS+' - '+minFS+') * ((100vw - '+minV+'px) / ('+maxV+' - '+minV+')))';
			return r;	
		}		
	}

	function createDropdown(){
		// TO DO : BIG
		const e = document.createElement('select');
		e.innerHTML = `
		  <option value="one">one</option>
		  <option value="two">two</option>
		  <option value="three">three</option>
		  <option value="four">four</option>`
		return e;
	}

	function createNumber(){
		// TO DO : number input + dropdown[px,em...]
		const e = document.createElement('input');
		e.setAttribute('type', 'number');
		return e;
	}

	function createMargin(){
		// TO DO : 4 text input > check with regEx if number_px || number_%
		const e = document.createElement('input');
		e.setAttribute('type', 'number');
		return e;
	}

	function createTextAlign(){
		// TO DO : dropdown[left,right,center,justify]
		const e = document.createElement('input');
		e.setAttribute('type', 'number');
		return e;
	}

// will be checking for this when updating panel upon bp change
this.inputsCreated = true;	
}

// gets attr that point to the rule corresponding to the controller item 
function pullAttr(t,value){	
	const o = {				
		mq : t.parentElement.getAttribute('mediaquery'),
		el : t.parentElement.getAttribute('elemrule'),
		p : t.parentElement.getAttribute('prop')
	}
	o.v = value ? value : t.value;
	return o;
}

// updates rules based on mediaQuery,elements,property,value
function updateRuleVal({mq,el,p,v}){
	sheet.getRule('@global').getRule(mq).getRule(el).prop(p,v);
}
// helper
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}


