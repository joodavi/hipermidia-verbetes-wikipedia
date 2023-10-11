// todo
// mais de uma palavra na busca
// mudar o nome filtered
// otimizar código
// fazer um readme

const parser = new DOMParser()
const xhttp = new XMLHttpRequest()

const hero = document.getElementById("hero")
const searchInput = document.getElementById("searchInput")
const searchButton = document.getElementById("searchButton")

var searchTerm = ""
var searchList = ""

var cacheXml = []
var cacheResult = {}
var pagesArray = {}

// função para parsear o xml e criar o cache
function loadingXml() {
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var xmlString = this.responseText
            xmlString = parser.parseFromString(xmlString, "text/html")
            pagesArray = xmlString.querySelectorAll("page")
            console.log("tempo de carregamento do xml: ")
            pagesArray.forEach(page => {
                var id = page.querySelector("id").textContent
                var title = page.querySelector("title").textContent
                var text = page.querySelector("text").textContent
                cacheXml.push({
                    id: id,
                    title: title,
                    text: text,
                    occurrences: countWordOccurrences(title, text)
                })
            })
        }
    }
    xhttp.open("GET", "data/verbetesWikipediaFull.xml", true)
    xhttp.send()
}

loadingXml()

const search = () => {
    // recebe a consulta do input
    searchTerm = document.getElementById("searchInput").value.toLowerCase()
    searchButton.addEventListener("click", addStyle())

    searchList = ""

    // checa se já existe uma pesquisa no cache
    if (cacheResult[searchTerm]) {
        results = cacheResult[searchTerm]

        // chama a função que cria o html para a página
        showResults(results)
    } else {
        // elimina buscas em vazio, espaço em branco ou palavras com menos que 5 caracteres
        if ((searchTerm === "") || (searchTerm === " ") || (searchTerm.length <= 4)) {
            searchEmpty()
        } else {
            // verifica se a busca é composta ou não
            if (searchTerm.split(' ').length == 1) {
                pages = []

                // passa pelo cache do xml buscando ocorrências da busca e insere as "páginas dentro de um array"
                cacheXml.forEach(page => {
                    if (page.occurrences[searchTerm]) {
                        pages.push({
                            id: page.id,
                            title: page.title,
                            text: page.text,
                            occurrences: page.occurrences[searchTerm],
                        })
                    }
                })

                // faz a ordenação com base nas ocorrências e resume o array a somente 30 elementos
                pages = pages.sort((a, b) => {
                    return b.occurrences - a.occurrences
                }).slice(0, 30)

                // salva em cache termo e a busca
                cacheResult[searchTerm] = pages

                // chama a função que cria o html para a página
                showResults(pages)
            } else {
                searchTerm = searchTerm.split(' ')
                words = []
                pages = []

                // passa pelo cache e cria um array com as "páginas" que ocorram os dois termos de busca...
                // ...mesmo que separadamente, neste array tbm serão inseridos score e um array com título... 
                // ...e texto juntos
                cacheXml.forEach(page => {
                    if (page.occurrences[searchTerm[0]] && page.occurrences[searchTerm[1]]) {
                        words.push({
                            id: page.id,
                            title: page.title,
                            text: page.text,
                            occurrences: page.occurrences[searchTerm[0]] + page.occurrences[searchTerm[1]],
                            score: 0,
                            filtered: [...page.title.toLowerCase().split(' '), ...page.text.toLowerCase().split(' ')].filter((word) => word.length >= 4)
                        })
                    }
                })

                // verifica se dentro do array existe ocorrências onde o primeiro e segundo termo da busca...
                // ...estão em sequência e dá 100 pontos no score para cada ocorrência, isso foi feito...
                // ...por entender que não são ocorrências como as que ocorrem em título e texto
                words.forEach(word => {
                    word.filtered.forEach((filter, index) => {
                        if (index < word.filtered.length && filter === searchTerm[0] && word.filtered[index + 1] === searchTerm[1]) {
                            word.score += 100
                        }
                    })
                })

                // cria um array de "páginas" com a mesma condição anterior: os termos devem estar juntos
                words.forEach(word => {
                    let found = false
                    word.filtered.forEach((filter, index) => {
                        if (index < word.filtered.length && filter === searchTerm[0] && word.filtered[index + 1] === searchTerm[1]) {
                            if (!found) {
                                pages.push({
                                    id: word.id,
                                    title: word.title,
                                    text: word.text,
                                    occurrences: word.occurrences,
                                    score: word.score
                                })
                                found = true
                            }
                        }
                    })
                })

                // faz a ordenação com base no score e resume o array a somente 30 elementos
                pages = pages.sort((a, b) => {
                    return b.score - a.score
                }).slice(0, 30)

                // salva em cache termo e a busca
                cacheResult[searchTerm.join(' ')] = pages

                // chama a função que cria o html para a página
                showResultsWithScore(pages)
            }
        }
    }
    document.getElementById("xmlData").innerHTML = searchList
}

// contar as ocorrências, 10 para ocorrência no título, 1 para ocorrência no texto
function countWordOccurrences(title, text) {
    const result = {}

    // textos são colocados dentro de um vetor após serem separados com base em espaços em branco 
    // também ocorre um filtro para que palavras com menos de 5 caracteres sejam retiradas do vetor e evitar operações desnecessárias
    title = title.toLowerCase().split(' ').filter((word) => word.length >= 4)
    text = text.toLowerCase().split(' ').filter((word) => word.length >= 4)

    title.forEach(word => {
        if (result[word]) {
            result[word] += 10
        } else {
            result[word] = 10
        }
    })

    text.forEach(word => {
        if (result[word]) {
            result[word]++
        } else {
            result[word] = 1
        }
    })

    return result
}

// função que gera o html com base nos resultados de busca
function showResults(results) {
    results.forEach(page => {
        searchList +=
            "<summary>" +
            " <span>" + "ID: " + page.id + "</span> " +
            page.title +
            " <span>" + page.occurrences + " occurrences" + "</span>" +
            "<details>" +
            page.text +
            "</details>" +
            "</summary>"
    })
}

function showResultsWithScore(results) {
    results.forEach(page => {
        searchList +=
            "<summary>" +
            " <span>" + "ID: " + page.id + "</span> " +
            page.title +
            " <span>" + page.occurrences + " occurrences" + "</span>" + " <span>" + "score: " + page.score + "</span>" +
            "<details>" +
            page.text +
            "</details>" +
            "</summary>"
    })
}

// gambiarras para css
const searchEmpty = () => {
    searchList +=
        "<p style='padding: 0 3.5em'>" +
        "Nenhum resultado encontrado" +
        "</p>"

}

const addStyle = () => {
    searchInput.style.marginBottom = "0px"
    searchInput.style.width = "65%"
    hero.style.width = "95%"
    hero.style.flexDirection = "row"
}
