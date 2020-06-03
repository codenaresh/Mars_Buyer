

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');


var tdata = require('./../../json/AddItem.json');

var logger = require('./../../log');



//var myselect = new selectwraper(by.xpath("//div[4]/display-filter[1]/form[1]/div[1]/select[1]']");


describe("Add Item by Search", function() {
	
beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
	
	
	it("Search Item ", function() {
		
		

		Additemobj.enterProductid(tdata.AddItemBySearch.searchitem);
		
		browser.sleep(8000);
		
		
	});
	
	
	        it("Verify Item Id", function() {
	        	
	        	
    	 
	    	var itemid= Additemobj.getitemnumber();
	    	
	    	itemid.getText().then(function(text){
	    		
	    		console.log("Item numbe is:"+text);
	    		
	    		expect(text).toBe(tdata.AddItemBySearch.searchitem);//searching the same item
	    		
	    	});
	    	
	        });
	
	
	
	        it("Click on Product/veryFirstImage Icon", function() {
	    		
	    		
	    		// click on very first image present in Grid
	     	

	    		Additemobj.clickOnFirstImage();
	    		
	    		browser.sleep(6000);

	    		
	    	});
	     
	
	  it("Verifying the counter ", function() {
		  
		var countericon=  Additemobj.getcountericon();
	    	 
		countericon.getText().then(function(count){
	       	  
	       	  console.log(count);
	       	  
	       	  //expect(count).toBe(2);// dummat data, counter should be equal to entered quantity
	       	  
	         });
	     	
	     });
	  
	  
	  it("verify UOM element of product description", function() {
			 
			 var uom= Additemobj.getuom();
			 
			 expect(uom.isDisplayed()).toBeTruthy();
			 
			 expect(uom.isPresent()).toBeTruthy();
			 
		     
			 
		 	
		 });


		it("verify Status  of product description", function() {
			 
		var status= Additemobj.getstatus();
			 
			 expect(status.isDisplayed()).toBeTruthy();
			 
			 expect(status.isPresent()).toBeTruthy();
		  	
		 });

	 

	 
	 

		it("Enter Quantity and click to add to cart button", function() {
			   
			   
			Additemobj.qtyfield(tdata.AddItemBySearch.qtyforsearch) ;	// dummy data
			
			// click on Add to Cart
			
			 browser.sleep(6000);
			
			 Additemobj.clickaddtocarticon();
			
			 browser.sleep(6000);
			
		   });
		   
		   
		   it("click on cart icon and click on  CheckOut", function() {
			   
			   
			   // click on cart icon
			   Additemobj.clickOnCartIcon();
			   
		  	    browser.sleep(5000);
		  	    
		  	    // click on checkout
			 
		  	 // Additemobj.clickOnCheckout();
		 		
			    // browser.sleep(5000);
		   	
		   });
	 
	 
	 
	 xit("Verify Error Message if Qty<1 or zero", function() {
		 
		 
		var qtyerrormessge= element(by.xpath("//div[@id='toast-container']"));
		
		expect(qtyerrormessge.isDisplayed()).toBeTruthy();
		
		qtyerrormessge.getText().then(function(text){
			
			expect(text).toContain("Please enter a quantitity");
			
		});
		
	 	
	 });
	  
	
  });
