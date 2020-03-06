/*jshint esversion:6*/

let posArr;

// !! important some of these might break when only 1 handle left; fix! 

function createSlider(hArr){
	// hArr -  new boundary vals
	console.log(hArr);
	let slider = document.getElementById('slider');	
	noUiSlider.create(slider, {
		start: hArr,
		connect: true,
		range: {
			'min': 0,
			'max': 3840
		},
		behaviour:'tap',
		tooltips:true,
		// format passed and received vals
		format:{
			from:(value)=>{
				return Math.floor(parseInt(value));
			},
			to:(value)=>{
				return Math.floor(parseInt(value));
			}
		}
	});	
	console.log('createSlider');
	console.log(slider);
	// hooking up event handlers
	updateEventHandler();
	endEventHandler();
}

function endEventHandler(){
	// user stops interacting with the slider
	slider.noUiSlider.on('end.one',(val,h)=>{
		console.log(val);		
		if (val.length!=slider.noUiSlider.get().length) return;
		const rangesArr = getRangesArr(val);
		panel.adjustBP(rangesArr, h);
	});
}


function updateEventHandler(){
	slider.noUiSlider.on('update.one',(val,h,u,tap)=>{
		console.log(val);
		console.log(h);
		console.log(u);
		console.log(tap);
		// when moving slider, check if overlaps with another slider
		if(!tap){
			posArr = val;
			checkIfOverlap(val,h);
		} else {
			slider.noUiSlider.setHandle(h,posArr[h],false);
			addHandle(val[h]);
		}	
	});
}

function addHandle(pos){
	const bpObjList = panel.tabs.list;
	posArr = slider.noUiSlider.get();
	// formatting as array
	posArr = !Array.isArray(posArr) ? 
		(()=>{let t = posArr;
			posArr = [];
			posArr.push(t);
			return posArr})() :
			posArr;			 
	/*finding index of the new handle
	by comparing new handle value with present values.
	this is what might be causing the bug*/ 
	let i = posArr.findIndex((elem)=>{
		return elem > pos;
	});	

	// if no present val is greater than new val 
	// (meanign new val added all the way to right)
	// than we put it in the end of the array
	i = i==-1 ? posArr.length : i;

	// check if number of handles reched the limit.
	// the number of bp properties in bpObjList is fixed.
	// number of handles == number of breakpoints + global, dont do anything
	let count = 0;
	for (const k in bpObjList) if (bpObjList.hasOwnProperty(k)) count++;
	if(posArr.length == count) return;	
	// add new handle value to posArr at index (to keep the order increasing)
	// replace slider with the updated one
	posArr.splice(i,0,pos);
	slider.noUiSlider.destroy();
	createSlider(posArr);
	// format boundaries to breakpoint ranges
	// depending on position of the new value in the array insert new bp appropriately
	const rangeArr = getRangesArr(posArr);
	const newRule = i==0 ? panel.prependBP(rangeArr,i) :
		i == posArr.length - 1 ? panel.appendBP(rangeArr,i) :
		panel.insertBP(rangeArr,i);
	// console.log(`i : ${i}`); // the i is the new handle index;
	// console.log(`2. posArray: ${posArr}`) // this is the new array new handle  
}

function checkIfOverlap(val,h){
	let withPrev = h ? (val[h] == val[h-1]) : false;
	let withNext = h != val.length-1 ? (val[h] == val[h+1]) : false;
	let rmInd = withPrev ? 
		h-1 : 
		withNext ? 
		h+1 : 
		undefined;
	if (rmInd!==undefined) rmHandle(rmInd, h);	
}

function rmHandle(rmInd, expandInd){
	const rangesArr=getRangesArr(posArr);
	panel.removeBP(rangesArr ,rmInd, expandInd);
	posArr.splice(rmInd,1);
	slider.noUiSlider.destroy();
	createSlider(posArr);
}

function getRangesArr(val){
	const rangesArr = [];
		for (var i = 0; i < val.length; i++) {
			if (i==val.length-1) break;	
			const maxMin = [];
			maxMin.push(val[i]);
			maxMin.push((val[i+1])-1);
			rangesArr.push(maxMin);
		}
		return rangesArr;
}

export{createSlider,posArr};

// HOW TO IMPLEMENT ::

// Pull START VARS from 