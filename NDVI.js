
var ROI = geometry // Region of Interest 

var addNDVI = function(image) {
    
    var band = image.addBands(image.normalizedDifference(['B8', 'B4'])) // NDVI formula, input bands 
    return band

    return image.updateMask(mask)
};


// Image collection (Sentinel-2 MSI: MultiSpectral Instrument, Level-2A)
var S2 = ee.ImageCollection('COPERNICUS/S2_SR')
//filter date - start and end 
    .filterDate('2019-07-01', '2019-08-31')
//filter according to drawn boundary
    .filterBounds(ROI)
    .filterMetadata('CLOUDY_PIXEL_PERCENTAGE','less_than',30)
    .map(function(image){return image.clip(ROI)}) // Cut out image collection by ROI
    .map(addNDVI) //add function 






// Extract NDVI band
var NDVI = S2.select(['nd']); // this is one band ('nd') generated from function 'addNDVI'

//Create NDVI median composite image
var NDVImed = NDVI.median(); 



// Create palettes for display NDVI image 
var ndvi_pal = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b','#a6d96a'];



// Display NDVI results on map
Map.addLayer(NDVImed.clip(ROI), {min:-1, max:1, palette: ndvi_pal}, 'NDVI');





//----------------------------------DISPLAY CHART (TEMPORAL ANALYSIS) -----------------------------------------------

    
    
var tempTimeSeries = ui.Chart.image.seriesByRegion(
    NDVI, ROI, ee.Reducer.median(), 'nd', 10, 'system:time_start', 'Median of NDVI')
        .setChartType('ScatterChart')
        .setOptions({
          title: 'NDVI Over time.',
          vAxis: {title: 'NDVI'},
          hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 20}},
          lineWidth: 1,
          pointSize: 2,
          series: {
            0: {color: 'FF0000'},//NDVI

}});


// Display ('Console')
print(tempTimeSeries);




//------------------------------------Export NDVI Image--------------------------------------------------------------

Export.image.toDrive({
 image: NDVImed,
 description: 'NDVi',  
 scale: 10,  
 region: ROI,  
 fileFormat: 'GeoTIFF',  
 formatOptions: {  
    cloudOptimized: true  
  },
  skipEmptyTiles: true
});