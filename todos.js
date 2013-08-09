$(function() {
		   //Model
	var Todo = Backbone.Model.extend({//单个任务
		defaults:function()  {
			return {title: "empty todo ......",//CONTENT
			order: Todos.nextOrder(),//ID
			done: false};//是否已完成
		},	
		toggle: function() {//完成转换
			this.save({done: !this.get("done")});	
		}
	});		 
	
	//Collection
	var TodoList = Backbone.Collection.extend({//任务列表
		model: Todo,
		localStorage: new Backbone.LocalStorage("todos-backbone"),
		done: function() {//完成的任务
			return this.where({done: true});
		},
		remaining: function() {//未完成的任务
			return this.where({done: false});
		},
		nextOrder: function() {//下一个ORDER
			if(!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: 'order'//以ORDER排序
	});
	
	var Todos = new TodoList;//new一个任务列表
	
	//View
	var TodoView = Backbone.View.extend({//单个任务视图
		tagName: "li",
		template: _.template($('#item-template').html()),//单个任务列表模板
		events: {//事件集
			"click .toggle": "toggleDone",
			"dblclick .view": "edit",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},
		initialize: function() {//初始化
			console.log(this.model);
			this.listenTo(this.model, "change", this.render);//他怎么知道this.model是谁的?因为line115
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function() {//负责页面渲染
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$(".edit");
			return this;
		},
		toggleDone: function() {//更改任务的Done
			this.model.toggle();
		},
		edit: function() {//编辑任务
			this.$el.addClass("editing");
			this.input.focus();
		},
		close: function() {//关闭编辑
			var value = this.input.val();
			if(!value) {
				this.clear();
			} else {
				this.model.save({thitle: value});
				this.$el.removeClass("editing");
			}
		},
		updateOnEnter: function(e) {//确认编辑
			if(e.keyCode == 13) this.close();
		},
		clear: function() {//清除任务
			this.model.destroy();	
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $("#todoapp"),	
		statsTemplate: _.template($("#stats-template").html()),
		events: {
			"keypress #new-todo": "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},
		initialize: function() {//初始化
			this.input = this.$("#new-todo")	;
			this.allCheckbox = this.$("#toggle-all")[0];
			this.listenTo(Todos, "add", this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'all', this.render);
			
			this.footer = this.$('footer');
			this.main = $('#main');
			
			Todos.fetch();
		},
		render: function() {//渲染
			var done = Todos.done().length;
			var remaining = Todos.remaining().length;
			
			if(Todos.length) {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
			} else {
				this.main.hide();
				this.footer.hide();
			}
			
			this.allCheckbox.checked = !remaining;
		},
		addOne: function(todo) {
			var view = new TodoView({model: todo});//这里将model传入啦
			this.$("#todo-list").append(view.render().el);
		},
		addAll: function() {
			Todos.each(this.addOne, this);
		},
		createOnEnter: function(e) {
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;
			
			Todos.create({title: this.input.val()});
			this.input.val('');
		},
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');
			return false;
		},
		toggleAllComplete: function() {
			var done = this.allCheckbox.checked;
			Todos.each(function(todo) {todo.save({'done': done});});
		}
	});
	
	var App = new AppView;
});