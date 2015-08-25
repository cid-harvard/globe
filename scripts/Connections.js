function Connection(){
    this.incrementLink=0;
    this.incrementLinkMax=1000;
    this.showLinks=true;
};

Connection.prototype.animateLinks = function(){
	
};

Connection.prototype.addLinks2 =  function(){
    links=new THREE.Object3D();
    $.getJSON("data/network_hs.json", function(json){
        $.each(json.edges,function(i,val){
            productA=products[val["source"]]; 
            productB=products[val["target"]];
            
            if(productA &&productB && productB.x!==0 && productA.x!==0){
                var line_geom = new THREE.Geometry();
                line_geom.vertices.push(new THREE.Vector3(productA.x,productA.y,-1));
                line_geom.vertices.push(new THREE.Vector3(productB.x,productB.y,-1));
                var line_material = new THREE.LineBasicMaterial({color:productA.color,width:val["strength"]*10});
                var line = new THREE.Line(line_geom, line_material);
                links.add(line);
            }
        });
    });
    scene.add(links);
};

Connection.prototype.addLinks = function(type,chosenCountry){
    scene.remove(links);
    links=new THREE.Object3D();
    var count=0;
    var height=15;
    var color=new THREE.Color();
    var continentCentroid={1:[3.16,19.33],2:[48.92,85.78],3:[-13.58,121.64],4:[53.12,4.21],5:[-16.63,-59.76],6:[35.74, -102.3],7:[27.99, -173.32]}
    var cartx,carty,cartz,cartx2,carty2,cartz2;
    $.each(trades,function(i,exports){
            country=countries[i];            
            states=anchors[i];

            if(country && states && (chosenCountry==="ALL" || chosenCountry===i)){
            if(type==="continent"){
            for(var s=0;s<country.exports/dollars/50;s++){
                var segments=[];
                randomCity=states[Math.round(Math.random()*(states.length-1))];  
                if(type==='CtoC'){
                segments.push(new THREE.Vector3(randomCity.lon*1.55,randomCity.lat*1.55,0));
                segments.push(new THREE.Vector3(country.lat*1.55,country.lon*1.55,height/3));
                segments.push(new THREE.Vector3(country.lat*1.55,country.lon*1.55,height));
                }else{
                   segments.push(new THREE.Vector3(randomCity.lon*1.55,randomCity.lat*1.55,0));
                    segments.push(new THREE.Vector3(country.lat*1.45,country.lon*1.45,height/3));
                    segments.push(new THREE.Vector3(country.lat*1.45,country.lon*1.45,height)); 
                }
                links.add(Spline(segments,0x999999));
                count++;
            }
            }

            var coord1=continentCentroid[country.continent], coord2=null;
            $.each(exports,function(j,val){
                country2=countries[val.c];
                if(country2){
                    var coord2=continentCentroid[country2.continent];
                    var segments=[];

                    var lon1 = Math.min(country.lat,country2.lat)/180*Math.PI;  // In radian
                    var lon2 = Math.max(country.lat,country2.lat)/180*Math.PI;  // In radian
                    var lat1 = Math.min(country.lon,country2.lon)/180*Math.PI; // In radian
                    var lat2 = Math.max(country.lon,country2.lon)/180*Math.PI; // In radian

                    var dLon = (lon2-lon1); 

                    var Bx = Math.cos(lat2) * Math.cos(dLon);
                    var By = Math.cos(lat2) * Math.sin(dLon);
                    var avgLat = Math.atan2(
                            Math.sin(lat1) + 
                            Math.sin(lat2), 
                            Math.sqrt((
                            Math.cos(lat1)+Bx) * (Math.cos(lat1)+Bx) + By*By));
                    avgLat=avgLat*180/Math.PI;
                    var avgLong = lon1 + Math.atan2(By, Math.cos(lat1) + Bx)*180/Math.PI;

                if(type==='CtoC'){
                    height=0;

                    color.setHSL(1,1,1);
                    segments.push(new THREE.Vector3(country.lat*1.55,country.lon*1.55,height));
                    segments.push(new THREE.Vector3(country.lat*1.55,country.lon*1.55,30+Math.pow(val.e,.3)));
                    //segments.push(new THREE.Vector3(country2.lat*1.55,country2.lon*1.55,30+country2.exports/dollars/50));
                    //segments.push(new THREE.Vector3(avgLat*1.55,avgLong*1.55,30+Math.pow(val.e,.3)));

                    segments.push(new THREE.Vector3(country2.lat*1.55,country2.lon*1.55,30+Math.pow(val.e,.4)));
                    segments.push(new THREE.Vector3(country2.lat*1.55,country2.lon*1.55,height));
                }else if(type==="sphere"){

                    color.setHSL(1,1,1);
                    var globeHeight=1.2+Math.random()/10,globeHeight2=1.2+Math.random()/100;
                    if(country.continent===country2.continent){
                        globeHeight=0;
                        globeHeight2=0;
                    }
                    theta = (90 - country.lon) * Math.PI / 180;
                    phi = ( country.lat) * Math.PI / 180;
                    cartx=globeSize * Math.sin(theta) * Math.cos(phi);
                    carty=globeSize * Math.sin(theta) * Math.sin(phi);
                    cartz=globeSize * Math.cos(theta);
                    segments.push(new THREE.Vector3(cartx,carty,cartz));

                    segments.push(new THREE.Vector3(globeHeight2 *cartx,globeHeight2 *carty,globeHeight2 *cartz));

                    theta = (90 - coord1[0]) * Math.PI / 180;
                    phi = ( coord1[1]) * Math.PI / 180;
                    cartx=globeSize * Math.sin(theta) * Math.cos(phi);
                    carty=globeSize * Math.sin(theta) * Math.sin(phi);
                    cartz=globeSize * Math.cos(theta);
                    segments.push(new THREE.Vector3(globeHeight *cartx,globeHeight *carty,globeHeight *cartz));


                    theta = (90 - coord2[0]) * Math.PI / 180;
                    phi = ( coord2[1]) * Math.PI / 180;
                    cartx2=globeSize * Math.sin(theta) * Math.cos(phi);
                    carty2=globeSize * Math.sin(theta) * Math.sin(phi);
                    cartz2=globeSize * Math.cos(theta);

                    if(country.continent!==country2.continent)segments.push(new THREE.Vector3((cartx+cartx2+Math.random()/20),(carty+carty2+Math.random()/20),(cartz+cartz2+Math.random()/20)));

                    segments.push(new THREE.Vector3(globeHeight *cartx2,globeHeight *carty2,globeHeight *cartz2));

                    theta = (90 - country2.lon) * Math.PI / 180;
                    phi = ( country2.lat) * Math.PI / 180;
                    cartx2=globeSize * Math.sin(theta) * Math.cos(phi);
                    carty2=globeSize * Math.sin(theta) * Math.sin(phi);
                    cartz2=globeSize * Math.cos(theta);
                    segments.push(new THREE.Vector3(globeHeight2 *cartx2,globeHeight2 *carty2,globeHeight2 *cartz2));
                    segments.push(new THREE.Vector3(cartx2,carty2,cartz2));
                    

                }else{
                    color.setHSL(1,1,1);
                    segments.push(new THREE.Vector3(country.lat*1.45,country.lon*1.45,height));
                    segments.push(new THREE.Vector3(coord1[1]*1.4,coord1[0]*1.4,30+country.continent*5));
                    //segments.push(new THREE.Vector3(coord2[1]*1.4,coord2[0]*1.4,30+country2.continent*5));
                    segments.push(new THREE.Vector3(coord2[1]*1.4,coord2[0]*1.4,30+country2.continent*5));
                    segments.push(new THREE.Vector3(country2.lat*1.45,country2.lon*1.45,height));
                }
                links.add(Spline(segments,color.getHex()));
                }
                
            });    
            } 
    });
    console.log(count);    
    scene.add(links);
};
function Spline(controlPoints,colorHex){
    var numPoints=40;

    var material = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent:true,
    opacity:0.8,
    vertexColors:true,
    blending:THREE.AdditiveBlending
    });
    var colors=[];
    var spline = new THREE.SplineCurve3(controlPoints);
    var geometry = new THREE.Geometry();
    var splinePoints=spline.getPoints( 100 );
    for(var i = 0; i < splinePoints.length; i++){
        geometry.vertices.push(splinePoints[i]); 
        colors[i]= new THREE.Color(); 
        colors[i].setHSL(0.5,1,i/100);
    }
    geometry.colors=colors;


    return (new THREE.Line(geometry, material));
    
}
Connection.prototype.animateLinks(){
    
    if(links){
        incrementLink++;
        if(incrementLink>incrementLinkMax)incrementLink=0;
    for (var i = links.children.length - 1; i >= 0; i--) {
        link=links.children[i];
        colors=link.geometry.colors;
        for (var j = 100; j >= 0; j--) {

            sine=Math.sin(incrementLink/20+j/20+i);
            colors[j].setHSL(0.5,1,(sine-0.75)*4);
        };
        link.geometry.colorsNeedUpdate=true;
        //link.material.opacity=(sine-0.75)*4;
    }
    }
}
function addSquareLinks(){
    links=new THREE.Object3D();
    $.getJSON("data/network_hs.json", function(json){
        $.each(json.edges,function(i,val){
            productA=products[val["source"]]; 
            productB=products[val["target"]];
            
            if(productA &&productB && productB.x!==0 && productA.x!==0){
                var line_geom = new THREE.Geometry();
                var coeff=Math.random()*1.5;
                line_geom.vertices.push(new THREE.Vector3(productA.x,productA.y,-1));
                if(i%2===0){
                line_geom.vertices.push(new THREE.Vector3(productA.x,(productA.y-productB.y)/2*coeff,-1));
                line_geom.vertices.push(new THREE.Vector3(productB.x,(productA.y-productB.y)/2*coeff,-1));
                }else{
                    line_geom.vertices.push(new THREE.Vector3((productA.x-productB.x)/2*coeff,productA.y,-1));
                    line_geom.vertices.push(new THREE.Vector3((productA.x-productB.x)/2*coeff,productB.y,-1));
                }
                line_geom.vertices.push(new THREE.Vector3(productB.x,productB.y,-1));
                var line_material = new THREE.LineBasicMaterial({color:productB.color,width:val["strength"]*10});
                var line = new THREE.Line(line_geom, line_material);
                links.add(line);
            }
        });
    });
    scene.add(links);
}
function addCurvedLinks(){
    scene.remove(links);
    links=new THREE.Object3D();
    $.getJSON("data/network_hs.json", function(json){
        $.each(json.edges,function(i,val){
            productA=products[val["source"]]; 
            productB=products[val["target"]];
            
            if(productA &&productB && productB.x!==0 && productA.x!==0){
                var line=buildAxis(productA.x,productA.y,1,productB.x,productB.y,1,productA.color);
                links.add(line);
            }
        });
    });
    scene.add(links);
}
function buildAxis(n, r, i, s, o, u, a) {
    var ncolor=new THREE.Color(a);
    var l = new THREE.Geometry;
    var c = new THREE.LineBasicMaterial({
        linewidth: .6,
        color: ncolor
    });
    var h = 40;
    var p = 1 + Math.sqrt((n - s) * (n - s) + (r - o) * (r - o)) /100;
    if (u % 2 === 0) p = -p;
    var d = new THREE.SplineCurve3([new THREE.Vector3(n, r, i), new THREE.Vector3((n + s) / 2 - (n - s) / p, (r + o) / 2 + (r - o) / p, (i + u) / 2-10*p), new THREE.Vector3(s, o, u)]);
    var v = d.getPoints(h);
    for (var m = 0; m < v.length; m++) {
        l.vertices.push(v[m])
    }
    var g = new THREE.Line(l, c);
    return g
};
function hideLinks(){
    scene.remove(links);
}