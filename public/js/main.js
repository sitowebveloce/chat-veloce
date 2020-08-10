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
            // Change id with name
            myId = `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${myId}</span>`
                // RESET FORM
            form.reset();
            // Return
            return null;
        } else if (msg.includes('username') && msg.includes('woman')) {
            // Split
            msg = msg.split(' ');
            // Change id with name
            myId = `<img class='profile-img' src='/imgs/woman.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${myId}</span>`
                // RESET FORM
            form.reset();
            // Return
            return null;
        } else if (msg.includes('username') && msg.includes('free')) {
            // Split
            msg = msg.split(' ');
            // Change id with name
            myId = `<img class='profile-img' src='/imgs/gender.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${myId}</span>`
                // RESET FORM
            form.reset();
            // Return
            return null;
        } else {
            // Split
            msg = msg.split(' ');
            // Change id with name
            myId = `<img class='profile-img' src='/imgs/user.svg'> ${msg[1]}`;
            // Set username
            idDiv.innerHTML = `<span> ${myId}</span>`
                // RESET FORM
            form.reset();
            // Return
            return null;
        }
    }

    // EMIT MESSAGE
    socket.emit('says-out', `<small class='says'>${myId} says:</small> <span class='message-board'> ${msg} </span>`);
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
        // Push id inside the array
        userJoined.push(id);
        // console.log(userJoined)
        // SHOW USERS
        usersIn(userJoined);
        // SHOW BOARD MESSAGES
        boardMessage(`<span class='joined'>User <small>${id}</small> joined the ${room}.</span>`);
        // EMIT YOUR ID
        socket.emit('user-in-out', { message: `<span class='already'>User <small>${myId}</small> it's already in.</span>`, id: myId });
        // EMIT MESSAGE
        socket.emit('message-out', `<span class='hello'>Hello from <small>${myId}</small></span>`);
    });
    // ON USER DISCONNECTED
    socket.on('user-disconnected', idx => {
        // SHOW BOARD MESSAGES
        boardMessage(`<span class='joined'>User <small>${idx}</small> disconnected from the ${room}.</span>`);
        // REMOVE USER FROM THE ARRAY
        userJoined = userJoined.filter(u => u !== idx);
        // console.log(userJoined)
        // SHOW USERS
        usersIn(userJoined);
    });

    // ON USER IN IN 
    socket.on('user-in-in', msg => {
        // SHOW BOARD MESSAGES
        boardMessage(`${msg.message}`);
        // ADD ID INSIDE THE ARRAY
        userJoined.push(msg.id);
        // SHOW
        usersIn(userJoined);
    });
    // ON MESSAGE IN
    socket.on('message-in', msg => {
        // SHOW BOARD MESSAGES
        boardMessage(`${msg}`);
        // REPLY
        socket.emit('reply-out', { message: `<span class='reply'>Reply hello from <small> ${myId} </small> </span>`, id: myId })
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
});
// USERS IN
const usersIn = (userJoined) => {
    // RESET AND ADD USERS
    users.innerHTML = '';
    // REMOVE DUPLICATES
    userJoined = new Set(userJoined);
    // LOOP THROUGH AND SHOW USERS
    userJoined.forEach(u => {
        users.innerHTML += `<div> 🤷 User-In: ${u} </div> `;
    });
}