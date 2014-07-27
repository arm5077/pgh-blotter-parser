$(window).load(function(){
	// Initialize map and add Stamen map layer
	var layer = new L.StamenTileLayer("toner-lite");
	var map = new L.Map("map", {
		center: new L.LatLng(40.4417, -80.0000),
		zoom: 13,
		minZoom: 12,
		zoomControl:false,
		scrollWheelZoom:false
	});
		
	map.addLayer(layer);
	
	new L.control.zoom({position: "bottomright"}).addTo(map);
	
	// Initialize markers object
	var markers = L.markerClusterGroup();
	
	// Pull data (currently fake)
	$.getJSON("js/fake-data.json", function(data){
		
		// Update total count
		$("#total_incidents").html( data.length );
		
		$.each(data, function(i, incident){
			
			// Add new incident module
			var newIncident = $("<div class = 'incident'></div>").appendTo("#incident_list");
			
			// Properly class incident module as Arrest or Offense
			newIncident.addClass( (incident["Report Name"] == "ARREST" ? "arrest" : "offense" ) ); 
			
			// Add timestamp
			newIncident.append("<div class = 'timestamp'>" + incident["Incident Time"] + " &mdash; " + incident["Report Name"] + " </div>");
			
			// Add charges module
			var charges = $("<div class = 'charges'></div>").appendTo(newIncident);
			
			// Cycle through crimes
			$.each(incident.Description, function(j, crime){
				
				// Add crime to listing
				charges.append("<h1>" + crime + "</h1>");
				
			});
			
			// Add info module
			var info = $("<div class='info'></div>").appendTo(newIncident);
			
			// Add location and perp info (if applicable) to info module
			info.append("<table><tr><td><i class='fa fa-map-marker'></td><td><h2>" + incident.Neighborhood + "</h2><h2>" + incident["Location of Occurrence"] + "</h2></td>");
			if( incident["Report Name"] == "ARREST" ) info.find("tr").after("<tr><td><i class='fa fa-user'></i></td><td><h2>" + incident.Age + "-year-old " + (incident.Gender == "M" || incident.Gender == "F" ? ( incident.Gender == "M" ? "man" : "woman" ) : "person of unknown gender") + "</h2></td></tr>");
			
			// Add marker
			var marker = L.marker([incident.geocode.lat, incident.geocode.lng]);
			
			// Scroll to and highlight incident on marker click
			marker.on("click", function(){
				// Check if list is hidden; act accordingly
				if( $("#data").css("position") != "relative" ) {
					$("#data").css({position:"relative", "margin-top":"301px"});
				}
				
				$.scrollTo( newIncident, 250, {offset:-50} );
				$(".incident").removeClass("selected");
				newIncident.addClass("selected");
				
			});
			
			// "Hover" highlight incident on marker mouseover
			marker.on("mouseover", function(){
				newIncident.addClass("hover");
			});
			
			marker.on("mouseout", function(){
				newIncident.removeClass("hover");
			});
			
			// Add marker to markers group
			markers.addLayer(marker);
			
			// Zoom to marker on incident click
			newIncident.click(function(){
				map.setView([incident.geocode.lat, incident.geocode.lng], 17, {animate:true});
				$(".incident").removeClass("selected");
				newIncident.addClass("selected");
			});
			
		});
	});
	
	// Add markers to map
	map.addLayer(markers);
	
	// Turn on le scrollz
	
	var s = skrollr.init();
	
	
	// 
	// Global events
	//
	
	$("#content").waypoint(function(direction){
		$("#content, #header").toggleClass("hidden");
	}, {offset:-50} );
	$(window).scrollTo(0,0);
	
});