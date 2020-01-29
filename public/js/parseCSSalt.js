window.sheet = {};
let styles = {};
const bp = { //the order is important > tracker needs global controllerItems first
	index:[{
	min:undefined,
	max:undefined},
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
			mq = mq.trim();
			this.indexed.push(mq);			
		}
		return this.indexed;
	},
	indexed:[],
	// import add remove methods from module
	add:function(max,min){
		console.log('breakPoint added (TODO)')		
	},
	remove:function(index){
		console.log('breakPoint removed (TODO)')
	}
}

const textProps = {
	styles: {
		['color'] : 'colPicker',
		['font-size'] : 'equation',
		['font-family'] : 'dropdown',
		['line-height'] : 'number',
		['letter-spacing'] : 'number',
		['margin']: 'box-vals',
		['text-align']: 'dropdown'		
	},
	indexed: function(){		
		return Object.entries(this.styles);		
	}
}

const elemRules = {
		'#rootDiv':textProps.styles,
 		'h1.editable':textProps.styles,
 		'h2.editable':textProps.styles,
 		'h3.editable':textProps.styles,
		'p.editable':textProps.styles		
 		}	  	

// init styleSheet from defaults
function initSheet(){
	const r = elemRules;
	for (var i = 0; i < bp.index.length; i++) {	
		let mq = `@media ${bp.parse(i)}`;
		mq = mq.trim();			
		styles[mq] = JSON.parse(JSON.stringify(r))
	}
	sheet = jss.default
		.createStyleSheet(styles,{link:true})
		.attach();
	assignClasses();	
}

function assignClasses(){
	const arr = [];
	for (const sel in elemRules) {
		const elemArr = document.querySelectorAll(sel);
		for (const elem of elemArr) {
			elem.className = sheet.classes[sel]
		}
	}
}


document.body.onload = ()=>{
	initSheet();
}

export {bp,textProps,elemRules}