let testtest = 'hahaha'
let styleSheet = ((s)=>{	
	for (item of s){
		if(item.href.includes('workspace.css')) return item;
	}
})(document.styleSheets)

console.log(styleSheet);

CSSquery = {
	selectors : ['h1', 'h2', 'h3', 'h4', 'button.mock'],
	properties : ['color']
}

class Style {
	constructor(stylesheet, query){
		this.mediaRules = ((s)=>{
			let arr = [];
			for (let i of s) {
// mediaRule array with names, conditions and rules, staged for merge with selectors 
				let media = {}, selectors = {};			
				media =  i.conditionText == "" ? 
					{name:'global'} : getBreakPoints(i.conditionText);
				media.media = i;
				selectors = getSelectors(i.cssRules,query); 
				media = Object.assign(selectors,media);
				arr.push(media);
			}
			return arr;
		})(stylesheet.cssRules);
	}
}


// ~~~~~ FIXTHIS ~~~~~
function getProperties(css,q){
	const propList = q.properties;
	let obj = {testname:"testval"};
	// console.log(css)
	return obj
}

function getSelectors(mRule,q){
	let obj = {};
// loop goes through selector names
	for (name of q.selectors) {
		obj = Object.assign(obj,mapSelector(name, mRule, q));		
// each name is searched for in each mediaRule.cssRules		
		// obj[name] = propObj;
	}
	return obj;

	function mapSelector(name, list, q){
		let selectorRule;
		for (rule of list) {
			if (rule.selectorText == name){
				selectorRule = {[name]: {rule : rule, name: name} };
				mapProperties(rule, q);
				return selectorRule;
			} 
		}		
	}

	function mapProperties(rule, q){
		let obj = {}
		let s = rule.style;		
		q = q.properties; 
		for (prop of q) {
			if (s.prop != undefined) obj[prop] = s.prop;
		}
		console.log(obj);
	}
}
// ~~~~~ ^FIXTHIS^ ~~~~~

function getBreakPoints(string){
	let obj = {
		name: "",
		min: "",
		max: ""
	};
	let condition = string.split('and');
	for (i of condition){
		if (i.includes('max')) obj.max = parseInt(i.replace(/\D/g, ""));
		if (i.includes('min')) obj.min = parseInt(i.replace(/\D/g, ""));		
	}
	obj.name = `${obj.min} - ${obj.max}`;
	return obj;
}

let style = new Style(styleSheet, CSSquery)
