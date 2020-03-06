/*jshint esversion:6*/
function adjustBP(rangeArr, h){
	const bpObj = panel.tabs.list; //! i should rename all occurances of bpObj > bpObjList to avoid confusion 
	const mqLeft = h!=0 ? parseBP(rangeArr[h-1]) : undefined;
	const mqRight = h!=rangeArr.length ? parseBP(rangeArr[h]) : undefined;
	const mqObjLeft = h!=0 ? bpObj[`breakPoint${h}`] : undefined;
	const mqObjRight = h!=rangeArr.length ? bpObj[`breakPoint${h+1}`] : undefined;
	changeMq(mqObjLeft,mqLeft);
	changeMq(mqObjRight,mqRight);
	sheet.detach();sheet.attach();
	updateMqAttr(mqObjLeft);
	updateMqAttr(mqObjRight);
}	

function changeMq(mqObj,newMq){ //mqObj refers to a single breakPoint Obj
	if(mqObj==undefined || newMq==undefined) return;
	const sheetRule = mqObj.sheetRule;
	const i = sheet.rules.index.indexOf(sheetRule);
	const style = getMqStyle(sheetRule);
	sheet.deleteRule(sheetRule.key);
	mqObj.sheetRule = sheet.addRule(newMq,style,{index:i});

	let mqHeader = extractBP(newMq); 
	mqHeader = `${mqHeader[0]}px - ${mqHeader[1]}px`;
	mqObj.div.children[0].innerText = mqHeader;
}

function applyStyleToBp(mqObj, style){
	if(mqObj==undefined || style==undefined)return;
	const sheetRule = mqObj.sheetRule;
	const i = sheet.rules.index.indexOf(sheetRule);
	const mq = sheetRule.key;
	sheet.deleteRule(sheetRule.key);
	mqObj.sheetRule = sheet.addRule(mq,style,{index:i});
	if(style = panel.defaultStyle) resetInputs(mqObj);
}

function resetInputs(mqObj){
	const elems = mqObj.submenu.list;
	for (const k in elems) {
		for (const j in elems[k]) {
			if (elems[k][j].constructor.name == "ControllerItem"){
				elems[k][j].resetInputValues();
			}
		}
	}
}

function getMqStyle(sheetRule){	
	const ruleList = sheetRule.rules.index;
	const o = {};
	for (const v of ruleList) {
		o[v.key] = v.style;
	}
	return o;
}

function updateMqAttr(mqObj){
	if (mqObj==undefined) return;	
	const newMq = mqObj.sheetRule.key;
	mqObj.mediaQuery = newMq;
	mqObj.div.setAttribute('mediaquery',newMq);
	mqObj.li.setAttribute('mediaquery',newMq);
	const elems = mqObj.submenu.list;
	for (const k in elems) {
		for (const kk in elems[k]) {
			if (elems[k][kk].updatemq == undefined) continue;
			elems[k][kk].updatemq(newMq);			
		}
		elems[k]['font-size'].updateRuleValue();
	}
}

function removeBP(rangeArr,rmHndlInd, expandInd){
	const rm = rmHndlInd, exp = expandInd;	
	const bpObjList = panel.tabs.list;
	let rmBp;

	if (!(exp==0||exp==rangeArr.length)){
		rmBp = rm < exp ? rm+1 : rm; 
		const expBp= rm < exp ? exp+1 : exp;
		const newMq = parseBP(rangeArr[expBp-1]);
		const expBpObj = bpObjList[`breakPoint${expBp}`];				
		changeMq(expBpObj,newMq);
		updateMqAttr(expBpObj);	
	}else{
		rmBp = exp == 0 ? 1 :
			exp==rangeArr.length ? rangeArr.length : console.log('wtf');
	}
	const rmBpObj = bpObjList[`breakPoint${rmBp}`];

	
	changeBpVis(rmBpObj,false)
	// rmBpObj.changeVis(false);
	removeFromTracked(rmBpObj);
	disableBP(rmBpObj);
	updateMqAttr(rmBpObj);
	reorderBP(`breakPoint${rmBp}`);//have to access prop through key
	
	sheet.detach();sheet.attach();
}

