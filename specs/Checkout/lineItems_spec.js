
var checkoutobj = require('./../../pageobjects/Checkout/Checkout.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var page = require('./../../pageobjects/BasePage/BasePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var tdata = require('./../../json/Checkout.json');

var selectwraper = require('./../../Select-Wrapper.js');

var myselect = new selectwraper(by.xpath("//select[@id='ShippingMethod']"));

var logger = require('./../../log');


describe("Veriy Line Items", function() {
	
	beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
     
     
     it("User should be  able to click on Cart", function() {
    	 
    	 Additemobj.clickOnCartIcon();
     	
     });
     
     
   it("Verify user is on shopping cart page", function() {
	   
	   browser.getCurrentUrl().then(function(url){
		   
		   console.log("url is :"+url);
		   
		   expect(url).toContain("https://archway-mars-qa.azurewebsites.net/cart");
		   
	   });
   	
   });
     
  
   it("Verify Item presence in cart and in line item", function() {
	   
	   
	   var text= element(by.xpath("//span[@class='fa-layers-counter']"));
	   
	   text.isPresent().then(function(status) {
		   
		   if(status){
			   
			   
			   
			   text.getText().then(function(val){
					
					
					
					if(val>0){
						
						console.log("text is:"+val);
						
						element.all(by.css("img-thumbnail")).count().then(function(count){
							
							console.log("itms are :"+count);
							
							expect(val).toBe(count);
							
							
							
						});
						
						
					}
					
					else{
						
						console.log("no item in cart");
						
						var text= element(by.xpath("//p[@class='mb-0']"));
						
						text.getText().then(function(val){
							
							console.log("text is:"+val);
							
							expect(val).toContain("You do not have any items in your cart");
							
						});
					}
						
					
					
					
				
					
				});
			   
			   
			   
		   }
	   	
	   }).catch(function(err){
		   
		   console.log("error is :"+err);
		   
	   });
		
		
	   
		
   	
   });
    	
    	 
    
 
	
	 


});
	 
  
