function UI() {
    this.fullscreen = false;
    this.showabout = false;
    myThis = this;
    this.loading=0;
    $(document).keyup(function(e) {
        switch (e.which) {
            case 37: 

                break;
            case 27:
                THREEx.FullScreen.cancel();
                $("#fullscreen").html('<a href="#">Fullscreen Mode</a>');
                myThis.fullscreen = false;
                break;
            default:
                return; 
        }
    });
    $(window).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
            var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            if(!state){
                $("#fullscreen").html('<a href="#">Fullscreen Mode</a>');
                myThis.fullscreen = false;
                THREEx.FullScreen.cancel();
            }  
    });


    $("#fullscreen").click(function() {
        if (!myThis.fullscreen) {
            THREEx.FullScreen.request(document.body);
            $("#fullscreen").html('<a href="#">Window Mode</a>');
            myThis.fullscreen = true;
        } else {
            THREEx.FullScreen.cancel();
            $("#fullscreen").html('<a href="#">Fullscreen Mode</a>');
            myThis.fullscreen = false;
        }
    });


    $("#showAbout").click(function(){
        myThis.showabout=!myThis.showabout;
        if(myThis.showabout){
            $("#aboutText").show();
            $("#aboutText").animate({'right':'0'},400, "swing", function() {

            });
        }else{
            $("#aboutText").animate({'right':-window.innerWidth*0.4+'px'},200, "swing", function() {
                $("#aboutText").hide();
            });
        }
	});
    $("#closeAbout").click(function(){
        myThis.showabout=false;
        $("#aboutText").animate({'right':-window.innerWidth*0.4+'px'},200, "swing", function() {
                $("#aboutText").hide();
        });
    });


    ring=true;
    buttons = [];
    divX = 45;
    divY = 60;
    step = 30;
    ring = false;
    //buttons.push({"id":"groupButton","title":"Group by Product","img":"images/icon/productstack.png"});
    buttons.push({
        "id": "gridSphereButton",
        "title": "Globe view",
        "img": "images/icon/globe2.png",
        "desc": "Displays all products a country exports by placing them inside a country"
    });
    buttons.push({
        "id": "gridButton",
        "title": "Map view",
        "img": "images/icon/map2.png",
        "desc": "Displays all products a country exports by placing them inside a country"
    });
    buttons.push({
        "id": "towersButton",
        "title": "Country Stacks",
        "img": "images/icon/stacks32.png",
        "desc": "Stacks every product a country exports on a map, each row represents $2.5B"
    });
    buttons.push({
        "id": "productButton3",
        "title": "3d product space",
        "img": "images/icon/graph2.png",
        "desc": "3D version of the productspace, hop around by clicking on nodes"
    });
    buttons.push({
        "id": "productButton",
        "title": "Product Space",
        "img": "images/icon/graph22.png",
        "desc": "Displays all products in their category, arranged in a similarity graph called the product space."
    });
    buttons.push({
        "id": "productButton2",
        "title": "Product Stacks",
        "img": "images/icon/stack2.png",
        "desc": "Stacks products by category"
    });

    newDiv="<table>";
    for (var i = 0; i < buttons.length; i++) {
        option = buttons[i];
        option.rank=i;
        angle = 0;
        if(i%3==0 && i>0){
            newDiv+="</tr><tr>"
        }
        newDiv += "<td><div class='modeSelector' style='-webkit-transform: rotateY(" + angle + "deg);transform: rotateY(" + angle + "deg);'id='" + option.id + "'><img src='" + option.img + "'/><div class='optionTitle'>" + option.title + "</div></div></td>";
    }
    newDiv+="</tr></table>";

    $("#visualizations").html(newDiv);

    $("#gridSphereButton").addClass("selectedMode");
    $("#visualizations").on("mouseover",".modeSelector",function(){
        for (var i = 0; i < buttons.length; i++) {
            if(buttons[i].id===$(this).prop('id')){
                $("#modeDescription").show();
                $("#modeDescription").html(buttons[i].desc);
                offset=$(this).offset();
                $("#modeDescription").css({'top':offset.top,'left':'180px'});
            }
        }
    });
    $("#visualizations").on("mouseout",".modeSelector",function(){
        $("#modeDescription").hide();
    });

};
UI.prototype.addSpinner = function(){
var opts = {
  lines: 17 // The number of lines to draw
, length: 0 // The length of each line
, width: 1 // The line thickness
, radius: 84 // The radius of the inner circle
, scale: 3.5 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#FFF' // #rgb or #rrggbb or array of colors
, opacity: 0 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 99 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var target = document.getElementById('spinner')
var spinner = new Spinner(opts).spin(target);

}
UI.prototype.buildCategories= function(categories){
    cats=["Animal & Animal Products","Vegetable Products","Foodstuffs","Mineral Products","Chemicals & Allied Industries","Plastics & Rubbers","Leathers and Furs","Wood & Wood Products","Textiles","Footwear & Headgear","Stone & Glass","Metals","Machinery & Electrical","Transportation","Miscellaneous","Service"];
    var catHTML="<table><tr>";
    $.each(categories,function(i,val){
            color=new THREE.Color(i);
            rgba="rgba("+Math.round(color.r*295)+","+Math.round(color.g*295)+","+Math.round(color.b*295)+",0.8)";
            //catHTML+="<td class='categoryButton' style='-webkit-box-shadow: inset 0px -12px 15px -2px  "+rgba+"; -moz-box-shadow: inset 0px -12px 15px -2px  "+rgba+"; box-shadow: inset 0px -12px 15px -2px  "+rgba+";'><div id=cat"+val.id+" class='chooseCategory'>"+cats[val.id]+" </div></td>";
            catHTML+="<td class='categoryButton' style='border-top:8px solid "+rgba+" ;'><div id=cat"+val.id+" class='chooseCategory'>"+cats[val.id]+" </div></td>";            
        });
        $("#categories").html(catHTML+"</tr></table>");
};
UI.prototype.updateLoader = function(add){
    this.loading+=add;
    percentage=this.loading;
    $("#loadingBar").animate({'width':percentage/100*500},100);
}
UI.prototype.createProductBox = function(products) {
    var html='<select class="productSelection"><option value="null" selected="selected">Select a product</option>';

    $.each(products,function(i,val){
        html+="<option value ='"+val.atlasid+"'>"+val.name+"</option>";
    });
    html+="</select>";
    $(".productBox").html(html);
    $(".productSelection").select2({placeholder: "Select a product",allowClear: true});
    
};

UI.prototype.changeCursor = function(type,blocked){
    $('body').removeClass("grab");
    $('body').removeClass("grabbing");
    switch(type){
        case "grab":
        if(blocked)$('body').css({"cursor":"not-allowed"});
        else $('body').addClass("grab");
        break;
        case "grabbing":
        if(blocked)$('body').css({"cursor":"not-allowed"});
        else $('body').addClass("grabbing");
        break;
        case "default":
        case "pointer":
        default:
        $('body').css({"cursor":type});
        break;
    }
    
};

UI.prototype.createSelectionBox = function(countries) {
    var html='<select class="countrySelection"><option value="null" selected="selected">Select a country</option>';

    $.each(countries,function(i,val){
        html+="<option value ='"+i+"'>"+val.name+"</option>";
    });
    html+="</select>";
    $(".selectionBox").html(html);
    $(".countrySelection").select2({placeholder: "Select a country",allowClear: true});
    
};