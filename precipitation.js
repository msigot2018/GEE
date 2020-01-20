//PRECIPITATION IN mm BY DAY FOR 50ºN AND 50ºS (WGS84) TO SPECIFIC AREA 
// SPATIAL RESOLUTION: ABOUT 5KM 
//SOURCE: https://chc.ucsb.edu/data/chirps


var polygon =  //study area 
var startDateEarly = ee.Date('start date_yy_mm_dd');
var endDateEarly = ee.Date('end_date_yy_mm_dd');

//------------------------------------------------------------------------------------------------

var chirpsColl = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                .filterDate(startDateEarly, endDateEarly)
                .filterBounds(polygon);



print(ui.Chart.image.series(chirpsColl, polygon, ee.Reducer.median(), 1)
      .setChartType('ScatterChart')
      .setOptions({
        title: 'Precipitação',
        vAxis: {title: ''},
        hAxis: {title: 'Meses', format: 'MM-yy', gridlines: {count: 20}},
        lineWidth: 1,
        pointSize: 0,
        series: {
          0: {color: '3B7A57'},}
      }));

