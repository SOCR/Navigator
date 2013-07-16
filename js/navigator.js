

(function(){
	$(document).ready(function(){
		var nodeName = $("#nodeInput");
    	nodeName = nodeName.val();
	      if(nodeName == "")
	        nodeName = "node";
	      var dataName = $("#dataInput");
	      dataName = dataName.val();
	      if(dataName == "")
	        dataName = "name";

	      $.get("default.txt").success(function(xml){inputHandle.html(xml)})

	      var inputHandle = $("#xmlInput"); 
	      var goButton = $("#goButton");
	      var searchButton = $("#searchButton");
	      var previousButton = $("#previousButton");
	      var nextButton = $("#nextButton");
	      var searchInput = $("#searchInput");
	      var dataSet = "";

	      goButton.on("click",function(){
	      	document.getElementById("chart").innerHTML = "";
	        dataSet = "";
	        var input = inputHandle.val();
	        var cleanData = clean(inputHandle.val());
	        var jsonObj = $.xml2json(cleanData);  
	        var mainNode;
	        mainNode = getData(jsonObj, nodeName, dataName);
	        getDataSet(mainNode, true, 35000);
	        hierarchy();
	        tree();
	        return false;
	      });

			function hierarchy(){
				var found = new Array();
				searchButton.on("click",function(){
					found.length = 0;
					searchTree(root, searchInput.val().toLowerCase(), found);
					if(found != null){
						closeAll(root);
						var cur = 0;
						document.getElementById("shownMatch").innerHTML = found[cur].name;
						document.getElementById("match").innerHTML = found.length;
						var current = found[cur];
						while(current.parent != null){
							current = current.parent;
							if(current.children == null)
								click(current);
						}
						previousButton.on("click",function(){
							if(cur == 0)
							{
								cur = found.length - 1;
							}
							else
								cur--;
							document.getElementById("shownMatch").innerHTML = found[cur].name;
							closeAll(root);
							var current = found[cur];
							while(current.parent != null){
								current = current.parent;
								if(current.children == null)
									click(current);
							}
							return false;
						})
						nextButton.on("click",function(){
							if(cur == found.length - 1)
							{
								cur = 0;
							}
							else
								cur++;
							document.getElementById("shownMatch").innerHTML = found[cur].name;
							closeAll(root);
							var current = found[cur];
							while(current.parent != null){
								current = current.parent;
								if(current.children == null)
									click(current);
							}
							return false;
						})
						}
					return false;
				});

				$(window).resize(function() {
				    waitForFinalEvent(function() {
				    	removeGraph();
	                    hierarchy();
	                }, 500, '0a1edaaa-3f4e-4a23-8bc2-7f6e1a5f35b0');
	            });

	            var removeGraph = function() {
		            svg = d3.select('#chart svg');
		            svg.on('click', null);
		            svg.on('dblclick', null);
		            svg.on('mouseover', null);
		            svg.on('mouseout', null);

		            $('#chart').empty();
		        }

		        var w = $("#chart").width()
		          h = 800,
		          i = 0,
		          barHeight = 20,
		          barWidth = w * .8,
		          duration = 400;

		        var root;

		        var tree = d3.layout.tree()
		            .size([h, 100]);

		        var diagonal = d3.svg.diagonal()
		            .projection(function(d) { return [d.y, d.x]; });

		        var vis = d3.select("#chart").append("svg:svg")
		            .attr("width", w)
		            .attr("height", h)
		          	.append("svg:g")
		            .attr("transform", "translate(20,30)")

		        var json = jQuery.parseJSON(dataSet);
		          json.x0 = 0;
		          json.y0 = 0;
		          update(root = json);

		        closeAll(root);
		        // click(root);

		        function update(source) {

		          // Compute the flattened node list. TODO use d3.layout.hierarchy.
		          var nodes = tree.nodes(root);
		          
		          // Compute the "layout".
		          nodes.forEach(function(n, i) {
		            n.x = i * barHeight;
		          });
		          
		          // Update the nodes…
		          var node = vis.selectAll("g.node")
		              .data(nodes, function(d) { return d.id || (d.id = ++i); });
		          
		          var nodeEnter = node.enter().append("svg:g")
		              .attr("class", "node")
		              .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		              .style("opacity", 1e-6);

		          // Enter any new nodes at the parent's previous position.
		          nodeEnter.append("svg:rect")
		         	  .attr("class", "bar")
		              .attr("y", -barHeight / 2)
		              .attr("height", barHeight)
		              .attr("width", barWidth)
		              .attr("title", function(d) { return d.name; })
		              .style("fill", color)
		              .on("click", click)
		              .on("dblclick", dblclick)
		              .on("mouseover", function(){d3.select(this).style("fill", "green");})
		              .on("mouseout", function(){d3.select(this).style("fill", color);});
		          
		          nodeEnter.append("svg:text")
		              .attr("dy", 3.5)
		              .attr("dx", 5.5)
		              .text(function(d) { return d.name; });
		          
		          // Transition nodes to their new position.
		          nodeEnter.transition()
		              .duration(duration)
		              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		              .style("opacity", 1);
		          
		          node.transition()
		              .duration(duration)
		              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		              .style("opacity", 1)
		            .select("rect")
		              .style("fill", color);
		          
		          // Transition exiting nodes to the parent's new position.
		          node.exit().transition()
		              .duration(duration)
		              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		              .style("opacity", 1e-6)
		              .remove();
		          
		          // Update the links…
		          var link = vis.selectAll("path.link")
		              .data(tree.links(nodes), function(d) { return d.target.id; });
		          
		          // Enter any new links at the parent's previous position.
		          link.enter().insert("svg:path", "g")
		              .attr("class", "link")
		              .attr("d", function(d) {
		                var o = {x: source.x0, y: source.y0};
		                return diagonal({source: o, target: o});
		              })
		            .transition()
		              .duration(duration)
		              .attr("d", diagonal);
		          
		          // Transition links to their new position.
		          link.transition()
		              .duration(duration)
		              .attr("d", diagonal);
		          
		          // Transition exiting nodes to the parent's new position.
		          link.exit().transition()
		              .duration(duration)
		              .attr("d", function(d) {
		                var o = {x: source.x, y: source.y};
		                return diagonal({source: o, target: o});
		              })
		              .remove();
		          
		          // Stash the old positions for transition.
		          nodes.forEach(function(d) {
		            d.x0 = d.x;
		            d.y0 = d.y;
		          });
		        }

		      	function closeAll(d) {
			      if (d.children) {
			        d.children.forEach(closeAll);
			        click(d);
			      }
			    }

		        // Toggle children on click.
		        function click(d) {
		          if (d.children) {
		            d._children = d.children;
		            d.children = null;
		          } else {
		            d.children = d._children;
		            d._children = null;
		          }
		          update(d);
		        }

		        function dblclick(d) {
		        	window.open(d.url);
		        }

		        function color(d) {
		          return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
		        }
		    }

		    function tree(){
		    	var found = new Array();
		    	searchButton.on("click",function(){
					found.length = 0;
					searchTree(root, searchInput.val().toLowerCase(), found);
					if(found != null){
						closeAll(root);
						var cur = 0;
						var current = found[cur];
						while(current.parent != null){
							current = current.parent;
							if(current.children == null)
								click(current);
						}
						previousButton.on("click",function(){
							if(cur == 0)
							{
								cur = found.length - 1;
							}
							closeAll(root);
							var current = found[cur];
							while(current.parent != null){
								current = current.parent;
								if(current.children == null)
									click(current);
							}
						})
						nextButton.on("click",function(){
							if(cur == found.length - 1)
							{
								cur = 0;
							}
							closeAll(root);
							var current = found[cur];
							while(current.parent != null){
								current = current.parent;
								if(current.children == null)
									click(current);
							}
						})	
					}
				});

				$(window).resize(function() {
				    waitForFinalEvent(function() {
				    	removeGraph();
	                    tree();
	                }, 500, '0a1edaaa-3f4e-4a23-8bc2-7f6e1a5f35b1');
	            });

	            var removeGraph = function() {
		            svg = d3.select('#tree svg');
		            svg.on('click', null);
		            svg.on('dblclick', null);
		            svg.on('mouseover', null);
		            svg.on('mouseout', null);

		            $('#tree').empty();
		        }

		      	var w = $("#tree").width(),
				    h = $("#tree").height()+800,
				    root;

				var force = d3.layout.force()
				    .linkDistance(100)
				    .charge(-175)
				    .gravity(.05)
				    .size([w, h]);

				var vis = d3.select("#tree").append("svg:svg")
				    .attr("width", w)
				    .attr("height", h);

				var json = jQuery.parseJSON(dataSet);
				root = json;
				update();

				closeAll(root);
		        click(root);

				function update() {
				  var nodes = flatten(root, null),
				      links = d3.layout.tree().links(nodes);

				  // Restart the force layout.
				  force
				      .nodes(nodes)
				      .links(links)
				      .start();

				  // Update the nodes…
				  var node = vis.selectAll("g.node")
				      .data(nodes, function(d) { return d.id });

				  node.select("circle")
				      .style("fill", color);

				  // Enter any new nodes.
				  var nodeEnter = node.enter().append("svg:g")
				      .attr("class", "node")
				      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				      .on("click", click)
				      .on("dblclick", dblclick)
				      .call(force.drag);

				  nodeEnter.append("svg:circle")
				      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 7.5; })
				      .style("fill", color)
				      .on("mouseover", function(){d3.select(this).style("fill", "green");})
		              .on("mouseout", function(){d3.select(this).style("fill", color);});

				  nodeEnter.append("svg:text")
				      .attr("text-anchor", "middle")
				      .attr("dy", ".35em")
				      .text(function(d) { return d.name; });

				  // Exit any old nodes.
				  node.exit().remove();

				  // Update the links…
				  var link = vis.selectAll("line.link")
				      .data(links, function(d) { return d.target.id; });

				  // Enter any new links.
				  link.enter().insert("svg:line", ".node")
				      .attr("class", "link")
				      .attr("x1", function(d) { return d.source.x; })
				      .attr("y1", function(d) { return d.source.y; })
				      .attr("x2", function(d) { return d.target.x; })
				      .attr("y2", function(d) { return d.target.y; });

				  // Exit any old links.
				  link.exit().remove();

				  // Re-select for update.
				  link = vis.selectAll("line.link");
				  node = vis.selectAll("g.node");

				  force.on("tick", function() {
				    link.attr("x1", function(d) { return d.source.x; })
				        .attr("y1", function(d) { return d.source.y; })
				        .attr("x2", function(d) { return d.target.x; })
				        .attr("y2", function(d) { return d.target.y; });

				    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				  });
				}

				// Color leaf nodes orange, and packages white or blue.
				function color(d) {
				  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
				}

				function closeAll(d) {
			      if (d.children) {
			        d.children.forEach(closeAll);
			        click(d);
			      }
			    }

				// Toggle children on click.
				function click(d) {
				  if (d.children) {
				    d._children = d.children;
				    d.children = null;
				  } else {
				    d.children = d._children;
				    d._children = null;
				  }
				  update();
				}

				function dblclick(d) {
		        	window.open(d.url);
		        }

				// Returns a list of all nodes under the root.
				function flatten(root, above) {
				  var nodes = [], i = 0;

				  function recurse(node, above) {
				    if (node.children)
				    {
				    	for(var j = 0; j < node.children.length; j++)
				    		recurse(node.children[j], node)
				    }
				    if (!node.id) node.id = ++i;
				    node.parent=above;
				    nodes.push(node);
				  }

				  recurse(root, above);
				  return nodes;
				}
			}

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
	      
	      function getDataSet(dataList, last, setSize)
	      {
	        dataSet += '{"name": "' + dataList.mName + '", "url": ' + '"' + dataList.mUrl + '", "size": ' + setSize;
	        var size = dataList.mArray.length;
	        if(size != 0)
	        {
	          dataSet += ',"children": [';
	          for(var i = 0; i < size; i++)
	          {
	            if(i != size - 1)
	              getDataSet(dataList.mArray[i], false, setSize * 2 / 3);
	            else
	              getDataSet(dataList.mArray[i], true, setSize * 2 / 3);
	          }
	          dataSet += ']';
	        }
	        dataSet += '}';
	        if(!last)
	        dataSet += ',';
	        return;
      	}

      	function searchTree(element, matchingTitle, addArray){
		     if(element.name.toLowerCase().indexOf(matchingTitle) != -1)
		          addArray.push(element);
		     if (element.children != null){
		          for(var i=0; i < element.children.length; i++){
		               searchTree(element.children[i], matchingTitle, addArray);
		          }
		     }
		     else if (element._children != null){
		          for(var i=0;  i < element._children.length; i++){
		               searchTree(element._children[i], matchingTitle, addArray);
		          }
		      }
		}

		var waitForFinalEvent = (function () {
	        var timers = {};
	        return function (callback, ms, uniqueId) {
	            if (!uniqueId) {
	                uniqueId = 'Don\'t call this twice without a uniqueId';
	            }
	            if (timers[uniqueId]) {
	                clearTimeout (timers[uniqueId]);
	            }
	            timers[uniqueId] = setTimeout(callback, ms);
	        };
	    })();
	}); //document ready
})();