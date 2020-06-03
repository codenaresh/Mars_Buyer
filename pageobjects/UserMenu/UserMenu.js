
var page = require('./../BasePage/BasePage.js');

var UserMenu;

UserMenu= function(){
	
	var myorders=element(by.xpath("//small[contains(text(),'My Orders')]"));
	
	 var userCircle =   element(by.xpath('//span[@class="d-none d-md-inline"]'));  
	
  
    var myProfile = element(by.xpath("//small[contains(text(),'My Profile')]")); 
    
    var logout = element(by.xpath("//small[contains(text(),'Logout')]"));  
    
    var myOrders = element(by.xpath("//small[contains(text(),'My Orders')]"));
    
  var addresses = element(by.xpath("//small[text()='Addresses']"));
  
  
  this.clickonmyorders= function(){
	  
	  myorders.click(); 
	  
  };
  
  this.getmyorders= function(){
	  
	 return myorders; 
	  
  };
  
  
  this.getuserCircleElement= function(){
	  
	  return userCircle;
	  
  };
  
  this.getaddressesElement= function(){
	  
	  return addresses;
	  
  };
  
this.getprofileElement= function(){
	  
	  return myProfile;
	  
  };
  
this.getlogoutElement= function(){
	  
	  return logout;
	  
  };
    
    
    
    this.clickOnUserCircle= function(){
    	
    	page.highlightElement(userCircle);
    	
    	page.click(userCircle);
    	
    	//userCircle.click();
    	
    	
    };
    
    
 this.clickOnmyProfile= function(){
	 
	 page.highlightElement(myProfile);
	 
	 page.click(myProfile);
    	
	 myProfile.click();
    	
    	
    };
    
 this.clickOnlogout= function(){
	 
	 page.highlightElement(logout);
	 
	 page.click(logout);
    	
	 //logout.click();
    	
    	
    };
    
    
 this.clickOnaddresses= function(){
	 
	 page.highlightElement(addresses);
 	
    	
	 addresses.click();
    	
    	
    };
    
    
    this.clickOnmyOrders= function(){
    	
    	 page.highlightElement(myOrders);
    	 
    	 page.click(myOrders);
    	
   	 //myOrders.click();
       	
       	
       };
    
    
   

	
	
	
	
	
	
	
	
	
	
	
	
	
};

module.exports= new UserMenu();