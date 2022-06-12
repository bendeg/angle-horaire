export let map;

export function getMap(defaultCoordinates) {
  if(map != undefined) return map;
  else return new ol.Map({
                layers: [
                  new ol.layer.Tile({source: new ol.source.OSM()})
                ],
                view: new ol.View({
                  center: defaultCoordinates,
                  zoom: 16
                }),
                target: 'map'
              });
}
