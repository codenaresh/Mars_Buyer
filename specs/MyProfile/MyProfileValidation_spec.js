

var MYprofileobj = require('./../../pageobjects/MyProfile/MyProfile.js');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var logger = require('./../../log');

describe("User Profile updation", function() {
	

	
	beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
	
	
	it("user should be able to click on  profile successfully", function() {
		
		
		UserMenuobj.clickOnUserCircle();
		
		logger.log('info', 'Click on Usercircle');
		
		browser.sleep(4000);
		
		UserMenuobj.clickOnmyProfile();
		
		logger.log('info', 'Click on Profile');
		
		browser.sleep(4000);
		
		
	
		
	});
	
	

	
	it("user should be able to update   profile successfully", function() {
		
	// fname
		
		var fname = element(by.xpath("//input[@id='FirstName']"));
		
		fname.clear();
		
          browser.sleep(8000);
		
		
          var lname = element(by.xpath("//input[@id='LastName']"));
          
          lname.clear();
          
		browser.sleep(8000);
		
		
		var phonenumber = element(by.xpath("//input[@id='Phone']"));
		
		phonenumber.clear();
		
	    MYprofileobj.clickOnSave();
	    
	    browser.sleep(13000);
	    
	    
	    logger.log('info', 'Click on save');
		
		//browser.sleep(6000);
		
	
	});
	
	
	
	

	
});