// SELECT ELEMENTS
const idDiv = document.querySelector('.id');
const board = document.querySelector('.board');
const form = document.querySelector('form');
const input = document.querySelector('.message');
const users = document.querySelector('.users');

// SOCKET.IO
const socket = io();
// MY ID
let myId;
let userName = '';
// ROOM
let room = roomName;
// User joined
userJoined = [];

// BOARD MESSAGES FUNCTION
const boardMessage = (message) => {
    // Inset message on top
    board.insertAdjacentHTML('afterbegin', `<span>${message.charAt(0).toUpperCase() + message.slice(1)}</span> <br>`);
}

// HANDLE SUBMIT
form.addEventListener('submit', e => {
    // Prevent default
    e.preventDefault()
        // Set message
    let msg = input.value;
    // CHECK MESSAGE
    // SET USERNAME
    if (msg.includes('username')) {
        // SET USERNAME AND SX
        if (msg.includes('username') && msg.includes('male')) {
            // Split
            msg = msg.split(' ');
            // SOCKET EMIT NEW NAME TO ALL USERS IN THE CHAT ROOM
            socket.emit('new-name-out', ({ id: myId, newName: `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}` }));
            // Change id with name
            userName = `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${userName}</span>`
                // RESET FORM
            form.reset();
            // Return
            return;
        } else if (msg.includes('username') && msg.includes('woman')) {
            // Split
            msg = msg.split(' ');
            // SOCKET EMIT NEW NAME TO ALL USERS IN THE CHAT ROOM
            socket.emit('new-name-out', ({ id: myId, newName: `<img class='profile-img' src='/imgs/woman.svg'> ${msg[1]}` }));
            // Change id with name
            userName = `<img class='profile-img' src='/imgs/woman.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${userName}</span>`
                // RESET FORM
            form.reset();
            // Return
            return;
        } else if (msg.includes('username') && msg.includes('free')) {
            // Split
            msg = msg.split(' ');
            // SOCKET EMIT NEW NAME TO ALL USERS IN THE CHAT ROOM
            socket.emit('new-name-out', ({ id: myId, newName: `<img class='profile-img' src='/imgs/gender.svg'> ${msg[1]}` }));
            // Change id with name
            userName = `<img class='profile-img' src='/imgs/gender.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${userName}</span>`
                // RESET FORM
            form.reset();
            // Return
            return;
        } else {
            // Split
            msg = msg.split(' ');
            // SOCKET EMIT NEW NAME TO ALL USERS IN THE CHAT ROOM
            socket.emit('new-name-out', ({ id: myId, newName: `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}` }));
            // Change id with name
            userName = `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${userName}</span>`
                // RESET FORM
            form.reset();
            return;
        }
    }

    // EMIT MESSAGE
    socket.emit('says-out', `<small class='says'>${userName !== '' ? userName : myId} says:</small> <span class='message-board'> ${msg} </span>`);
    // RESET FORM
    form.reset();
})

//
// ─── SOCKET IO EVENTS ───────────────────────────────────────────────────────────

socket.on('connect', () => {
    // Emit join and room
    socket.emit('join', ({ room: roomName }));
    // Your ID event
    socket.on('your-id', id => {
        myId = id
            // SHOW YOUR ID
        idDiv.innerHTML = `<span>${myId.toUpperCase()}</span>`
    });

    // ON USER-JOIN EVENT
    socket.on('user-join', id => {
        // Create a user object
        let user = { id: id, name: '' }
            // Push id inside the array
        userJoined.push(user);
        // console.log(userJoined)
        // SHOW USERS
        usersIn(userJoined);
        // SHOW BOARD MESSAGES
        boardMessage(`<span class='joined'>User <small>${user.id}</small> joined the ${room}.</span>`);
        // EMIT YOUR ID
        socket.emit('user-in-out', { message: `<span class='already'>User <small>${userName !== '' ? userName : myId}</small> it's already in.</span>`, id: myId, name: userName });
        // EMIT MESSAGE
        socket.emit('message-out', `<span class='hello'>Hello from <small>${userName !== '' ? userName : myId}</small></span>`);
    });
    // ON USER DISCONNECTED
    socket.on('user-disconnected', idx => {
        // SHOW BOARD MESSAGES
        boardMessage(`<span class='joined'>User <small>${idx}</small> disconnected from the ${room}.</span>`);
        // REMOVE USER FROM THE ARRAY
        userJoined = userJoined.filter(u => u.id !== idx);
        // console.log(userJoined)
        // SHOW USERS
        usersIn(userJoined);
    });

    // ON USER IN IN 
    socket.on('user-in-in', ({ message, id, name }) => {
        // SHOW BOARD MESSAGES
        boardMessage(`${message}`);
        // ADD ID and NAME INSIDE THE ARRAY
        let user = { id: id, name: name }
        userJoined.push(user);
        // SHOW
        usersIn(userJoined);
    });
    // ON MESSAGE IN
    socket.on('message-in', msg => {
        // SHOW BOARD MESSAGES
        boardMessage(`${msg}`);
        // REPLY
        socket.emit('reply-out', { message: `<span class='reply'>Reply hello from <small> ${userName !== '' ? userName : myId} </small> </span>`, id: myId })
    });
    // ON REPLY IN
    socket.on('reply-in', msg => {
        // SHOW BOARD MESSAGES
        boardMessage(`${msg.message}`);
    });
    // ON SAYS IN
    socket.on('says-in', msg => {
        // SHOW BOARD MESSAGE
        boardMessage(`${msg}`)
    });
    // ON NEW NAME IN
    socket.on('new-name-in', ({ id, newName }) => {
        // Change name
        userJoined.map(u => {
            if (u.id === id)
                u.name = newName
        });

        // Show new names
        usersIn(userJoined);
    });
});
// USERS IN
const usersIn = (userJoined) => {
    // RESET AND ADD USERS
    users.innerHTML = '';
    // REMOVE DUPLICATES
    userJoined = userJoined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
        // console.log(userJoined)
        // LOOP THROUGH AND SHOW USERS
    userJoined.forEach(u => {
        users.innerHTML += `<div class='users-in'> 🤷 User-In: ${u.name !== '' ? u.name : u.id} </div> `;
    });
}