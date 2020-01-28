let slider = document.querySelector('.axis');
// using spread operator to parse it as an array
let handles = [...document.querySelectorAll('.handle')];

let screenRange = 3840;
let sliderRange = slider.offsetWidth;


function distrHandles(){
	let distanceStep = sliderRange / (handles.length-1) - (handles[0].offsetWidth/(handles.length-1)) ;
	let d = 0;
	for (let i = 0; i < handles.length; i++) { 
		handles[i].style.left = `${d}px`;
		d += distanceStep;
	}
}
distrHandles();


// Make the DIV element draggable:
dragElement(handles);

function dragElement(elmnts) {
	for (let h of elmnts) {
	  	let pos1 = 0, pos2 = 0;
    	h.addEventListener('mousedown',function(e){
			dragMouseDown(e,h);
    	})
	  }    	
  }

  function dragMouseDown(e,h) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos2 = e.clientX;

    document.onmouseup = function(e){
    	closeDragElement(e,h);
    }
    // call a function whenever the cursor moves:
    document.onmousemove = function(e){
    	elementDrag(e,h)
    }
    // document.onmousemove = elementDrag;
  }

  function elementDrag(e,h) {
    e = e || window.event;
    e.preventDefault();
    if (elemOutsideRange(h).max){
    	closeDragElement();
    	h.style.left = parseInt(h.style.left) - 5 + 'px';    	
    	return;
    }
    if (elemOutsideRange(h).min){
    	closeDragElement();
    	h.style.left = parseInt(h.style.left) + 5 + 'px';
    	return;
    }
    // calculate the new cursor position:
    pos1 = pos2 - e.clientX;
    pos2 = e.clientX;
    // set the element's new position:
    h.style.left = (h.offsetLeft - pos1) + "px";
  }

  function elemOutsideRange(h){
  	let widthTotal = slider.offsetWidth - h.offsetWidth;
  	let cond1,cond2;
  	let i = handles.indexOf(h);
  	
  	let hPos = parseInt(h.style.left);
  	let minPos = i ? parseInt(handles[i-1].style.left) + h.offsetWidth : 0;
  	let maxPos = i == handles.length-1 ? widthTotal : parseInt(handles[i+1].style.left) - h.offsetWidth;
  	// console.log(hPos);
  	// console.log(minPos);
  	// console.log(maxPos);
  	// console.log('+++++++');
  	cond1 = (hPos < minPos);
  	cond2 = (hPos > maxPos);
  	console.log(cond1);
  	console.log(cond2);
  	console.log('+++++++');
  	return {min:cond1,max:cond2};
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }