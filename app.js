let produtos = [];

function normalizar(texto) {
return texto
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "");
}

async function carregarProdutos() {


try {

    const response = await fetch("Itens.da.Tabela.txt");

    const buffer = await response.arrayBuffer();

    const decoder = new TextDecoder("utf-16");

    const texto = decoder.decode(buffer);

    const linhas = texto.split(/\r?\n/);

    produtos = [];

    for (const linha of linhas) {

        if (!linha || linha.includes("Status")) {
            continue;
        }

        const match = linha.match(
            /^\S+\s+\d+\s+([\d\.,]+)\s+(\d+)\s+(.+?)\s+[\d\.,]+\s+[\d\.,]+\s*$/
        );

        if (!match) {
            continue;
        }

        const preco = match[1].trim();
        const codigo = match[2].trim();
        const descricao = match[3].trim();

        if (
            codigo === "0" ||
            descricao === "" ||
            descricao === "0"
        ) {
            continue;
        }

        produtos.push({
            codigo,
            descricao,
            preco
        });
    }

    document.getElementById("info").innerHTML =
        produtos.length + " produtos carregados";

} catch (erro) {

    console.error(erro);

    document.getElementById("info").innerHTML =
        "Erro ao carregar tabela";
}


}

function pesquisar(textoBusca) {


const busca = normalizar(textoBusca);

const resultados =
    document.getElementById("resultados");

resultados.innerHTML = "";

if (!busca) {
    return;
}

const encontrados = produtos
    .filter(produto => {

        const descricao =
            normalizar(produto.descricao);

        return (
            produto.codigo.includes(busca) ||
            descricao.includes(busca)
        );
    })
    .sort((a, b) => {

        const aCodigoExato =
            a.codigo === textoBusca;

        const bCodigoExato =
            b.codigo === textoBusca;

        if (aCodigoExato && !bCodigoExato)
            return -1;

        if (!aCodigoExato && bCodigoExato)
            return 1;

        const descA =
            normalizar(a.descricao);

        const descB =
            normalizar(b.descricao);

        const aComeca =
            descA.startsWith(busca);

        const bComeca =
            descB.startsWith(busca);

        if (aComeca && !bComeca)
            return -1;

        if (!aComeca && bComeca)
            return 1;

        return descA.localeCompare(descB);
    })
    .slice(0, 100);

if (encontrados.length === 0) {

    resultados.innerHTML =
        '<div class="card">Nenhum produto encontrado</div>';

    return;
}

encontrados.forEach(produto => {

    resultados.innerHTML +=
        '<div class="card">' +
            '<div class="codigo">' +
                produto.codigo +
            '</div>' +
            '<div>' +
                produto.descricao +
            '</div>' +
            '<div class="preco">' +
                'R$ ' + produto.preco +
            '</div>' +
        '</div>';
});


}

function entrar() {


const senha =
    document.getElementById("senha").value;

if (senha === "vieira2026") {

    document.getElementById("login").style.display =
        "none";

    document.getElementById("app").style.display =
        "block";

} else {

    alert("Senha incorreta");
}


}

document
.getElementById("busca")
.addEventListener("input", function (e) {


    pesquisar(e.target.value);

});


carregarProdutos();
