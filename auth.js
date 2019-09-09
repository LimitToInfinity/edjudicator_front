document.addEventListener("DOMContentLoaded", postLoad)

function postLoad() {

    const loginURL = "http://127.0.0.1:8000/api/v1/auth/login/";
    const registerURL = "http://127.0.0.1:8000/api/v1/auth/register/";
    const songsURL = "http://127.0.0.1:8000/api/v1/songs/";

    const guestLoginButton = document.querySelector(".guest-button");
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");
    const allSongsButton = document.querySelector(".all-songs");
    
    guestLoginButton.addEventListener("click", guestLogin);
    loginForm.addEventListener("submit", login);
    registerForm.addEventListener("submit", register);
    allSongsButton.addEventListener("click", getAllSongs);

    function login(event)
    {
        event.preventDefault();

        loginFormData = new FormData(loginForm);

        const username = loginFormData.get("username");
        const password = loginFormData.get("password");

        const loginBody =
        {
            username,
            password,
        }

        return fetch(`${loginURL}`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody)
        })
        .then(res => res.json())
        .then(json =>
        {
            localStorage.setItem('username', json.username);
            localStorage.setItem('email', json.email);
            localStorage.setItem('token', json.token.token);
            window.location.replace("game.html");
        });
    }

    function guestLogin(event)
    {
        const username = "guest";
        const password = "guest";

        const loginBody =
        {
            username,
            password,
        }

        return fetch(`${loginURL}`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody)
        })
        .then(res => res.json())
        .then(json =>
        {
            localStorage.setItem('username', json.username);
            localStorage.setItem('email', json.email);
            localStorage.setItem('token', json.token.token);
            window.location.replace("game.html");
        });
    }

    function register(event)
    {
        event.preventDefault();

        registerFormData = new FormData(registerForm);

        const username = registerFormData.get("username");
        const password = registerFormData.get("password");
        const email = registerFormData.get("email");

        const registerBody =
        {
            username,
            password,
            email,
        }

        return fetch(`${registerURL}`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerBody)
        })
        .then(res => res.json())
        .then(json =>
        {
            localStorage.setItem('username', json.username);
            localStorage.setItem('email', json.email);
            localStorage.setItem('token', json.token.token);
        });
    }

    function getAllSongs()
    {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        });
        
        return fetch(`${songsURL}`, {
            method: 'GET',
            headers: myHeaders,
        })
        .then(response => {
            if (response.status === 200) { return response.json(); }
            else { throw new Error('Something went wrong on api server!'); }
        })
        .then(songs => {
                console.log(songs);
            })
            // .catch(error => {
            //     console.error(error);
            // });
    }
}

// fetch('/user/data', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer' + authToken
//     }
//   })
//   .then(res => res.json())
//   .then(data => { console.log(data) })
//   .catch(err => { console.log(err) })

// function getAllClients() {
//     const myHeaders = new Headers({
//         'Content-Type': 'application/json',
//         'Authorization': 'your-token'
//     });
    
//     return fetch('http://localhost:8080/clients', {
//       method: 'GET',
//       headers: myHeaders,
//     })
    
//     .then(response => {
//         if (response.status === 200) {
//           return response.json();
//         } else {
//           throw new Error('Something went wrong on api server!');
//         }
//       })
//       .then(response => {
//         console.debug(response);
//       }).catch(error => {
//         console.error(error);
//       });
//     }
    
//     getAllClients();

// if (this.state.logged_in) {
//     fetch('http://localhost:8000/core/current_user/', {
//     headers: {
//         Authorization: `JWT ${localStorage.getItem('token')}`
//     }
//     })
//     .then(res => res.json())
//     .then(json => {
//         this.setState({ username: json.username });
//     });
// }

//   handle_login = (e, data) => {
//     e.preventDefault();
//     fetch('http://localhost:8000/token-auth/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => res.json())
//       .then(json => {
//         localStorage.setItem('token', json.token);
//         this.setState({
//           logged_in: true,
//           displayed_form: '',
//           username: json.user.username
//         });
//       });
//   };

//   handle_signup = (e, data) => {
//     e.preventDefault();
//     fetch('http://localhost:8000/core/users/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => res.json())
//       .then(json => {
//         localStorage.setItem('token', json.token);
//         this.setState({
//           logged_in: true,
//           displayed_form: '',
//           username: json.username
//         });
//       });
//   };

//   handle_logout = () => {
//     localStorage.removeItem('token');
//     this.setState({ logged_in: false, username: '' });
//   };