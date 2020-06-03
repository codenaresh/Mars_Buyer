
var HtmlReporter = require('protractor-beautiful-reporter');

waitTimeout = 120000;

exports.config = {
		
  framework: 'jasmine',
  
 directConnect: true,
 
  capabilities: {
      browserName: 'chrome'
      
  },
  
allScriptsTimeout:250000,

//getPageTimeout: 180000,

maxSessions: 1,
  
  jasmineNodeOpts: {
	  
	// If true, display spec names.
	    isVerbose: false,
	  
	  onComplete: null,
	  
	// If true, print colors to the terminal.
	  showColors: true,
	  
	// If true, include stack traces in failures.
	    includeStackTrace: true,
	    
	  defaultTimeoutInterval: 120000,
	  
  
  },
  
 
  
  //specs: ['./specs/LoginPage/LoginPage_spec.js'],
  
  
  suites:{
	  
	  /*-------------------Login Page->Home Page-->logout--------------*/
	  
	  TC001:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->HomePage->-->Add Multiple Product---->logout--------------*/
	  
	  TC002:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddMultipleProduct.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->HomePage->-->Quick Add-->logout--------------*/
	  
	  TC003:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItem_quickadd_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->-Home Page-->Quick Add-->Check out-->logout------------*/
	  
	  TC004:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItem_quickadd_spec.js','./specs/Checkout/Checkout_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->-Home Page-->By List-->Check out-->logout------------*/
	  
	  TC005:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItemByList_spec.js','./specs/Checkout/Checkout_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->-Home Page-->By Grid-->Check out-->logout------------*/
	  
	  TC006:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItemByGrid_spec.js','./specs/Checkout/Checkout_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->-Home Page-->By Table-->Check out-->logout------------*/
	  
	  TC007:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItemByTable_spec.js','./specs/Checkout/Checkout_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->-Home Page-->By Search item on Home Page-->Check out-->logout------------*/
	  
	  TC008:['./specs/LoginPage/LoginPage_spec.js','./specs/HomePage/HomePage_spec.js','./specs/AddItem/AddItemBySearch_spec.js','./specs/Checkout/Checkout_spec.js','./specs/Logout/Logout_spec.js'],
	  
	 
	  /*-------------------Login Page->Profile->Logout-------------*/
	  
	  TC009:['./specs/LoginPage/LoginPage_spec.js','./specs/MyProfile/MyProfile_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->Search and Re-order-->logout--------------*/
	  
	  TC0010:['./specs/LoginPage/LoginPage_spec.js','./specs/MyOrders/SearchAndReorder_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  /*-------------------Login Page-->specific order search-->LogOut------------*/
	  
	  TC0011:['./specs/LoginPage/LoginPage_spec.js','./specs/MyOrders/MyOrdersTableSearch_spec.js','./specs/Logout/Logout_spec.js'],
	  
	  TC0012:['./specs/LoginPage/LoginPage_spec.js'],
	  
	  
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
	
	list_pagination:'./specs/AddItem/list_pagination_spec.js',
	  
	AddByTable:'./specs/AddItem/AddItemByTable_spec.js',
	  
	AddBySearch:'./specs/AddItem/AddItemBySearch_spec.js',
	
	
	  

  
  /*-------------------My Orders --------------*/
  
	SearchAndReorder:'./specs/MyOrders/SearchAndReorder_spec.js',
	
	AdvanceSearchAndReorder:'./specs/MyOrders/MyOrder_specificSearch_spec.js',
	  
	MyOrdersVerificationByStatus:'./specs/MyOrders/MyOrdersTableSearch_spec.js',




	  /*-------------------Checkout Process which will select one time address --------------*/ 
	  
Checkout:'./specs/Checkout/Checkout_spec.js',

cancelAndContinueShopping:'./specs/Checkout/CancelAndContinueShopping_spec.js',

lineitems:'./specs/Checkout/lineItems_spec.js',
	  
	  
	  /*-------------------Address selection  chocie--------------*/
  
  MultipleAddress:'./specs/Address/MultipleAddress_spec.js',
  
  SelectASaveAddress:'./specs/Address/SelectASaveAddress_spec.js',
  
	AddAnAddress:'./specs/Address/AddAddress_spec.js',
	
	validationAddres:'./specs/Address/AddressValidation_spec.js',
	
	distributionlist:'./specs/Address/Address_Distribution_spec.js',
	  
	  
	  /*-------------------Profile --------------*/
	  
	profile:'./specs/MyProfile/MyProfile_spec.js',  //MyProfileValidation_spec.js
	
	profileValidation:'./specs/MyProfile/MyProfileValidation_spec.js',							

/*-------------------Change password --------------*/

changepassword:'./specs/ChanagePassword/ChangePassword_spec.js',
	 
	  
	  
	  /*-------------------log out--------------*/
	  
logout:'./specs/Logout/Logout_spec.js',
	  
	  
  },
  
  onPrepare: function () {
	  
	  browser.manage().window().maximize();
	  
	  browser.manage().timeouts().implicitlyWait(6000);
	  
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
	  },

  

 
// 
 /* onPrepare: function() {
    // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
       baseDirectory: 'Reports/screenshots'      }).getJasmine2Reporter());
 },*/
  
   
   
   
  
  
};