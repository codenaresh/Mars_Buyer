var page = require('./../../pageobjects/BasePage/BasePage.js');

var addressobj = require('./../../pageobjects/Address/EditAddress.js');

var usermenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var tdata = require('./../../json/ValidationError.json');

var addressobj = require('./../../pageobjects/Address/EditAddress.js');


var logger = require('./../../log');

//var usermenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');



var tdata = require('./../../json/Address.json');

describe('Verify user can update  New Address', function () {
	
	 beforeEach(function() {
	        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
	    });

	    afterEach(function() {
	      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	    });
	    
	    browser.ignoreSynchronization = true;
	    
	   
	
	    
	    
	 it("Verify if user can create a New Address", function() {
		 
		 
		  usermenuobj.clickOnUserCircle();
			
			browser.sleep(5000);
			
			usermenuobj.clickOnaddresses();
			
			
			browser.sleep(5000);
			
			addressobj.clickOnAddAddress();
			
			browser.sleep(4000);
			
			var createaddress=element(by.xpath("//button[contains(text(),'Create Address')]"));
			
			if(createaddress.isPresent()){
				
				createaddress.click();
				
				browser.sleep(8000);
				
			}
			
			

	
	});
	 
	 it("First Name Error Message", function() {
		 
		 
	var fname1=addressobj.getfnameerrormsg();
		 
	fname1.getText().then(function(text){
		
		console.log("Fname Error Message is :"+text);
		
	
		expect(text).toContain(tdata.addressvalidation.fname);
		
	}).catch(function(err){
		
		
		console.log(err);
	});
	
		 
	 	
	 });
	
	 
	 
	 it("Last Name Error Message", function() {
		 
			var lname=addressobj.getlnameerrormessage();
		
			lname.getText().then(function(text){
				
				console.log("lname Error Message is :"+text);
				
			
				expect(text).toContain(tdata.addressvalidation.lname);
				
			}).catch(function(err){
				
				
				console.log(err);
			});
			
		 
		 
		 
	 	
	 });
	 
	 
	 it("Address 1 is required Error Message", function() {
		 
		 
		 var address1=addressobj.getaddress1errormsg();
		 
		 address1.getText().then(function(text){
				
				console.log("Address Error Message is :"+text);
				
			
				expect(text).toContain(tdata.addressvalidation.address1);
				
			}).catch(function(err){
				
				
				console.log(err);
			});
		 
		 
		 
	 	
	 });
	 
	 
	 it("City is required Error Message", function() {
		 
		 
 var city=addressobj.getcityerrormsg();
		 
 city.getText().then(function(text){
				
				console.log("city Error Message is :"+text);
				
			
				expect(text).toContain(tdata.addressvalidation.city);
				
			}).catch(function(err){
				
				
				console.log(err);
			});
		 
		 
		 
	 	
	 });
	 
	 it("State is required Error Message", function() {
		 
		 
		 
		 var state=addressobj.getstateerrormsg();
		 
		 state.getText().then(function(text){
						
						console.log("state Error Message is :"+text);
						
					
						expect(text).toContain(tdata.addressvalidation.state);
						
					}).catch(function(err){
						
						
						console.log(err);
					});
		 
		 
		 
	 	
	 });
	 
	 it("Zip Code is required Error Message", function() {
		 
		 
 var zipcode=addressobj.getzipcodeerrormsg();
		 
 zipcode.getText().then(function(text){
						
						console.log("zipcode Error Message is :"+text);
						
					
						expect(text).toContain(tdata.addressvalidation.zipcode);
						
					}).catch(function(err){
						
						
						console.log(err);
					});
		 
		 
		 
	 	
	 });
	 
	 it("Email Address is required e Error Message", function() {
		 
		 
		 
		 var email=addressobj.getemailerrormsg();
		 
		 email.getText().then(function(text){
								
								console.log("email Error Message is :"+text);
								
							
								expect(text).toContain(tdata.addressvalidation.email);
								
							}).catch(function(err){
								
								
								console.log(err);
							});
		 
		 
		 
	 	
	 });
	 
	 it("Phone Number is required  Error Message", function() {
		 
		 
		 
 var phone=addressobj.getphoneerrormsg();
		 
 phone.getText().then(function(text){
								
								console.log("phone Error Message is :"+text);
								
							
								expect(text).toContain(tdata.addressvalidation.phonenumber);
								
							}).catch(function(err){
								
								
								console.log(err);
							});
		 
	 	
	 });
	 
	 xit("close the alert", function() {
		 
		element(by.xpath("//shared-modal[1]//fa-icon[1]//*[local-name()='svg']//*[name()='path' and contains(@fill,'currentCol')]")).click();
	 	
	 });

});