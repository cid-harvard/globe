function Controls(container,height){
	this.centerX=0;
	this.centerY=0;
	this.centerZ=0;
	this.targetCenterX=0;
	this.targetCenterY=0;
	this.targetCenterZ=0;
	this.rotationY=0;
	this.rotationX=-Math.PI/2;
	this.rotationZ=-Math.PI;
	this.targetX=0;
	this.targetZ=0;
	this.viewingHeight=this.minZoom;
	this.targetHeight=height;
	this.maxZoom=600;
	this.minZoom=175;
	this.locked=false;
	this.globeMode=false;
	this.rotationSpeed=4;
	this.loading=true;

	this.centerSpeed=30;
	thisthis=this;
	$('body').on("keydown",function(e) {
		thisthis.buttons(e);
	});

};
Controls.prototype.buttons= function(e){
	this.rotationSpeed=6;
	move=this.viewingHeight/6000;
	if(!this.locked){
    switch(e.which) {
        case 37: // left
        this.targetZ+=move;
        break;

        case 38: // up
        this.targetX-=move;
        break;

        case 39: // right
       	this.targetZ-=move;
        break;

        case 40: // down
        this.targetX+=move;
        break;

        default: return; 
    }
    }
}

Controls.prototype.reset= function(){
	this.targetX=Math.PI/2+0.0001;
	this.targetZ=-Math.PI/2;
	this.targetHeight=450;
	this.centerX=0;
	this.centerY=0;
	this.centerZ=0;
};
Controls.prototype.setTarget = function(x,y){
	this.rotationSpeed=1.5;
	this.targetZ-=(x)/Math.pow(this.maxZoom-this.viewingHeight+200,1.1);
    this.targetX+=(y)/Math.pow(this.maxZoom-this.viewingHeight+200,1.1);
}

Controls.prototype.zoom = function(fov){
	this.viewingHeight-=fov*Math.log(this.viewingHeight);
	if(this.viewingHeight<this.minZoom){
		this.viewingHeight=this.minZoom
	}
	if(this.viewingHeight>this.maxZoom){
		this.viewingHeight=this.maxZoom
	}
	this.targetHeight=this.viewingHeight;
};
Controls.prototype.lockRotation= function(lock){
	this.locked=lock;
	this.globeMode=false;
};
Controls.prototype.isLocked = function(){
	return this.locked;
}
Controls.prototype.globe= function(){
	this.globeMode=true;
};
Controls.prototype.rotate= function(rotx,roty){
	this.rotationSpeed=6;
	this.targetX=roty;
	this.targetZ=rotx;
};
Controls.prototype.pan= function(x,y){
	this.targetX=roty;
	this.targetZ=rotx;
};
Controls.prototype.setZoom= function(zoom){
	this.targetHeight=zoom;
};
Controls.prototype.zoomIn= function(zoom){
	this.targetHeight-=zoom;
};
Controls.prototype.setHeight= function(height){
	this.viewingHeight=height;
};
Controls.prototype.getZoom= function(){
	return this.viewingHeight;
};
Controls.prototype.center = function(x,y,z){
	this.targetCenterX=x;
	this.targetCenterY=y;
	this.targetCenterZ=z;
}
Controls.prototype.getCenter = function(){
	return {"x":this.targetCenterX,"y":this.targetCenterY,"z":this.targetCenterZ};
}
Controls.prototype.autoRotate = function(){
	this.targetZ-=0.003;
}
Controls.prototype.loaded = function(){
	this.loading=false;
}
Controls.prototype.focusCenter = function(){
	this.rotationSpeed=30;
	this.targetZ=-Math.PI-Math.atan2(this.targetCenterY,this.targetCenterX);
}
Controls.prototype.update= function(){
	if(this.loading===true)this.autoRotate();
	error=0.0001;

	if(Math.abs(this.rotationX-this.targetX)>error)this.rotationX += (this.targetX-this.rotationX)/this.rotationSpeed;
    else this.rotationX=this.targetX;

    if(Math.abs(this.rotationZ-this.targetZ)>error)this.rotationZ += (this.targetZ-this.rotationZ)/this.rotationSpeed;
    else this.rotationZ=this.targetZ;

    if(Math.abs(this.viewingHeight-this.targetHeight)>error)this.viewingHeight += (this.targetHeight-this.viewingHeight)/30;
    else this.viewingHeight=this.targetHeight;


    if(Math.abs(this.centerX-this.targetCenterX)>error)this.centerX += (this.targetCenterX-this.centerX)/this.centerSpeed;
    else this.centerX=this.targetCenterX;

    if(Math.abs(this.centerZ-this.targetCenterZ)>error)this.centerZ += (this.targetCenterZ-this.centerZ)/this.centerSpeed;
    else this.centerZ=this.targetCenterZ;

    if(Math.abs(this.centerY-this.targetCenterY)>error)this.centerY += (this.targetCenterY-this.centerY)/this.centerSpeed;
    else this.centerY=this.targetCenterY;


	offset=1;
	if(this.globeMode)offset=1.5;

	if(this.rotationX>=Math.PI*offset)this.rotationX=Math.PI*offset;
	if(this.rotationX<=1.7)this.rotationX=1.7;


	camera.position.x = this.centerX + this.viewingHeight * Math.sin( -this.rotationX+Math.PI/2 )* Math.cos( -this.rotationZ );         
	camera.position.y = this.centerY + this.viewingHeight * Math.sin( -this.rotationX+Math.PI/2 )* Math.sin( -this.rotationZ );
	camera.position.z = this.centerZ + this.viewingHeight * Math.cos( -this.rotationX+Math.PI/2 );

	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(this.centerX,this.centerY,this.centerZ));
};

