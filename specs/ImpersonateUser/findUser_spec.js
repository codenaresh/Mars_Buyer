var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');

var page = require('./../../pageobjects/BasePage/BasePage.js');

var OR = require('./../../json/objects.json');

var tdata = require('./../../json/login.json');

var logger= require('./../../log');

var userObj = require('./../../pageobjects/UserMenu/User.js');

//var xl=require('./../../util/ReadExcel.js');
 
//var dataReaderObj=require('./../../util/DataReader.js');


browser.manage().timeouts().implicitlyWait(4000);

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
			
			// expected condition
			
             var EC = protractor.ExpectedConditions;
             
			var button = element(by.xpath("//button[@id='submitBtn']"));
			
			var isClickable = EC.elementToBeClickable(button);
			

			browser.wait(isClickable, 5000,"waiting for click"); //wait for an element to become clickable
			
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
		
		
		
		it("get User table data ", function() {
			
			
			
			var tbledata=element.all(by.css(".table"));
			
			
			element.all(by.css(".table>thead")).each(function(headerval) {
				
				headerval.getText().then(function(text){
					
					console.log("HEader val is :"+text);
					
				});
				
			});
			
			tbledata.all(by.tagName("tr")).each(function(row) {
				
				row.all(by.tagName("td")).each(function(tdval) {
					
					tdval.getText().then(function(text){
						
						console.log("text is :"+text);
						
						
						
					});
					
				});
				
			});
				
				
				
		
			
			
		});
		

	    xit("Verify order status and respected orders", function() {
	    	
	    
	    					  
	    				      //getting the size of the pagination
	    				        
	    				      var getPaginationsize = element.all(by.css("ngb-pagination>ul>li"));
	    				      
	    				      
	    				      getPaginationsize.count().then(function (pagination) {
	    				    	  
	    				          if (pagination > 0) {

	    				              for (var i = 1; i < pagination-1; i++) {
	    				            	  
	    				            	  browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
	    				            	  
	    				            	  browser.sleep(3000);
	    				            	  
	    				            	  
	    				                  getPaginationsize.get(i).click();
	    				                  
	    				                  
	    				                
	    				                   element.all(by.css("td.text-center:nth-child(1)")).count().then(function(text){
	    				                	
	    				                	console.log("total count:"+text);
	    				                	
	    				                	
	    				                });
	    				                
	    				                browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
	    				         	   
	    				         	   browser.sleep(3000);
	    				         	   
	    				         	   
	    				         	  browser.getCurrentUrl().then(function(text){
	    	    						  
	    	    						   console.log(text);
	    	    						   
	    	    					
	    	    						   
	    	    						   expect(text).toBeTruthy();
	    	    						   
	    	    						  browser.sleep(3000);
	    	    						  
	    	    						
	    	    						       
	    	    				    
	    	    						  
	    	    				      });
	    				         	   
	    				         	   
	    				         	   
	    				              }
	    				          } 
	    				      });
	    				      
	    	
	    	
	  	
	    	
	    });
	    
	    
	   
		
		it("Verify URl if user on user's page", function() {
			
			
		       var url=browser.getCurrentUrl();
		       
		       expect(url).toContain("users");

				

			});
		
		it("Login into Mars_Buyer with Impersonate User successfully", function() {
			
			var tabledata = element.all(by.css(".table"));
			
			tabledata.getText().then(function(val){
				
				//console.log("table data is:"+val);
				
			});
			
			

			// get rows 
			var rows = tabledata.all(by.tagName("tr"));
			
			rows.count().then(function(text){
				
				//console.log("row is :"+text);
				
				
			});
			
			// for speicifc col value 
			
			element.all(by.tagName('tr')).get(1).all(by.tagName('td')).get(1).getText().then(function(val){
				
			//	console.log("col value is :"+val);
				
			});
			
			
			var cells = rows.all(by.tagName("td"));
			
			cells.count().then(function(text){
				
				
				//console.log("col is :"+text);
				
				if(text>0){
				
					cells.getText().then(function(colval){
						
						//console.log("col name is "+colval);
						
					});
					
					
					
				}
				
				
			});
			
		
			
	

			
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
	
	// click on user id 
	  userid.click();
	
	browser.sleep(6000);
	
	userid.getText().then(function(text){
				
				// console.log("T ki value - ",text);
				
			});
		

				
		});		
	

});