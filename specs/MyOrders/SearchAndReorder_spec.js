
var page = require('./../../pageobjects/BasePage/BasePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var myorderobj = require('./../../pageobjects/MyOrders/MyOrders.js');

var tdata = require('./../../json/MyOrder.json');

var logger = require('./../../log');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');


describe("search product", function() {
	
	
	beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    
    browser.ignoreSynchronization = true;
    
    
    
    it("Verify if user can search product by Order Number successfully", function() {
    	
    	
    	UserMenuobj.clickOnUserCircle();
    	
    	logger.log('info', 'Click on Usercircle');
    	
    	
    	
    	browser.sleep(4000);
    	
    	UserMenuobj.clickOnmyOrders();
    	
    	
    	
    	browser.sleep(7000);
    	
    	
    	
    	var fav=myorderobj.getfav();

        fav.getText().then(function(text){
	
		console.log("text is :"+text);
		
		expect(text).toContain(tdata.testdata.Favorites);
	
}).catch(function(err){ 
	
	console.log("Error is:"+err);
	
});
        
        
        
        myorderobj.searchOrder(tdata.testdata.itemforsearch);
        
        logger.log('info','Enter some item in search box');
   	
   	   browser.sleep(9000);
   	   
   	   
   	   
  	 var ordernotfoundtext=  myorderobj.getordernotfoundtext();
  	 
  	 ordernotfoundtext.isPresent().then(function(status){
  		 
  		 if(status){
  			 
  			 ordernotfoundtext.getText().then(function(text){
  				 
  				 console.log("Message is :"+text);
  				 
  				 expect(text).toContain(tdata.testdata.orderNotFoundtext);
  				 
  			 });
  			 
  			 
  		 }
  		 
  		 else{
  			 
  			 
  			myorderobj.clickonordernum();// first click
			
			 logger.log('info','Click on  fiorder row');
			
		
			browser.sleep(3000);
			
		browser.getCurrentUrl().then(function(text){
			
			console.log("url is :"+text);
			
		});
		
		
		
		
		// Re-Order the product
		
		var reorderbtn=	myorderobj.getreorder();
		
		//spage.highlightElement(reorderbtn);

		browser.sleep(4000);
		
		
		
		expect(reorderbtn.isDisplayed()).toBeTruthy();// verifying the presence of the button

		// click on reorder btn
	
		reorderbtn.click();
		
		logger.log('info','click on Re-order icon');
		
	
		browser.sleep(3000);
		
		
		// verify if Line items are present or not, if present please click on add to cart button to re-order
		
		var linetemtext=element(by.xpath("//p[contains(text(),'None of the line items on this order are available')]"));
		
		
		linetemtext.isPresent().then(function(status){
			
			
			if(status){
				
				
				linetemtext.getText().then(function(text){
					
					console.log("Text val is :"+text);
					
					expect(text).toContain("None of the line items on this order are available");
					
				}).catch(function(err){
					
					console.log("Error is :"+err);
					
				});
				
				
				
				
			}
			
			else{
				
				
				var addtocart= myorderobj.getaddtocartbtn();
				
				expect(addtocart.isPresent()).toBeTruthy();// verifying Add to cart is present
				
				addtocart.click();
				
				browser.sleep(8000);
				
				logger.log('info','click on Add to cart');
				
				// url  verify
				
				browser.getCurrentUrl().then(function(url){
					
					console.log("url is :"+url);
					
				});
				
				
				
				// click on cart icon
				  Additemobj.clickOnCartIcon();
			   	    
				   	 browser.sleep(5000);
				   
				
				
				
				
				
				
				
				
				
				
			}
			
			
			
			
			
			
			
		});
		
		
		
  			 
  			 
  	 
  
  		 
  		 }
        
        
        
   
    	
    	
    });
	
	
    });
	
});