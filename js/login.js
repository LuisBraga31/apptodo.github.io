/* 01 - Variáveis */

const userEmailRef = document.querySelector('#inputEmail');
const userSenhaRef = document.querySelector('#inputPassword');
const buttonLoginRef = document.querySelector('#loginButton');

var userLogin = {
    email:'', 
    password:''
}

var formsErrors = {
    inputEmail: true,
    inputPassword: true
}

/* 02 - Funções */

function checkForm() {

    const formErrorsArray = Object.values(formsErrors);
    const formValidacao = formErrorsArray.every(item => item === false);

    buttonLoginRef.disabled = !formValidacao;
    
    if(formValidacao) {
        buttonLoginRef.classList.add('ativado');
    } else {
        buttonLoginRef.classList.remove('ativado');
    }

}

function validateInput(input) {

    const inputValidacao = input.checkValidity();
    const elementFatherRef = input.parentElement.parentElement;

    if(inputValidacao) {
        elementFatherRef.classList.remove('error');
        elementFatherRef.classList.add('correct')
    } else {
        elementFatherRef.classList.remove('correct');
        elementFatherRef.classList.add('error');
    }
    
    formsErrors[input.id] = !inputValidacao;

    checkForm();

}

function validateEmail(email) {
    userLogin.email = email;
}

function validatePassword(password) {
    userLogin.password = password;
}

function login(event) {

    event.preventDefault();

    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    
    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(userLogin)
    }

    fetch('https://todo-api.ctd.academy/v1/users/login', requestConfig).then(    
        response => {
            if (response.ok) {
                response.json().then(
                    data => 
                    Swal.fire(
                        'Login Efetuado!',
                        'Login realizado com sucesso!',
                        'success'
                      ).then(result => {
                        if (result.isClosed) {
                            localStorage.setItem('userToken', data.jwt);
                            window.location.href = './tarefas.html';
                        } else {
                            localStorage.setItem('userToken', data.jwt);
                            window.location.href = './tarefas.html';
                        } 
                      })
                )
            
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuário não encontrado...',
                    text: 'Email ou senha não conferem!'
                  })
            }
        }
    );

}

/* 03 - Eventos */

userEmailRef.addEventListener('keyup', () => validateInput(userEmailRef));
userSenhaRef.addEventListener('keyup', () => validateInput(userSenhaRef));

userEmailRef.addEventListener('keyup', (event) => validateEmail(event.target.value));
userSenhaRef.addEventListener('keyup', (event) => validatePassword(event.target.value));

buttonLoginRef.addEventListener('click',(event) => login(event));