function changeBpVis(mqObj,bool){
	const style = bool ? "" : "none";
	mqObj.visible = bool;
	mqObj.div.style.display = style;
	mqObj.li.style.display = style;
}

function disableBP(bpObj){
	if(bpObj==undefined) return;
	const sheetRule = bpObj.sheetRule;
	const mq = parseBP([0,1]);
	const i = sheet.rules.index.indexOf(sheetRule);
	const style = sheetRule.rules.raw;
	sheet.deleteRule(sheetRule.key);
	bpObj.sheetRule = sheet.addRule(mq,style,{index:i});
}

function reshuffleBP(emptyInd,insertInd){
	const bpObjArr = [];
	const bpObjList = panel.tabs.list;
	for (const k in bpObjList) {
			bpObjArr.push(bpObjList[k]);
		}
	const newBpObj = bpObjArr.splice(emptyInd,1)[0];
	bpObjArr.splice(insertInd,0,newBpObj);	
	let i = 0;
	for (const k in bpObjList) {
			bpObjList[k]=bpObjArr[i];			
			if (!i){i++;continue}//if global
			bpObjList[k].div.setAttribute('id',k);
			bpObjList[k].li.children[0]
				.setAttribute('href',`#${k}`);
			bpObjList[k].li.children[0]
				.innerText = `break point ${i}`;			
			i++;
		}
	console.log(bpObjList);
	// console.log(`index of used bp is ${emptyInd}`);
	// console.log(`index to insert it @ is ${insertInd}`);
	// console.log(bpObjArr);






	// let bpObjTemp, bpObjTemp2;
	// const bpObjList = panel.tabs.list;
	// bpObjTemp = bpObjList[`breakPoint${index}`];
	// bpObjList[`breakPoint${index}`] = bpObjList[key];
	// // bpObjList[`breakPoint${index}`].changeVis(true);
	// let count = 0;

	// // it's adding an extra bp, why ??
	// bpObjList[`breakPoint${index+1}`] = bpObjTemp;


	// for (const k in bpObjList) {
	// 	// console.log(`key: ${k}`);console.log(`count: ${count}`);
	// 	if (count<=index) {count++;continue}
	// 	console.log(bpObjList[k]);
	// 	console.log('replaced with');
	// 	console.log(bpObjTemp);
	// 	bpObjTemp2 = bpObjList[k];
	// 	bpObjList[k] = bpObjTemp;
	// 	bpObjTemp = bpObjTemp2;
	// 	console.log('now storing');
	// 	console.log(bpObjTemp);
	// }
	console.log(panel.tabs.list);
}

function reorderBP(key){ //mqObj is the entire mqObj from panel	
	const bpObjList = panel.tabs.list;
	bpObjList.temp = bpObjList[key];	
	delete bpObjList[key];
	let i = 0;	
	// changing order in panel obj,
	// changing id + href pairs for tabby
	for (let k in bpObjList) {
		if(!i){i++;continue;}
		const nk = `breakPoint${i}`;
		if(nk!=k){
			bpObjList[nk] = bpObjList[k];
			delete bpObjList[k];
			bpObjList[nk].div.setAttribute('id',nk);
			bpObjList[nk].li.children[0]
				.setAttribute('href',`#${nk}`);
			bpObjList[nk].li.children[0]
				.innerText = `break point ${i}`;
		}				
		i++;
	}
}

function removeFromTracked(bpObj){ 
	const elemList = bpObj.submenu.list;
	console.log(elemList);
	for (let el in elemList) {
		for (let prop in elemList[el]) {
			if (!elemList[el][prop].inheritGlobalBtn) continue;
			if (elemList[el][prop].inheritGlobalBtn.checked){
				elemList[el][prop].trackByGlobalController(false);
			}
		}
	}
}

