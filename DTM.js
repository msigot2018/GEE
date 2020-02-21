var ROI = geometry

var palette_slope = []
var palette_elevation = ['#855723', '	#996F1D','	#AD8717','	#C19F11','#D5B70B','	#E9CF05','#FEE700',
'#D8CC04','#B2B109','#8C970D','#667C12','#406116','#1B471B']

var dataset = ee.Image('USGS/SRTMGL1_003').clip(ROI);//spatial resolution 30m
var elevation = dataset.select('elevation'); //is possible to obtain elevation directly from collection 'USGS/SRTMGL1_003'
var slope = ee.Terrain.slope(elevation);

Map.setCenter(geometry, 10);

Map.addLayer(slope, {min: 0, max: 60, palette: palette_slope}, 'slope');
Map.addLayer(elevation,{min: -15, max: 1422, palette: palette_elevation},'elevation')


var max_elv = ee.Number(elevation.reduceRegion({
      reducer: ee.Reducer.max(),
      geometry: ROI,
      scale: 30,
      maxPixels: 1e9
    }).values().get(0))
    
var min_elv = ee.Number(elevation.reduceRegion({
      reducer: ee.Reducer.min(),
      geometry: ROI,
      scale: 30,
      maxPixels: 1e9
    }).values().get(0))

print('Altitude máxima:',max_elv)
print('Altitude mínima:', min_elv)

Export.image.toDrive({
 image: elevation, //or 'slope'
 description: 'MDT',  
 scale: 30,  
 region: ROI,  
 fileFormat: 'GeoTIFF',  
 formatOptions: {  
    cloudOptimized: true  
  },
  skipEmptyTiles: true
});