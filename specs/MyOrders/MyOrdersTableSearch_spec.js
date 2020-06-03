

var page = require('./../../pageobjects/BasePage/BasePage.js');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var myorderobj = require('./../../pageobjects/MyOrders/MyOrders.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var tdata = require('./../../json/MyOrder.json');




var logger= require('./../../log');

var selectwraper = require('./../../Select-Wrapper.js');

var myselect = new selectwraper(by.xpath("//select[@id='status']"));



browser.manage().timeouts().implicitlyWait(4000);

describe(' Verifying the Login Page - ', function () {
	

	beforeEach(function() {
		
		
		setTimeout(function() {
			
		}, 100000);
		        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
		     });

		     afterEach(function() {
		      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		     });
		     
		     browser.ignoreSynchronization = true;
		     
		     
	
    it("User should be able to select Order status successfully", function() {
    	
    	UserMenuobj.clickOnUserCircle();
    	
    	logger.log('info', 'Click on Usercircle');
    	
    
    	browser.sleep(4000);
    	
    	UserMenuobj.clickOnmyOrders();
    	
    	
    	
    	myselect.getOptions().getText().then(function(text){
    		
    		console.log(text);//[ ' All ', ' Open ', ' Canceled ', '  Shipped ']
    		
    		 if(text[1]==tdata.testdata.status){
    			 
    			 myselect.selectByText(" Open ");
    			 
    			 browser.sleep(4000);
    			 
    		 }
    		 });
    	
    	 });
    
    
    
    it("User Should be able to enter date successfully", function() {
    	
    	
    	myorderobj.enterFromdate(tdata.testdata.fromdate);
    	
    	myorderobj.enterTodate(tdata.testdata.todate);
    	
    	
    });
    
	 it("Verify Header value", function() {
		 
	 element.all(by.css(".table>thead")).each(function(val) {
			
			val.getText().then(function(header){
				
				console.log("header val is :"+header);
				
			});
			
			
		});
		
		
		
		
		
			
		});

		
			 
			 
			 
		
			 
			 
});
    		        			   
    		        			 		        			  
    		        			  
	        			   
    		        			   
