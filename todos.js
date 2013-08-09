$(function() {
		   //Model
	var Todo = Backbone.Model.extend({//��������
		defaults:function()  {
			return {title: "empty todo ......",//CONTENT
			order: Todos.nextOrder(),//ID
			done: false};//�Ƿ������
		},	
		toggle: function() {//���ת��
			this.save({done: !this.get("done")});	
		}
	});		 
	
	//Collection
	var TodoList = Backbone.Collection.extend({//�����б�
		model: Todo,
		localStorage: new Backbone.LocalStorage("todos-backbone"),
		done: function() {//��ɵ�����
			return this.where({done: true});
		},
		remaining: function() {//δ��ɵ�����
			return this.where({done: false});
		},
		nextOrder: function() {//��һ��ORDER
			if(!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: 'order'//��ORDER����
	});
	
	var Todos = new TodoList;//newһ�������б�
	
	//View
	var TodoView = Backbone.View.extend({//����������ͼ
		tagName: "li",
		template: _.template($('#item-template').html()),//���������б�ģ��
		events: {//�¼���
			"click .toggle": "toggleDone",
			"dblclick .view": "edit",
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEnter",
			"blur .edit": "close"
		},
		initialize: function() {//��ʼ��
			console.log(this.model);
			this.listenTo(this.model, "change", this.render);//����ô֪��this.model��˭��?��Ϊline115
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function() {//����ҳ����Ⱦ
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$(".edit");
			return this;
		},
		toggleDone: function() {//���������Done
			this.model.toggle();
		},
		edit: function() {//�༭����
			this.$el.addClass("editing");
			this.input.focus();
		},
		close: function() {//�رձ༭
			var value = this.input.val();
			if(!value) {
				this.clear();
			} else {
				this.model.save({thitle: value});
				this.$el.removeClass("editing");
			}
		},
		updateOnEnter: function(e) {//ȷ�ϱ༭
			if(e.keyCode == 13) this.close();
		},
		clear: function() {//�������
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
		initialize: function() {//��ʼ��
			this.input = this.$("#new-todo")	;
			this.allCheckbox = this.$("#toggle-all")[0];
			this.listenTo(Todos, "add", this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'all', this.render);
			
			this.footer = this.$('footer');
			this.main = $('#main');
			
			Todos.fetch();
		},
		render: function() {//��Ⱦ
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
			var view = new TodoView({model: todo});//���ｫmodel������
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