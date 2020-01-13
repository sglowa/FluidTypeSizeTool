const bp = {
	index:[
	{min:360,
	max:768},
	{min:769,
	max:1279},
	{min:1280,
	max:1700},
	{min:1701,
	max:2560}],	
	parse(i){
		let str = '';
		str += this.index[i].min != undefined ? `(min-width:${this.index[i].min}px)`:''; 
		str += this.index[i].min != undefined && this.index[i].max != undefined ? ' and ' : '';
		str += this.index[i].max != undefined ? `(max-width:${this.index[i].max}px)`:''; 
		return str;
	},
	indexRun:function(){
		this.indexed = []
		for (var i = 0; i < this.index.length; i++) {
			let mq = `@media ${this.parse(i)}`;
			this.indexed.push(mq);			
		}
	},
	indexed:[],
	add(max,min){
		console.log('breakPoint added')
	},
	remove(index){
		console.log('breakPoint removed')
	}
}

const textProps = {
	styles: {
		color : 'colPicker',
		['font-size'] : 'equation',
		['font-family'] : 'font-dropdown',
		['line-height'] : 'number',
		['letter-spacing'] : 'number',
		['margin']: 'box-vals',
		['text-align']: 'text-align'		
	},
	indexed: function(){		
		return Object.entries(this.styles);		
	}
}

const styles = {
 	'@global': {
 		[`@media`] : {
 		'h1':textProps.styles,
 		'h2':textProps.styles,
 		'h3':textProps.styles,
		'p':textProps.styles,
		'#rootDiv':textProps.styles
 		}	  	
  	}
}

let sheet;
// Application logic.

// init styleSheet from defaults
function initSheet(){
	const r = styles['@global']['@media'];
	for (var i = 0; i < bp.index.length; i++) {		
		styles['@global'][`@media ${bp.parse(i)}`] = JSON.parse(JSON.stringify(r));		
	}
	sheet = jss.default.use(jssGlobal.default())
		.createStyleSheet(styles,{link:true})
		.attach();	
}
// sheet = sheet.getRule('@global')

function pullElemRules(s){
	const keys = Object.keys(s['@global']);
	const elems = Object.keys(s['@global'][keys[1]]);
	return elems;
}

// sheet & media query > '(min-width:xxx) and (max-width:yyy))'
function updateBP(s, m){
	const nStyle = s.rules.raw;
	const ruleClone = JSON.parse(JSON.stringify(nStyle['@global']['@media']));
	nStyle['@global'][`@media ${m}`] = ruleClone;
	sheet.detach();
	sheet = jss.default.use(jssGlobal.default())
		.createStyleSheet(nStyle,{link:true})
		.attach();		
}

function extractBP(str){
	const bp = str.match(/(\d+)/g);
	return bp;
}
