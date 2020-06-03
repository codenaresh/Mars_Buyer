var data= require("./dataprovider.js");

var using = require('jasmine-data-provider');

describe("Test Login", function() {
	
	beforeEach(function() {
		
		browser.get('https://archway-mars-qa.azurewebsites.net/login');
		
	});
	
	afterEach(function() {
		
	var errormsg=element(by.xpath("//div[@id='toast-container']"));
		
		errormsg.isPresent().then(function(status){
			
			if(status){
				
				errormsg.getText().then(function(text){
					
					console.log("Error messag is :"+text);
					
				});
				
				
			}
			else{
				
				
			var ele=element(by.xpath("//button[contains(text(),'Browse Products')]"));
			
			ele.isPresent().then(function(status){
				
				if(status){
				
					ele.getText().then(function(text){
						
						console.log("success message is :"+text);
						
					});
					
				}
				
			});
				
			
				
			
			}
			
		});
		
		console.log("After test case");
		
	});
	
	
	using(data.datadriven, function (data, description) {
		
		
		
		it('should login to application '+description, function() {
			
		    
		    
		    element(by.xpath("//input[@id='username']")).sendKeys(data.finput);
		    
		    element(by.xpath("//input[@id='password']")).sendKeys(data.sinput);

		    element(by.xpath("//button[@id='submitBtn']")).click();
		    
		    browser.sleep(5000);

		  });
		
		
        
        });
	
	it("Verify Error Message", function() {
		
	
		
    	
		
		
	});
	
	

	
	

	
	
	
	
});