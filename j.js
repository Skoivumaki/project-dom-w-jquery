$("#discordid").on("focus", function(){
    $("#first").fadeOut(3000);
    $("#first").fadeIn(3000);
});

let todoItems = [];

function renderTodo(todo) {
  localStorage.setItem('todoItems', JSON.stringify(todoItems));

  const list = $('.js-todo-list');
  const item = $(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.html('');
    return;
  }

  const isChecked = todo.checked ? 'done' : '';
  const node = $(document.createElement("li"))
    .addClass(`todo-item ${isChecked}`)
    .attr('data-key', todo.id)
    .html(`
      <input id="${todo.id}" type="checkbox"/>
      <label for="${todo.id}" class="tick js-tick"></label>
      <span>${todo.text}</span>
      <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
      </button>
    `);

  if (item.length) {
    item.replaceWith(node);
  } else {
    list.append(node);
  }
}

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

function toggleDone(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}

$(document).ready(function() {
  const form = $('.js-form');
  form.on('submit', function(event) {
    event.preventDefault();
    const input = $('.js-todo-input');

    const text = input.val().trim();
    if (text === '') {
      alert("Input was empty");
      $('#discordid').css('border-color', 'red');
    } else {
      addTodo(text);
      input.val('');
      input.focus();
      $('#discordid').css('border-color', '');
    }
  });

  const list = $('.js-todo-list');
  list.on('click', '.js-tick', function(event) {
    const itemKey = $(this).parent().data('key');
    toggleDone(itemKey);
  });

  list.on('click', '.js-delete-todo', function(event) {
    const itemKey = $(this).parent().data('key');
    deleteTodo(itemKey);
  });

  const ref = localStorage.getItem('todoItems');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});
