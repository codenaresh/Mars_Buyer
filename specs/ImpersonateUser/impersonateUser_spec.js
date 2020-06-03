
var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');


var tdata = require('./../../json/login.json');

var logger= require('./../../log');

var userObj = require('./../../pageobjects/UserMenu/User.js');


describe('Login Page - ', function () {
	

	
    it('should login the user', function () {
    	
    
    	loginPageObj.openurl(tdata.testdata.marsSellerurl);
		
		logger.log('info','navigating to the web site');
		
		browser.manage().window().maximize();
		
		
		
		
    });
    
    
    it("Verify Title of the Login Page", function() {
    	
    	browser.getTitle().then(function(title){
    		
    		console.log("Title is:"+title);
    		
    		expect(title).toContain("Mars Seller");
    		
    	}).catch(function(err){
    		
    		console.log(err);
    		
    	});
    	
    	
    	
    });
    
    
    
    
    it("Verify Username labeling is present", function() {
    	
    var usernamelabel=	element(by.xpath("//label[contains(text(),'Username')]"));
    
    expect(usernamelabel).toBeTruthy();
    
    usernamelabel.getText().then(function(text){
    	
    	console.log("text is :"+text);
    	
    	expect(text).toContain("Username");
    	
    }).catch(function(err){
    	
    	console.log("Username label not found");
    	
    });
    
    
    	
    });
    
    
    
    
    it("Verify password label is present", function() {
      	
      var pawdlabl=element(by.xpath("//label[contains(text(),'Password')]"));
      
      
      expect(pawdlabl).toBeTruthy();
      
      
      pawdlabl.getText().then(function(text){
      	
      	console.log("text is :"+text);
      	
      	expect(text).toContain("Password");
      	
      }).catch(function(err){
    	  
    	  console.log("password label not found");
    	  
      });
      
      
     
      	
      	
      
      });
        
      
   
      
    
    it("Verify Remember Me check box", function() {
    	
        var chkboxlbl=element(by.xpath("//label[contains(text(),'Remember Me')]"));
        
        expect(chkboxlbl.isPresent()).toBeTruthy();
        
        chkboxlbl.getText().then(function(text){
          	
          	console.log("Remember Me text is :"+text);
          	
          	expect(text).toContain("Remember Me");
          	
          }).catch(function(err){
        	  
        		console.log("Remember Me check box not found");
        	  
          });
          
        
        
        
        
        
        	
        });
    
    
    
    
    
    
    
    
		
	it("Login successfully",function() {
		
		
		if(tdata.testdata.usernameSeller=="admin" && tdata.testdata.passwordSeller=="fails345"){
			
			loginPageObj.EnterUsername(tdata.testdata.usernameSeller);
			
			logger.log('info','Enter Username');
			

			loginPageObj.EnterPassword(tdata.testdata.passwordSeller);
			
			logger.log('info','Enter Password');
			
			
			var EC = protractor.ExpectedConditions;
			
			
			
			var button = element(by.xpath("//button[@id='submitBtn']"));
			
			var isClickable = EC.elementToBeClickable(button);
			

			browser.wait(isClickable, 5000); //wait for an element to become clickable
			
			button.click();
			

			//loginPageObj.ClickLoginButton();
			
			

			
		    it("veriy all links present on page", function() {
		    	
		    	element.all(by.tagName("a")).getText().then(function(text){
		    		
		    		for(var i=0; i<text.length; i++){
		    			
		    			
		    			console.log(text[i]);
		    		}
		    		
		    		
		    		
		    	});
		    	
		    	
		    	
		    	
		    });
		    
		  
		   
		   it("Verify User has looged successfully", function() {
			   
			 var url=  browser.getCurrentUrl();
			 
			 expect(url).toContain("https://archway-mars-seller-qa.azurewebsites.net/home");
		   	
			   
			 	   
			   
		   });

			
			
			
			
			
		}
		
		else if(tdata.testdata.usernameSeller!="admin" && tdata.testdata.passwordSeller!="fails345"){
			
			loginPageObj.EnterUsername(tdata.testdata.usernameSeller);
			
			logger.log('info','Enter Username');
			

			loginPageObj.EnterPassword(tdata.testdata.passwordSeller);
			
			logger.log('info','Enter Password');
			
			loginPageObj.ClickLoginButton();
			
			var errormes= element(by.xpath("//div[@id='toast-container']"));
			
			errormes.getText().then(function(text){
				
				console.log("Error message is:"+text);
				
			});
			
			
			
		}
		
		

	
		
	});
	
	
	 it('Mouse Operations on Master menu on Home Page', function() {
    	 
 	 	
	  		
	  		// mouse hover on a submenu
	     
	  
	  		browser.actions().mouseMove(element(by.css(" li.nav-item:nth-child(1) div.dropdown > button.dropbtn.nav-link.text-color"))).perform();
	      
	  	});
	      
	     
	     

		it("user should be able to click on User Icon", function() {
		

			userObj.clickOnUserIcon();
			
			logger.log('info','click on User Icon');

			

		});
		
		it("Verify URl if user on user's page", function() {
			
			
		       var url=browser.getCurrentUrl();
		       
		       expect(url).toContain("users");

				

			});
		
		it("Login into Mars_Buyer with Impersonate User successfully", function() {
			
			
            var users=element.all(by.css(" td:nth-child(2) > a:nth-child(1)"));
			
			
			//console.log(users);		
	          var userid = users.filter(function(ele, arg1) {
				
				return ele.getText().then(function(text) {
					
					//console.log(text, " === ", 1313);
					if (text == tdata.testdata.impersonateUserid) 
						
					return text == tdata.testdata.impersonateUserid;
								});
				
			});
	

	  userid.getText().then(function(text){
		
		 console.log("T ki value - ",text);
		
	});
	  
	  userid.click();
		 
		// browser.sleep(4000);
		

			
		});
		
		it("click on Ipersonate User", function() {
			
			var impersonateuserbtn= element(by.xpath("//button[@class='btn btn-primary mb-3']"));
			
			expect(impersonateuserbtn.isDisplayed()).toBeTruthy();
			
			expect(impersonateuserbtn.isEnabled()).toBeTruthy();
			
			if(impersonateuserbtn.isPresent()){
				
				impersonateuserbtn.click();
				
				browser.sleep(20000);
				
			}
			
			
		});
		
		
		
		
		it("navigate to New window", function() {
			
			
			 var handlePromise = browser.driver.getAllWindowHandles();
			 
			 
			 
			 handlePromise.then(function (handles) {
				 
		        // parentHandle = handles[0];ss
		        var popUpHandle = handles[1];

		        // Change to new handle
		        browser.driver.switchTo().window(popUpHandle);

		        var popUpHandleFinal = browser.driver.getWindowHandle();
		        
		        expect(popUpHandleFinal).toEqual(popUpHandle);
		    });
			
			
		});
		
		it("Verify user is on Mars Buyer", function() {
			
			browser.sleep(5000);
			
			
			browser.getCurrentUrl().then(function(url){
				
				console.log("url is :"+url);
				
			});
			
		});
		
	
		
		
		
		
	
				
			
	

});