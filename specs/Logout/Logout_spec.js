
var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');

var page = require('./../../pageobjects/BasePage/BasePage.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var tdata = require('./../../json/login.json');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

//var dataReaderObj=require('./../../utils/DataReader.js');

var logger= require('./../../log');







describe("Log out ", function() {
	
	
	it("User should log out successfully from application", function() {
		
		// click on usercircle icon
		
		UserMenuobj.clickOnUserCircle();
		
		logger.log('info', 'Click on user circle');
		
		browser.sleep(4000);
		
		 var userlogout=UserMenuobj.getlogoutElement();
		 
		 if(userlogout.isPresent()){
			 
			 userlogout.click();
			 
			 browser.sleep(5000);
			 
			 expect(userlogout).toBeTruthy();
			 
		 }
		 
		 else{
			 
			 console.log("not found");
		 }
		 
		 
		 
	});
	
	it("verify successfull Logout", function() {
		
		 
		 expect(browser.getCurrentUrl()).toContain(tdata.testdata.logouturl);
		 
		 logger.log('info', 'logout successfully verify');
		 
		 
		
	});
	
	
	
});