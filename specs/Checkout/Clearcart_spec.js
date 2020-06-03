
var page = require('./../../pageobjects/BasePage/BasePage.js');


var tdata = require('./../../json/AddItem.json');

var logger = require('./../../log');

var selectwraper = require('./../../Select-Wrapper.js');





describe("Verify clear cart", function() {
	 
	
	it("verify If user can clear cart", function() {
		
		var clearcart= element(by.xpath("//button[@class='btn btn-primary ng-star-inserted']"));
		
		clearcart.click();
		
		 logger.log('info','Click on clear cart');
    	 
		
		
		
		
	});
	
	it("Verify Shopping cart Text is present", function() {
		
		
	var shoppingcart=	element(by.xpath("//h1[@class='display-4 m-0 headline-text text-center']"));
	
	shoppingcart.getText().then(function(text){
		
		console.log(text);
		
		expect(text).toContain(tdata.testdata.ShoppingCartText);
		
		
		
	});
		
		
		
		
	});
	
	
	it("Verify counter if user clear cart", function() {
		
	var counter=element(by.xpath("//span[@class='fa-layers-counter']"));
	
	counter.getText().then(function(count){
		
		console.log(count);
		
		expect(count).toBe(0);
		
	});
	
		
		
	});
	
	
	it("Verify Text after clearing the cart", function() {
		
	var textmsg=	element(by.xpath("//p[contains(text(),'You do not have any items in your cart')]"));
		
	textmsg.getText().then(function(text){
		
		console.log(text);
		
		expect(text).toContain(tdata.testdata.messageafterclearingCart);
		
	});
	
	
		
		
	});
	
	
	
	
});