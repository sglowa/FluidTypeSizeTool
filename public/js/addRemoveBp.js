import {sheet} from "./parseCSSalt.js"
import {panel} from "./workspace.js"

let bpObj;

function assignHideBtn(){
	bpObj = panel.tabs.list;
	for (const k in bpObj) {
		if (k=='global') continue;
		bpObj[k].li.children[1].onclick = (ev)=>{
			removeBP(bpObj,k)
		}
	}
}

function assignShowBtn(){
	// breakpoints should be appended and prepended
	// edited through sliders
	// i'll build the slider as a prototype
	// set the fixed minimal//maximal screen sizes
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
	// console.log(panel);
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

// those are gonna get attached 
// fuck, you fuckin dum dum, that's what you have the panel for you dumb sheeet.
function revealBP(id){
	const div = document.querySelector(id);
	const tab = document.querySelector(`[href='#${id}']`);
	div.style.display = "";
	tab.style.display = "";
}

// function hideBP(id){

// 	const div = document.querySelector(id);
// 	const tab = document.querySelector(`[href='#${id}']`);
// 	div.style.display = "none";
// 	tab.style.display = "none";
	


// 	// also Needs To Remove Rule from sheet


// }

function showBP(tabsVisible){
	if(isNaN(tabsVisible)) return;
	const divs = document.querySelectorAll('div .breakPoint');
	for (let i = tabsVisible; i < divs.length; i++) {
		divs[i].style.display = "none";
		const tab = document.querySelector(`[href='#${divs[i].id}']`).parentNode;
		tab.style.display = "none";
	}
}

export {showBP}