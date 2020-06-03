var page = require('./../../pageobjects/BasePage/BasePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var tdata = require('./../../json/AddItem.json');


var logger = require('./../../log');


//var myselect = new selectwraper(by.xpath(""));

describe("Add Item to cart by  Quick Add and verify contents present on page ", function() {
	
	
	beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
     
     
     
     
     
     it("Quick Add : Enter product and quantity successfully", function() {
    	 
    	
    	 homepageobj.browseProducts();
    	 
    	 browser.sleep(6000);
    	 
    	 logger.log('info','Click on Browse Product');
  		
  		
  	});
     
     
  it("verify Sort option is present on Add To Cart screen ", function() {
     	 
     	 
     	 var sort= Additemobj.getsort();
     	 
     	 // element to be visible
     	  
       	   expect(sort.isDisplayed()).toBeTruthy();
       	
         	expect(sort.isPresent()).toBeTruthy();
       	
       	sort.getText().then(function(text){
       		
       		
       	console.log("Sort option is :"+text);
       	
       	expect(text).toContain(tdata.testdataforquickAdd.sortbytext);
       		
       	}).catch(function(err){
       		
       		console.log("Sort option "+err);
       		
       	});
        	
        });
     
     it("verify Refine By text on Add To Cart screen", function() {
    	 
    	 
    	var refine=  Additemobj.getrefine();
    	
    	
    	expect(refine.isDisplayed()).toBeTruthy();
    	
    	expect(refine.isPresent()).toBeTruthy();
    	
    	refine.getText().then(function(text){
    		
    		
    	console.log("refine text is :"+text);
    	
    	expect(text).toContain(tdata.testdataforquickAdd.refineby);
    		
    	}).catch(function(err){
       		
       		console.log(" Refine By text "+err);
       		
       	});
     	
     });
     
     
     
     it("verify My Favorites link", function() {
    	 
    	 
     	var myfav= Additemobj.getmyfav();
     	
     	expect(myfav.isDisplayed()).toBeTruthy();
     	
     	expect(myfav.isPresent()).toBeTruthy();
     	
     	expect(myfav.isEnabled()).toBeTruthy();
     	
     	myfav.getText().then(function(text){
     		
     		
     	console.log("myfav link is :"+text);
     	
     	expect(text).toContain(tdata.testdataforquickAdd.myfav);
     		
     	}).catch(function(err){
       		
       		console.log(" My Favorites link "+err);
       		
       		
       		
       	});
      	
      });
      
     
     it("Verify Quick Add Header label text", function() {
    	 
    	 
    var quickaddheadertext=	 Additemobj.getquickaddheadertext();
    
   	 
    quickaddheadertext.getText().then(function(text){
    	
    	console.log("Head Text value:"+text);
    	
    	expect(quickaddheadertext.isDisplayed()).toBeTruthy();
    	
    	
    }).catch(function(err){
   		
   		console.log(" Quick Add Header label "+err);
   		
   	});
    
    it("Verify description written below Quick Add Header text", function() {
    	
    var qickadddesc= Additemobj.getqickadddesc();
   
    	
    qickadddesc.getText().then(function(text){
    	
    	console.log("Description Text is :"+text);
    	
    	expect(qickadddesc.isDisplayed());
    	
    	expect(qickadddesc).toContain(tdata.testdataforquickAdd.quickAddDesc);
    	
    }).catch(function(err){
   		
   		console.log(" description written below Quick Add Heade "+err);
   		
   	});
    
    
    });
    
    
    
     
     
  
     
     
 it("Verify lable of item ", function() {
    	 
    	 var itemlable= Additemobj.getitemlabel();
    	 
    	
    	 expect(itemlable.isPresent()).toBeTruthy();
    	 
    	 itemlable.getText().then(function(text){
    		 
    		 expect(text).toContain(tdata.testdataforquickAdd.itemlabel);
    		 
    	 }).catch(function(err){
    	   		
    	   		console.log(" lable of item "+err);
    	   		
    	   	});
    	 
 });
 
 
 
 it("Verify lable of qty ", function() {
	 
	 var qtylabel=Additemobj.getqtylabel();
	  
	 expect(qtylabel.isPresent()).toBeTruthy();
	 
	 qtylabel.getText().then(function(text){
		 
		 expect(text).toContain(tdata.testdataforquickAdd.qtylabel);
		 
	 }).catch(function(err){
	   		
	   		console.log(" lable of qty  "+err);
	   		
	   	});
	 
 });
 
 
 it("TC_004:Verify Add to Cart button is present on the page", function() {
		
		
		var addcartbtn=	Additemobj.addTocartButn();
		
		expect(addcartbtn.isPresent()).toBeTruthy();
			
			
		
		});
 
 

 it('Verify Add item and Quantity and click on checkout', function () {
	 
	 
		    	   // case:when item and qty both present
		    	   
		    	   
		    	 Additemobj.enterItem(tdata.testdataforquickAdd.item);
		    	 
		    	browser.sleep(3000);
		    	
		    
    			Additemobj.clickonfirstHighlightItem();
    		 		
    			browser.sleep(4000);
    			
    			
        		Additemobj.enterqty(tdata.testdataforquickAdd.qty);
        		
     			// click on Add to cart Button
    			
		      Additemobj.clickOnAddtoCart();
		      
		      browser.sleep(10000);
		    
		   	  
 });
 

	    	
 });
     
  xit("Verify Error Message if present else click on Cart Icon", function() {
	  
		
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
 
 xit("click on cart icon  ", function() {
		
	 Additemobj.clickOnCartIcon();
   	    
	 browser.sleep(5000);
});
 
 
 xdescribe("Verify Contens/Text ", function() {
 	
 		
			
			it("verify Remove Item text on Add To Cart screen", function() {
				
				 // clikc on cart icon

		   	    
		   
				

			   	var removeitem=Additemobj.getremoveitem();
			   	
			  
			   	removeitem.getText().then(function(text){
			   		
			   		console.log("link text value is:"+text);
			   		
			   		expect(text).toContain(tdata.testdataforquickAdd.removetext);
			   		
			   	}).catch(function(err){
				   		
				   		console.log(" Item text on Add To Cart screen "+err);
				   		
				   	});


			   		
			   		
			   	});

			 
			   	it("verify Qty text on checkout screen", function() {

			   	var Qty= Additemobj.getQty();
			   		
			   	Qty.getText().then(function(text){
			   				
			   				console.log("Qty text value is:"+text);
			   				
			   				expect(text).toContain(tdata.testdataforquickAdd.Qtytext);
			   				
			   			}).catch(function(err){
			   		   		
			   		   		console.log(" Qty text on checkout "+err);
			   		   		
			   		   	});



			   		
			   	});



			   	 
			   	 it("Verify total item text  present in cart", function() {
			   		 
			   		 
			   		 var countericon= Additemobj.getcountericon();
			   	
					 
			   		 // priting in console total count of item
			   		 
			   		 countericon.getText().then(function(text){
			   			 
			   			 console.log("countericon count is:"+text);
			   			 
			   		 }).catch(function(err){
			   		   		
			   		   		console.log(" total item text  present in cart"+err);
			   		   		
			   		   	});
			   		 
			   		 
			   		 // total item present in order history 
			   		 
			   		 var itemsincart= Additemobj.getitemsincart();
			   		
			   			
			   			itemsincart.getText().then(function(text){
			   				
			   				// using the reg expression to fetch the value from string
			   				
			   				console.log("count is:"+text);
			   				 
			   				//expect(text.replace(/[^0-9\.]+/g,"")).toBe(countericon.getText());
			   				
			   			}).catch(function(err){
			   		   		
			   		   		console.log(err);
			   		   		
			   		   	});
			   		 
			   		 

			   			
			   		 
			   		
			   	 	
			   	 });
			   	 
			   	 it("verify presence of continue shopping button", function() {
			   			 
			   			
			   			
			   			var contniueshop=Additemobj.getcontniueshopbtn();
			   			
			   			expect(contniueshop.isDisplayed()).toBeTruthy();// verify presence of button
			   			
			   			contniueshop.getText().then(function(text){
			   				
			   				console.log("button value is"+text);
			   				
			   				expect(text).toContain(tdata.testdataforquickAdd.continueshppintext);
			   				
			   				
			   			}).catch(function(err){
			   		   		
			   		   		console.log("presence of continue shopping button"+err);
			   		   		
			   		   	});
			   		 
			   			
			   			
			   			
			   			});
			   	 
			   	 
			   	 
			   	 
			   	 
				 
			   	 it("verify presence of Cancel Order button", function() {
			   			 
			   			
			   			
			   			var contniueshop=Additemobj.getcontniueshopbtn();
			   			
			   			expect(contniueshop.isDisplayed()).toBeTruthy();// verify presence of button
			   			
			   			contniueshop.getText().then(function(text){
			   				
			   				console.log("button value is"+text);
			   				
			   				expect(text).toContain(tdata.testdataforquickAdd.continueshppintext);
			   				
			   				
			   			}).catch(function(err){
			   		   		
			   		   		console.log("presence of continue shopping button"+err);
			   		   		
			   		   	});
			   		 
			   			
			   			
			   			
			   			});
			   	 
			   	 
			   		it(" Verify presence of clear cart button", function() {
			   			
			   			var clearbtn=Additemobj.getcancelbtn();
			   			
			   			expect(clearbtn.isDisplayed()).toBeTruthy();
			   			
			   			expect(clearbtn.isPresent()).toBeTruthy();
			   			
			   			clearbtn.getText().then(function(text){
			   				
			   				console.log("clear cart value is"+text);
			   				
			   				//expect(text).toContain(tdata.testdataforquickAdd.clearcarttext);
			   				
			   			}).catch(function(err){
			   		   		
			   		   		console.log(" presence of clear cart button"+err);
			   		   		
			   		   	});
			    	

		});
				
				
			
			
			

		   	
});		   		
		   	
});   		
