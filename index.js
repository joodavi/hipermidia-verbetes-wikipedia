const parser = new DOMParser()
const xhttp = new XMLHttpRequest()

const hero = document.getElementById("hero")
const searchInput = document.getElementById("searchInput")
const searchButton = document.getElementById("searchButton")

var searchTerm = ""
var searchList = ""

var cacheResult = {}
var pagesArray = {}
var cacheXml = []

function loadingXml() {
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var xmlString = this.responseText
            xmlString = parser.parseFromString(xmlString, "text/html")
            pagesArray = xmlString.querySelectorAll("page")
            console.log("tempo de carregamento do xml: ")
            pagesArray.forEach(function (page) {
                var title = page.querySelector("title").textContent
                var text = page.querySelector("text").textContent
                cacheXml.push({
                    title: title,
                    text: text,
                    occurrences: countWordOccurrences(title, text)
                })
                
            })
            return cacheXml
        }
    }
    xhttp.open("GET", "data/verbetesWikipedia.xml", true)
    xhttp.send()
}

loadingXml()

function search() {
    searchTerm = document.getElementById("searchInput").value.toLowerCase()
    searchButton.addEventListener("click", addStyle())
    if (cacheResult[searchTerm]) {
        results = cacheResult[searchTerm]

        showResults(results)
        console.log(`buscando no cache o termo "${searchTerm}"`)
    } else {
        if ((searchTerm === "") || (searchTerm === " ") || (searchTerm.length <= 3)) {
            searchEmpty()
        } else {
            pagesObject = []
            cacheXml.forEach(function (page) {

                if (page.title.includes(searchTerm) || page.text.includes(searchTerm)) {
                    pagesObject.push({
                        title: page.title,
                        text: page.text,
                        occurrences: page.result[word]
                    })
                }
            })
            
            var results = cacheXml.filter(entry => {
                const titleMatch = entry.title.toLowerCase().includes(searchTerm)
                const textMatch = entry.text.toLowerCase().includes(searchTerm)
        
                return titleMatch || textMatch
            })
            
            console.log(results.sort((a, b) => b.occurrences[searchTerm] - a.occurrences[searchTerm]))
    
            cacheResult[searchTerm] = results
        
            console.log(`fazendo uma nova pesquisa com o termo "${searchTerm}"`)
            showResults(results.slice(0, 50))
        }
    }
}

function showResults(results) {
    searchList = ""
    results.forEach(function (page) {
        searchList +=
            "<summary>" +
            page.title +
            "<details>" +
            page.text +
            "</details>" +
            "</summary>"
    })
    document.getElementById("xmlData").innerHTML = searchList
}

function countWordOccurrences(title, text) {
    const result = {}

    title = title.toLowerCase().split(' ').filter((word) => word.length >= 4)
    text = text.toLowerCase().split(' ').filter((word) => word.length >= 4)

    for (let word of title) {
        if (result[word]) {
            result[word] += 10
        } else {
            result[word] = 10
        }
    }

    for (let word of text) {
        if (result[word]) {
            result[word]++
        } else {
            result[word]= 1
        }
    }

    return result
}

const searchEmpty = () => {
    searchList += "<p style='padding: 0 3.5em'>" +
        "Nenhum resultado encontrado" +
        "</p>"

    document.getElementById("xmlData").innerHTML = searchList
    searchList = ""
}

const addStyle = () => {
    searchInput.style.marginBottom = "0px"
    searchInput.style.width = "65%"
    hero.style.width = "95%"
    hero.style.flexDirection = "row"
}