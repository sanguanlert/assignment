
var slideCollection = new App.SlideCollection();
slideCollection.fetch();

var slideShowView = new App.SlideShowView({model: slideCollection});
//slideShowView.render();
$('#health-info').append(slideShowView.$el);

slideCollection.on('update', function() {
    slideShowView.render();
});


