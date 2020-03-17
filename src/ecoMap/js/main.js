import jsonData from '../jsonDATA/data.json';

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

        fetch(jsonData)
                .then(data => data.json())
                .then(data => {
                    // console.log(data)
                    const arrFeatures = data.features
                    addPopupLogic(arrFeatures)
                })

        function addPopupLogic(arrFeatures) {
            console.log(arrFeatures)
            const arrCoordinats = []
            arrFeatures.forEach(element => {
                const result = []
                result.push(element.geometry.coordinates)
                result.push(element.properties.id)
                arrCoordinats.push(result.flat())
            });
            
            console.log('Массив координат ', arrCoordinats)
            
            
            let title = document.createElement('strong');
                title.innerHTML = ``

                // roperties": {
                //     "id": "ak16994523",
                //     "mag": 2.3,
                //     "benzol": 0.01,
                //     "ksilol": 0.04,
                //     "nitrogendioxideconcent": 0,
                //     "so2": 0.05,
                //     "toluol": 0,
                //     "time": 1507425650893,
                //     "felt": null,
                //     "tsunami": 0
            let benzolContainer = document.createElement('div')
                benzolContainer.innerHTML = 'Бензол'
            let ksilolContainer = document.createElement('div')
                ksilolContainer.innerHTML = 'Ксилол'
                        
            let population = document.createElement('div');
                population.innerHTML = ''

            console.log(arrFeatures)
            map.on('mousemove', function(e) {
                    // console.log(e)
                    title.textContent = ``
                    benzolContainer.textContent = `Бензол: `
                    ksilolContainer.textContent = `Ксилол: `
                    population.textContent = ``;

                    document.getElementById('info').innerHTML =
                    JSON.stringify(e.point) +
                    '<br />' +
                    JSON.stringify(e.lngLat.wrap());
    
                    // console.log(e.lngLat.lng)
                    // console.log(e.lngLat.lat)

                    let lngFromJSON = e.lngLat.lng.toFixed(2)
                    let latFromJSON = e.lngLat.lat.toFixed(2)
                    
                    arrFeatures.forEach((val, index) => {
                        // console.log('val ',val)
                        if (val.geometry.coordinates[0].toFixed(2) === lngFromJSON && val.geometry.coordinates[1].toFixed(2) === latFromJSON) {
                            
                            // console.log(arrCoordinats[index][2])
                            console.log(val.properties)
                            
                            title.textContent = `${val.properties.id}`
                            benzolContainer.textContent = `Бензол: ${val.properties.benzol || 'Нет данных'}`
                            ksilolContainer.textContent = `Ксилол: ${val.properties.ksilol || 'Нет данных'}`
                            population.textContent = 'Total population: ';
                                
                            overlay.appendChild(title);
                            overlay.appendChild(benzolContainer);
                            overlay.appendChild(ksilolContainer);
                            

                            overlay.appendChild(population);
                            overlay.style.display = 'block';

                            popup
                                .setLngLat(e.lngLat)
                                .setText(arrCoordinats[index][2])
                                .addTo(map);
                            

                        } else {
                            popup.remove();
                        }
                    })

    
                    
                });

            
        }


        map.on('load', function () {            
            map.setLayoutProperty('country-label', 'text-field', [
                'get',
                'name_ru'
            ]);

            // Add a geojson point source.
            // Heatmap layers also work with a vector tile source.
            map.addSource('earthquakes', {
                'type': 'geojson',
                'data':
                    // 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
                    // 'https://raw.githubusercontent.com/MoskKir/ecoMap/master/src/ecoMap/jsonDATA/data.json'
                    jsonData
                    
            });

            // console.log(jsonData)
            

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