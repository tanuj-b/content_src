window.MainView = Backbone.View.extend({

	topicData : null,
	FileName : null,
	TOC: null,

	initialize : function() {
		// this.render();
	},

	events : {

	},

	onDOMLoaded : function () {
		this.loadModalBox();
	},

	loadDataFile: function(loadFileName){
		if(!loadFileName)
		 	loadFileName = this.FileName;
		var context = this;
		//Do this thorugh PhoneGap API in mobiles??
		//add error in file load code

		$.ajax({
                        type: "GET",
                        dataType: "html",
                        url: Config.assetPath+Config.tmplatesFolder+'/'+loadFileName+'.xml',
                        async: false,
                    }).done(function (data) {
						context.topicData = data;
						context.FileName = loadFileName;
						context.TOC = context.buildTOC(data);
						console.log(context.TOC);
						console.log(context.renderTOC(context.TOC,"",1));
                    });
	},

	buildTOC : function(data)
	{
		var context = this,
			subTopics = $(data).children("topic"),
			result = {};

		if(subTopics.length!==0)
			_.each(subTopics,function(item){
				result[$(item).attr('id')] = {title: $(item).attr('title'), description: $(item).attr('description') , subTopics: context.buildTOC(item)};
			});
		else
			return null;
		return result;
	},

	loadModalBox : function(){
		
		
	    
	    $('div[data-role="dialog"]').live('pagebeforeshow', function(e, ui) {
		ui.prevPage.addClass("ui-dialog-background "); // will need to change to whatever.
		});

	    $('div[data-role="dialog"]').live('pagehide', function(e, ui) {
		$(".ui-dialog-background ").removeClass("ui-dialog-background ");
		});

		$(document).delegate('#opendialog', 'click', function() {
			  // NOTE: The selector can be whatever you like, so long as it is an HTML element.
			  //       If you prefer, it can be a member of the current page, or an anonymous div
			  //       like shown.
	  		$('<div>').simpledialog2({
			    mode: 'blank',
			    headerText: 'Some Stuff',
			    headerClose: true,
			    blankContent : 
			      "<ul data-role='listview'><li>Some</li><li>List</li><li>Items</li></ul>"+
			      // NOTE: the use of rel="close" causes this button to close the dialog.
			      "<a rel='close' data-role='button' href='#'>Close</a>"

			    		/* //or use inline content
				<div id="inlinecontent" style="display:none" 
			  	data-options='{"mode":"blank","headerText":"Yo","headerClose":true,"blankContent":true}'>
				<ul data-role='listview'><li>Some</li><li>List</li><li>Items</li></ul>
			    <a rel='close' data-role='button' href='#'>Close</a>
				</div>
				*/
			  });
			});
	},

	loadTopic: function(loadFileName, topicID){
		var context = this;
		if(!context.topicData||loadFileName==context.FileName)
		{
			context.loadDataFile(loadFileName); //add error checking here
		}
		return $(context.topicData).children('topic[id="'+topicID+'"]');
	},

	parseIntoSections: function(topicRawData, targetSelector, maxHeight){

		var contentBox = $(targetSelector);
		//targetSelector should default to .slides


/***************** 
					BEGIN JUGAAD : How to load and execute scripts when needed?
					Currently adding scripts along with other data in a <scipt> tag maybe should switch to .js file? I don't know how that helps
******************/
		//var script = $(topicRawData)[0].innerHTML.match(new RegExp("<scipt[^>]*>[^<]*</scipt>","g")); //or jquery selector for scipt?
		var scripts = $(topicRawData).find("scipt");

	    if (scripts != null)
	    {
	    	_.each(scripts,function(item){
	    		if($(item).attr("src"))
	    		{
	    			//has a src attribute. load js file?
	    		}
	    		else
	    		{
	        	eval(item.innerHTML); //Run Javascript. Security?
	        	$(item).remove(); ///But these tags won't just disappear.
	        	}
	    	});
	        
	    }
	    
/***************** 
				END JUGAAD: 
*****************/

		var fragments = $(topicRawData).find(".fragment");
		
	    var newSection = $('<section>');
	    contentBox.empty().append(newSection);
	    var sectionHTML = null;
	    for(var i = 0; i < fragments.length; i++) {
	       
	        if($(fragments[i]).attr("pagebreak"))
	        {
	        	//assuming that the pagebreak element has nothing else in it.
	        	if(sectionHTML)
	        	{
	        		newSection.html(sectionHTML);
	        		newSection.clone().insertBefore(newSection);
	        		//code to empty new clone of all classes
	        		newSection.attr('class', "");
		            sectionHTML = null;
		        }
		            continue;
	        }
	     	
	     	//check if fragment is type widget

	     	if($(fragments[i]).attr("ps-widget"))
	     	{
	     		//Scripts already been loaded
	     		//Get config
	     		var widgetConfig = widgetConfig = {
					type: $(fragments[i]).attr("ps-widget"),
					minHeight: $(fragments[i]).attr("ps-min-h"),
					maxHeight: $(fragments[i]).attr("ps-max-h"),
					minWidth: $(fragments[i]).attr("ps-min-w"),
					maxWidth: $(fragments[i]).attr("ps-max-w"),
					eventCaller: $(fragments[i]).attr("id")
				};
	     		//add classes
	     		newSection.addClass(widgetConfig.eventCaller);

	     		//
	     	}
		        var enhancedSection = (sectionHTML? sectionHTML : "")+ window.helper.completeHTML(fragments[i]);
		        //better method to laod html needed. Or assume always fragment, and load other way.
		        newSection.html(enhancedSection);

		        if(newSection.height() > maxHeight) {
		        	if(sectionHTML)
		            	{newSection.html(sectionHTML);}
		            newSection.clone().insertBefore(newSection);
		            newSection.attr('class', ""); //remove all classes
		            sectionHTML = null;
		            i--;
		        } else {
		            sectionHTML = enhancedSection;             
		        }
	    }

	    //make first fragments of all sections not fragments
	    $(contentBox).find("section .fragment:first-child").removeClass("fragment");
	    return contentBox.html();   
	},

	renderTOC: function(TOCData,index,level){
		var context=this;
		var result = null;
		var i=1;
		if(!TOCData)
			return null;

		$.each(TOCData,function(key,value)
		{
			result = (result ? result : ("")) + "<li><a href='#' id='"+key+"'><span class='TOC_title_l"+level+"'>"+index+"."+i+"]"+value.title+"</span>"
							+ "<span class='TOC_desc_l"+level+"'>"+value.description+ "</span></a>"
							+ (context.renderTOC(value.subTopics,index+"."+i,level+1)? context.renderTOC(value.subTopics,index+"."+i,level+1) : "") + "</li>";
			i++;
		})
		if(result)
			result = "<ul class='TOC_l"+level+"'>" + result + "</ul>";

		return result;
	},

	render : function() {
		
		var context = this;
		var topicToDisplayData = context.loadTopic("sample_data_2","1");
		context.renderTemp();
		
		var slides = context.parseIntoSections(topicToDisplayData,$(this.el).find(".slides"),window.heightForContent);

		//should not be window height but some other number?
		$(this.el).html(this.template({slides: slides}));
		return this;
	},

	renderTemp : function(){
		var context = this;
		var temp = "<section>Loading Slides</section>";
		$(context.el).html(context.template({slides: temp}));
		$(context.el).attr('data-role', 'page');
        $('body').append($(context.el));
        $(context.el).page();
        var transition = $.mobile.defaultPageTransition;
        $.mobile.changePage($(context.el), {
            transition: 'none'
        });
		return this;
	}
});