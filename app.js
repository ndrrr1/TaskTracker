let tasks = [];


const form = document.querySelector("#taskForm");
const list = document.querySelector("#taskList");


function render(){

    list.innerHTML="";


    tasks.forEach(task=>{

        let li=document.createElement("li");

        li.textContent =
        task.judul + " - " + task.matkul;


        list.appendChild(li);

    });

}



form.addEventListener("submit",function(e){

    e.preventDefault();


    let task={

        judul:
        document.querySelector("#judul").value,


        matkul:
        document.querySelector("#matkul").value,


        deadline:
        document.querySelector("#deadline").value

    };


    tasks.push(task);


    render();


});