var XLSX = require('xlsx');

var Excel = require('exceljs');

var output;

      
describe("test read Excel file", function() {
	
	
	
	it("Read data", function() {
		
		console.log("Hello world");
		
		 var workbook = new Excel.Workbook();

	       wb.xlsx.readFile("./Driver.xlsx").then(function(){

	       var sh = wb.getWorksheet("Object"
	       console.log(sh.rowCount);   

	        for (i = 2; i <= sh.rowCount; i++)

	           {

	        
	                      if (sh.getRow(i).getCell(1).value==PropertyID ) {

	                console.log(sh.getRow(i).getCell(2).value);

	                output = sh.getRow(i).getCell(2).value;

	                     }

	               
	                      return output;

	           }   

	           

	    });

	 

	     

	    


	
	
});
 
});
