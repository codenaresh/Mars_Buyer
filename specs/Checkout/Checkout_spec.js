
var checkoutobj = require('./../../pageobjects/Checkout/Checkout.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var page = require('./../../pageobjects/BasePage/BasePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var tdata = require('./../../json/Checkout.json');

var selectwraper = require('./../../Select-Wrapper.js');

var myselect = new selectwraper(by.xpath("//select[@id='ShippingMethod']"));

var logger = require('./../../log');


describe("CheckOut Verfication", function() {
	
	beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
     
     
    // verify some content present on checkout screen
     
  
     it("checkout case for One time Address", function() {
    	 
    
          Additemobj.clickOnCheckout(); 
          
    	 logger.log('info','Click on checkout');
    	 
    	 
		   //browser.sleep(5000);
    	 
    	 
    	 //checkoutobj.clickOnEnterOneTimeAddress();
    	 
    	 logger.log('info','Click on One time Address');
    	 
    	
    	 
     });
    	 
   it("checkout process", function() {
	   
	   checkoutobj.clickonsaveAndContinue();
	   
	   logger.log('info','Click on save and coontinue ');
	   
	   browser.sleep(15000);
	   
	   // select shipping method
	   
	  // myselect.selectByText(tdata.testdata.ShippingSpeed);
	   
	   // enter cost center
	   
	 // checkoutobj.entercostcenter(tdata.testdata.costceternumber);
	  
	  browser.sleep(5000);
	   
	  
	// Additemobj.clickonfirstHighlightItem();
	   
	   
	   // Requested Arrival Date validation
	   
	   var currenydate=page.currentdate();
	   
	   var date= "03/21/2020";
	   
		   
     // checkoutobj.calendardate(tdata.testdata.calendardate);
		  
	   
	   checkoutobj.clickonsaveAndContinue();
	   
	   logger.log('info','Click on save and coontinue');
	   
	    browser.sleep(10000);
	   
	   checkoutobj.clickOnsubmitOrder();
	   
	   logger.log('info','Click on One submit order');
	   
	   browser.sleep(10000);
		
   
   	
   });
   
    
     it("Verify order has submitted", function() {
    	 
    	 
        var ordersubttext=checkoutobj.getordersubttext();
    
    	   ordersubttext.getText().then(function(text){
		   
		  expect(text).toContain(tdata.testdata.OrderSubmittedText) ;
		      
		   
	   }).catch(function(err){
		   		
		   		console.log(" order has submitted"+err);
		   		
		   	});
    	   
     });
	   
	   
 
 
  
     it("Verify submited order Number ", function() {
    	 
    	 
    	 browser.getCurrentUrl().then(function(text){
    		 
    		 console.log("order submitted url is:"+text);
    		 
    		 var ordernum= checkoutobj.getordernumber();
    		 
    		 var actual_orderNumber=ordernum.getText();
    		 
    		 // priting the product number on console 
    		
    			 
    			 expect(text).toContain(actual_orderNumber);
    			 
    		 
    	 }).catch(function(err){
		   		
		   		console.log(" submited order Number"+err);
		   		
		   	});
  	}); 
     
     
  
     
    	 
    	 it("Order ID Number Text is present when order is confirmed", function() {
    		 
    		var ordenumtext= checkoutobj.getordernum();
    		
    		ordenumtext.getText().then(function(text){
    			
    			console.log("order number text is:"+text);
    			
    			expect(ordenumtext.isDisplayed()).toBeTruthy();
    			
    			expect(ordenumtext).toContain(tdata.testdata.ordernumbertext);
    			
    			
    		}).catch(function(err){
		   		
		   		console.log(" Order ID Number Text is presen"+err);
		   		
		   	});
    		
    		
    		 
    		 
    		 
    	 	
    	 });
    	 
    	 
    	 
    	 xit("Date Submitted Text is present when order is confirmed", function() {
    		 
    		 
    		 
    		 
    		 var datesubtext=checkoutobj.getdatesbmt();
     		
    		 datesubtext.getText().then(function(text){
     			
     			console.log("order number text is:"+text);
     			
     			expect(datesubtext.isDisplayed()).toBeTruthy();
     			
     			expect(datesubtext).toContain(tdata.testdata.datesubmittesText);
    		 
     		 }); 
    		 
     	 	
    	 });
    	 
    	 
    	 
	 xit(" Verify Date Submitted  is the current date when order is confirmed", function() {
    		 
    		 var ordersubmitdate= checkoutobj.getactuldate();
    		 
    		var currentdate= checkoutobj.currentdate();
    		
    		
    		// verifying that order submit date is the date order submitted/placed
    		
     		expect(ordersubmitdate.getText()).toBe(currentdate);
    		
    		 
     		 }); 
    		 
     	 	
    	 
    	 
    	 
    	 
    	 xit("Shipping Method Text is present when order is confirmed", function() {
    		 
    	 
    		 var shippingmethodtext= checkoutobj.getshipplabel();
    		 
    		 shippingmethodtext.getText().then(function(text){
     			
     			console.log("Shipping Method text is:"+text);
     			
     			expect(text).toContain(tdata.testdata.ShippingMethodText);
    		 
    		 
     		 });
     	 	
    	 });
    	 
    	 
    	 xit(" vrify Shipping Method  is same that user has selected while palcing the order", function() {
    		 
        	 
    		 var shippingmethodtype= checkoutobj.getshippmethodval();
     		
    		 
    		 shippingmethodtype.getText().then(function(text){
    			 
    			 console.log("shipping method is:"+text);
    			 
    			 expect(text).toContain(tdata.testdata.selectShippingMethod);
    			 
    			 
    			 
    		 });
    		
    		 
    	
    		 
    		 
     		 });
     	 	
    	
    	 
  
    	 
    	 
    	 xit("Subtotal Text is present when order is confirmed", function() {
    		 
    		 
    		 
    		 
    		 var subtotaltext= checkoutobj.getsubtotal();
      		
    		 subtotaltext.getText().then(function(text){
      			
      			console.log("order number text is:"+text);
      			
      			expect(text).toContain(tdata.testdata.SubtotalText);
     		 
     		 
      		 });
    		 
    		 
    		 
    		 
    		  
     	 	
    	 });
    	 
    	 
    	 
    	 
	 xit(" verify Subtotal value is correct", function() {
    		 
    		var num1,num2; 
    		 
    	var subtotalval=checkoutobj.getsubtotal();
    	
    	subtotalval.getText().then(function(num1){
    		
    		
    		//console.log("subtotalval is:"+num1.replace(/[^0-9\.]+/g,""));
    		
    		
  
    		});
    	
    	
    	
          var ordertotal=checkoutobj.getordertotalval();
		
          ordertotal.getText().then(function(num2){
			
			//console.log("ordertotal is :"+num2.replace(/[^0-9\.]+/g,""));
    		
    
    
    	});
    	
    	
    	
    	
	 });  	
     	 	
    	
    	 
    
 
	 
	 xit(" verify print option", function() {
		 
		var print= checkoutobj.getprinttext();
		
		expect(print.isPresent()).toBeTruthy();
		
		expect(print.isEnabled()).toBeTruthy();
		 
		 
		 
	 	
	 });
	 


});
	 
  
