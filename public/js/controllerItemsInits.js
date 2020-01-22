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

export {createColPicker, createEquation, createError}