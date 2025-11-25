import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqCzcbTf4ZWwQKXGY5ELD3qjxjokay6Ds",
    authDomain: "projeto-final-bb566.firebaseapp.com",
    projectId: "projeto-final-bb566",
    storageBucket: "projeto-final-bb566.firebasestorage.app",
    messagingSenderId: "964611662890",
    appId: "1:964611662890:web:b0988263a185c92da1cf53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Pegar o ID da URL (?id=xyz...)
const params = new URLSearchParams(window.location.search);
const idLivro = params.get('id');

// Se não tiver ID, volta para o acervo
if (!idLivro) {
    alert("Nenhum livro selecionado!");
    window.location.href = "/pages/acervo.html";
}

// 2. Buscar dados atuais do livro para preencher a tela
async function carregarDados() {
    try {
        const docRef = doc(db, "livros", idLivro);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data();

            // Preencher os inputs
            document.getElementById('titulo').value = dados.titulo;
            document.getElementById('codigo').value = dados.codigo;
            document.getElementById('autor').value = dados.autor;
            document.getElementById('editora').value = dados.editora || '';
            document.getElementById('categoria').value = dados.categoria;
            document.getElementById('status').value = dados.status || 'Disponível';
        } else {
            alert("Livro não encontrado!");
            window.location.href = "/pages/acervo.html";
        }
    } catch (error) {
        console.error("Erro ao buscar:", error);
    }
}

// 3. Salvar as alterações
document.getElementById('btnAtualizar').addEventListener('click', async () => {
    const titulo = document.getElementById('titulo').value;
    const codigo = document.getElementById('codigo').value;
    const autor = document.getElementById('autor').value;
    const editora = document.getElementById('editora').value;
    const categoria = document.getElementById('categoria').value;
    const status = document.getElementById('status').value;

    try {
        const docRef = doc(db, "livros", idLivro);

        // updateDoc atualiza apenas os campos enviados, sem apagar o resto
        await updateDoc(docRef, {
            titulo: titulo,
            codigo: codigo,
            autor: autor,
            editora: editora,
            categoria: categoria,
            status: status // Isso vai atualizar o relatório automaticamente
        });

        alert("Livro atualizado com sucesso!");
        window.location.href = "/pages/acervo.html";

    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao atualizar: " + error.message);
    }
});

// Inicia
carregarDados();