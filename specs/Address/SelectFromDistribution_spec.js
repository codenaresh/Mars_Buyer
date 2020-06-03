
var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var logger = require('./../../log');


describe(" Verify Mutiple Address", function() {
	
	
	
	it("User should be able to select address from distribution list ", function() {
		
	
   	     Additemobj.clickOnCheckout();
   	     
   	  logger.log('info','Click Checkout');
   	     
   	     browser.sleep(4000);
		
	
		logger.log('info','Click on Multiselect Address');
		
		  browser.sleep(3000);
		  
	var selectdistbtnlist= element( by.xpath("//button[@class='btn btn-secondary mb-3 ml-2 ng-star-inserted']"));
	
	expect(selectdistbtnlist.isDisplayed()).toBeTruthy();
	
	if(selectdistbtnlist.isPresent()){
		
		selectdistbtnlist.click();
	}
		
		

	});		
	
	
	
	it("Verify Distribution List Test", function() {
		
		
		
		
		
	});
	
	
	
	it("Search List ", function() {
		
		
		
		
		
		
	});

	
	
	
	
});