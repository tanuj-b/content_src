

//Config Variables

var SEPARATOR = '|:';

var config_mobile_android = {
	syncStoragePath : "",
	templatePath : "",
	serverUrl : 'http://localhost/nero/api/',
	edition : '0',
    editionName : 'mobile',
    tmplatesFolder : "tpl-mobile",
    phonegap : false,
    viewsArray : [  
                    'LandingView',
                    'MenuView',
                    'MainView'
                ]
};

var config_mobile_web = {
	syncStoragePath : "",
	templatePath : "",
	serverUrl : 'http://localhost/nero/api/',
	edition : '1',
    editionName : 'web',
    tmplatesFolder : "tpl-web",
    phonegap : false,
    viewsArray : [	
                  	'LandingView',
                  	'MenuView',
                  	'FlashCardListView',
    				'FlashCardListItemView',
    				'FlashCardView'
    			]
};

//var Config = config_mobile_android;	
var Config = config_mobile_android;	
    

