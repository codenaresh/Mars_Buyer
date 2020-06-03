
var  excelToJson = require('./ReadExcelToJson.js');



exports.config = {
		
  framework: 'jasmine',
  
 // seleniumArgs: ['-Dwebdriver.ie.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer3.14.0.exe'],
 directConnect: true,
 

  
allScriptsTimeout:20000,
  
  jasmineNodeOpts: {
	  
	  showColors:true,
	  
	  defaultTimeoutInterval: 25000},
  
 
  
  //specs: ['./specs/ImpersonateUser/findUser_spec.js'],
  
  
 

  onPrepare: function() {
	  
	  browser.manage().window().maximize();
	  
	  
	 // browser.get(excelToJson.testconfig.application_QA);
	 
	 // console.log("QA urls is:"+excelToJson.testconfig.application_QA);
      
   },
   
   suites:{
	   
	   TC001:['./specs/LoginPage/LoginPage_spec.js','./specs/Logout/Logout_spec.js'],
	   TC002:['./rough/testdemo.js'],
	   TC003:['./rough/testdemo.js'],
	   TC004:['./rough/testdemo.js'],
	   TC005:['./rough/testdemo.js'],
	   TC006:['./rough/testdemo.js'],
	   
	   
   },
   
   
   
   
  
  
};