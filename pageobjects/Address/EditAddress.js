var page = require('./../BasePage/BasePage.js');

var Address;

Address= function(){
	
	
	
	
var firstName = element(by.id('FirstName'));
    
 var lastName = element(by.id('LastName'));
    
var companyname = element(by.id('CompanyName'));

var street1=element(by.id("Street1"));

var street2=element(by.id("Street2"));
    
var city = element(by.id('City'));
    
var state = element(by.id('State'));
    
var zipCode = element(by.id('zipCode'));

var createAddress= element(by.xpath("//button[contains(text(),'Create Address')]"));

var editicon= element(by.xpath(""));

var noaddressfound= element(by.xpath("//p[contains(text(),'No addresses found')]"));

var searchAddress= element(by.xpath("//form[@class='ng-valid ng-touched ng-pristine']//input[@id='search-addon']"));

var addAnAddress= element(by.xpath("//button[contains(text(),'Add an Address')]"));

var faxnumbver= element(by.id("FaxNumber"));

var emailid= element(by.id("Email"));
// Validation Error message

var fnameerrormsg=	element(by.xpath("//span[contains(text(),'First Name is required')]"));

var lnameerrormessage=	element(by.xpath("//span[contains(text(),'Last Name is required')]"));

var address1errormsg=	element(by.xpath("//span[contains(text(),'Address 1 is required')]"));

var cityerrormsg=	element(by.xpath("//span[contains(text(),'City is required')]"));

var stateerrormsg=	element(by.xpath("//span[contains(text(),'State is required')]"));

var zipcodeerrormsg=	element(by.xpath("//span[contains(text(),'Zip Code is required')]"));

var emailerrormsg=	element(by.xpath("//span[contains(text(),'Email Address is required')]"));

var phoneerrormsg=	element(by.xpath("//span[contains(text(),'Phone Number is required')]"));

this.getfnameerrormsg= function(){
	
	return fnameerrormsg;
};

this.getlnameerrormessage= function(){
	
	return lnameerrormessage;
};

this.getaddress1errormsg= function(){
	
	return address1errormsg;
};

this.getcityerrormsg= function(){
	
	return cityerrormsg;
};

this.getstateerrormsg= function(){
	
	return stateerrormsg;
};

this.getzipcodeerrormsg= function(){
	
	return zipcodeerrormsg;
};


this.getemailerrormsg= function(){
	
	return emailerrormsg;
};

this.getphoneerrormsg= function(){
	
	return phoneerrormsg;
};



var phonenum= element(by.xpath("//input[@id='Phone']"));

// add address text

var addadress=element(by.xpath("//h4[contains(text(),'Add Address')]"));


this.getaddresstext= function(){
	
	return addadress;
	
	 
};

this.enteremail= function(value){
	
	emailid.clear();
	
	emailid.sendKeys(value);
	
};

this.enterfaxnumber= function(value){
	
	faxnumbver.clear();
	
	faxnumbver.sendKeys(value);
	
	
};

this.clickOnAddAddress= function(){
	
	page.highlightElement(addAnAddress);
	
	addAnAddress.click();
	
};



this.enterPhone= function(value){
	
	page.highlightElement(phonenum);
	
	phonenum.clear();
	
	phonenum.sendKeys(value);
	
};


this.addAddressElement= function(){
	
	
	return addAnAddress;
	
	
	
};
 

this.addressMessage= function(){
	

	return noaddressfound;
	
};

this.search= function(value){
	
	page.highlightElement(searchAddress);
	
	searchAddress.clear();
	
	searchAddress.sendKeys(value);
	
};


this.enterFirsName= function(value){
	
	page.highlightElement(firstName);
	
	firstName.clear();
	
	firstName.sendKeys(value);
};


this.enterLastName= function(value){
	
	page.highlightElement(lastName);
	
	lastName.clear();
	
	lastName.sendKeys(value);
};

this.enterCompanyName= function(value){
	

		page.highlightElement(companyname);
		
		companyname.clear();
		
		companyname.sendKeys(value);
		
	

};

this.enterStreet1Name= function(value){
	
	page.highlightElement(street1);
	
	street1.clear();
	
	street1.sendKeys(value);
};

this.enterStreet2Name= function(value){
	
	page.highlightElement(street2);
	
	street2.clear();
	
	street2.sendKeys(value);
};

this.enterCityName= function(value){
	
	page.highlightElement(city);
	
	city.clear();
	
	city.sendKeys(value);
};

this.clickOnState= function(){
	
	page.highlightElement(state);
	
	state.click();
};

this.enterZipcodeName= function(value){
	
	page.highlightElement(zipCode);
	
	zipCode.clear();
	
	zipCode.sendKeys(value);
};

this.clickOnSaveBtn= function(){
	
	page.highlightElement(createAddress);
	
	createAddress.submit();
};

 
 
	
	
};

module.exports= new Address();