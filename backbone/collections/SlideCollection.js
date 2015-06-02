var App = App || {};

App.SlideCollection = Backbone.Collection.extend({
    url: App.SlidesUrl,
    sync : function(method, collection, options) {
        options.dataType = "jsonp";
        return Backbone.sync(method, collection, options);
    },
    initialize: function() {
        this.sort_type = 'default';
    },
    setSortType: function(value) {
        this.sort_type = value;
        if (value == 'alpha') {
            this.comparator = this.alphaSortComparator;
        }
        else {
            this.comparator = this.originalSortComparator;
        }
    },
    setPageTitle: function(pageTitle) {
        this.page_title = pageTitle;
    },
    setSummary: function(summary) {
        this.summary = summary;
    },
    parse: function(response) {
        var slides = response.data[0].slides;
        
        /*Assign an id for each slide object for sorting instead of cloning the entire slides object*/
        var index = 0;
        _.each(slides, function(slide) {
            
            /**/
            if(index == 0) {
                slide.pageTitle = response.data[0].title;
                slide.summary = response.data[0].summary;

            }
            slide.id = index++;
            
        })
        return slides;
    },
    originalSortComparator: function(a, b) {
        return a.id - b.id;
    },
    alphaSortComparator: function(a, b) {
        return a.get('title').toLowerCase() < b.get('title').toLowerCase() ? -1 : 1;
    }
});
