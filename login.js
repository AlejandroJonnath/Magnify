document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('message');

    messageDiv.style.fontSize = "1.2rem"; 
    messageDiv.style.fontWeight = "bold"; 
    messageDiv.style.textAlign = "center";
    messageDiv.style.transition = "all 0.3s ease-in-out";

    if (username === 'Adriel' && password === 'adriel2002') {
        messageDiv.style.color = "#00ff00";
        messageDiv.innerHTML = "🟢 Conectando al servidor...";
        
        setTimeout(() => {
            messageDiv.innerHTML = "🔄 Analizando credenciales...";
        }, 1200);
        
        setTimeout(() => {
            messageDiv.innerHTML = "✅ Acceso concedido. Redirigiendo...";
        }, 2500);

        setTimeout(() => {
            window.location.href = "Magnify.html";
        }, 4000);
        
    } else {
        messageDiv.style.color = "#ff4757";
        messageDiv.innerHTML = "❌ Acceso denegado";
        messageDiv.style.animation = "shake 0.3s ease-in-out 2";
    }
});
