var AppRouter = Backbone.Router.extend({

    routes: {
        "": "landing",
        "menu": "menu",
        "main": "main",
        "flashcards": "flashcardlist",
        "flashcards/:id": "flashcards",
    },
    
    sync: function(){
        sync.setUserId(1); //get actual account id and set it
        //other sync functions here
     },

    initialize: function () {
        /*
         * To be replaced by sync. this is just for the demo
         */
        localStorage.clear(); //remove this line in final product.
        
    },
    
    landing: function () {
        this.firstPage = true;
        this.changePage(new LandingView());
        return;
    },

    menu: function () {
        this.changePage(new MenuView());
    },

    main: function () {
        var currentMainView = new MainView();
        this.changePage(currentMainView);

        Reveal.initialize({
        controls: true,
        progress: true,
        history: false,
        keyboard: true,
        mouseWheel : false,
        
        theme: 'simple', // available themes are in /css/theme
        transition: 'linear', // default/cube/page/concave/linear(2d)

        // Optional libraries used to extend on reveal.js
        dependencies: [{ src: 'js/lib/classList.js', condition: function() { return !document.body.classList; } }]
  
      });

    while(currentMainView.scripts.length > 0)
    {
        eval(currentMainView.scripts.pop());
    }
    
    Reveal.addEventListener( 'fragmentshown', function( event ) {
                        currentMainView.currentFragment = $(event.fragment).attr("id");
                    }
                 );

    Reveal.addEventListener( 'slidechanged', function( event ) {
        pgno = event.indexh+1;
        currentMainView.currentFragment = $(".slides").find("section[pgno="+pgno+"] :first-child").attr("id");
    } );
    },
    
    flashcardlist: function () {
        var context = this;
        flashCardLists.fetch({
            success: function () {
                console.log('flash cards fetched');
                context.changePage(new FlashCardListView({
                    model: flashCardLists
                }));
            }
        });
    },

    flashcards: function (id) {
        var context = this;
        var currentFlashCardList = flashCardLists.get(id);
        flashCardIDs = currentFlashCardList.get("wordIds").split("|:");

        currentFlashCards = new FlashCardCollection();

        _.each(flashCardIDs, function (id) {
            currentFlashCards.add({
                id: id
            });

        });

        //This is where flashCards are being fetched and stored into a Collection.
        //I have added a model with just id attribute set. I am running model.fetch() on each item in collection.
        //The first fetch loads them and saves them
        //creating a deferred variable and chaining them for calling final success callback

        var successCounter = 0,
            dfd = [];
        currentFlashCards.forEach(

        function (item) {
            dfd[successCounter] = item.fetch({
                add: true
            });
            successCounter++;
        });
        $.when.apply(this, dfd).then(function () {
            currentFlashCardList.set("currentFlashCard", 1);
            activeFlashCardView = new FlashCardView({
                flashCardList: currentFlashCardList,
                flashCards: currentFlashCards
            });
            context.changePage(activeFlashCardView);
            activeFlashCardView.showCard(1);

            //This following function should ideally bind to views events.
            /*$("input[type='radio']").click(function(){
			if($(this).hasClass("on")){
       			$(this).removeAttr('checked');
    		}
    		$(this).toggleClass("on");
    	}).filter(":checked").addClass("on");*/
        });

        //Make provisions for failure
    },

    showView: function (selector, view) {
        if (this.currentView) this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    },

    changePage: function (page) {
        //note change in code here.
        page.render();
        $(page.el).attr('data-role', 'page');
        $('body').append($(page.el));
        $(page.el).page();
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {
            transition: 'none'
        });
      }
});