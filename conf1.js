


var HtmlReporter = require('protractor-beautiful-reporter');





exports.config = {
		
  framework: 'jasmine',
  
  directConnect: true,
  
  


  //seleniumAddress: 'http://localhost:4444/wd/hub',
  
//allScriptsTimeout:30000,
  
 // jasmineNodeOpts: {defaultTimeoutInterval: 2500000},
  
 
  
  specs: ['./specs/ImpersonateUser/findUser_spec.js'],
  
  //specs: ['./demo6.js'],
  

  
  
 suites:{
	  
	  
	  /*-------------------Login Page--------------*/
	  
	  login:'./specs/LoginPage/LoginPage_spec.js',
	  
	  /*-------------------Login with impersonate user--------------*/
	  
	 impsonateUser:'./specs/ImpersonateUser/impersonateUser_spec.js',
	  
	  /*-------------------Home  Page--------------*/
	  
	Home:'./specs/HomePage/HomePage_spec.js',
	  
	 
	  
	  /*-------------------Add Item --------------*/
	  
	  
	  
  QuickAdd:'./specs/AddItem/AddItem_quickadd_spec.js',
	  
	AddMultipleProducts:'./specs/AddItem/AddMultipleProduct.js',
	  
	  
	AddByCategory:'./specs/AddItem/AddItemByCategory_spec.js',
	  
	AddByFilter:'./specs/AddItem/AddItemByFilters_spec.js',
	  
	AddByGrid:'./specs/AddItem/AddItemByGrid_spec.js',
	  
	AddByList:'./specs/AddItem/AddItemByList_spec.js',
	  
	AddByTable:'./specs/AddItem/AddItemByTable_spec.js',
	  
	AddBySearch:'./specs/AddItem/AddItemBySearch_spec.js',
	  

  
  /*-------------------My Orders --------------*/
  
	SearchAndReorder:'./specs/MyOrders/SearchAndReorder_spec.js',
	
	AdvanceSearchAndReorder:'./specs/MyOrders/MyOrder_specificSearch_spec.js',
	  
	MyOrdersVerificationByStatus:'./specs/MyOrders/MyOrdersTableSearch_spec.js',




	  /*-------------------Checkout Process which will select one time address --------------*/ 
	  
Checkout:'./specs/Checkout/Checkout_spec.js',

cancelAndContinueShopping:'./specs/Checkout/CancelAndContinueShopping_spec.js',
	  
	  
	  /*-------------------Address selection  chocie--------------*/
  
  MultipleAddress:'./specs/Address/MultipleAddress_spec.js',
  
  SelectASaveAddress:'./specs/Address/SelectASaveAddress_spec.js',
  
	Address:'./specs/Address/AddAddress_spec.js',
	  
	  
	  /*-------------------Profile --------------*/
	  
	profile:'./specs/MyProfile/MyProfile_spec.js',

/*-------------------Change password --------------*/

changepassword:'./specs/ChangePassword/ChangePassword_spec.js',
	 
	  
	  
	  /*-------------------log out--------------*/
	  
logout:'./specs/Logout/Logout_spec.js',
	  
	  
  },
  

 
  
	 

 /* onPrepare: function() {
      // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
      jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'ReportsImpersonateUser/screenshots'
      }).getJasmine2Reporter());
   },*/
   
   
   
  onPrepare: function () {
	  
	  var today = new Date();
	    var timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' + today.getHours() + 'h-' + today.getMinutes() + 'm-' + today.getSeconds() + 's';
	    Screenshot = timeStamp;
	  
	    var AllureReporter = require('jasmine-allure-reporter');
	    jasmine.getEnv().addReporter(new AllureReporter());
	    jasmine.getEnv().afterEach(function(done){
	    	resultsDir:'allure-results'
	      browser.takeScreenshot().then(function (png) {
	        allure.createAttachment('Screenshot', function () {
	          return new Buffer(png, 'base64')
	        }, 'image/png')();
	        done();
	      })
	    });
	  }
   
   
   
  
  
};