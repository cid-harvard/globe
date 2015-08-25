function LabelManager(countries){
	this.showlabels=true;
    myThis=this;
    this.globeSize=150;

    $("#showlabels").click(function() {
    if (!myThis.showlabels) {
        $("#showlabels").html('<a href="#">Hide labels</a>');
        myThis.showlabels = true;
    } else {
        $("#showlabels").html('<a href="#">Show labels</a>');
        myThis.showlabels = false;
    }
    });

    countryHTML="";
    $.each(countries,function(co,country){
         countryHTML+="<a href='#' class='chosenCountry' id='"+co+"'>"+country.name+"</a><br/>";
    });        
    $("#countries").html(countryHTML);
};

LabelManager.prototype.resetLabels = function(countries){
    $.each(countries,function(c,co){
        $("#"+c).css({'font-size':10,'color':'#FFFFFF','z-index':2,'opacity':1});
    });
};
LabelManager.prototype.toScreenXY = function(id,country,particleSystem){
    var positions = geometry.attributes.position.array;

    var p = new THREE.Vector3(country.lat*1.55+particleSystem.position.x,country.lon*1.55+particleSystem.position.y, particleSystem.position.z);
    projScreenMat = new THREE.Matrix4;
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    p.applyProjection(projScreenMat);
    var ID="#"+id;  
    var labelWidth=$(ID).width();
    $(ID).css({top: -p.y * window.innerHeight / 2 + window.innerHeight / 2-3,left:p.x * window.innerWidth / 2 + window.innerWidth / 2 -labelWidth/2});
};

LabelManager.prototype.toScreenXYZ = function(id,country,geometry){
    var positions = geometry.attributes.position.array;
    var theta = (90 - country.lon) * Math.PI / 180;
    var phi = ( country.lat) * Math.PI / 180;
    var x=this.globeSize * Math.sin(theta) * Math.cos(phi);
    var y=this.globeSize * Math.sin(theta) * Math.sin(phi);
    var z=this.globeSize * Math.cos(theta);
    var cameraRay=Math.sqrt(Math.pow(camera.position.x,2)+Math.pow(camera.position.y,2)+Math.pow(camera.position.z,2));
    if(cameraRay>Math.sqrt(Math.pow(camera.position.x-x,2)+Math.pow(camera.position.y-y,2)+Math.pow(camera.position.z-z,2))+this.globeSize/4){
    var p = new THREE.Vector3(x,y, z);
    projScreenMat = new THREE.Matrix4;
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    p.applyProjection(projScreenMat);
    var ID="#"+id;
    var labelWidth=$(ID).width();
    $(ID).css({top: Math.round(-p.y * window.innerHeight / 2 + window.innerHeight / 2-3),left:Math.round(p.x * window.innerWidth / 2 + window.innerWidth / 2 -labelWidth/2)});
    }else{
    var ID="#"+id;
    $(ID).css({top: -100,left:0});
    }
};

LabelManager.prototype.setLabels = function(show){
    this.showlabels=show;
};

LabelManager.prototype.animateLabels = function(countries,geometry,currentSetup,particleSystem){
    myThis=this;
    if(this.showlabels ){
    switch(currentSetup){
        case "cities":
        case "probability":
        case "gridmap":
        case "towers":
        $.each(countries,function(index,co){
            myThis.toScreenXY(index,co,particleSystem);
        });
        break;
        case "globe":
        case "probability3D":
        case "gridSphere":
        $.each(countries,function(index,co){
            myThis.toScreenXYZ(index,co,geometry);
        });
        break;
        default:
        $.each(countries,function(index,co){
            $("#"+index).css({top:-100});
        });
        break;
    }
    }else{
         $.each(countries,function(index,co){
            $("#"+index).css({top:-100});
        });
    }
    
};