/*jshint esversion:6*/

function exportCSSinit(){
	window.exportRules = exportRules;
}

function exportRules(){
	const _export = getRules();
	copyToClipboard(_export);
}

function copyToClipboard(text) {
	console.log(text);
    const dummy = document.createElement("textarea");
    dummy.style.position = 'absolute';
    dummy.style.zIndex = -9999999;
    dummy.style.opacity = 0;
    document.body.appendChild(dummy);    
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function getRules(){
	const mqObj = panel.tabs.list;
	let rulesArr = [];
	for (const k in mqObj) {
		if(mqObj[k].visible){
			const mqRule_parsed = parseMqRule(mqObj[k].sheetRule.toString());
			rulesArr.push(mqRule_parsed);			
		}
	}
	return rulesArr.join("\n");
}

const regex = /(\w*-*\w*:)\s*;/gm;
function parseMqRule(rule){	
	const arr = rule.match(regex);	
	for(const i in arr){
		rule = rule.replace(arr[i],"");    
	}
	// gets rid of white spaces
	rule = rule.replace(/^\s*(?!.)/gm,'');
	// gets rid of unnecesary line breaks
	rule = rule.replace(/^\n+/gm,'');
	// gets rid of empty rules
	rule = rule.replace(/.*{\s+}/gm,'');
	return rule;
}

export {exportCSSinit}; 