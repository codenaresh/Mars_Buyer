var  excelToJson = require('./../ReadExcelToJson.js');

describe("test", function() {
	
	
	if(excelToJson.smoketest.test1==="Yes"){
		
		
		it("Test case execution", function() {
			
			console.log("Execution pass with flag");
			
			browser.getTitle().then(function(title){
				
			console.log("title is :"+title);	
				
			});
			
		});
		
		
	}
	
	else{
		
		console.log("Fail");
	}
	
	
});