var App = App || {};

App.SlideView = Backbone.View.extend({
    tagName: 'li',
    /*Don't like carousel when clicking a previous, so using image */
    toggle: function(isShow) {
        if (isShow)
            this.$el.removeClass('hide');
        else
            this.$el.addClass('hide');
    },
    loadImage: function() {
       this.$el.find('[load-src]').each(function(element) {
           $(this).attr('src', $(this).attr('load-src'))
       })
    },
    render: function() {
        var templateHtml = $('#slide-template').html();
        var template = Handlebars.compile(templateHtml);

        var html = template(this.model.attributes);
        this.$el.html(html);
    }
})