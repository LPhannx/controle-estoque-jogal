// Chave usada no localStorage para armazenar o estoque
const STORAGE_KEY = 'estoqueApp';


function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


// Função para carregar o estoque do localStorage
function getEstoque() {
    const estoqueJSON = localStorage.getItem(STORAGE_KEY);
    return estoqueJSON ? JSON.parse(estoqueJSON) : [];
}


// Função para salvar o estoque no localStorage
function saveEstoque(estoque) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estoque));
    exibirEstoque();
}


function exibirEstoque() {
    const listaUL = document.getElementById('lista');
    listaUL.innerHTML = ''; 

    const estoque = getEstoque();

    if (estoque.length === 0) {
        listaUL.innerHTML = '<li>O estoque está vazio.</li>';
        return;
    }

    estoque.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}: ${item.quantidade}`;
        listaUL.appendChild(li);
    });
}


function adicionar() {
    const nomeInput = document.getElementById('produto');
    const quantidadeInput = document.getElementById('quantidade');

    const nome = nomeInput.value.trim();
    const quantidade = parseInt(quantidadeInput.value);
    const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    const nomeSemAcento = removerAcentos(nome).toLowerCase();

    if (!nome || isNaN(quantidade) || quantidade <= 0) {
        alert('Por favor, insira um nome de produto válido e uma quantidade a adicionar.');
        return;
    }

    let estoque = getEstoque();
    const produtoIndex = estoque.findIndex(item => removerAcentos(item.nome).toLowerCase() === nomeSemAcento);

    if (produtoIndex > -1) {
        estoque[produtoIndex].quantidade += quantidade;
        alert(`Quantidade de '${estoque[produtoIndex].nome}' atualizada.`);
    } else {
        estoque.push({ nome: nomeFormatado, quantidade: quantidade });
        alert(`'${nomeFormatado}' adicionado ao estoque.`);
    }

    saveEstoque(estoque); 
    nomeInput.value = '';
    quantidadeInput.value = '';
}


function remover() {
    const nomeInput = document.getElementById('produto');
    const quantidadeInput = document.getElementById('quantidade');

    const nome = nomeInput.value.trim();
    const quantidade = parseInt(quantidadeInput.value);
    const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    const nomeSemAcento = removerAcentos(nome).toLowerCase();

    if (!nome || isNaN(quantidade) || quantidade <= 0) {
        alert('Por favor, insira um nome de produto válido e a quantidade a remover.');
        return;
    }

    let estoque = getEstoque();
    const produtoIndex = estoque.findIndex(item => removerAcentos(item.nome).toLowerCase() === nomeSemAcento);

    if (produtoIndex > -1) {
        const produto = estoque[produtoIndex];

        if (produto.quantidade >= quantidade) {
            produto.quantidade -= quantidade;
            alert(`${quantidade} unidades de '${produto.nome}' removidas.`);

            if (produto.quantidade === 0) {
                estoque.splice(produtoIndex, 1);
                alert(`'${produto.nome}' esgotado e removido do estoque.`);
            }
        } else {
            alert(`ERRO: Apenas ${produto.quantidade} unidades de '${produto.nome}' estão em estoque.`);
        }
    } else {
        alert(`ERRO: '${nomeFormatado}' não encontrado no estoque.`);
    }

    saveEstoque(estoque);
    nomeInput.value = '';
    quantidadeInput.value = '';
}


// Carrega o estoque ao abrir a página
document.addEventListener('DOMContentLoaded', exibirEstoque);