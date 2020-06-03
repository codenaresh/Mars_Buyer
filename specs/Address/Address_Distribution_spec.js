var page = require('./../../pageobjects/BasePage/BasePage.js');

var addressobj = require('./../../pageobjects/Address/EditAddress.js');

var usermenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var tdata = require('./../../json/Address.json');

var OR = require('./../../json/objects.json');

var logger = require('./../../log');

var usermenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var selectwraper = require('./../../Select-Wrapper.js');

var myselect = new selectwraper(by.xpath("//select[@id='Country']"));

var myselect1 = new selectwraper(by.xpath("//select[@id='State']"));


describe('Verify user can update  New Address', function () {
	
	 beforeEach(function() {
	        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
	    });

	    afterEach(function() {
	      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	    });
	    
	    browser.ignoreSynchronization = true;
	    
	   
	
	    it("User should be able to click on User Menu ", function() {
	    	
	    	
	    	  usermenuobj.clickOnUserCircle();
				
				browser.sleep(5000);
				
	    	
	    });
	    
	    
	    
	    
	 it("click on distribution list", function() {
		 
		 
		var distributionbtnlist=  element(by.xpath("//small[contains(text(),'Distribution list')]"));
		
		page.highlightElement(distributionbtnlist);
		
		
		
	if(distributionbtnlist.isPresent()){
		
		
		distributionbtnlist.click();
		
		browser.sleep(3000);
	}
		
			
	  });
	 
	 
	 it("Verify url of distribution list", function() {
		 
		 
		 expect(browser.getCurrentUrl()).toContain("https://archway-mars-qa.azurewebsites.net/profile/distributionlist");
	 	
	 });
	 
	 
	 it("Verify Text of List", function() {
		 
		 var text= element(by.xpath("//h1[text()='Distribution List']"));
		 
		 text.getText().then(function(text){
			 
			 console.log("text is :"+text);
			 
			 expect(text).toContain("DISTRIBUTION LIST");
			 
		 });
		 
	 	
	 });
	 
	 
	 it("Verify If Usercan create distribution list", function() {
		 
		 
		 
		var distrbutionloistbtn= element(by.xpath("//button[text()=' Create Distribution List ']"));
		
		page.highlightElement(distrbutionloistbtn);
		
		if(distrbutionloistbtn.isDisplayed()){
			
			
			distrbutionloistbtn.click();
			
			
			expect(browser.getCurrentUrl()).toContain("https://archway-mars-qa.azurewebsites.net/profile/distributionlist/distributionlistdetail");
			
			browser.sleep(3000);
		}
		
		// Enter List Name
		
		var enterlistname=element(by.xpath("//input[@id='DistributionListName']"));
		
		page.highlightElement(enterlistname);
		
		
		enterlistname.clear();
		
		enterlistname.sendKeys("test1");
		
		
		// click on create to create list
		
		var createbtn=element(by.xpath("//span[text()='Create']"));
		
		// verify create button displayed
		
		expect(createbtn.isDisplayed()).toBeTruthy();
		
		page.highlightElement(createbtn);
		
		if(createbtn.isPresent()){
			
			createbtn.click();
			
			browser.sleep(3000);
		}
		
		// successfull message
		
		
		var message=element(by.xpath("//div[@id='toast-container']"));
		
		message.getText().then(function(text){
			
			console.log("message is :"+text);
			
		});
		
		
	 	
	 });
	 
	

	
	});
	

