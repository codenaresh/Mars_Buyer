var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');

var OR = require('./../../json/objects.json');

var tdata = require('./../../json/login.json');

var logger= require('./../../log');

var HttpClient = require("protractor-http-client").HttpClient;



describe("Verify Login", function() {
	

	beforeEach(function() {
		

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
	

    // browser.ignoreSynchronization = true;

    it('should login the user', function () {
    	
    
    	     loginPageObj.openurl(OR.testsiteurl);
    	     
    	  
    	     logger.log('info','Launch the Core Buyer URL');
    
         
            
            

          
         
    });
    
	
    
    
    it("Verify Mars  written on Image on Login Page", function() {
    	
    	var masrtext=loginPageObj.getmasrtext();
    	
    	masrtext.getAttribute("alt").then(function(text){
    		
    		console.log("text is :"+text);
    		
    		expect(text).toContain("Mars");
    		
    	}).catch(function(err){
    		
    		console.log(err);
    		
    	});
    	
    		
    	});
    
    
    
    it("Verify Welcome Message on Login Page", function() {
    	
    	
    	var welcomemsg=loginPageObj.getwelcomemsg();
    	
    	welcomemsg.getText().then(function(text){
    		
    		console.log("welcome message is :"+text);
    		
    		expect(text).toContain("Welcome to Mars");
    		
    	}).catch(function(err){
    		
    		console.log(err);
    		
    	});
    	
    	
    	
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
    
    
    
    
    it("Forgot Customer Number link the Login page", function() {
    	
       var forgotusername=loginPageObj.getforgotusername();
       
       expect(forgotusername).toBeTruthy();
       
       forgotusername.getAttribute("href").then(function(val){
       	
       	console.log("value is :"+val);
       	
       }).catch(function(err){
       	
       	console.log(err);
       	
       });
       
        
   
        	
        	});
    
   
    
    it("Verify Username labeling is preseet", function() {
    	
    var usernamelabel=	loginPageObj.getUsernameLabel();
    
    usernamelabel.getText().then(function(text){
    	
    	console.log("Username is :"+text);
    	
    	expect(text).toContain("User Name");
    	
    }).catch(function(err){
    	
    	console.log(err);
    });
    
    
    
    expect(usernamelabel).toBeTruthy();
    
    	
    });
    
    
    
    
    it("Verify password label is present", function() {
      	
      var pawdlabl=loginPageObj.getpasswordlabel();
      
      pawdlabl.getText().then(function(text){
      	
      	console.log("password is :"+text);
      	
      	expect(text).toContain("Password");
      	
      }).catch(function(err){
      	
      	console.log(err);
      });
      
      
      expect(pawdlabl).toBeTruthy();	
      	
      	
      
      });
        
      
   
      
    
    it("Verify Remember Me check box", function() {
    	
        var chkboxlbl=loginPageObj.getchkboxlbl();
        
        chkboxlbl.getText().then(function(text){
          	
          	console.log("Remember Meis :"+text);
          	
          	expect(text).toContain("Remember Me");
          	
          }).catch(function(err){
          	
          	console.log(err);
          });
        
        expect(chkboxlbl.isPresent()).toBeTruthy();
        
        	
        });
    
   
    it("verify the title of the Page", function() {
    	
    	browser.getTitle().then(function(title){
    		
    		console.log("title is :"+title);
    		
    		expect(title).toContain(tdata.testdata.title);
        	
    		
    	});
    	
    	
    	
    	
    
    	});
    	
 
    
    it("veriy all links present on page", function() {
    	
    	element.all(by.tagName("a")).each(function(val) {
    		
    		val.getAttribute("href").then(function(text){
    			
 
    			console.log("login page links are  :"+text);
    		});
    		
    	});
    		
    	
    	
    	
    });
    
    
    
    
    
    
    it("User Login successfully ", function() {
    	
    	
    	if(tdata.testdata.username=="TestMARSQA" && tdata.testdata.password=="fails345"){
    		
    	
    	 loginPageObj.EnterUsername(tdata.testdata.username);
    	 
    	   logger.log('info','Enter the username');
         

         loginPageObj.EnterPassword(tdata.testdata.password);
         
         logger.log('info','Enter the password');
       

         loginPageObj.ClickLoginButton();
         
         logger.log('info','click on Button');
         
        browser.sleep(6000);
         
         var url=browser.getCurrentUrl().then(function(val){
        	 
        	 console.log("url is :"+val);
        	 
        	
         	
        	 
         });
         
     	
     	
    	}
    	
    	else if(tdata.testdata.username!="TestMARSQA" || tdata.testdata.password!="fails345") {
    		

       	   loginPageObj.EnterUsername(tdata.testdata.username);
       	 
       	   logger.log('info','Enter the username');
            

            loginPageObj.EnterPassword(tdata.testdata.password);
            
            logger.log('info','Enter the password');
          

            loginPageObj.ClickLoginButton();
            
            logger.log('info','click on Button');
            
           browser.sleep(6000);
    		
    		
    		
    		console.log("user not found");
			
			var errormsg=element(by.xpath("//div[@id='toast-container']"));
	    	
	    	errormsg.getText().then(function(text){
	    		
	    		console.log("Error message is"+text);
	    		
	    		expect(text).toBeTruthy();
	    		
	    	});
    	
    		
    		
    		 
    		
    	}
    	
    });
    
  
   

});