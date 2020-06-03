

var addressobj = require('./../../pageobjects/Address/EditAddress.js');

var usermenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var tdata = require('./../../json/Address.json');

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
	    
	   
	
	    
	    
	 it("Verify if user can clikc on New Address", function() {
		 
		 
		  usermenuobj.clickOnUserCircle();
		  
		  logger.log('info', 'Click on Usercircle');
			
			
			browser.sleep(3000);
			
			usermenuobj.clickOnaddresses();
			
			logger.log('info', 'Click on Address');
			
			
			
			browser.sleep(3000);
			
			addressobj.clickOnAddAddress();
			
			logger.log('info', 'Click on Address');
			
			
			browser.sleep(4000);
			
			
		
	  });
	 
	 it("user should be able to select country", function() {
		 
		   myselect.selectByText(tdata.testdata.selectcountry);
			
			logger.log('info', 'Select Country');
			
			// Verify Item present in drop down
			
		var items=element.all(by.id("Country")).map(function(ele, index) {
				
				return {
				    index: index,
				    text: ele.getText(),
				};
				
			});
				
			expect(items).toEqual(3);
			
			
	 	
	 });
	 
	 
	 it("Enter first Name", function() {
		 
		 
			
			addressobj.enterFirsName(tdata.testdata.firstname);
			
			logger.log('info', 'Enter Fname');
	 	
	 });
	 
	 
	 
	 it("Enter Last Name", function() {
		 
		 
			
		 addressobj.enterLastName(tdata.testdata.LastName);
			
			logger.log('info', 'Enter lname');
			
			
			browser.sleep(2000);
	 	
	 });
	 
	 
	 it("Enter Compamy Name", function() {
		 
		 addressobj.enterCompanyName(tdata.testdata.companyName);
			
			
			logger.log('info', 'Enter company Fname');
			
			
			
	 	
	 });
	 
	 
	 it("Enter Street  Name", function() {
		 
		 addressobj.enterStreet1Name(tdata.testdata.address1);
			
		
			logger.log('info', 'Enter street name');
			
            addressobj.enterStreet2Name(tdata.testdata.address2);
			
			logger.log('info', 'Enter stree2 name');                 
			
			
			
	 	
	 });
	 
	 
	 it("Enter city  Name", function() {
		 
		 addressobj.enterCityName(tdata.testdata.CityName);
			
			browser.sleep(3000);               
			
			
			
	 	
	 });
	 
	 
 it("Select state  Name", function() {
		 
	 element(by.css('#State')).click();
		
		element(by.id('State'))
	    .all(by.tagName('option'))
	    .get(3)
	    .click();             
			
			
			
	 	
	 });
 
 it("Enter zipcode  Name", function() {
	 
	 addressobj.enterZipcodeName(tdata.testdata.zipCod);             
		
		
		
 	
 });
 
 it("Enter Fax Number  Name", function() {
	 
	 addressobj.enterfaxnumber(tdata.testdata.Fax);
		
		browser.sleep(3000);               
		
		
		
 	
 });
 
 it("Enter E-mail  Name", function() {
	 
	 addressobj.enteremail(tdata.testdata.email);
		
		
 	
 });
 
 it("Enter Phone  Name", function() {
	 
addressobj.enterPhone(tdata.testdata.phoneNumber);
		
             
	 	
 });
 
 it("Click on Save button", function() {
	 
	 addressobj.clickOnSaveBtn();
		
		browser.sleep(3000);               
		
		
		
 	
 });
	 
	 
	
	 
	 
	

	it("Verify URL after click on address", function() {
		
		browser.getCurrentUrl().then(function(url){
			
			console.log("urls is :"+url);
			
			expect(url).toContain("https://archway-mars-qa.azurewebsites.net/profile/addresses");
			
		});
		
	});
	
	it("User should be select address wheather its original OR suggested ", function() {
		
		var originalbtn=element(by.xpath("//button[contains(text(),'Original')]"));
		
		expect(originalbtn.getAttribute("value")).toContain("Use  Original");
		
		originalbtn.click();
		
		
		
	});
	


	
	
	});
	

