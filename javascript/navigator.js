

(function(){
	$(document).ready(function(){

			var searchButton = $("#searchButton");
			var searchInput = $("#searchInput");
			var previousButton = $("#previousButton");
	      	var nextButton = $("#nextButton");
	        hierarchy();

		    function hierarchy(){
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
				document.getElementById('menu').onchange = function() {
				    if (this.options[this.selectedIndex].value === 'SOCR_HyperTree.json') {
				        d3.json("xml/SOCR_HyperTree.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				    if (this.options[this.selectedIndex].value === 'FileFormatTypes_HyperTree.json') {
				        d3.json("xml/FileFormatTypes_HyperTree.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				    if (this.options[this.selectedIndex].value === 'GAMS_NIST_Resources.json') {
				        d3.json("xml/GAMS_NIST_Resources.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				    if (this.options[this.selectedIndex].value === 'iTools_TR_Resources.json') {
				        d3.json("xml/iTools_TR_Resources.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				    if (this.options[this.selectedIndex].value === 'NIF_TR_Resources.json') {
				        d3.json("xml/NIF_TR_Resources.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				    if (this.options[this.selectedIndex].value === 'OID_IIP_TR_Resources.json') {
				        d3.json("xml/OID_IIP_TR_Resources.json", function(json) {
					        root = json;
					        update(root);
							closeAll(root);
					        click(root);
					      });
				    }
				};
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
		          h = 650,
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

		        d3.json("xml/SOCR_HyperTree.json", function(json) {
			        root = json;
			        update(root);
					closeAll(root);
			        click(root);
			      });

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