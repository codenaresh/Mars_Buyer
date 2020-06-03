
var fs =  require('fs-extra');

var  excelToJson = require('convert-excel-to-json');


var result = excelToJson({
	
    sourceFile: './TestCase.xlsx',
    
    header:{
    	
    	rows:1
    }
});



console.log("xcel output :", result);

console.log("application_QA :", result.LoginCrenditial[0].B);

console.log("application_Stagging :", result.LoginCrenditial[0].C);

console.log("application_dev :", result.LoginCrenditial[0].D);

console.log("application_prod :", result.LoginCrenditial[0].E);



console.log("username gamil :", result.LoginCrenditial[1].B);

console.log("password gamil :", result.LoginCrenditial[2].B);


console.log("username youtube :", result.LoginCrenditial[1].C);

console.log("password youtube :", result.LoginCrenditial[2].C);


console.log("username FB :", result.LoginCrenditial[1].D);

console.log("password FB :", result.LoginCrenditial[2].D);


console.log("username Yahoo :", result.LoginCrenditial[1].E);

console.log("password Yahoo :", result.LoginCrenditial[2].E);


console.log("test 1",result.Smoke[0].F);

console.log("test 2",result.Smoke[1].F);


var datarequired= function(){
	
	
	this.testconfig={
			
			
			application_QA:	 result.LoginCrenditial[0].B,
			
			application_Stagging:result.LoginCrenditial[0].C,
			
			application_dev:result.LoginCrenditial[0].D,
			
			application_prod:result.LoginCrenditial[0].E,
			
			
			
			username_gamil:result.LoginCrenditial[1].B,
			
			password_gamil : result.LoginCrenditial[2].B,
			
			
			username_youtube :result.LoginCrenditial[1].C,
			
			password_youtube :result.LoginCrenditial[2].C,
			
			
			
			
	};
	

	this.smoketest={
			
			
			test1:result.Smoke[0].F,
			test2:result.Smoke[1].F,
			test3:result.Smoke[2].F,
			test4:result.Smoke[3].F,
		
	
			
	};
	
};


module.exports= new datarequired();



