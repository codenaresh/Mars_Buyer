
      
describe("test read Excel file", function() {
	
	
	
	it("Read data", function() {
		
			               
		var XLSX = require('xlsx');

		var workbook = XLSX.readFile('Driver.xlsx');
		
		var worksheet= workbook.Sheets["Object"];

		var a = XLSX.utils.sheet_to_json(worksheet);
		
		a.forEach(function(data) {
			
			console.log("values are :"+data.ObjectProperty);
			
		});
	
});
	
});
