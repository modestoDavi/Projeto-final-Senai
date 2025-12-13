// Seleciona o botão hambúrguer e a lista de links
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// Adiciona um evento de 'click' ao botão
hamburger.addEventListener("click", () => {
    // Alterna a classe 'active' na lista de links
    navLinks.classList.toggle("active");
    // Alterna a classe 'active' no botão (para a animação do "X")
    hamburger.classList.toggle("active");
});

// Fecha o menu ao clicar em um link (para mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Fecha o menu ao redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});