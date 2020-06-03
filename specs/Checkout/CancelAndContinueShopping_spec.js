describe("Cancel and Continue Shopping", function() {
	
	
	it("verify if user can cancel continue shopping", function() {
		
	
	var cancel=element(by.xpath("//button[@class='btn btn-danger']"));
	
	expect(cancel.isPresent()).toBeTruthy();
	
	if(cancel.isPresent()){
		
		
		cancel.click();
	}
	
	

	
	});
	
	
	it("Verify Text You do not have any items in your cart", function() {
		
		var text= element(by.xpath("//p[@class='mb-0']"));
		
		text.getText().then(function(val){
			
			console.log("text is:"+val);
			
			expect(val).toContain("You do not have any items in your cart");
			
		});
		
		
		
		
	});
	
	
      it("Verify Shopping Cartt", function() {
		
		var shoppingtext= element(by.xpath("//h1[@class='display-4 m-0 headline-text text-center']"));
		
		shoppingtext.getText().then(function(val){
			
			console.log("text is:"+val);
			
			expect(val).toContain("Shopping Cart");
			
		});
		
		
		
		
	});
      
      
      
      it("Verify Continue Shoppping ", function() {
  		
  		var continueshoppingbtn= element(by.xpath("//button[@class='btn btn-primary']"));
  		
  		expect(continueshoppingbtn.isEnabled()).toBeTruthy();
  		
  		if(continueshoppingbtn.isPresent()){
  			
  			continueshoppingbtn.click();
  			
  			
  		}
  		
  		
  		
  	});
  	
	
	
	
		
		
		
		
		
	
	
	
	
	
	
	
	
	
	
	
});