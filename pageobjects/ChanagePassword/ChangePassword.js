
var page = require('./../../pageobjects/BasePage/BasePage.js');

var changepassword;

changepassword= function(){
	
	
	var emailid=element(by.xpath("//input[@id='email']"));
	
	var savebtn= element(by.xpath("//button[@class='btn btn-primary btn-block']"));
	
	 var forgotpwdtext= element(by.xpath("//*[text()='Forgot Password']"));
	 
	 var emailfield=	element(by.xpath("//button[@id='submitBtn']"));
	 
	 var errormsg=element(by.xpath("//div[@id='toast-container']"));
	
	
	
this.enteremailid= function(value){
	
	page.highlightElement(emailid);
		
	emailid.clear();
	
	emailid.sendKeys(value);
		
		
	};
	

	this.getforgotpwdtext= function(){
		
		return forgotpwdtext;
	};
	
	this.sendemail=function(){
		
		page.highlightElement(emailfield);
		
		emailfield.click().then(function(succ){
			
			console.log("pass ho gaya");
			
		}).catch(function(err){
			

			errormsg.getText().then(function(text){
				
				console.log("val is :"+text);
				
			}).catch(function(err1){
				
				console.log(err1);
			});
			
		});
		
		
	};
	
	
	this.enternewpassword= function(value){
		
		page.highlightElement(newpassword);
			
		newpassword.clear();
		
		newpassword.sendKeys(value);
			
			
		};
		
		
		this.enternconfirmpwd= function(value){
			
			page.highlightElement(confirmpwd);
				
			confirmpwd.clear();
			
			confirmpwd.sendKeys(value);
				
				
			};
		
	
	
	
	
	this.clickonchangepassword= function(){
		
		page.highlightElement(changepassword);
		
		
		changepassword.click();
		
		
	};
	
	
	this.clickonsavebtn= function(){
		
		page.highlightElement(savebtn);
		
		savebtn.click();
		
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};

module.exports= new changepassword();