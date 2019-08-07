const API_URL = 'http://127.0.0.1:1337'

async function login(username, password) {
  try {
    let response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    let json = await response.json()

    if (response.status !== 200 || json.error) {
      throw Error('Invalid username or password')
    }

    let token = json.token
    return token
  } catch (error) {
    throw error
  }
}

async function logout(token) {
  try {
    let response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    })

    let json = await response.json()

    if (response.status !== 200 || json.error) {
      throw Error('Invalid token')
    }
  } catch (error) {
    throw error
  }
}

async function getUsers(token) {
  try {
    let response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    let json = await response.json()

    if (response.status !== 200 || json.error) {
      throw Error('Invalid token')
    }

    let users = json.users
    return users
  } catch (error) {
    throw error
  }
}

function renderUsers(users) {
  const ul = document.getElementById('users')
  while(ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }

  for (const user of users) {
    if (user.username) {
      const li = document.createElement('li');
      li.innerHTML = `${user.username}`
      ul.appendChild(li)
    }
  }
}

function renderError(error) {
  const p = document.getElementById('error')
  p.innerHTML = error
}

async function main() {
  // Login
  document.getElementById('login').addEventListener('click', async function() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
      let token = await login(username, password)

      localStorage.setItem('token', token)
      console.log('Saving token', token)

      const users = await getUsers(token)
      renderUsers(users)
      renderError(null)
    } catch(error) {
      console.log(error)
      renderError('Incorrect email or password')
    }
  })

  // Logout
  document.getElementById('logout').addEventListener('click', async function() {
    let token = localStorage.getItem('token')
    console.log('Fetching token', token)

    if(token) {
      try {
        await logout(token)

        renderUsers([])
        localStorage.clear()
      } catch(error) {
        console.log(error)
        renderError('Invalid token')
      }
  }})
}

main()
