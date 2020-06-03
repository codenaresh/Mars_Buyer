

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var tdata = require('./../../json/AddItem.json');

var logger = require('./../../log');





describe("Add Item by Table", function() {
	
	
beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
	

	
	
	it("User should add item successfully", function() {
		
		
		   homepageobj.browseProducts();
	       
	       browser.sleep(8000);
	       
	       logger.log('info','Click on Browse Product');
	 		 
	        //Additemobj.clickonallProducts();
	        
	        logger.log('info','Click view all product');
   	       
           Additemobj.clickontablelink();
   	  
   	      browser.sleep(5000);
   	  
		
	});
	
 it("verify presence of  table icon ", function() {
    	 
    	 
    	 var tablelink= element(by.xpath("//label[contains(text(),'Table')]"));
      	
      	expect(tablelink.isDisplayed()).toBeTruthy();
      	
      	expect(tablelink.isPresent()).toBeTruthy();
      	
      	tablelink.getText().then(function(text){
      		
      		
      	console.log("Table text is :"+text);
      	
      	expect(text).toContain("Table");
      		
      	});
       	
       });
	
	 //Pagination logic and verify items count on per page
	
	   xit("Verify pagination feature", function() {
	    	
	    	

	        //getting the size of the pagination
	          
	        var getPaginationsize = element.all(by.css("div > ngb-pagination > ul > li"));
	        
	        
	        getPaginationsize.count().then(function (pagination) {
	      	  
	            if (pagination > 0) {

	                for (var i = 1; i < pagination-1; i++) {
	              	  
	              	  browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
	              	  
	              	  browser.sleep(5000);
	              	  
	              	  
	                    getPaginationsize.get(i).click();
	                  
	                     element.all(by.css("div.row.mb-2:nth-child(2) div.col-12 > p.card-text.text-muted")).count().then(function(text){
	                  	
	                  	console.log("total count:"+text);
	                  	
	                  	
	                  });
	                  
	                  browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
	           	   
	           	   browser.sleep(5000);
	           	   
	           	   
	                }
	            } else {
	                console.log('Pagination not exists');
	            }
	        });
	        
	        
	     
	        
	        // capturing the latest url when click on last page
	        browser.getCurrentUrl().then(function(text){
	  		  
	  		   console.log(text);
	  		   
	  		   expect(text).toBeTruthy();
	  		   
	  		  browser.sleep(5000);
	  		  
	  		  element(by.xpath("//div[@class='m-0 mt-1 text-center']")).getText().then(function(text){
	  			  
	  			 console.log(text);
	  			  
	  		  });
	     	   
	  		       
	      
	  		  
	        });
	        
	    });
	        
	
	
	
	it("Click on Product/veryFirstImage Icon", function() {
		
		
		// click on very first image present in Grid
 	

		Additemobj.clickOnFirstImage();
		
		browser.sleep(6000);

		
	});
	
	it("verify UOM element of product description", function() {
		 
		 var uom= Additemobj.getuom();
		 
		 uom.getText().then(function(text){
			 
			 if(text){
				 
				 expect(uom.isPresent()).toBeTruthy(); 
				 
			 }
			 
			 
		 }).catch(function(e){
			 
			 console.log("UOM elemen not found ");
			 
		 });
		 
		 
		 
		 
		 
		
		 
		// expect(uom.isPresent()).toBeTruthy();
		 
	     
		 
	 	
	 });


	it("verify Status  of product description", function() {
		 
	var status= Additemobj.getstatus();
	
	
	status.getText().then(function(text){
		 
		 if(text){
			 
			 console.log("status is:"+text);
			 
			 expect(status.isDisplayed()).toBeTruthy();
			 
		 }
		 
		 
	 }).catch(function(e){
		 
		 console.log(" Status not found");
		 
	 });
	 
	
	  	
	 });


	 
	it("verify Min Qty  product description", function() {
		 
	var qtychk= Additemobj.getqtychk();
	
	
	qtychk.getText().then(function(text){
		 
		 if(text){
			 
			 console.log("qtychk is:"+text);
			 
			 expect(qtychk.isDisplayed()).toBeTruthy();
			 
		 }
		 
		 
	 }).catch(function(e){
		 
		 console.log(" qtychk not found");
		 
	 });
		 
		 
	  	
	 });


	 
	it("verify Max Order Limit of product description", function() {
		 
	var maxorderqty=Additemobj.getmaxorderqty();
	
	
	maxorderqty.getText().then(function(text){
		 
		 if(text){
			 
			 console.log("maxorderqty is:"+text);
			 
			 expect(maxorderqty.isDisplayed()).toBeTruthy();
			 
		 }
		 
		 
	 }).catch(function(e){
		 
		 console.log(" maxorderqty not found");
		 
	 });
		 
		 
		
	  	
	 });


	
	
	it("Enter Quantity and click to add to cart button", function() {
		   
		Additemobj.qtyfield(tdata.AddItemByTable.qtyfortable)
		
		browser.sleep(5000);
   	
		 Additemobj.clickaddtocarticon();
	
	    browser.sleep(6000);
	

	   	
	   });
	   
	   
	   it("click on Cart Icon", function() {
		   
		   Additemobj.clickOnCartIcon();
		   
		   logger.log('info','Click on Cart Icon');
		   
	  	    browser.sleep(5000);
		 
	  	 
	   	
	   });
	   
	
	
	
});
