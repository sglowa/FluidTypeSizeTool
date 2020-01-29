let posArr;

// !! important some of these might break when only 1 handle left; fix! 

function addHandle(pos){
	posArr = slider.noUiSlider.get();
	posArr = !Array.isArray(posArr) ? 
		(()=>{let t = posArr;
			posArr = []
			posArr.push(t)
			return posArr})() :
			posArr;			 	
		
	let i = posArr.findIndex((elem)=>{
		return elem > pos
	});	
	i = i==-1 ? posArr.length : i;
	posArr.splice(i,0,pos);
	slider.noUiSlider.destroy();
	createSlider(posArr);
}

function createSlider(hArr){
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
	    format:{
			from:(value)=>{
				return Math.floor(parseInt(value));
			},
			to:(value)=>{
				return Math.floor(parseInt(value));
			}
		}
	});	
	updateEventHandler();
	endEventHandler();
}

function endEventHandler(){
	slider.noUiSlider.on('end.one',(val,h)=>{		
		if (val.length!=slider.noUiSlider.get().length) return;
		const rangesArr = [];
		for (var i = 0; i < val.length; i++) {
			if (i==val.length-1) break;	
			const maxMin = [];
			maxMin.push(val[i]);
			maxMin.push((val[i+1])-1);
			rangesArr.push(maxMin);
		}
		panel.adjustBP(rangesArr, h);
	})
}


function updateEventHandler(){
	// lol, dziala
	slider.noUiSlider.on('update.one',(val,h,u,tap)=>{
		if(!tap){
			posArr = val;
			checkIfOverlap(val,h);
		} else {
			slider.noUiSlider.setHandle(h,posArr[h],false);
			addHandle(val[h]);
		}	
	})
}

function checkIfOverlap(val,h){
	let withPrev = h ? (val[h] == val[h-1]) : false;
	let withNext = h != val.length-1 ? (val[h] == val[h+1]) : false;
	let rmInd = withPrev ? 
		h-1 : 
		withNext ? 
		h+1 : 
		undefined;
	if (rmInd!==undefined) rmHandle(rmInd);	
}

function rmHandle(rmInd){
	console.log(`selected handle overlapping with handle ${rmInd}`);
	posArr.splice(rmInd,1);
	slider.noUiSlider.destroy();
	createSlider(posArr);
}

export{createSlider,posArr};

// HOW TO IMPLEMENT ::

// Pull START VARS from 