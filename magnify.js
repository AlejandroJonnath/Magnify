let player;
let repeat = false;
let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
let currentVideoIndex = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoPlayer', {
        height: '457,5',
        width: '100%',
        videoId: playlist.length > 0 ? playlist[currentVideoIndex] : 'dQw4w9WgXcQ', // Video de inicio por defecto
        playerVars: {
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// 📌 Maneja los cambios en el estado del reproductor
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        if (repeat) {
            player.playVideo();
            showNotification("🔄 Repitiendo el video...", "info");
        } else {
            if (currentVideoIndex < playlist.length - 1) {
                currentVideoIndex++;
                loadYouTubePlayer(playlist[currentVideoIndex]);
                showNotification("⏭ Pasando al siguiente video", "success");
            } else {
                showNotification("🎵 Fin de la lista de reproducción", "info");
            }
        }
    }
}

// 📌 Muestra una notificación en la pantalla
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type;
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.style.opacity = 0;
    }, 3000);
}

// 📌 Carga un video en el reproductor
function loadYouTubePlayer(videoId) {
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
    }
}

// 📌 Carga la lista de reproducción desde el localStorage
function loadPlaylist() {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = "";
    playlist.forEach((videoId, index) => {
        const li = document.createElement('li');
        li.textContent = `🎵 Video ${index + 1}`;
        li.onclick = () => {
            currentVideoIndex = index;
            loadYouTubePlayer(videoId);
            showNotification(`Cargando video ${index + 1}`, "info");
        };
        videoList.appendChild(li);
    });
}

// 📌 Agregar video a la lista de reproducción
document.getElementById('addListBtn').addEventListener('click', () => {
    const videoUrl = prompt("Ingrese la URL del video de YouTube:");
    if (videoUrl) {
        try {
            const url = new URL(videoUrl);
            const videoId = url.searchParams.get("v");

            if (videoId) {
                const cleanVideoId = videoId.split("&")[0]; // Elimina parámetros extra
                playlist.push(cleanVideoId);
                localStorage.setItem('playlist', JSON.stringify(playlist));
                loadPlaylist();
                showNotification("➕ Video agregado a la lista", "success");
            } else {
                showNotification("❌ URL no válida: Falta el parámetro 'v'", "error");
            }
        } catch (error) {
            showNotification("❌ URL no válida", "error");
        }
    }
});

// 📌 Eliminar video de la lista de reproducción
document.getElementById('removeListBtn').addEventListener('click', () => {
    if (playlist.length === 0) {
        showNotification("❌ No hay videos en la lista", "error");
        return;
    }

    const videoIndex = prompt(`Ingrese el número del video a eliminar (1-${playlist.length}):`);
    const index = parseInt(videoIndex) - 1;

    if (index >= 0 && index < playlist.length) {
        playlist.splice(index, 1);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        loadPlaylist();
        showNotification("🗑 Video eliminado de la lista", "success");
    } else {
        showNotification("❌ Número de video inválido", "error");
    }
});

// 📌 Controles básicos del reproductor
document.getElementById('playBtn').addEventListener('click', () => player.playVideo());
document.getElementById('pauseBtn').addEventListener('click', () => player.pauseVideo());

// 📌 Activar/Desactivar el modo repetir
document.getElementById('repeatBtn').addEventListener('click', () => {
    repeat = !repeat;
    showNotification(`🔄 Modo repetir: ${repeat ? "Activado" : "Desactivado"}`, "info");
});

// 📌 Verificar si el video está bloqueado para `iframe` y cargarlo correctamente
function checkVideo(videoId) {
    let iframe = document.getElementById("videoPlayer");
    let button = document.getElementById("openYouTubeBtn");
    
    // Verificar si el video se puede incrustar
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    .then(response => {
        if (response.ok) {
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            button.style.display = "none"; // Ocultar el botón
        } else {
            iframe.style.display = "none";
            button.style.display = "block"; // Mostrar botón
            button.onclick = () => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
        }
    })
    .catch(() => {
        iframe.style.display = "none";
        button.style.display = "block"; 
        button.onclick = () => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    });
}

// 📌 Cargar la lista de reproducción al cargar la página
window.onload = loadPlaylist;
