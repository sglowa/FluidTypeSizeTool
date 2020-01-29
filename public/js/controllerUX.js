import {createSlider,posArr} from './controllerUX/slider.js'

function buildUi(){	
	createSlider(getBpBoundaries());
}

function getBpBoundaries(){
	const bpObj = panel.tabs.list;
	const rangesArr = [];
	const boundariesArr = [];
	for (const k in bpObj) {
		if (k == 'global') continue;		
		const minMax = extractBP(bpObj[k].mediaQuery);
		rangesArr.push(minMax);
		if (!bpObj[k].visible)break;
	}
	for (const r of rangesArr) {
		boundariesArr.push(r[0]);
	}	
	return boundariesArr;
} 

export {buildUi}