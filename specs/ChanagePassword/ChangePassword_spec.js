var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');

var OR = require('./../../json/objects.json');

var changepwdobj = require('./../../pageobjects/ChanagePassword/ChangePassword.js');

var tdata = require('./../../json/ChangePassword.json');

var logger = require('./../../log');

describe("Chnage Password", function() {
	
	
	beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
     browser.ignoreSynchronization = true;
	
	
		it("Lunch the URL", function() {
			

			  loginPageObj.openurl(OR.testsiteurl);
			
			browser.manage().window().maximize();
			
			
		});
		
		
		  it("Forgot password link present on the Login page", function() {
		    	
		        var forgotbtn=loginPageObj.getforpwd();
		        
		        forgotbtn.getAttribute("href").then(function(val){
		        	
		        	expect(val).toContain("https://archway-mars-qa.azurewebsites.net/forgot-password");
		        	
		        	console.log("value is :"+val);
		        	
		        }).catch(function(err){
		        	
		        	console.log(err);
		        	
		        });
		        
		        
		       
		        expect(forgotbtn.isDisplayed()).toBeTruthy();
		       
		     
		        	});
		  
		  
		  
		  it("Verify if user clicks on password button clicks successfully", function() {
			  
			var forgotpwdlink=  loginPageObj.getforpwd();
			
			if(forgotpwdlink.isPresent()){
				
				forgotpwdlink.click();
				
				browser.sleep(4000);
				
				// verify url after clicking on forgot button
				
				expect(browser.getCurrentUrl()).toContain(tdata.testdata.forgotpwdur);
			}
			else{
				
				//pass
			}
		  	
		  });
		  
		  it("Verify text forgot password", function() {
			  
			  var textval=changepwdobj.getforgotpwdtext();
			  
			  textval.getText().then(function(val){
				  
				  console.log("val is :"+val);
				  
				  expect(text).toContain(tdata.testdata.forgotpasswordtext);
				  
			  }).catch(function(err){
				  
				  console.log(err);
				  
			  });
		  	
		  });
		    
		   
	
	it("Enter Email id", function() {
		
		
		changepwdobj.enteremailid(tdata.testdata.email);
		
		
	});
	
	it("Click on send E-mail succssfull", function() {
		
		changepwdobj.sendemail();
		
	});
		
		
	
	
});