function prependBP(rangeArr, h){
 	console.log("new ranges :");
 	console.log(rangeArr);
 	console.log(`handle index: ${h}`);

 	const bpObjList = this.tabs.list;
 	// finding first unused bpObj (slot)
 	let emptyBpObj, emptyBpInd = 0;
 	for (const k in bpObjList){
 		if(!bpObjList[k].visible){
 			emptyBpObj = bpObjList[k];
 			break}
 			emptyBpInd++;
 		}
 	// updating mq
 	const mqLeft = parseBP(rangeArr[h]);
	changeMq(emptyBpObj, mqLeft);
 	updateMqAttr(emptyBpObj);
 	// updating style
 	applyStyleToBp(emptyBpObj,panel.defaultStyle);
 	changeBpVis(emptyBpObj,true);
 	reshuffleBP(emptyBpInd,h+1);
	panel.reorderTabs();
	sheet.detach();sheet.attach();
}

function appendBP(rangeArr, h){
	console.log("new ranges :");
	console.log(rangeArr);
 	console.log(`handle index: ${h}`);

 	const bpObjList = this.tabs.list;
 	// finding first unused bpObj (slot)
 	let emptyBpObj, emptyBpInd = 0;
 	for (const k in bpObjList){
 		if(!bpObjList[k].visible){
 			emptyBpObj = bpObjList[k];
 			break}
 			emptyBpInd++;
 		}
 	// updating mq
 	const mqRight = parseBP(rangeArr[h-1]);
	changeMq(emptyBpObj, mqRight);
 	updateMqAttr(emptyBpObj);
 	// updating style
 	applyStyleToBp(emptyBpObj,panel.defaultStyle);
 	changeBpVis(emptyBpObj,true);
 	reshuffleBP(emptyBpInd,h);
	panel.reorderTabs();
	sheet.detach();sheet.attach();
}

function insertBP(rangeArr, h){
	const bpObjList = this.tabs.list;
 	const splitBpObj = bpObjList[`breakPoint${h}`];
 	const mqLeft = parseBP(rangeArr[h-1]);
 	const mqRight = parseBP(rangeArr[h]);

 	changeMq(splitBpObj, mqLeft);
 	updateMqAttr(splitBpObj);
 	const styleCp = getMqStyle(splitBpObj.sheetRule);

 	let emptyBpObj, emptyBpInd = 0;
 	for (const k in bpObjList){
 		if(!bpObjList[k].visible){
 			emptyBpObj = bpObjList[k];
 			break}
 			emptyBpInd++;
 		}
 	
 	applyStyleToBp(emptyBpObj,styleCp);
 	changeMq(emptyBpObj,mqRight);
 	updateMqAttr(emptyBpObj);
 	changeBpVis(emptyBpObj,true);
 	console.log('emptyBpObj:');
 	console.log(emptyBpObj.visible);
	reshuffleBP(emptyBpInd,h+1);
	panel.reorderTabs();

	copyInputVals(splitBpObj,emptyBpObj)

	sheet.detach();sheet.attach();
}

function copyInputVals(srcBpObj,destBpObj){
	const srcElemList = srcBpObj.submenu.list;
	const destElemList = destBpObj.submenu.list;
	for (const el in destElemList) {
		for (const prop in destElemList[el]) {
			for (const input in destElemList[el][prop].inputs) {
				console.log(srcElemList[el][prop].inputs[input].value);
				destElemList[el][prop].inputs[input].value = srcElemList[el][prop].inputs[input].value;
				destElemList[el][prop].inheritGlobalBtn = srcElemList[el][prop].inheritGlobalBtn;
			}
		}
	}
}

// runs on init
// hiding tabs beyond tabsVisible limit.
function showBP(tabsVisible){
	if(isNaN(tabsVisible)) return;
	const bpObj = this.tabs.list;
	let i = 0;
	for (const k in bpObj) {
		i++;
		if (i <= tabsVisible) continue;
		console.log(bpObj[k]);
		changeBpVis(bpObj[k],false);
		// bpObj[k].changeVis(false);
		
	}
}

// export all that's needed to controller and there assign to panel;
export {showBP,adjustBP,removeBP,prependBP,appendBP,insertBP}