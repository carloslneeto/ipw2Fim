document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM carregado");

    if (!Parse) {
        console.error("Parse não está definido.");
        return;
    }

    console.log("Parse:", Parse);

    async function loadRoomDetails() {
        const roomId = new URLSearchParams(window.location.search).get("roomId");
        if (!roomId) {
            alert("ID da sala não encontrado.");
            return;
        }

        try {
            const Room = Parse.Object.extend("Room");
            const query = new Parse.Query(Room);
            const room = await query.get(roomId);

            const roomNameElement = document.getElementById("roomName");
            if (roomNameElement) {
                roomNameElement.textContent = room.get("name");
            }
        } catch (error) {
            console.error("Erro ao carregar detalhes da sala:", error);
        }
    }

    async function loadMessages() {
        const roomId = new URLSearchParams(window.location.search).get("roomId");
        if (!roomId) {
            console.error("ID da sala não encontrado.");
            return;
        }

        try {
            const Message = Parse.Object.extend("Message");
            const query = new Parse.Query(Message);
            const Room = Parse.Object.extend("Room");
            const room = new Room();
            room.id = roomId;
            query.equalTo("room", room);
            query.ascending("createdAt");

            const results = await query.find();

            const messagesContainer = document.getElementById("messagesContainer");
            if (!messagesContainer) {
                console.error("Container de mensagens não encontrado!");
                return;
            }
            messagesContainer.innerHTML = "";

            results.forEach((message) => {
                const messageContent = message.get("content");
                const sender = message.get("sender")?.get("nickname") || "Anônimo";
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.innerHTML = `
                    <strong>${sender}</strong>: ${messageContent}
                `;

                messagesContainer.appendChild(messageElement);
            });
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        }
    }

    async function sendMessage(messageContent, roomId) {
        try {
            const Message = Parse.Object.extend("Message");
            const message = new Message();

            const Room = Parse.Object.extend("Room");
            const room = new Room();
            room.id = roomId;

            message.set("content", messageContent);
            message.set("room", room);
            message.set("sender", Parse.User.current());

            await message.save();
            document.getElementById("messageContent").value = ""; 
            await loadMessages();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }

    document.getElementById("sendMessageForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const messageInput = document.getElementById("messageContent");
        if (!messageInput) {
            console.error("Campo de mensagem não encontrado!");
            return;
        }
        const messageContent = messageInput.value.trim();
        if (!messageContent) {
            alert("Por favor, insira uma mensagem.");
            return;
        }
        const roomId = new URLSearchParams(window.location.search).get("roomId");
        if (!roomId) {
            alert("ID da sala não encontrado.");
            return;
        }
        await sendMessage(messageContent, roomId);
    });
    
    loadRoomDetails();
    loadMessages();
    setInterval(loadMessages, 5000);
});
