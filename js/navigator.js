

(function(){
	$(document).ready(function(){

		var inputHandle = $("#xmlInput"); 
		var goButton = $("#goButton");

		var canvas=document.getElementById("viewport");
		var ctx=canvas.getContext('2d');

		goButton.on("click",function(){
			var nodeName = "node";
			var dataName = "name";
			var cleanData = clean(inputHandle.val());
			var jsonObj = $.xml2json(cleanData);	
			var mainNode;
			mainNode = getData(jsonObj, nodeName, dataName);
			console.log(mainNode);
			document.getElementById("heirarchyOutput").innerHTML=JSON.stringify(mainNode, null, 4);
			drawData(mainNode);
		});

		function clean(data){
		 	data = data.replace(/(\r\n|\n|\r)/gm," ");
		 	data = data.replace(/\s+/g," ");
		 	data = data.replace(/^\s+|\s+$/g,'')
			return data;
		}

		function getData(jsonObj, nodeName, dataName){
			var next = new Array();
			var curNode = new dataNode(jsonObj.name, jsonObj.url, next);

			if(jsonObj.node != null)
			{
				var size = jsonObj.node.length;
			}
			else{
				return curNode;
			}
			for(var i = 0; i < size; i++)
			{
				curNode.array[i]=getData(jsonObj.node[i], nodeName, dataName);
			}
			return curNode;
		}

		function dataNode(name, url, array)
		{
			this.name = name;
			this.url = url;
			this.array = array;
		}

		function drawData(node)
		{
			
		}
	}); //document ready
})();