myTodos
=======

Backbone example
1,Model------'toJSON' method:read or clone all of a model’s data attributes

2,Model------maybe 'on' method:'change' is useful but 'change: what' can not

3,Model---View: model can be given to a view such as'var view = new TodoView({model: todo})' in Todos example

4,View-------'render' method:can be bound to a model's change() event to up-to-data always

5,View-------template use: 1,template:_.template(```) 2,$el.html(this.template(this.model.toJSON()))

6,Model------cid :Backbone automatically assigns models

7,Model------when 'save, destory, fetch' begin,'Backbone.sync' method happen-----$.ajax()

8,Backbone.sync--------var methodMap = {
                                       'create': 'POST',
                                       'update': 'put',
                                       'delete': 'DELETE',
                                       'read': 'GET'
                                        };
                                        
9,Collection-------'reset' method allows us to update an entire collection at once

10,Router--------mostly only need single Router,the author said

11,Router--------can use method 'navigate' to change URL

12,in the url '#' is to 'id/name' in this page
