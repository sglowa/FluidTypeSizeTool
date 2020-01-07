const bp = {
	index:[
	{max:768},
	{min:769,
	max:1279},
	{min:1280,
	max:1700},
	{min:1701}],
	parse(i){
		let str = '';
		str += this.index[i].min != undefined ? `(min-width:${this.index[i].min}px)`:''; 
		str += this.index[i].min != undefined && this.index[i].max != undefined ? ' and ' : '';
		str += this.index[i].max != undefined ? `(max-width:${this.index[i].max}px)`:''; 
		return str;
	},
	add(max,min){
		console.log('breakPoint added')
	},
	remove(index){
		console.log('breakPoint removed')
	}
}

const styles = {
 	'@global': {
 		[`@media`] : {
 		'h1':{color:'green'},
 		'h2':{},
 		'button.edit':{color:'green'}
 		},
	  	[`@media ${bp.parse(0)}`] : {
			'h1':{color:'red'},
	 		'h2':{},
	 		'h3':{},
	 		'p':{}

		},
		[`@media ${bp.parse(1)}`]:{
			'h1':{color:'blue'},
	 		'h2':{},
	 		'h3':{},
	 		'p':{}
		},
		[`@media ${bp.parse(2)}`]:{
			'h1':{color:undefined},
	 		'h2':{},
	 		'h3':{},
	 		'p':{}
		}
  	}
}

// Application logic.


let sheet = jss.default.use(jssGlobal.default())
	.createStyleSheet(styles,{link:true});
sheet.attach();	
// sheet = sheet.getRule('@global')

function updateBP(sheet, media){
	const k = jss.default.use(jssGlobal.default())
		.createStyleSheet(sheet.rules.raw,{link:true, media:media })
		.attach()
	sheet.detach();
	sheet = k;
}











