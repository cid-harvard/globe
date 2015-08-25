function ClickWheel(){
	buttons=[];
	divX=45;
	divY=60;
	step=30;
	ring=false;
	//buttons.push({"id":"groupButton","title":"Group by Product","img":"images/icon/productstack.png"});

	buttons.push({"id":"productButton","title":"Product Space 2D","img":"images/icon/graph2d.png"});
	buttons.push({"id":"productButton3","title":"Product Sphere","img":"images/icon/graph3d.png"});
	buttons.push({"id":"gridSphereButton","title":"Globe Map","img":"images/icon/globe.png"});
	buttons.push({"id":"gridButton","title":"Flat Map","img":"images/icon/map2d.png"});
	buttons.push({"id":"towersButton","title":"Map Stacks","img":"images/icon/stack.png"});
	buttons.push({"id":"productButton2","title":"Product Stacks","img":"images/icon/productstack.png"});

	legend="<div id='legend'><table><tr><td>Graphs</td><td>Maps</td><td>Stacks</td></tr></table></div>";
	//$('#UI').append(legend);
	for (var i = 0; i < buttons.length; i++) {
		option=buttons[i];
		angle=Math.PI+Math.PI*i/(buttons.length-1);
		if(ring){
			topvalue=20-30*Math.sin(angle);
			leftvalue=window.innerWidth/2-buttons.length*(divX+step)/2+i*(divX+step);
		}else{
			topvalue=50+i*(divX+step);
			leftvalue=-1;
		}
		angle=-90-angle*90/Math.PI;
		angle=0;
		newDiv="<div class='modeSelector' style='top:"+topvalue+";left:"+leftvalue+";-webkit-transform: rotateY("+angle+"deg);transform: rotateY("+angle+"deg);'id='"+option.id+"'><img src='"+option.img+"'/><span>"+option.title+"</span></div>";
		$('#UI').append(newDiv);
	}
}

ClickWheel.prototype.rotateTo =  function(index){
	
}