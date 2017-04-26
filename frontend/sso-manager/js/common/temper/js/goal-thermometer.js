/**
 * @author Lance Snider - lance@lancesnider.com
*/

//editable vars
var goalAmount = 100;//how much are you trying to get
//var currentAmount = 1267;//how much do you currently have (if you want to define in js, not html)
var animationTime = 1000;//in milliseconds
var numberPrefix = "";//what comes before the number (set to "" if no prefix)
var numberSuffix = "℃";//what goes after the number
var tickMarkSegementCount = 4;//each segement adds 40px to the height
var widthOfNumbers = 0;//the width in px of the numbers on the left

//standard resolution images
var glassTopImg = "images/tbs/top.png";
var glassBodyImg = "images/tbs/glass.png";
var redVerticalImg = "images/tbs/glass-body.png";
var tooltipFGImg = "images/tbs/body.png";
var glassBottomImg = "images/tbs/bottom.png";
var tootipPointImg = "";
var tooltipMiddleImg = "";
var tooltipButtImg = "";

var arrayOfImages;
var imgsLoaded = 0;
var tickHeight = 50;
var mercuryHeightEmpty = 0;
var numberStartY = 6;
var thermTopHeight = 13;
var thermBottomHeight = 51;
var tooltipOffset = 15;
var heightOfBody = {};
var mercuryId = {};
var mercurybId = {};
var tooltipId = {};
var resolution2x = false;
//visually create the thermometer
function createGraphics(id){

	//add the html
	$('#'+id).html(
		"<div class='therm-graphics'>" +
			"<img class='therm-top' src='"+glassTopImg+"'></img>" +
			"<img class='therm-body-mercury' src='"+redVerticalImg+"'></img>"+
			"<div class='therm-body-fore'><img class='therm-body-bg' src='"+glassBodyImg+"' ></img></div>" +
			"<img class='therm-bottom' src='"+glassBottomImg+"'></img>" +
		"</div>"
	);

	//preload and add the background images
	$('<img/>').attr('src', tooltipFGImg).load(function(){
		$(this).remove();
		$(".therm-body-fore").css("background-image", "url('"+tooltipFGImg+"')");
		checkIfAllImagesLoaded();
	});

	$('<img/>').attr('src', tooltipMiddleImg).load(function(){
		$(this).remove();
		$(".therm-tooltip .tip-middle").css("background-image", "url('" + tooltipMiddleImg + "')");
		checkIfAllImagesLoaded();
	});

	//adjust the css
	heightOfBody[id] = tickMarkSegementCount * tickHeight;
	$(".therm-body-fore").css("height", heightOfBody[id]);
	$(".therm-bottom").css("top", heightOfBody[id] + thermTopHeight-5);
	mercuryId[id] = $("#"+id).find(".therm-body-mercury");
	mercuryId[id].css("top", heightOfBody[id] + thermTopHeight);
	mercurybId[id] = $("#"+id).find('.therm-body-bg');
	tooltipId[id] = $("#"+id).find(".therm-tooltip");
	tooltipId[id].css("top", heightOfBody[id] + thermTopHeight - tooltipOffset);
	//check that the images are loaded before anything
	arrayOfImages = new Array( ".therm-top", ".therm-body-bg", ".therm-body-mercury", ".therm-bottom", ".tip-left", ".tip-right");
	preload(arrayOfImages);

};
//check if each image is preloaded
function preload(arrayOfImages) {
	for(i=0;i<arrayOfImages.length;i++){
		$(arrayOfImages[i]).load(function() {   checkIfAllImagesLoaded();  });
	}
}
//check that all the images are preloaded
function checkIfAllImagesLoaded(){
	imgsLoaded++;
	if(imgsLoaded == arrayOfImages.length+2){
		$(".goal-thermometer").fadeTo(1000, 1, function(){

		});
	}
}
//format the numbers with $ and commas
function commaSeparateNumber(val){
	val = Math.round(val);
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return numberPrefix + val + numberSuffix;
}