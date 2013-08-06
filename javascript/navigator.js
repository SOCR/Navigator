

(function(){
	$(document).ready(function(){

			var searchButton = $("#searchButton");
			var searchInput = $("#searchInput");
			var previousButton = $("#previousButton");
	      	var nextButton = $("#nextButton");
	        tree();

		    function tree(){
		    	var found = new Array();

		    	searchButton.on("click",function(){
					found = [];
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
				    h = $("#tree").height(),
				    root;

				var force = d3.layout.force()
				    .linkDistance(75)
				    .charge(-125)
				    .gravity(.05)
				    .size([w, h]);

				var vis = d3.select("#tree").append("svg:svg")
				    .attr("width", w)
				    .attr("height", h);

			      d3.json("SOCR_HyperTree.json", function(json) {
			        root = json;
			        update();
					closeAll(root);
			        click(root);
			      });

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