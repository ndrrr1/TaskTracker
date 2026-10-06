let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const form = document.querySelector("#taskForm");
const list = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const error = document.querySelector("#error");
const deadlineInput = document.querySelector("#deadline");

deadlineInput.min = new Date().toISOString().split("T")[0];

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render(){
  list.textContent = "";

  let filteredTasks = tasks.filter(task => {
    if(currentFilter === "active") return !task.selesai;
    if(currentFilter === "done") return task.selesai;
    return true;
  });

  filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  counter.textContent = `${tasks.filter(task => !task.selesai).length} tugas aktif`;

  if(filteredTasks.length === 0){
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Belum ada tugas.";
    list.appendChild(empty);
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    const taskMain = document.createElement("div");
    taskMain.className = "task-main";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.judul;

    if(task.selesai){
      title.classList.add("completed");
    }

    const detail = document.createElement("small");
    detail.className = "task-detail";
    detail.textContent = `${task.matkul} • Deadline ${task.deadline}`;

    taskMain.append(title, detail);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Hapus";
    deleteBtn.dataset.delete = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.selesai;
    checkbox.dataset.id = task.id;

    actions.append(deleteBtn, checkbox);
    li.append(taskMain, actions);
    list.appendChild(li);
  });
}

form.addEventListener("submit", function(e){
  e.preventDefault();

  const judul = document.querySelector("#judul").value.trim();
  const matkul = document.querySelector("#matkul").value;
  const deadline = document.querySelector("#deadline").value;

  if(judul.length < 3 || !deadline){
    error.textContent = "Judul minimal 3 karakter dan deadline wajib diisi";
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  if(deadline < today){
    error.textContent = "Deadline tidak boleh sebelum hari ini";
    return;
  }

  tasks.push({
    id: Date.now(),
    judul,
    matkul,
    deadline,
    selesai: false
  });

  save();
  form.reset();
  error.textContent = "";
  render();
});

list.addEventListener("click", function(e){
  const checkbox = e.target.closest("input[type='checkbox']");
  const deleteBtn = e.target.closest("[data-delete]");

  if(checkbox){
    const task = tasks.find(item => item.id == checkbox.dataset.id);
    if(task){
      task.selesai = checkbox.checked;
    }
  }

  if(deleteBtn){
    tasks = tasks.filter(item => item.id != deleteBtn.dataset.delete);
  }

  save();
  render();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", function(){
    document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("on"));
    button.classList.add("on");
    currentFilter = button.dataset.filter;
    render();
  });
});

render();
