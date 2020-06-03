
var HtmlReporter = require('protractor-beautiful-reporter');

exports.config = {
		
  framework: 'jasmine',
  
 directConnect: true,
 
 capabilities: {
     'browserName': 'chrome',
     'chromeOptions': {
         'args': ['--no-sandbox', '--disable-web-security', '--window-size=1920,1080', '--start-maximized'],
         prefs: {
             download: {
                 'prompt_for_download': false,
                 'directory_upgrade': true,
                 'default_directory': './tmp'
             }
         }
     }
 },
 

  

  
 
//getPageTimeout: 180000,

maxSessions: 1,
 
jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    showColors: true
},
  

  
  specs: ['./demotest.js'],
   
  onPrepare: function() {
	  
	  browser.driver.manage().window().setSize(1920, 1080);
      // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
      jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'Reports_DataProvider/screenshots'
      }).getJasmine2Reporter());
   },
   
   
   
   
  
  
};