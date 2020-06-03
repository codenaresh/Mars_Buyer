
 
var BasePage;

BasePage = function() {
	
	
	this.sleep= function(timeInSeconds){
		
		return browser.sleep(1000 * timeInSeconds);
		
	};
	
	// tabledata
	
	this.tabledataval= function(){
		
		var tabledata = element.all(by.css("./table"));

		// get rows 
		var rows = tabledata.all(by.tagName("tr"));

		// get cell values
		var cells = rows.all(by.tagName("td"));

		expect(cells.get(0).getText()).toEqual("something");
		expect(cells.get(1).getText()).toEqual("something");
		expect(cells.get(2).getText()).toEqual("something")	;
		
	};
	
	// veriy header text of table
	
	this.headervale= function(){
		
		var row = element.all(by.repeater('item in items.list')).first();
		var cells = row.all(by.tagName('td'));

		var cellTexts = cells.map(function (elm) {
		    return elm.getText();
		});
		//Then, you can assert it to be an array of column texts:

		expect(cellTexts).toEqual(["The first text", "The second text", "The third text"]);
		
		
	};
	
	//mouse move on a element
	   this.mouseMove = function (element) {
	        if (typeof element !== 'undefined') {
	            element.isDisplayed().then(function () {
	                browser.actions().mouseMove(element).perform();
	                return this;
	            });
	        }
	    };
	    
	    
	    //mouse up on a element
	    this.mouseUp = function (element) {
	        if (typeof element !== 'undefined') {
	            element.isDisplayed().then(function () {
	                browser.actions().mouseUp(element).perform();
	                return this;
	            });
	        }
	    };
	    
	    //mouse down on a element
	    this.mouseDown = function (element) {
	        if (typeof element !== 'undefined') {
	            element.isDisplayed().then(function () {
	                browser.actions().mouseDown(element).perform();
	                return this;
	            }).catch(function(err){
	            	
	            	console.log("Error is :"+err);
	            	
	            	//throw err;
	            	
	            	
	            });
	        }
	    };
	    
	    
	  //click on an element
	    this.click = function (element) {
	        if (typeof element !== 'undefined') {
	            element.isDisplayed().then(function () {
	                element.isEnabled().then(function () {
	                    element.click();
	                    return this;
	                });
	            }).catch(function(err){
	            	
	            	console.log("Error is :"+err);
	            	
	            	//throw err;
	            	
	            	
	            });
	        }
	    };
	
	
	
	  //select a value from dropdown
	    this.select = function (element, value) {
	        if (typeof element !== 'undefined') {
	            element.isDisplayed().then(function () {
	                element.isEnabled().then(function () {
	                    if (typeof value !== 'undefined') {
	                        element.$('[label="' + value + '"]').click();
	                    }
	                    return this;
	                });
	            });
	        }
	    };
	
	
	
	
	//verify checkbox is checked
    this.isCheckboxChecked = function (element) {
        if (typeof element !== 'undefined') {
            element.isDisplayed().then(function () {
                element.isEnabled().then(function () {
                    element.isSelected().then(function () {
                        return this;
                    });
                });
            });
        }
    };
    
    
    
  //verify radio button is selected
    this.isRadioButtonSelected = function (element) {
        if (typeof element !== 'undefined') {
            element.isDisplayed().then(function () {
                element.isEnabled().then(function () {
                    element.isSelected().then(function () {
                        return this;
                    });
                });
            });
        }
    };

    
    //wait till specified time
    this.wait = function (value) {
        browser.sleep(value | 2000);
    };
    
    
  //wait for element is displayed
    this.waitForElementIsDisplayed = function (element) {
        if (typeof element !== 'undefined') {
            browser.wait(function () {
                return element.isDisplayed();
            }, waitTimeout | 60000);
        }
    };
    
    this.waitForElementIsNotDisplayed = function (element) {
        if (typeof element !== 'undefined') {
            browser.wait(function () {
                return !element.isDisplayed();
            }, waitTimeout | 60000);
        }
    };
    
    
  //type a value in input box
    this.type = function (element, value) {
        if (typeof element !== 'undefined') {
            element.isDisplayed().then(function () {
                element.isEnabled().then(function () {
                    element.clear();
                    if (typeof value !== 'undefined') {
                        element.sendKeys(value);
                    }
                    return this;
                });
            }).catch(function(err){
            	
            	console.log("Error is :"+err);
            	
            	//throw err;
            	
            	
            });
        }
    };
    
    
    //type a value in input box and press enter key
    this.typeAndEnter = function (element, value) {
        if (typeof element !== 'undefined') {
            element.isDisplayed().then(function () {
                element.isEnabled().then(function () {
                    element.clear();
                    if (typeof value !== 'undefined') {
                        element.sendKeys(value + '\13');
                    }
                    return this;
                });
            });
        }
    };
    
  //verify a value in input box
    this.verifyValue = function (element, value) {
        if (typeof element !== 'undefined') {
            element.isDisplayed().then(function () {
                element.isEnabled().then(function () {
                    if (typeof value !== 'undefined') {
                        actualValue=element.getAttribute('value').toEqual(value);
                    }
                    return actualValue;
                });
            });
        }
    };




	
	this.clickonfirstHighlightItem= function(){
		
		var firsthighlightitem=element(by.xpath("//div[1]/div[1]/ngb-typeahead-window[1]/button[1]/ngb-highlight[1]"));
		
		page.highlightElement(firsthighlightitem);
		
		firsthighlightitem.click();
		
		
	};
	
	
	
	this.visiblitelement= function(element){
		
		var EC = protractor.ExpectedConditions;
	    
		var elementvisible = EC.visibilityOf(element);
		
		browser.wait(elementvisible,5000, "waiting for element to be visible");
		
		
		
	};
	
	
this.clickableOfelement= function(element){
		
		var EC = protractor.ExpectedConditions;
	    
		var elemenclickable = EC.elementToBeClickable(element);
		
		browser.wait(elementvisible,5000, "waiting for element to be visible");
		
		
		
	};
	
	
	this.alertispresent= function(){
		
     var EC = protractor.ExpectedConditions;
	    
		var alertpresent = EC.alertIsPresent();
		
		browser.wait(alertpresent,5000, "waiting for alert to be visible");
		
		
	};
	
	
	this.elementselection= function(element){
		
	     var EC = protractor.ExpectedConditions;
		    
			var elementselect = EC.elementToBeSelected(element);
			
			browser.wait(elementselect,5000, "waiting for alert to be visible");
			
			
		};
	
	
	
	
	
	this.selectDropdownbyNum = function ( element, optionNum ) {
		  if (optionNum){
		    var options = element.all(by.tagName('option'))   
		      .then(function(options){
		        options[optionNum].click();
		      });
		  }
		};
	
	
	this.element= function(ele){
		
		return ele;
		
	};


	

	this.logOut = function(xpath) {

		element(by.xpath(xpath)).click();

		
	};

			this.uploadfile = function(fileToUpload, value, absolutePath) {
		
				absolutePath = path.resolve(__dirname, fileToUpload);
		
				element(by.css('input[type="file"]')).sendKeys(absolutePath);
		
				element(by.xpath(value)).click();

	};
	this.getPageTitle = function() {

		return browser.getTitle();

	};

	this.refreshThePage = function() {

		browser.executeScript("history.go(0)");

	};

	this.ScrollTheViewElementAndClick = function(element) {

		browser.executeScript("arguments[0].scrollIntoView();", element);

	};
	this.highlightElement = function(el) {

		console.log("highlight--");

		console.log("locator---:" + el.locator());

		return browser.driver.executeScript(
				"arguments[0].setAttribute('style', arguments[1]);",
				el.getWebElement(), "color: Red; border: 2px solid red;").then(
				function(resp) {
					browser.sleep(2000);
					return el;
				}, function(err) {
					console.log("error is :" + err);
				});
	};
	
	

	
	
	
	this.currentdate= function(){
		
		var today = new Date();
		
		var dd = today.getDate();
		
		var mm = today.getMonth()+1; //January is 0!
		
		var yyyy = today.getFullYear();

	     return mm+'/'+dd+'/'+yyyy;
	     
		};
	
	
	// code to verify status code
	
	this.httpget= function(siteUrl){
		
		      var http = require('http');
		
			  var defer = protractor.promise.defer();

			  http.get(siteUrl, function(response) {

			      var bodyString = '';

			      response.setEncoding('utf8');

			      response.on("data", function(chunk) {
			          bodyString += chunk;
			      });

			      response.on('end', function() {
			          defer.fulfill({
			              statusCode: response.statusCode,
			              bodyString: bodyString
			          });
			      });

			  }).on('error', function(e) {
			      defer.reject("Got http.get error: " + e.message);
			  });

			  return defer.promise;
			}
		




};

module.exports = new BasePage();