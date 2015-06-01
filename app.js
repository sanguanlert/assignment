/*I assume that page load mean all DOM is already load not all resources such as Image.*/
$( document ).ready(function() {
    
        $.ajax({
            type: 'POST',
                url: 'https://api2.healthline.com/api/service/2.0/slideshow/content?partnerId=7eef498c-f7fa-4f7c-81fd-b1cc53ac7ebc&contentid=17103&includeLang=en',
                dataType: "jsonp",
                success: function (response) {
                    
                    var data = response.data;
                    /*check if there is at least data*/
                    if(data && data.length > 0 && data[0])
                    {
                        item = data[0];
                         slideController.init(item);
                    }
                    else {
                        alert("there is no data");
                    }
                   },
                error: function (request, status, error) {

                    alert(error);
                }
            });
           
    
    var slideModel = {
         currentSlideId: 0,
         currentSlide: null,
         slides: [],
         defaultSlides: [],
         slideLength: 0,
         pageTitle: "",
         summary: "",
         
    
    };
    
    var slideController = {
        forward: true,
        init: function(item) {
            console.log(item);
            /*assign value from api*/
            slideModel.slides = item.slides;
            /*
                Cloning the original slide object for sorting by default.
            */
            slideModel.defaultSlides = $.extend([], item.slides);
            
            slideModel.slideLength = item.slides.length;
            slideModel.pageTitle = item.title;
            slideModel.summary = item.summary;
            
            pageView.init();
            slideListView.init();
            slideControlView.init();
            slideControlView.disablePrevSlide();
            
        },
        getPageTitle: function() {
        
            return slideModel.pageTitle;
        },
        getPageSummary: function() {
        
            return slideModel.summary;
        },
        getCurrentTwoSlides: function() {
            return this.getNextTwoSlices();
            
        },
        getNextTwoSlices: function()
        {
            
            var start = slideModel.currentSlideId;
            currentTwoSlides = slideModel.slides.slice(start, start + 2);
           
           
            /*hide seconde slide forward*/
          /*  $.each(currentTwoSlides, function(index, slide){
               slide.display = (index == 0);
            });*/
            
            
            return currentTwoSlides;
        
        },
        setCurrentSlide: function(slide) {
            slideModel.currentSlide = slide;
        },
        
        getCurrentSlide: function() {
            return slideModel.currentSlide;
        
        },
        getCurrentSlideId: function() {
            return slideModel.currentSlideId;
        
        },
        setCurrentSlideId: function(currentSlideId) {
            slideModel.currentSlideId = currentSlideId;
        },
        loadNextTwoSlides: function() {
            slideListView.render();
            if(slideModel.currentSlideId >= slideModel.slideLength -1)
                slideControlView.disableNextSlide();
            
            if(slideModel.currentSlideId == 0)
                slideControlView.disablePrevSlide();
           
        },
        loadPrevSlide: function() {
            
            slideListView.render();
            
            if(slideModel.currentSlideId == 0)
              slideControlView.disablePrevSlide();
        },
        nextSlides: function()
        {
            this.forward = true;
            slideControlView.nextSlides();
            slideModel.currentSlideId++;
           
        },
         prevSlides: function()
        {
            
            this.forward = false;
            slideControlView.prevSlides();
            slideModel.currentSlideId--;
           
        },
        sortBy: function(sortBy)
        {
            if(sortBy == "alpha") {
                
                slideModel.slides.sort(function(s1, s2){
                    return s1.title.toLowerCase() < s2.title.toLowerCase() ? -1 : 1;
                });
            }
            else 
                slideModel.slides = $.extend([], slideModel.defaultSlides);
            
            this.setCurrentSlideId(0);
            slideControlView.reset();
            slideListView.init();
            slideControlView.init();
            slideControlView.disablePrevSlide();
            slideView.init();
            
            this.forward = true;
           /* $.each(slideModel.slides, function(index, slide){
                console.log(slide.title);
            })*/
        }   
    
    };
    
    var pageView = {
        init: function() {
            this.pageTitleElem = $('#health-info #title');
            this.pageSummryElem = $('#health-info #summary');
            this.render();
        },
        render: function() {
            this.pageTitleElem.html(slideController.getPageTitle());
            this.pageSummryElem.html(slideController.getPageSummary());
        }
        
    };
    /*slide view*/
    var slideView = {
        init: function(){
          this.wrapperElem = $('.slide-template');
          this.titleElem = $('.slide-template .slide-title');
          this.bodyElem = $('.slide-template .slide-body');
          this.imageElem  = $('.slide-template .slide-img');
          
        },
        
        render: function() {
            var currentSlide = slideController.getCurrentSlide();
            this.titleElem.text(currentSlide.title);
            this.bodyElem.html(currentSlide.body);
            this.imageElem.attr("src", "http://www.healthline.com/" +currentSlide.image.imageUrl);
            
            return this.wrapperElem.children().clone();          
        }
    
    }
    
    var slideListView = {
        init: function(){
            this.slideListElem = $('.slides');
            slideView.init();
            this.render();
        },
        
        render: function() {
            /*reset ul*/
            this.slideListElem.empty();
            var slides = slideController.getCurrentTwoSlides();
            
            for (i = 0; i < slides.length; i++) {
                var slide = slides[i];
                slideController.setCurrentSlide(slide); 
                var $newLiElem = $('<li>');
                $newLiElem.html(slideView.render());
                this.slideListElem.append($newLiElem);
            }
        }
    
    }
    
    var slideControlView = {
    
        init: function() {
            this.nextSlideElem = $('#next-slide');
            
            this.nextSlideElem.on("click", function(){
                slideController.nextSlides();
            
            });
            this.prevSlideElem = $('#prev-slide');
            this.prevSlideElem.on("click", function(){

                slideController.prevSlides();
            
            });
            this.sortControlElem = $('#sort-contorl input:radio');
            this.sortControlElem.change(function() {
                slideController.sortBy(this.value);
            });
                                  
        },
        slideAction: function(isNext, actionElem, resetElem, direction){
            actionElem.find("img").remove();
            var newImg = $("<img>").attr({
                "src": "http://www.healthline.com/images/clear.gif",
                "height": "1px",
                "width": "1px",
                "class": "tracking"
                
            }); 
            
            actionElem.append(newImg);
            
           if(resetElem.hasClass("disable"))
            {
                this.bindActionSlide(isNext, resetElem);
            }
            
            $('.slides li').each(function(index, li) {
                 $(li).animate(
                    direction,
                    {
                        complete: function(){
                           if(index == 0) {
                             slideController.loadNextTwoSlides();
                           }
                        }
                    }
                );
               
            });
        
        }, 
        nextSlides: function() {
        
            var direction =  {right  : '600px'};
            this.slideAction(true, this.nextSlideElem, this.prevSlideElem, direction);
        
        },
        
        prevSlides: function() {
            
            var direction =  {left  : '600px'};
            this.slideAction(false, this.prevSlideElem, this.nextSlideElem, direction);
        
        },
        bindActionSlide: function(isNext, resetElem) {
            resetElem.removeClass("disable").attr('disabled', false).on("click", function(){
                if(isNext)
                    slideController.prevSlides();
                else
                    slideController.nextSlides();
            });
        
        },
        disableNextSlide: function(){
            this.nextSlideElem.off("click").addClass('disable').attr('disabled', true);
          
        },
        disablePrevSlide: function(){
            this.prevSlideElem.off("click").addClass('disable').attr('disabled', true);
          
        },
        reset: function()
        {
            this.nextSlideElem.unbind("click");
            this.prevSlideElem.unbind("click");
        }
    }
                    
});
