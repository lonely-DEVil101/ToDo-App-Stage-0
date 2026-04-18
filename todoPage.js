let editingCard = null;
const addTask = document.getElementById("add-new-task");
const closeDialog = document.getElementById("close-dialog");
const dialog = document.querySelector("dialog");
const form = document.getElementById("task-form");
const taskList = document.getElementById("todo-task");


//event Listeners
closeDialog.addEventListener("click", () => { 
    dialog.close();
})

addTask.addEventListener('click', () => {
    dialog.showModal();
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("task-title");
    const description = formData.get("task-description");
    const priority = formData.get("task-priority");
    const dueDate = formData.get("dueDate");
    const tagsInput = formData.get("tags");

    const tags = tagsInput
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag !== "");

    const newTask = {
        title,
        description,
        priority,
        dueDate,
        tags
    }

    if (editingCard) {
        // EDIT MODE
        const updatedCard = createNewTask(newTask);
        editingCard.replaceWith(updatedCard);
        editingCard = null; // reset after editing
    } else {
        // CREATE MODE (your existing logic)
        const card = createNewTask(newTask);
        taskList.appendChild(card);
    }

    e.target.reset()
    dialog.close()
})





const createNewTask = (task) => {
    const card = document.createElement("article");
    card.setAttribute("data-testid", "test-todo-card");
    card.setAttribute("class", "card");

    //Date formatting
    const dateObj = new Date(task.dueDate);
    const formattedDate = dateObj.toDateString();

    //Time remaining
    function getTimeRemaining(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
      
        const diff = due - now;
      
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
        // OVERDUE
        if (diff < 0) {
          const overdueMinutes = Math.abs(minutes);
          const overdueHours = Math.abs(hours);
          const overdueDays = Math.abs(days);
      
          if (overdueMinutes < 60) {
            return `Overdue by ${overdueMinutes} min`;
          }
          if (overdueHours < 24) {
            return `Overdue by ${overdueHours} hours`;
          }
          return `Overdue by ${overdueDays} days`;
        }
      
        // DUE NOW
        if (minutes < 1) {
          return "Due now!";
        }
      
        // LESS THAN 1 HOUR
        if (minutes < 60) {
          return `Due in ${minutes} min`;
        }
      
        // LESS THAN 24 HOURS
        if (hours < 24) {
          return `Due in ${hours} hours`;
        }
      
        // TOMORROW (nice UX touch)
        if (days === 1) {
          return "Due tomorrow";
        }
      
        // DEFAULT
        return `Due in ${days} days`;
      }

    
    const tagsHTML = task.tags.map(tag => {
        return `<li class="tag">${tag}</li>`;
      }).join("");


    
    card.innerHTML = `
    <div class="card-header">
        <h3 data-testid="test-todo-title">${task.title}</h3>
        <input
            type="checkbox"
            data-testid="test-todo-complete-toggle" 
            aria-label="Mark task as complete"
        />
    </div>
    <div class="card-body">
        <p data-testid="test-todo-description">${task.description}</p>
        <div data-testid="test-todo-priority">Priority: ${task.priority}</div>
        <time data-testid="test-todo-due-date" datetime="${task.dueDate}">Due date: ${formattedDate}</time>
        <time data-testid="test-todo-time-remaining" datetime="${task.dueDate}">Remaining Time: ${getTimeRemaining(task.dueDate)}</time>
        <span data-testid="test-todo-status">Progress: Pending</span>
        <ul data-testid="test-todo-tags">
        ${tagsHTML}
        </ul>
        <button id="edit-button" data-testid="test-todo-edit-button">Edit</button>
        <button id="delete-button" data-testid="test-todo-delete-button">Delete</button>
    </div>    
    `;

    const title = card.querySelector('[data-testid="test-todo-title"]');
    const checkbox = card.querySelector('[data-testid="test-todo-complete-toggle"]');
    const status = card.querySelector('[data-testid = "test-todo-status"]');
    const header = card.querySelector(".card-header");
    const deleteBtn = card.querySelector('[data-testid="test-todo-delete-button"]');
    const editBtn = card.querySelector('[data-testid="test-todo-edit-button"]');
    const timeElement = card.querySelector('[data-testid="test-todo-time-remaining"]');

    setInterval(() => {
    timeElement.textContent = getTimeRemaining(task.dueDate);
    }, 60000); // every 60 seconds


    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
      
        editingCard = card;
      
        // Fill form fields
        form.elements["task-title"].value = task.title;
        form.elements["task-description"].value = task.description;
        form.elements["task-priority"].value = task.priority;
        form.elements["dueDate"].value = task.dueDate;
      
        dialog.showModal();
      });

    header.addEventListener("click", () => {
        card.classList.toggle("show-card-body")
    })

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            title.classList.add("completed");
            status.textContent = "Done";
        } else {
            title.classList.remove("completed");
            status.textContent = "Pending"
        }
    })

    checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent expand toggle
        card.remove();
      });

    
    return card
}





