

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
			var Renderer = function(canvas){
			    var canvas = $(canvas).get(0);
			    var ctx = canvas.getContext("2d");
			    var particleSystem;

			    var that = {
			      	init:function(system){
			      	particleSystem = system;
			      	particleSystem.screenSize(canvas.width, canvas.height);
	        		particleSystem.screenPadding(80);
	        		that.initMouseHandling();
	        		},

	        		redraw:function(){
		        		ctx.fillStyle = "white";
				        ctx.fillRect(0,0, canvas.width, canvas.height);
				        particleSystem.eachEdge(function(edge, pt1, pt2){
				          ctx.strokeStyle = "rgba(0,0,0, .333)";
				          ctx.lineWidth = 1;
				          ctx.beginPath();
				          ctx.moveTo(pt1.x, pt1.y);
				          ctx.lineTo(pt2.x, pt2.y);
				          ctx.stroke();
				        })
				        particleSystem.eachNode(function(node, pt){
				          var w = 10;
				          ctx.fillStyle = (node.data.alone) ? "orange" : "black";
				          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w);
				        })
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
		    var sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
		    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
		    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

		    // add some nodes to the graph and watch it go...
		    sys.addEdge('a','b')
		    sys.addEdge('a','c')
		    sys.addEdge('a','d')
		    sys.addEdge('a','e')
		    sys.addNode('f', {alone:true, mass:.25})
		}
	}); //document ready
})();