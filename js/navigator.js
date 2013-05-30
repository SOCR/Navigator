(function(){

var inputHandle = $("#xmlInput"); 
var goButton = $("#goButton");

goButton.on("click",function(){
	var cleanData = clean(inputHandle.val());
	var xmlObj = $.parseXML(cleanData);
	console.log(xmlObj);
});

function clean(data){
 	data = data.replace(/(\r\n|\n|\r)/gm," ");
 	data = data.replace(/\s+/g," ");
 	data = data.replace(/^\s+|\s+$/g,'')
	return data;
}
})();


