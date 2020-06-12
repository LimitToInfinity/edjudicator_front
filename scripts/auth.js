document.addEventListener("DOMContentLoaded", postLoad)

function postLoad() {

  // const loginURL = "http://127.0.0.1:8000/api/v1/auth/login/";
  // const registerURL = "http://127.0.0.1:8000/api/v1/auth/register/";
  // const highScoresURL = "http://127.0.0.1:8000/api/v1/highscores/";

  const loginURL = "https://edjudicatorback.herokuapp.com/api/v1/auth/login/";
  const registerURL = "https://edjudicatorback.herokuapp.com/api/v1/auth/register/";
  const highScoresURL = "https://edjudicatorback.herokuapp.com/api/v1/highscores/";

  const guestLoginButton = document.querySelector(".guest-button");
  const loginButton = document.querySelector(".login-button");
  const registerButton = document.querySelector(".register-button");
  const guestLoginForm = document.querySelector(".guest-login-form");
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  // const allHighScoresButton = document.querySelector(".all-high-scores");

  guestLoginButton.addEventListener("click", guestLogin);
  loginButton.addEventListener("click", showLoginForm);
  registerButton.addEventListener("click", showRegisterForm);
  loginForm.addEventListener("submit", login);
  registerForm.addEventListener("submit", register);
  // allHighScoresButton.addEventListener("click", getAllHighScores);

  function showLoginForm()
  {
    registerButton.classList.remove("selected");
    loginButton.classList.add("selected");

    guestLoginForm.classList.remove("displayed");
    registerForm.classList.remove("displayed");
    loginForm.classList.add("displayed");
  }

  function showRegisterForm()
  {
    loginButton.classList.remove("selected");
    registerButton.classList.add("selected");

    guestLoginForm.classList.remove("displayed");
    loginForm.classList.remove("displayed");
    registerForm.classList.add("displayed");
  }

  function guestLogin(event)
  {
    runLoadingAnimations();

    const username = "Guest";
    const password = "guest";

    registerButton.classList.remove("selected");
    if (!loginButton.classList.contains("selected"))
    {
      loginButton.classList.add("selected");
    }

    loginForm.classList.remove("displayed");
    registerForm.classList.remove("displayed");
    guestLoginForm.classList.add("displayed");

    usernameInput = guestLoginForm.querySelector("#guest-login-username");
    passwordInput = guestLoginForm.querySelector("#guest-login-password");

    displayWordLetterByLetter(username, usernameInput, 250, "");
    displayWordLetterByLetter(password, passwordInput, 250, "");

    function displayWordLetterByLetter(word, textField, timeoutLength, displayedWord)
    {
      wordLength = word.length;
      for (let i = 0; i < wordLength; i++)
      {
        let randomColorNumber = 0
        setTimeout(() => {
          randomColorNumber = Math.floor(Math.random() * 360);
          textField.style = `color: hsl(${randomColorNumber}, 100%, 50%);`
        },
          i * timeoutLength
        );

        setTimeout(() =>
        {
          displayedWord = displayedWord.concat(word.charAt(i))
        }, 
          i * timeoutLength
        );

        setTimeout(() => textField.value = displayedWord, i * timeoutLength);
      }
    }

    const loginBody =
    {
      username,
      password,
    }

    setTimeout(() => {
      return unAuthFetchCall(loginURL, "POST", loginBody)
        .then(res => res.json())
        .then(json =>
        {
          localStorage.setItem('id', json.id);
          localStorage.setItem('username', json.username);
          localStorage.setItem('email', json.email);
          localStorage.setItem('token', json.token);
          localStorage.setItem('value', json.value);
          window.location.replace("game.html");
        });

    }, 1500);
  }

  function login(event)
  {
    event.preventDefault();

    runLoadingAnimations();

    loginFormData = new FormData(loginForm);

    const username = loginFormData.get("username");
    const password = loginFormData.get("password");

    const loginBody =
    {
      username,
      password,
    }

    return unAuthFetchCall(loginURL, "POST", loginBody)
      .then(response => {
        if (response.status === 201) { return response.json(); }
        else
        {
          throw new Error("That login is funky yo!");
        }
      })
      .then(json =>
      {
        localStorage.setItem('id', json.id);
        localStorage.setItem('username', json.username);
        localStorage.setItem('email', json.email);
        localStorage.setItem('token', json.token);
        localStorage.setItem('value', json.value);
        window.location.replace("game.html");
      })
      .catch(error => {
        if (loginForm.querySelector("#login-error-message"))
        {
          lastErrorMessage = loginForm.querySelector("#login-error-message");
          loginForm.removeChild(lastErrorMessage);
        }

        errorElement = document.createElement("p");
        errorElement.innerText = error.message;
        errorElement.style.color = "red";
        errorElement.id = "login-error-message";

        loginForm.append(errorElement);

        gameContainer = document.querySelector("canvas");
        document.body.removeChild(gameContainer);
        runDudeAnimations();
      });
  }

  function register(event)
  {
    event.preventDefault();

    runLoadingAnimations();

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

    return unAuthFetchCall(registerURL, "POST", registerBody)
      .then(response => {
        if (response.status === 201) { return response.json(); }
        else
        {
          throw new Error("That registration is funky yo!");
        }
      })
      .then(json =>
      {
        localStorage.setItem('id', json.id);
        localStorage.setItem('username', json.username);
        localStorage.setItem('email', json.email);
        localStorage.setItem('token', json.token);
        localStorage.setItem('value', json.value);
        window.location.replace("game.html");
      })
      .catch(error => {
        if (registerForm.querySelector("#register-error-message"))
        {
          lastErrorMessage = registerForm.querySelector("#register-error-message");
          registerForm.removeChild(lastErrorMessage);
        }

        errorElement = document.createElement("p");
        errorElement.innerText = error.message;
        errorElement.style.color = "red";
        errorElement.id = "register-error-message";

        registerForm.append(errorElement);

        gameContainer = document.querySelector("canvas");
        document.body.removeChild(gameContainer);
        runDudeAnimations();
      });
  }

  function getAllHighScores()
  {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    });

    token = localStorage.getItem("token");
    return authFetchCall(highScoresURL, "GET", token)
      .then(response => {
        if (response.status === 200) { return response.json(); }
        else { throw new Error('Log in or register, yo!'); }
      })
      .then(highScores => {
        console.log(highScores);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function authFetchCall(url, method, header, body)
  {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${header}`
    });

    return fetch(url,
    {
      method,
      headers: myHeaders,
      body: JSON.stringify(body)
    });
  }

  function unAuthFetchCall(url, method, body)
  {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch(url,
    {
      method,
      headers: myHeaders,
      body: JSON.stringify(body)
    });
  }

  runDudeAnimations();
  function runDudeAnimations()
  {
    var configDude =
    {
      type: Phaser.WEBGL,
      width: 100,
      height: 100,
      "transparent": true,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        parent: 'animations',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, //or CENTER_BOTH or CENTER_VERTICALLY
        width: 100,
        height: 100
      },
      canvas: document.querySelector("canvas"),
    };


    var player;
    var gameDude = new Phaser.Game(configDude);

    function preload ()
    {
      game = this;

      game.load.spritesheet('dude', './../assets/adventurer.png',
      {
        frameWidth: 50, frameHeight: 37
      });
    }

    function create ()
    {
      game = this;

      player = game.add.sprite(47, 45, 'dude');
      player.setScale(2);

      game.anims.create({
        key: 'all-dude-animations',
        frames: game.anims.generateFrameNumbers('dude', { start: 0, end: 108 } ),
        frameRate: 10,
        repeat: -1
      });
    }    

    function update ()
    {
      player.anims.play("all-dude-animations", true);
    }
  }

  function runLoadingAnimations()
  {
    var configMinotaur =
    {
      type: Phaser.WEBGL,
      width: 100,
      height: 100,
      "transparent": true,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        parent: '.loading',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, //or CENTER_BOTH or CENTER_VERTICALLY
        width: 100,
        height: 100
      },
      canvas: document.querySelector("canvas"),
    };

    var minotaur;
    new Phaser.Game(configMinotaur);

    function preload ()
    {
      game = this;

      game.load.spritesheet('minotaur', './../assets/minotaur.png',
      {
        frameWidth: 96, frameHeight: 96
      });
    }

    function create ()
    {
      game = this;

      minotaur = game.add.sprite(49, 67, 'minotaur');
      minotaur.setScale(1);
      scoreText = game.add.text(0, 17, 'loadi...', { fontSize: '20px', fill: '#000' }).setDepth(-1);

      game.anims.create({
        key: 'all-minotaur-animations',
        frames: game.anims.generateFrameNumbers('minotaur', { start: 0, end: 95 } ),
        frameRate: 30,
        repeat: -1
      });
    }

    function update ()
    {
      minotaur.anims.play("all-minotaur-animations", true);
    }
  }
}
