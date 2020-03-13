const jsonData = require('../jsonDATA/data.json');

mapboxgl.accessToken = 'pk.eyJ1IjoibW9za2tpciIsImEiOiJjazNoZTAwcTgwYXJiM2JxdDJra2R3NXViIn0.d4xMxIrtPiJpOMbMW3XXLw';
// pk.eyJ1IjoibW9za2tpciIsImEiOiJjazNoZTAwcTgwYXJiM2JxdDJra2R3NXViIn0.d4xMxIrtPiJpOMbMW3XXLw
// token for URL with GITHUB pk.eyJ1IjoibW9za2tpciIsImEiOiJjazdwenAycDgwMDJrM2duMXlxY2wyb212In0.1A3TicZXFlulWa55US7ONQ
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [27.56667, 53.9000],
            zoom: 10
        });

        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false
            });
        console.log(popup)

        var overlay = document.getElementById('map-overlay');
        console.log(overlay)

        map.on('mousemove', function(e) {
                // console.log(e)
                document.getElementById('info').innerHTML =
                // e.point is the x, y coordinates of the mousemove event relative
                // to the top-left corner of the map
                JSON.stringify(e.point) +
                '<br />' +
                // e.lngLat is the longitude, latitude geographical position of the event
                JSON.stringify(e.lngLat.wrap());
            });

        map.on('load', function () {            
            map.setLayoutProperty('country-label', 'text-field', [
                'get',
                'name_ru'
            ]);
            console.log(this)

            var title = document.createElement('strong');
                title.textContent = `hello world`
                
            var population = document.createElement('div');
                population.textContent = 'Total population: ';
                
            overlay.appendChild(title);
            overlay.appendChild(population);
            overlay.style.display = 'block';

            // Add a geojson point source.
            // Heatmap layers also work with a vector tile source.
            map.addSource('earthquakes', {
                'type': 'geojson',
                'data':
                    // 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
                    // 'https://raw.githubusercontent.com/MoskKir/ecoMap/master/src/ecoMap/jsonDATA/data.json'
                    jsonData
                    
            });

            console.log(jsonData)
            map.addLayer(
                {
                    'id': 'earthquakes-heat',
                    'type': 'heatmap',
                    'source': 'earthquakes',
                    'maxzoom': 9,
                    'paint': {
                        // Increase the heatmap weight based on frequency and property magnitude
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            0,
                            0,
                            5,
                            1
                        ],
                        // Increase the heatmap color weight weight by zoom level
                        // heatmap-intensity is a multiplier on top of heatmap-weight
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            1,
                            9,
                            3
                        ],
                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        // Begin color ramp at 0-stop with a 0-transparancy color
                        // to create a blur-like effect.
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0,
                            'rgba(33,102,172,0)',
                            0.2,
                            'rgb(103,169,207)',
                            0.4,
                            'rgb(209,229,240)',
                            0.6,
                            'rgb(253,219,199)',
                            0.8,
                            'rgb(239,138,98)',
                            1,
                            'rgb(178,24,43)'
                        ],
                        // Adjust the heatmap radius by zoom level
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            2,
                            9,
                            20
                        ],
                        // Transition from heatmap to circle layer by zoom level
                        'heatmap-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            1,
                            9,
                            0
                        ]
                    }
                },
                'waterway-label'
            );

            map.addLayer(
                {
                    'id': 'earthquakes-point',
                    'type': 'circle',
                    'source': 'earthquakes',
                    'minzoom': 7,
                    'paint': {
                        // Size circle radius by earthquake magnitude and zoom level
                        'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                            16,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                        ],
                        // Color circle by earthquake magnitude
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            1,
                            'rgba(33,102,172,0)',
                            2,
                            'rgb(103,169,207)',
                            3,
                            'rgb(209,229,240)',
                            4,
                            'rgb(253,219,199)',
                            5,
                            'rgb(239,138,98)',
                            6,
                            'rgb(178,24,43)'
                        ],
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        // Transition from heatmap to circle layer by zoom level
                        'circle-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            0,
                            8,
                            1
                        ]
                    }
                },
                'waterway-label'
            );
        });