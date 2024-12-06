async function createRoom(roomName) {
    const Room = Parse.Object.extend("Room");
    const room = new Room();
    room.set("name", roomName);
  
    try {
      await room.save();
    } catch (error) {
      alert(`Erro ao criar sala: ${error.message}`);
    }
  }
  
  async function getRooms() {
    const Room = Parse.Object.extend("Room");
    const query = new Parse.Query(Room);
  
    try {
      const results = await query.find();
      return results.map((room) => ({
        id: room.id,
        name: room.get("name"),
      }));
    } catch (error) {
      alert(`Erro ao carregar salas: ${error.message}`);
    }
  }



  