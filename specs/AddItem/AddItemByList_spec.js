var page = require('./../../pageobjects/BasePage/BasePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var tdata = require('./../../json/AddItem.json');

var logger = require('./../../log');


describe("Add Item by List", function() {
	
	
	
beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
    	 
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
	
	
	
	
    it("Item should add successfully", function() {
    	
    	
       homepageobj.browseProducts();
       
       browser.sleep(8000);
       
       logger.log('info','Click on Browse Product');
 		 
       // Additemobj.clickonallProducts();
       
      // Additemobj.clickonveiwallProduct();
        
        logger.log('info','Click view all product');
  		
        browser.sleep(5000);
       
  
       //clicking on List icon  
        
        
         Additemobj.clickOnList();
         
         logger.log('info','Click on list');
   		
         
        // element(by.css("label.btn.btn-primary.p-2:nth-child(1)")).click();
         
         browser.sleep(6000);
         
         
        	 
         });
    
    
    
    
    it("verify presence list icon ", function() {
   	 
   	 
   	 var listicon=Additemobj.getlisticontext();
    	
    	expect(listicon.isDisplayed()).toBeTruthy();
    	
    	expect(listicon.isPresent()).toBeTruthy();
    	
    	listicon.getText().then(function(text){
    		
    		
    	console.log("List text is :"+text);
    	
    	expect(text).toContain("List");
    		
    	});
     	
     });
    
    it("verify Display option is present ", function() {
   	 
   	 
   	 var display=Additemobj.getdisplaytext();
     	
     	expect(display.isDisplayed()).toBeTruthy();
     	
     	expect(display.isPresent()).toBeTruthy();
     	
     	display.getText().then(function(text){
     		
     		
     	console.log("display text is :"+text);
     	
     	expect(text).toContain(tdata.AddItemByList.DisplayText);
     		
     	}).catch(function(err){
     		
     		console.log(err);
     		
     	});
     	
      	
      });
    
    
  
      
    
    
    
    //Pagination logic and verify items count on per page

   

it("Click on Product/veryFirstImage Icon", function() {
	

	Additemobj.clickOnFirstImage();
	
	browser.sleep(10000);

   
});

describe("Verify Item/product deatils", function() {
	
	
	
	it("Items details", function() {
		
element.all(by.css(" p.card-text.text-muted")).each(function(val) {
			
			val.getText().then(function(text){
				
				var obj=text.split(":");
			
				console.log(obj[0]);
				
			});
			
			
		});

	});
	
	
	// second way
	
	xit("Items details by map ", function() {
		
		var items = element.all(by.css('p.card-text.text-muted')).map(function(elm, index) {
			  return {
			    index: index,
			    text: elm.getText(),
			    class: elm.getAttribute('class')
			  };
			});

		expect(items).toEqual([
			  {index: 0, text: 'First'},
			  {index: 1, text: 'Second'},
			  {index: 3, text: 'ff'},
			  {index: 4, text: 'bb'},
			  {index: 5, text: 'nn'},
			  {index: 6, text: 'mm'},
			  {index: 7, text: 'Fiyyrst'},
			  {index: 8, text: 'ii'},
			 
			]);


	
	
		
	});
	
	
	
 
it("Enter Quantity and click to add to cart button", function() {
	

		
		Additemobj.qtyfield(tdata.AddItemByList.qtyforlist) ;	// dummy data
		
		// click on Add to Cart
		
		 browser.sleep(2000);
		
		 Additemobj.clickaddtocarticon();
		 
		 browser.sleep(6000);
		 
				
	

});


	
	



it("Validate Error Message if out of stock or any other reson", function() {
	
	
	
	var errmsg= element(by.xpath("//div[@id='toast-container']"));
	
	errmsg.isPresent().then(function(status){
		
		if(status){
			
			errmsg.getText().then(function(text){
				
				console.log("text is :"+text);
				
				//expect(text).toContain("Out of stock");
				
				
				
			});
		
		}
		
		else{
			
			
			  // click on cart i   
			   Additemobj.clickOnCartIcon();
				   
				   logger.log('info','Click on Cart Icon');
				   
			  	    browser.sleep(5000);
				 
			  	 
	
		}
		
	});
	
	
	
	 
	 
});	 

});	 

});	 	
