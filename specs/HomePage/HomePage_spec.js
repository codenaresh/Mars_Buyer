
var loginPageObj = require('./../../pageobjects/LoginPage/LoginPage.js');

var page = require('./../../pageobjects/BasePage/BasePage.js');

var homepageobj = require('./../../pageobjects/HomePage/HomePage.js');

var Additemobj = require('./../../pageobjects/AddItem/AddItem.js');

var tdata = require('./../../json/HomePage.json');

var tdata1 = require('./../../json/contact.json');

var UserMenuobj = require('./../../pageobjects/UserMenu/UserMenu.js');


var logger= require('./../../log');

describe(" Verifying Home Page ", function() {
	
	
	beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
     });

     afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     });
     
  
  browser.ignoreSynchronization = true;
	
	
	
  
  it("veriy all links present on page", function() {
	  
	  
  	
  	element.all(by.tagName("a")).each(function(val) {
  		
  		
  		
  		
  		val.getAttribute("href").then(function(text){
  			
  			console.log("links is :"+text);
  		});
  		
  	});
  
	});
  
  
	
	it("should find all links on Home Page", function() {
		
		var  allLinks = element.all(by.tagName('a'));
		
		allLinks.count().then(function(link_tally){
			
			console.log('There are a total of ' + link_tally );
			
			});
			
		      
		    });
		 
		
	
	it("Verify Presence of Logo text on Home Page", function() {
    	
    	
	    var logo=homepageobj.getlogo();
	    
	    logo.getAttribute("alt").then(function(text){
    		
    		console.log("text is :"+text);
    		
    		expect(text).toContain("Mars");
    		
    	}).catch(function(err){
    		
    		console.log(err);
    		
    	});
	    	
	    });
	
	
	    it("Verify URL of the Home page once user is logged successfully ", function() {
	    	
	         browser.getCurrentUrl().then(function(val){
	        	 
	        	 console.log("Home page url is :"+val);
	        	
	        	expect(val).toContain(tdata.testdata.homepageurl);
	        	
	        });
	        
	    
	    	
	    });
	    
	    
	    
	    
	    

	    
	    
	it("Verify BrowseProduct icon is present on the Landing/Home page after Login", function() {
	    	
		var browseProduct =homepageobj.getbrowseProduct();
		
		      expect(browseProduct.isDisplayed()).toBeTruthy();
		      
	    	  expect(browseProduct.isPresent()).toBeTruthy();
	    	
	    	expect(browseProduct.isEnabled()).toBeTruthy();
	    	
	    	browseProduct.getText().then(function(text){
	    		
	    		expect(text).toContain(tdata.testdata.BrowseProductstext);
	    		
	    	}).catch(function(err){
	    		
	    		console.log(err);
	    	});
	    	
	    	
	    	
	    	
	    });
	    
	
	it("Verify Report icon is present on the Landing/Home page after Login", function() {
		
		var reporticon= homepageobj.getresourceicon();
	    	
	    	expect(reporticon.isPresent()).toBeTruthy();
	    	
	    	expect(reporticon.isEnabled()).toBeTruthy();
	    	
	    	reporticon.getText().then(function(text){
	    		
	    		expect(text).toContain(tdata.testdata.ReportsText);
	    		
	    	}).catch(function(err){
	    		
	    		console.log(err);
	    	});
	    	
	    	
	    	
	});
	

	



	it("Verify Search Option on Home Page", function() {
		
		var searchoption=homepageobj.getsearchoption();
		
		expect(searchoption.isDisplayed()).toBeTruthy();
		
		expect(searchoption.isPresent()).toBeTruthy();
		
	});

	
	

	it("Verify Cart Icon", function() {
		
		var carticon= homepageobj.getcarticon();
		
		expect(carticon.isDisplayed()).toBeTruthy();
		
		expect(carticon.isPresent()).toBeTruthy();
		
		
		
	});
	

	
	
	describe("Verify Feature Item ", function() {
		
		it("Verify Feature Product text presence", function() {
			
			
	
			var featureitem= homepageobj.getfeatureitem();
			
	
			featureitem.getText().then(function(text){
				
				console.log("text val is :"+text);
				
				expect(text).toContain("Featured Products");
				
			}).catch(function(err){
	    				
	    		console.log(err);
	    	});
	    	
			
		});
		
		
 
		
		it("Click on feature veryFirstImage Icon", function() {
			
			
			 browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
			 
			 browser.sleep(3000);
			
		element.all(by.css("img.card-img-top.img-fluid.flex-shrink-0")).count().then(function(count){
				
				if(count>0){
					
					element.all(by.css("img.card-img-top.img-fluid.flex-shrink-0")).first().click();
					
					browser.sleep(5000);
					
				}
				else{
					
					throw "not found";
				}
				
			});
			
			
		
		});
		

		it("verify Status  of product description", function() {
			 
			 var status= Additemobj.getstatus();
				 
				 expect(status.isDisplayed()).toBeTruthy();
				 
				 expect(status.isPresent()).toBeTruthy();
			  	
			 });
		
		it("verify UOM element of product description", function() {
			 
			 var uom= Additemobj.getuom();
			 
			 expect(uom.isDisplayed()).toBeTruthy();
			  
		 	
		 });
		
		it("verify Length text presence", function() {
			
			var length=element(by.xpath("//*[contains(text(),'Length')]"));
			
			length.getText().then(function(text){
				
				console.log(" length text is:"+text);
				
				//expect(text).toContain("Length");
				
			});
			
			
			
			
		});
		
	it("verify Height text presence", function() {
		
		
		var Height=element(by.xpath("//*[contains(text(),'Height')]"));
		
		Height.getText().then(function(text){
			
			console.log(" length text is:"+text);
		
			
		}).catch(function(err){
    		
    		console.log(err);
    	});
    	
			
			
		});
	
	it("verify Width text presence", function() {
		
		
		
    var Width=element(by.xpath("//*[contains(text(),'Width')]"));
		
      Width.getText().then(function(text){
			
			console.log(" length text is:"+text);
			
			//expect(text).toContain("Length");
			
			
			
			
		}).catch(function(err){
    		
    		console.log(err);
    	});
    	
		
		
		
	});
	
	it("verify Weight text presence", function() {
		
		
		
		 var Weight=element(by.xpath("//*[contains(text(),'Weight')]"));
			
		 Weight.getText().then(function(text){
				
				console.log(" length text is:"+text);
				
				
				
				
				
				
			}).catch(function(err){
	    		
	    		console.log(err);
	    	});
	    	
		
	
		
		
		
	});
	
	});
	
	

	
	it("Verify if Item ID and URl contains the Same Product ID", function() {
		
		browser.getCurrentUrl().then(function(url){
			
	console.log("url is :"+url);
			
	var idtext=	element(by.xpath("//span[@class='text-muted']"));
	
	idtext.getText().then(function(val){
		
		console.log("val is :"+val);
		
	});
	
	
			
		});
		
		

		
	});
	
	it("Click on Mars Icon", function() {
		
		var marsicon=element(by.xpath("//img[@class='img-fluid']"));
		
		marsicon.click();
	
		browser.sleep(3000);
		
	
	});
	
	
	
	
	xdescribe("Verify RESOURCES Tab", function() {
		
		it("Verify Documents link", function() {
			
			browser.actions().mouseMove(element(by.xpath("//button[contains(text(),'Resources')]"))).perform();
			
			element(by.xpath("//small[contains(text(),'Documents')]")).click();
		
	});
		
		
		
		
	});


	
	

	
	describe("Verify Contact US link", function() {
		
		it("Verify Conact US links exist exist in footer", function() {
			
			
			var conatctus=homepageobj.getconatctus();
			
			// scroll down the page
			browser.executeScript("arguments[0].scrollIntoView();", conatctus);
			
			expect(conatctus.isDisplayed()).toBeTruthy();
			
			expect(conatctus.isPresent()).toBeTruthy();
			
			expect(conatctus.isEnabled());
			
			conatctus.isPresent().then(function(val){
				
				if(val){
					
					conatctus.click();
				}
				
			}).catch(function(err){
				
				throw err;
				
			});
		
		});
		
		it("navigate to Contact form window", function() {
			
			
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
		
		
		
		it(" Verification of Name text  is present and Enter Name  ",function() {
			
			
			var nametext= homepageobj.getnametext();
		 
	         expect(nametext.isDisplayed()).toBeTruthy();
	         
	         expect(nametext.isPresent()).toBeTruthy();
	         
	         expect(nametext.getText()).toContain(tdata.testdata.nametext);
				
			});
		
		
		
           it(" Enter Name value ", function() {
			
			
			var name= element(by.xpath("//input[@id='inputName']"));
			
			name.clear();
			
			
			name.sendKeys(tdata1.testdata.name);
			
			
			  browser.sleep(2000);
			
			
			});
		
	
		
	
	
	
		
		it(" Verification Email text is present", function() {
			
			var emailtext= homepageobj.getemailtext();
	         
	         expect(emailtext.isDisplayed()).toBeTruthy();
	         
	         expect(emailtext.isPresent()).toBeTruthy();
	         
	         emailtext.getText().then(function(text){
	        	 
	        	 expect(text).toContain(tdata.testdata.emailtext);
	         
	       
			}).catch(function(err){
				
				console.log(err);
				
			});
	         
		});
		
		
      it(" Enter Email value ", function() {
			
			
			var email= element(by.xpath("//input[@id='inputEmail']"));
	         
			email.clear();
			
			email.sendKeys(tdata1.testdata.email);
		
			
				
			});
		
		
		it("Verification Contact  Number text is present", function() {
			
			
			var contactltext= homepageobj.getcontactltext();
	         
	         expect(contactltext.isDisplayed()).toBeTruthy();
	         
	         expect(contactltext.isPresent()).toBeTruthy();
	         
	         expect(contactltext.getText()).toContain(tdata.testdata.contacttext);
				
			});
		
		
		
		
       it(" Enter contact value ", function() {
			
			
			var contact= element(by.xpath("//input[@id='inputContactNumber']"));
	         
			contact.clear();
			
			contact.sendKeys(tdata1.testdata.contact);
				
			});
		
		
		
		it(" Verification Message text is present", function() {
			
			
			var messgetext= homepageobj.getmessgetext();
	         
	         expect(messgetext.isDisplayed()).toBeTruthy();
	         
	         expect(messgetext.isPresent()).toBeTruthy();
	         
	         expect(messgetext.getText()).toContain(tdata.testdata.messagetext);
				
			});
		
		
      it(" Enter Message value ", function() {
			
			
			var msg= element(by.xpath("//textarea[@id='inputMessage']"));
	         
			msg.clear();
			
			msg.sendKeys(tdata1.testdata.message);
				
			});
		
		
		it("Verify Cancell Button presence ", function() {
			
			var cancelbtn=homepageobj.getsbtbtn();
			
			expect(cancelbtn.isDisplayed()).toBeTruthy();
			
			expect(cancelbtn.isPresent()).toBeTruthy();
			
		});
		
       it("Verify Submit button presence  ", function() {
			
			var sbtbtn=homepageobj.getsbtbtn();
			
			expect(sbtbtn.isEnabled()).toBeTruthy();
			
			expect(sbtbtn.isDisplayed()).toBeTruthy();
			
			expect(sbtbtn.isPresent()).toBeTruthy();
			
			if(sbtbtn.isPresent()){
				
				sbtbtn.click();
				
				browser.sleep(5000);
				
			}
			
		});
       
       it("Verify url", function() {
    	   
    	  browser.getCurrentUrl().then(function(url){
    		  
    		  console.log("url is :"+url);
    		  
    		  expect(url).toContain("https://archway-mars-qa.azurewebsites.net/contact-us");
    		  
    	  }); 
       	
       });
       
       it("Verify Success Message ", function() {
    	   
    	   element(by.xpath("//div[@class='alert alert-info mt-2']")).getText().then(function(text){
    		   
    		   console.log("Success Message is :"+text);
    		   
    		   expect(text).toContain("Thank you for your message. We will get back to you as soon as possible.");
    		   
    	   });
    	   
       	
       });
		
		
		
	
	});
		
	


	describe("Verify UserMenu", function() {
		
		
		it("Verify UserCircle", function() {
			
		var usercir	=UserMenuobj.getuserCircleElement();
		
		expect(usercir.isDisplayed()).toBeTruthy();
		
		expect(usercir.isPresent()).toBeTruthy();
			
		usercir.click();// clicking on the User Menu
		
		browser.sleep(3000);
		
	
		});
		
		
		
		
		it("Verify presence of User profile", function() {
			
		var userprofile=UserMenuobj.getprofileElement();
		
		expect(userprofile).toBeTruthy();
		
		expect(userprofile.isPresent()).toBeTruthy();
		
		userprofile.getText().then(function(text){
			
			console.log(text);
			
			expect(text).toContain(tdata.testdata.myprofile);
			
			
		}).catch(function(err){
    		
    		console.log(err);
    	});
		
		
			
			
		});
		
		
		it("Verify presence of my Orders", function() {
			
			
			var myorders=UserMenuobj.getmyorders();
			
			expect(myorders).toBeTruthy();
			
			expect(myorders.isPresent()).toBeTruthy();
			
			myorders.getText().then(function(text){
				
				console.log(text);
				
				expect(text).toContain(tdata.testdata.MyOrdersText);
				
				
			}).catch(function(err){
	    		
	    		console.log(err);
	    	});
			
			
			
			
		});
		
		
		
		it("Verify User Logout Option", function() {
			
			
			
        var userlogout=UserMenuobj.getlogoutElement();
			
			expect(userlogout).toBeTruthy();
			
			expect(userlogout.isPresent()).toBeTruthy();
			
			userlogout.getText().then(function(text){
				
				console.log(text);
				
				expect(text).toContain(tdata.testdata.logout);
				
				browser.sleep(2000);
				
				
			}).catch(function(err){
	    		
	    		console.log(err);
	    	});
			
			
			
			
			
			
			
			
		});
		
		
		
		
		it("Verify Distribution list Option", function() {
			
			
			
        var distribtnlist= element(by.xpath("//small[contains(text(),'Distribution list')]"));
			
			expect(distribtnlist).toBeTruthy();
			
			expect(distribtnlist.isPresent()).toBeTruthy();
			
			distribtnlist.getText().then(function(text){
				
				console.log(text);
				
				expect(text).toContain("Distribution list");
				
				browser.sleep(3000);
				
				
			}).catch(function(err){
	    		
	    		console.log(err);
	    	});
			
			
			
			
			
			
			
			
		});
		
		
		
	
		
		it("Verify Address  Option", function() {
			
			
			
        var addresstext= element(by.xpath("//small[contains(text(),'Addresses')]"));
			
			expect(addresstext).toBeTruthy();
			
			expect(addresstext.isPresent()).toBeTruthy();
			
			addresstext.getText().then(function(text){
				
				console.log(text);
				
				expect(text).toContain("Addresses");
				
			
			}).catch(function(err){
	    		
	    		console.log(err);
	    	});
			
			
	
		});
		
	});
		
	it("Refresh the Page", function() {
		
	
	
		browser.refresh();
		
		browser.sleep(6000);
		
	
	});
		
		
		
		
	

	
});
	
