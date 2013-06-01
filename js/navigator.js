

(function(){
	$(document).ready(function(){

		var inputHandle = $("#xmlInput"); 
		var goButton = $("#goButton");

		goButton.on("click",function(){
			var nodeName = "node";
			var dataName = "name";
			var cleanData = clean(inputHandle.val());
			var jsonObj = $.xml2json(cleanData);	
			var mainNode;
			dataSet = "";
			mainNode = getData(jsonObj, nodeName, dataName);
			getDataSet(mainNode);
			//document.getElementById("heirarchyOutput").innerHTML=JSON.stringify(mainNode, null, 4);
			$("#heirarchyOutput").html(JSON.stringify(mainNode, null, 4))
			drawData(dataSet);
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
				curNode.mArray[i]=getData(jsonObj.node[i], nodeName, dataName);
			}
			return curNode;
		}

		function dataNode(name, url, array)
		{
			this.mName = name;
			this.mUrl = url;
			this.mArray = array;
		}

		function drawData(dataSet)
		{
			var Renderer = function(canvas){
			    var canvas = $(canvas).get(0);
			    var ctx = canvas.getContext("2d");
			    var particleSystem;
			    var graphics = arbor.Graphics(canvas);

			    var _vignette = null
			    var selected = null,
			        nearest = null,
			        _mouseP = null;

			    var that = {
			      	init:function(system){
			      	particleSystem = system;
			      	particleSystem.screenSize(canvas.width, canvas.height);
	        		particleSystem.screenPadding(80);
	        		$(window).resize(that.resize)
       				that.resize()
	        		that.initMouseHandling();
	        		},

	        		resize:function(){
				        canvas.width = $(window).width()
				        canvas.height = .75* $(window).height()
				        sys.screen({size:{width:canvas.width, height:canvas.height}})
				        _vignette = null
				        that.redraw()
			      	},
					        		
	        		redraw:function(){
				        graphics.clear();

				        particleSystem.eachEdge(function(edge, pt1, pt2){
					        ctx.strokeStyle = "#d3d3d3";
					        ctx.lineWidth = 1;
					        ctx.beginPath();
					        ctx.moveTo(pt1.x, pt1.y);
					        ctx.lineTo(pt2.x, pt2.y);
					        ctx.stroke();
				        })

				        particleSystem.eachNode(function(node, pt){
					        var w = Math.max(20, 20+graphics.textWidth(label));
					        var label = node.name;
				            graphics.rect(pt.x-w/2, pt.y-8, w, 20, 4, {fill:"gray"})
				            graphics.text(label, pt.x, pt.y+9, {color:"white", align:"center", font:"Arial", size:12})
				        })
				        that._drawVignette();
				    },

				    _drawVignette:function(){
				        var w = canvas.width;
				        var h = canvas.height;
				        var r = 20;

				        if (!_vignette){
				          var top = ctx.createLinearGradient(0,0,0,r);
				          top.addColorStop(0, "#e0e0e0");
				          top.addColorStop(.7, "rgba(255,255,255,0)");

				          var bot = ctx.createLinearGradient(0,h-r,0,h);
				          bot.addColorStop(0, "rgba(255,255,255,0)");
				          bot.addColorStop(1, "white");

				          _vignette = {top:top, bot:bot};
				        }
				        
				        // top
				        ctx.fillStyle = _vignette.top;
				        ctx.fillRect(0,0, w,r);

				        // bot
				        ctx.fillStyle = _vignette.bot;
				        ctx.fillRect(0,h-r, w,r);
				    },

				    initMouseHandling:function(){
				        var dragged = null;

				        var handler = {
				          clicked:function(e){
				            var pos = $(canvas).offset();
				            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
				            dragged = particleSystem.nearest(_mouseP);

				            if (dragged && dragged.node !== null){
				              dragged.node.fixed = true;
				            }

				            $(canvas).bind('mousemove', handler.dragged);
				            $(window).bind('mouseup', handler.dropped);

				            return false;
				          	},
				          	dragged:function(e){
				            var pos = $(canvas).offset();
				            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

				            if (dragged && dragged.node !== null){
				              var p = particleSystem.fromScreen(s);
				              dragged.node.p = p;
				            }

				            return false;
				          	},

					        dropped:function(e){
					            if (dragged===null || dragged.node===undefined) return;
					            if (dragged.node !== null) dragged.node.fixed = false;
					            dragged.node.tempMass = 1000;
					            dragged = null;
					            $(canvas).unbind('mousemove', handler.dragged);
					            $(window).unbind('mouseup', handler.dropped);
					            _mouseP = null;
					            return false;
					        }
				        }
				        $(canvas).mousedown(handler.clicked);
				    },
	        	}
	        	return that;
	        }
		    var sys = arbor.ParticleSystem(1000, 600, 0.5);
		    sys.parameters({gravity:true});
		    sys.renderer = Renderer("#viewport");
	        // var json = JSON.stringify(eval("(" + dataSet + ")"));
	        json = $.parseJSON(dataSet);
		    sys.merge({nodes:json.nodes, edges:json.edges});
		    //sys.addNode(dataList[1]);
		    //sys.addEdge(dataList,dataList.mArray);
		    //sys.addEdge(dataList,dataList.mArray[1]);
		    //sys.addEdge(dataList,dataList.mArray[2]);
		    //sys.addEdge(dataList,'e');
		}

		function getDataSet(dataList)
		{
			dataSet ='{"nodes": {';
			getNodeData(dataList, true);
			dataSet += '},';
			dataSet += ' "edges": {';
			getEdgeData(dataList, true);
			dataSet += '}}';
		}

		function getNodeData(dataList, first)
		{
			if(first)
				dataSet += '"' + dataList.mName + '": {}';
			else
				dataSet+=', "' + dataList.mName + '": {}';
			var size = dataList.mArray.length;
			for(var i = 0; i < size; i++)
			{
				getNodeData(dataList.mArray[i], false);
			}
			return;
		}

		function getEdgeData(dataList, first)
		{

		}
	}); //document ready
})();