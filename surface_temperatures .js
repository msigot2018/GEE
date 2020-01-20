//SUROFACE TEMPERATURE FROM MODIS INSTRUMENTS (NASA)
// SPATIAL RESOLUTION:  1 KM 
//SOURCE: https://lpdaac.usgs.gov/products/mod11a1v006/

var ae = ABCD;//this is the area of study

var dataset = ee.ImageCollection('MODIS/006/MOD11A1')
              .filter(ee.Filter.date('start date_yy_mm_dd', 'end_date_yy_mm_dd'))
              .map(function(image){return image.clip(ae)}) //clip by area
           

              
var landSurfaceTemperature = (dataset.select('LST_Day_1km')) //or 'LST_Night_1km'

var landSurfaceTemperatureVis = {

  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};
// map over the image collection and use server side functions
var tempToDegrees = landSurfaceTemperature.map(function(image){
  return image.multiply(0.02).subtract(273.15).copyProperties(image,['system:time_start','system:time_end']);//0.02 rescale factor; 
});
// print and add to the map
print('image collection in temp in degrees', tempToDegrees);
Map.addLayer(tempToDegrees, {min: -10, max: 40, palette: landSurfaceTemperatureVis.palette}, 'temperature in degrees');


//-------------------------------------------------------MEDIAN------------------------------------------------

var tempToDegrees_stat = tempToDegrees.median(); //



print('meadian of collection: ', tempToDegrees_stat);
Map.addLayer(tempToDegrees_stat, {min:-10, max: 40, palette: landSurfaceTemperatureVis.palette},'stat of collection');

//----------------------------------------------------CHARTs----------------------------------------------------


var series1 = ui.Chart.image.doySeries(
    tempToDegrees, ae, ee.Reducer.median(),500);

	
	// Show the chart with temperatures by day of the month
print(ui.Chart.image.series(tempToDegrees, ae, ee.Reducer.median(), 10)
      .setChartType('ScatterChart')
      .setOptions({
        title: 'Surface temperatures',
        vAxis: {title: ''},
        hAxis: {title: 'Months', format: 'MM-yy', gridlines: {count: 20}},
        lineWidth: 1,
        pointSize: 0,
        series: {
          0: {color: '3B7A57'},}
      }));



// Show the chart by day of the year
print(series1);

{
var min = ee.Number(tempToDegrees_stat.reduceRegion({
   reducer: ee.Reducer.min(),
   geometry: geometry2,
   scale: 30,
   }).values().get(0));
print(min, 'min_temp:');

var max = ee.Number(tempToDegrees_stat.reduceRegion({
    reducer: ee.Reducer.max(),
   geometry: geometry2,
   scale: 30,
   }).values().get(0));
print(max, 'max_temp:')
}

