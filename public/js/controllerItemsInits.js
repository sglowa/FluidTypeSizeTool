function createColPicker(obj){
		// remember, from right to left;
		let node = obj.inputs.color = document.createElement('input');		
		node.setAttribute('type', 'color');		
		node.addEventListener('input', function(){
			obj.updateRuleValue();
			if (obj.inheritGlobalBtn) {
				obj.inheritGlobalBtn.checked = false;	
			}
			
		})	
		// FOR L8R > elmnts copy vals from prop.elements not from global;
		// obj.updateRuleValue('');
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

function createNumber(obj){	
	// we accept em, px, %, vw for letterspacing, vh for line height (or should both be allowed?)
	let node = obj.inputs[obj.property] = document.createElement('input');	
	setAttributes(node,{type:"text",
		placeholder:'use em, px, %, vw or vh'});

	node.addEventListener('input', function(){
		obj.updateRuleValue();
		if (obj.inheritGlobalBtn) {
			obj.inheritGlobalBtn.checked = false;	
		}		
	})

	obj.getValue = ()=>{		
		console.log(obj)
		let v = obj.inputs[obj.property].value;
		v += "";
		v = v.replace(/\s/gm,"");

		if (v==""){
			return "normal";
		}else{
			v = v.match(/([-+]?[0-9]*\.?[0-9]+).?(px|em|vw|vh|%)/mg);
			if(v!=null){
				if (v.length==1){
					return v;	
				}else if(v.length > 1){
					console.log('one value only');
				}
			}						
		}
	}
	return node;	
}

function createBoxVals(obj){
	let nodes = [];
	for (var i = 0; i < 4; i++) {
		let node = obj.inputs[obj.property+i] = document.createElement('input');	
		setAttributes(node,{type:"text",
			placeholder:'use em, px, %, vw or vh'});

		node.addEventListener('input', function(){
			obj.updateRuleValue();
			if (obj.inheritGlobalBtn) {
				obj.inheritGlobalBtn.checked = false;	
			}		
		})
		nodes.push(node);	
	}

	obj.getValue = ()=>{
		let a = ['invalid','invalid','invalid','invalid']; //result & value
		let v = '';
		i = 0; 
		for (const k in obj.inputs) {
			v = obj.inputs[k].value;				
			v += ''; //stringifying just in case
			v = v.replace(/\s/gm,"");

			if (v.match(/([-+]?[0-9]*\.?[0-9]+).?(px|em|vw|vh|%)/mg)!=null){
				a[i]=v.match(/([-+]?[0-9]*\.?[0-9]+).?(px|em|vw|vh|%)/mg)[0];
			}else if(v==""){
				a[i] = v;
			}
			i++; 
		}
		let str = a.toString();
		str = str.replace(/\,/g,' ');
		if (a[0]&&a[1]&&a[2]&&a[3]) return str;
		if (a[0]&&a[1]&&a[2]==""&&a[3]=="") return str;
		if (a[0]&&a[1]==""&&a[2]==""&&a[3]=="") return str;
		if (a[0]==""&&a[1]==""&&a[2]==""&&a[3]=="") return "auto";
	}
	return nodes;
}

function createDropdown(obj){
	const p = obj.property;
	let a =[];
	switch(p){
		case 'text-align':
			a = ['left','right','center','justify'];
			break;
		// case 'font-family'
		// 	a = [];
		// 	break;
	}	
	const sel = obj.inputs[p] = document.createElement('select');
	for (const o of a) {
		const el = document.createElement('option');
		el.setAttribute('value',o);
		el.innerText = o;
		sel.appendChild(el);
	}
	sel.addEventListener('input',()=>{
		obj.updateRuleValue();
		if (obj.inheritGlobalBtn) {
			obj.inheritGlobalBtn.checked = false;	
		}
	})
	return sel;
}

function createError(obj){
	let node = document.createElement('div');
	node.innerText =  `oops! "${obj.type}" not recognized!`;
	// console.count(`couldn't recognize controller item's type : ${this.type}`);
	return node;
}

export {createColPicker,createEquation,createError
	,createNumber,createBoxVals,createDropdown}