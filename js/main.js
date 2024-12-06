document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nickname = document.getElementById("registerNickname").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            registerUser(nickname, email, password);
        });
    }
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nickname = document.getElementById("loginNickname").value;
            const password = document.getElementById("loginPassword").value;
            loginUser(nickname, password);
        });
    }

    loadRooms();

    document.getElementById("createRoomForm").addEventListener("submit", function (e) {
        e.preventDefault();
        
        const roomName = document.getElementById("roomName").value;
        const roomDescription = document.getElementById("roomDescription").value;

        createRoom(roomName, roomDescription);
    });

    const createRoomButton = document.getElementById("createRoomButton");
    const createRoomModal = document.getElementById("createRoomModal");
    createRoomButton.addEventListener("click", () => {
        createRoomModal.classList.toggle("hidden");
    });

    async function loadRooms() {
        const Room = Parse.Object.extend("Room");
        const query = new Parse.Query(Room);
        try {
            const rooms = await query.find();
            const roomsList = document.getElementById("roomsList");
            roomsList.innerHTML = ''; 

            rooms.forEach(room => {
                const roomElement = document.createElement('div');
                roomElement.classList.add('room');

                const roomName = room.get('name');
                const roomDescription = room.get('description') || "Sem descrição";

                roomElement.innerHTML = `
                    <h3>${roomName}</h3>
                    <p>${roomDescription}</p>
                    <button onclick="enterRoom('${room.id}')">Entrar na sala</button>
                `;
                roomsList.appendChild(roomElement);
            });
        } catch (error) {
            console.error("Erro ao carregar as salas:", error);
        }
    }

    async function createRoom(name, description) {
        const Room = Parse.Object.extend("Room");
        const room = new Room();
        room.set("name", name);
        room.set("description", description);
        room.set("creator", Parse.User.current()); 

        try {
            await room.save();
            loadRooms();  

            window.location.href = `room.html?roomId=${room.id}`;
        } catch (error) {
            console.error("Erro ao criar a sala:", error);
            alert("Erro ao criar a sala.");
        }
    }

    window.enterRoom = function(roomId) {
        window.location.href = `room.html?roomId=${roomId}`;
    };
});
