const express = require('express');
const path = require('path');
const pug = require('pug');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;


const app = express();

// the first one specifies the port defined by the environment, i think ... 
// the var = x || y is equal to var = x ? x : y
const port = process.env.PORT || "8000";

// ±±CONFIGURATION±±

app.set('views', path.join(__dirname, "views"));
app.set('view engine', "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// serving jspanel from node_modules
app.use('/dist', express.static(__dirname + '/node_modules/jspanel4/dist/'));
app.use('/jss', express.static(__dirname + '/node_modules/jss/'));
app.use('/jss-preset-default', express.static(__dirname + '/node_modules/jss-preset-default/'));
app.use('/nosliderui', express.static(__dirname + '/node_modules/nouislider/distribute/'));

// vars for pug :
const lorem = new LoremIpsum()
let renderVar = {
	title:"Fluid TypeSize",
	loremPar:(x)=>{return (lorem.generateParagraphs(x))},
	loremSen:(x)=>{return (lorem.generateSentences(x))}
}

// ±±Routes Definitions±±
 app.get('/', (req,res)=>{
 	// 1 arg= file path of what to render
 	// 2 arg = Object that is passed from controller (backend) to the template;
 	res.render("index", renderVar);
 })
// ±± send pug rendered as string on GET request 
 app.post('/control', (req,res)=>{
 	// console.log(req.body);
 	res.send(pug.renderFile('views/controller.pug',{data:req.body}));
 })

 // ±±SERVER ACTIVATION±±

 app.listen(port, ()=>{
 	console.log(`Listening to requests on http://localhost:${port}`);
 })