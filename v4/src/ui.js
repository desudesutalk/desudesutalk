var app = app || {};

app.Contact = Backbone.Model.extend({
    defaults: {
        key: '',
        keyHash: '',
        name: '',
        enabled: true,
        groups: '',
        adedd: 0,
        lastSeen: 0
    }
});

var AddressBook = Backbone.Collection.extend({
    model: app.Contact
});

app.AddressBook = new AddressBook();

app.AppView = Backbone.View.extend({
    el: '#appView',
    initialize: function() {
        this.listenTo(app.AddressBook, 'add', this.addOne);
        this.listenTo(app.AddressBook, 'reset', this.addAll);
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
        var view = new app.ContactView({
            model: todo
        });
        $('#thread').append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.$('#thread').empty();
        app.AddressBook.each(this.addOne, this);
    }

});


// The DOM element for a todo item...
app.ContactView = Backbone.View.extend({

    //... is a list tag.
    tagName: 'div',

    // Cache the template function for a single item.
    template: _.template('<div class="view"><h3><%= key %></h3><p><%= adedd %></p></div>'),

/*    // The DOM events specific to an item.
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },
*/
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    // Re-renders the titles of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});


$(function() {
    // Kick things off by creating the **App**.
    new app.AppView();
});
