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

// Cache de elementos DOM
let elementosCache = null;
let livroId = null;

// Inicialização rápida - sem bloquear a thread principal
document.addEventListener('DOMContentLoaded', () => {
    // 1. Buscar ID imediatamente
    const params = new URLSearchParams(window.location.search);
    livroId = params.get('id');
    
    if (!livroId) {
        redirecionarComErro("Nenhum livro selecionado!");
        return;
    }
    
    // 2. Inicializar Firebase de forma assíncrona
    setTimeout(() => inicializarApp(), 0);
});

async function inicializarApp() {
    try {
        // 3. Inicializar Firebase e buscar dados
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // 4. Cache de elementos DOM (apenas uma vez)
        if (!elementosCache) {
            elementosCache = {
                loading: document.getElementById('loading'),
                formSection: document.getElementById('form-section'),
                errorMessage: document.getElementById('error-message'),
                livroIdDisplay: document.getElementById('livroIdDisplay'),
                btnAtualizar: document.getElementById('btnAtualizar'),
                campos: {
                    codigo: document.getElementById('codigo'),
                    titulo: document.getElementById('titulo'),
                    autor: document.getElementById('autor'),
                    editora: document.getElementById('editora'),
                    categoria: document.getElementById('categoria'),
                    status: document.getElementById('status')
                }
            };
        }
        
        // 5. Carregar dados (única operação de rede)
        await carregarDadosLivro(db, elementosCache);
        
    } catch (error) {
        console.error("Erro na inicialização:", error);
        mostrarErroRapido("Erro ao inicializar aplicação");
    }
}

// Função otimizada para carregar dados
async function carregarDadosLivro(db, elementos) {
    try {
        // Medir tempo de carregamento (opcional, para debug)
        const inicio = performance.now();
        
        const docRef = doc(db, "livros", livroId);
        const docSnap = await getDoc(docRef);
        
        const fim = performance.now();
        console.log(`Tempo de busca: ${(fim - inicio).toFixed(2)}ms`);
        
        if (docSnap.exists()) {
            const dados = docSnap.data();
            
            // Atualizar UI de forma otimizada
            requestAnimationFrame(() => {
                elementos.loading.style.display = 'none';
                elementos.formSection.style.display = 'block';
                
                // Preencher campos em batch
                preencherCampos(elementos.campos, dados);
                
                // Foco no campo principal
                elementos.campos.titulo.focus();
                
                // Configurar evento de salvar (uma vez)
                if (!elementos.btnAtualizar._hasListener) {
                    elementos.btnAtualizar.addEventListener('click', () => salvarAlteracoes(db, elementos));
                    elementos.btnAtualizar._hasListener = true;
                }
            });
            
        } else {
            mostrarErroRapido("Livro não encontrado!");
        }
        
    } catch (error) {
        console.error("Erro ao carregar:", error);
        mostrarErroRapido("Erro ao buscar dados do livro");
    }
}

// Função otimizada para preencher campos
function preencherCampos(campos, dados) {
    campos.codigo.value = dados.codigo || '';
    campos.titulo.value = dados.titulo || '';
    campos.autor.value = dados.autor || '';
    campos.editora.value = dados.editora || '';
    campos.categoria.value = dados.categoria || '';
    campos.status.value = dados.status || 'Disponível';
}

// Validação simplificada
function validarFormularioRapido(campos) {
    if (!campos.titulo.value.trim()) {
        alert("Informe o título do livro.");
        campos.titulo.focus();
        return false;
    }
    if (!campos.codigo.value.trim()) {
        alert("Informe o código do livro.");
        campos.codigo.focus();
        return false;
    }
    return true;
}

// Salvar alterações otimizado
async function salvarAlteracoes(db, elementos) {
    if (!validarFormularioRapido(elementos.campos)) return;
    
    if (!confirm("Salvar alterações?")) return;
    
    const btn = elementos.btnAtualizar;
    const textoOriginal = btn.innerHTML;
    
    try {
        // Desabilitar botão rapidamente
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';
        
        const dadosAtualizados = {
            titulo: elementos.campos.titulo.value.trim(),
            codigo: elementos.campos.codigo.value.trim(),
            autor: elementos.campos.autor.value.trim(),
            editora: elementos.campos.editora.value.trim(),
            categoria: elementos.campos.categoria.value,
            status: elementos.campos.status.value,
            dataAtualizacao: new Date()
        };
        
        const docRef = doc(db, "livros", livroId);
        await updateDoc(docRef, dadosAtualizados);
        
        alert("✅ Livro atualizado!");
        window.location.href = "/pages/acervo.html";
        
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("❌ Erro: " + error.message);
        
        // Restaurar botão
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
    }
}

// Funções auxiliares rápidas
function mostrarErroRapido(mensagem) {
    if (elementosCache) {
        elementosCache.loading.style.display = 'none';
        elementosCache.errorMessage.style.display = 'block';
    } else {
        setTimeout(() => alert(mensagem), 100);
    }
}

function redirecionarComErro(mensagem) {
    alert(mensagem);
    setTimeout(() => {
        window.location.href = "/pages/acervo.html";
    }, 500);
}