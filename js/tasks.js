/* 01 - Variáveis */

const authToken = localStorage.getItem('userToken');
const finishSessionRef = document.querySelector('#closeApp');
const userNameRef = document.querySelector('#userName');
const taskRef = document.querySelector('#novaTarefa');
const buttontaskRef = document.querySelector('#criarTarefa');

const tasksPendetesRef = document.querySelector('.tarefas-pendentes');
const tasksFinalizadasRef = document.querySelector('.tarefas-terminadas');

const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': authToken
}

var userTask = {

    description: '',
    completed: false

};

let tasksPendentes = [];
let tasksFinalizadas = [];

var checkValidation = false;

/* 02 - Funções */

function logout() {

    window.location.href = './index.html';
    localStorage.clear();
}

function finalizaSession() {
    Swal.fire({
        title: 'Tem certeza que deseja sair?',
        text: "Você será deslogado!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, desejo sair!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      })
}

function verificaToken() {

    if (authToken===null) {
        
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Você não esta logado!'
          }).then((result) => {
            
            if(result.closed) {
                logout();
            } else {
                logout();
            }

          })
    }

    else {
        getUserData();
    }
}

function validateInput(input) {

    const inputValidacao = input.checkValidity();

    if(inputValidacao) {
        checkValidation = true;
    } else {
        checkValidation = false;
    }

}

function validateDescription(task) {

    userTask.description = task;

}

function getUserData() {

    var requestConfig = {
        method: 'GET',
        headers: requestHeaders
    }

    fetch('https://todo-api.ctd.academy/v1/users/getMe', requestConfig).then(
        response => {
            
            response.json().then(
                data => {
                    var name = data.firstName + ' ' + data.lastName;
                    userNameRef.innerText = name;
                }
            )
            if(response.ok) {
                getTasks();
            }  
        }
    )
}

function createTask(event) {

    event.preventDefault();

    if(checkValidation) {
        
        var requestConfig = {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(userTask)
    
        }
    
        fetch('https://todo-api.ctd.academy/v1/tasks', requestConfig).then(
            response => {
                if (response.ok){
                    getTasks();
           
                }
            }
        )
    
            taskRef.value = "";
            userTask.description = " ";
            checkValidation = false;
            carregamento();

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao adicionar tarefa',
            text: 'A tarefa não tem caracteres suficientes!'
          })
    }

}

function getTasks() {

    var requestConfig = {
        method: 'GET',
        headers: requestHeaders
    }

    fetch(`https://todo-api.ctd.academy/v1/tasks`, requestConfig).then(
         response => {
            if (response.ok) {
                response.json().then (
                    tasks => {
                        insertTasks(tasks);
                    }
                )
            }

         }
    )
    
}

function insertTasks(tasks) {

    tasksPendetesRef.innerHTML = " ";
    tasksFinalizadasRef.innerHTML = " ";
    
    tasksPendentes = [];
    tasksFinalizadas = [];

    tasks.map( task => {

        if(task.completed) {
            tasksFinalizadas.push(task);
        } else {
            tasksPendentes.push(task);
        }

    });

    for (let i=0; i < tasksPendentes.length; i++) {
    
        let taskDate = new Date(tasksPendentes[i].createdAt);

        tasksPendetesRef.innerHTML += `
        <li class="tarefa">
            <div class="not-done"> X </div>
            <div class="descricao">
            <p class="nome"> ${tasksPendentes[i].description}</p>
            <p class="timestamp">Criada em: ${new Intl.DateTimeFormat('pt-BR').format(taskDate)}</p>
            </div>
        </li>
        `
    }

    for (let i=0; i < tasksFinalizadas.length; i++) {
    
        let taskDate = new Date(tasksFinalizadas[i].createdAt);

        tasksFinalizadasRef.innerHTML += `
        <li class="tarefa">
            <div class="not-done"> <img src="assets/lixo.svg"> </div>
            <div class="descricao">
            <p class="nome"> ${tasksFinalizadas[i].description}</p>
            <p class="timestamp">Criada em: ${new Intl.DateTimeFormat('pt-BR').format(taskDate)}</p>
            </div>
        </li>
        `
    }

    atualizar();
    deletar();

}

function updateTask(target) {

    var userUpdate = {
        completed: true
    }

    var requestConfig = {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(userUpdate)
    }

    fetch(`https://todo-api.ctd.academy/v1/tasks/${target}`, requestConfig).then (
        response => {
            if(response.ok) {
                getTasks();
            }
        }
    )

    carregamento();

}

function deleteTask(target) {
    
    var requestConfig = {
        method: 'DELETE',
        headers: requestHeaders
    }
    
    Swal.fire({
        title: 'Tem certeza que deseja apagar essa tarefa?',
        text: "Você não poderá voltar atrás!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, desejo remover!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://todo-api.ctd.academy/v1/tasks/${target}`, requestConfig).then (
                response => {
                    if(response.ok) {
                        getTasks();
                    }
                }
                
            )
            carregamento();
        }
      })




}

function atualizar() {
    let completedTaskRef = Array.from(tasksPendetesRef.children);

    completedTaskRef.map( (item, index) => {

        const clickTask = item.children[0];
        
        clickTask.addEventListener('click', () => updateTask(tasksPendentes[index].id));
    });
}

function deletar() {
    let deleteTaskRef = Array.from(tasksFinalizadasRef.children);

    deleteTaskRef.map( (item, index) => {

        const clickTask = item.children[0];
        
        clickTask.addEventListener('click', () => deleteTask(tasksFinalizadas[index].id));
    });
}

function carregamento(){
    tasksPendetesRef.innerHTML = `    
    <div id="skeleton">
        <li class="tarefa">
            <div class="not-done"> </div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>

        <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
    </div>`;

    tasksFinalizadasRef.innerHTML = `    
    <div id="skeleton">
        <li class="tarefa">
            <div class="not-done"> </div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>

        <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
    </div>`;
}

/* 03 - Eventos */

taskRef.addEventListener('keyup',(event) => validateDescription(event.target.value));
taskRef.addEventListener('keyup', () => validateInput(taskRef));

buttontaskRef.addEventListener('click',(event) => createTask(event));
finishSessionRef.addEventListener('click', () => finalizaSession());


/* 04 - Invocando Função */

verificaToken();
