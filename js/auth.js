async function registerUser(nickname, email, password) {
    const user = new Parse.User();

    user.set("username", nickname); 
    user.set("nickname", nickname); 
    user.set("email", email);       
    user.set("password", password); 

    try {
        await user.signUp();
        alert("Usuário registrado com sucesso!");
        console.log("Usuário registrado:", { nickname, email });
    } catch (error) {
        alert(`Erro ao registrar: ${error.message}`);
        console.error("Erro ao registrar:", error);
    }
}

async function loginUser(nickname, password) {
    try {
        await Parse.User.logIn(nickname, password);
        alert("Login bem-sucedido!");
        console.log("Usuário logado:", { nickname });
        window.location.href = "home.html"; 
    } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
        console.error("Erro ao fazer login:", error);
    }
}
