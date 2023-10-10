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
            pagesArray.forEach(function (page) {
                var id = page.querySelector("id").textContent
                var title = page.querySelector("title").textContent
                var text = page.querySelector("text").textContent
                cacheXml.push({
                    data: {id: id, title: title, text: text,},
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
    searchTerm = document.getElementById("searchInput").value.toLowerCase()
    searchButton.addEventListener("click", addStyle())

    searchList = ""

    if (cacheResult[searchTerm]) {
        results = cacheResult[searchTerm]

        showResults(results)
        console.log(`buscando no cache o termo "${searchTerm}"`)
    } else {
        if ((searchTerm === "") || (searchTerm === " ") || (searchTerm.length <= 3)) {
            searchEmpty()
        } else {
            pages = []

            cacheXml.forEach(function (page) {
                if (page.occurrences[searchTerm]) {
                    pages.push({
                        content: page,
                        occurrences: page.occurrences[searchTerm]
                    })
                }
            })

            pages = pages.sort(function (a, b) {
                return b.occurrences - a.occurrences
            }).slice(0, 30)

            cacheResult[searchTerm] = pages

            console.log(`fazendo uma nova pesquisa com o termo "${searchTerm}"`)
            
            showResults(pages)
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

    title.forEach(function (word) {
        if (result[word]) {
            result[word] += 10
        } else {
            result[word] = 10
        }
    })

    text.forEach(function (word) {
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
    results.forEach(function (page) {
        searchList +=
            "<summary>" +
            " <span>" + "ID: " + page.content.data.id + "</span> " +
            page.content.data.title +
            " <span>" + page.occurrences + " occurrences" + "</span>" +
            "<details>" +
            page.content.data.text +
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
