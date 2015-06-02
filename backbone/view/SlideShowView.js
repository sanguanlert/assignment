var App = App || {};

App.SlideShowView = Backbone.View.extend({
    events: {
        'click #prev-slide': 'onPrev',
        'click #next-slide': 'onNext',
        'click #sort-control input[name=sort]': 'onSort'
    },
    onSort: function(element) {
        var value = $(element.target).val();
        this.model.setSortType(value);
        this.model.sort();
        this.render();
    },
    onNext: function() {
        if (this.slideIndex < this.slideViews.length) {
            this.viewSlide(++this.slideIndex);
        }
        else {
            this.$el.find('#next-slide').addClass('disable').attr('disabled', true);
        }

    },
    onPrev: function() {
        if (this.slideIndex > 0) {
            this.viewSlide(--this.slideIndex);
        }
    },
    refreshButton: function() {
        if (this.slideIndex == 0) 
            this.$el.find('#prev-slide').addClass('disable').attr('disabled', true);
        else 
            this.$el.find('#prev-slide').removeClass('disable').attr('disabled', false);
        

        if (this.slideIndex == this.slideViews.length - 1) 
            this.$el.find('#next-slide').addClass('disable').attr('disabled', true);
        else 
            this.$el.find('#next-slide').removeClass('disable').attr('disabled', false);
        
    },
    viewSlide: function(index) {
        for (var i = 0; i < this.slideViews.length; i++) {
            var shouldToggle = i == index;
            this.slideViews[i].toggle(shouldToggle)

            var shouldLoadImage = i == index || i == index + 1;
            if (shouldLoadImage ) {
                this.slideViews[i].loadImage();
            }
        }

        // Load the image


        this.slideIndex = index;
        this.refreshButton();
    },
    fetchOnlyTwo: function() {
        var twoSlidesArray = [];
        if (this.model.length > 0) {
           // console.log(this.model);
            _.find(this.model, function(){
              //  console.log(this.mode);
            });
        }
    },
    render: function() {
        var templateHtml = $('#slideshow-template').html();
        var template = Handlebars.compile(templateHtml);
        var page_title = "";
        var summary = "";
        
        if(this.model.at(0)) {
             page_title = this.model.at(0).get("title");
             summary = this.model.at(0).get("summary");
        }
        
        var html = template({
            is_alpha: this.model.sort_type == 'alpha',
            is_default: this.model.sort_type == 'default',
            summary: summary,
            page_title: page_title
            
        });
        this.$el.html(html);
        
        this.fetchOnlyTwo();
        
        this.slideViews = [];
        if (this.model.length > 0) {
            var that = this;
            
            this.model.each(function(model) {
                var slideView = new App.SlideView({model: model});
               // console.log(model);
                slideView.render();
                
                that.slideViews.push(slideView);
                that.$el.find('.slides').append(slideView.$el);
            })

            this.viewSlide(0);
        }
    }
})