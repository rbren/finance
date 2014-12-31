var Quandl = {};
var DB = 'WIKI';                                                                                                                                               
Quandl.dataUrl = function(ticker, startDate, endDate) {
  var ret = "https://www.quandl.com/api/v1/datasets/" + DB + "/" + ticker + ".json?auth_token=1xkdHCMigj6iDyEoGizy";                                           
  if (startDate) {                                                                                                                                             
    ret += '&trim_start=' + startDate;                                                                                                                         
  }                                                                                                                                                            
  if (endDate) {                                                                                                                                               
    ret += '&trim_end=' + endDate;                                                                                                                             
  }                                                                                                                                                            
  console.log('url:' + ret);                                                                                                                                   
  return ret;                                                                                                                                                  
}                                                                                                                                                              
                                                                                                                                                               
Quandl.rewriteData = function(fileData) {
  var cols = fileData.column_names;                                                                                                                            
  var data = fileData.data;                                                                                                                                    
  for (var i = 0; i < data.length; ++i) {                                                                                                                      
    var newRow = {};                                                                                                                                           
    for (var j = 0; j < cols.length; ++j) {                                                                                                                    
      var label = cols[j].toLowerCase().replace(/[\s\.]/g, '');                                                                                                
      if (j == 0) {                                                                                                                                            
        newRow[label] = parseDate(data[i][j]);                                                                                                                 
      } else {                                                                                                                                                 
        newRow[label] = +data[i][j];                                                                                                                           
      }                                                                                                                                                        
    }                                                                                                                                                          
    if (DB === 'GOOG') {                                                                                                                                       
      newRow.adjclose = newRow.close;                                                                                                                          
    }                                                                                                                                                          
    data[i] = newRow;                                                                                                                                          
  }                                                                                                                                                            
  console.log('rewrote:' + JSON.stringify(data[0]));                                                                                                           
  return data;                                                                                                                                                 
};

Quandl.loadOptionsData = function(file, onDone) {
  if (!file) file = 'http://54.68.181.251:3060/data/nflx_20141231_options.json';
  console.log('loading:' + file);
  d3.json(file, function(err, json) {
    console.log('json:' + JSON.stringify(json[0]));
    for (var i = 0; i < json.length; ++i) {
      json[i]['expdate'] = parseDate(json[i]['expdate']);
    }
    byStrike = {};
    json.foreach(function(d) {
      byStrike[d.strike] = d;
    });
    
    onDone(byStrike);
  })
}

Quandl.loadData = function(ticker, start, end, onDone) {
  if (typeof start === 'function') {                                                                                                                           
    onDone = start;                                                                                                                                            
    start = null;                                                                                                                                              
  }                                                                                                                                                            
  d3.json(Quandl.dataUrl(ticker, start, end), function(error, json) {                                                                                                 
    if (error) throw error;                                                                                                                                    
    $('#ticker').val(json.code);                                                                                                                               
    $('h1').html(json.code);                                                                                                                                   
    $('#endDate').val(json.data[0][0]);                                                                                                                        
    $('#startDate').val(json.data[json.data.length-1][0]);                                                                                                     
    ret = Quandl.rewriteData(json);                                                                                                                                 
    onDone(ret);                                                                                                                                      
  });                                                                                                                                                          
}
