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
		console.log(elems[k]);
		for (const kk in elems[k]) {
			console.log(elems[k][kk]);
			if (elems[k][kk].updatemq == undefined) continue;
			elems[k][kk].updatemq(newMq);
		}
	}
}

function assignHideBtn(){
	const bpObj = panel.tabs.list;
	for (const k in bpObj) {
		if (k=='global') continue;
		bpObj[k].li.children[1].onclick = (ev)=>{
			removeBP(bpObj,k);
		}
	}
}
window.tempGetBpObj = assignHideBtn;

// TODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
// write this first, instead of hideBP()
function removeBP(bpObj,key){
	console.log(bpObj[key]);
	bpObj[key].div.style.display = "none";
	bpObj[key].li.style.display = "none";
	removeFromTracked(bpObj,key);
	sheet.deleteRule(bpObj[key].mediaQuery);
	sheet.detach();
	sheet.attach();
	reorderBP(bpObj,key);
	assignHideBtn();
	// write a function to move prop up
	// hide the tab by using div && li props
	
	// delete rule from sheets
	// delete props from tracked
	// reOrder the breakPoints
	//	
}

function reorderBP(bpObj,key){
	bpObj.temp = bpObj[key];	
	delete bpObj[key];
	let i = 0;	
	// changing order in panel obj,
	// changing id + href pairs for tabby
	for (let k in bpObj) {
		if(!i){i++;continue}
		const nk = `breakPoint${i}`;
		if(nk!=k){
			bpObj[nk] = bpObj[k];
			delete bpObj[k];
			bpObj[nk].div.setAttribute('id',nk);
			bpObj[nk].li.children[0]
				.setAttribute('href',`#${nk}`);
			bpObj[nk].li.children[0]
				.innerText = `break point ${i}`;
		}				
		i++;
	}
}

function removeFromTracked(bpObj,key){
	const elemList = bpObj[key].submenu.list;
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

function addBP(){

	// check if number of breakPoints doesn't exceed total
	// addRule and append at the end of index 
	// reveal BP tab and change innerText + mediaQueries accordingly
}


function showBP(tabsVisible){
	if(isNaN(tabsVisible)) return;
	const bpObj = this.tabs.list;
	let i = 1;
	for (const k in bpObj) {
		const state = i <= tabsVisible;
		const style = state ? "" : "none"; 
		bpObj[k].visible = state;
		bpObj[k].div.style.display = style;
		bpObj[k].li.style.display = style;
		i++;
	}
}

// export all that's needed to controller and there assign to panel;
export {showBP,adjustBP}