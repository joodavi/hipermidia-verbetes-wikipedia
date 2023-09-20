const parser = new DOMParser()
const xhttp = new XMLHttpRequest()

// criar um fator ocorrencia/tamanho_texto

const hero = document.getElementById("hero")

const searchInput = document.getElementById("searchInput")
const searchButton = document.getElementById("searchButton")
var searchTerm = ""
var searchList = ``

var pagesArray = []

function loadXml() {
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var xmlString = this.responseText
            searchXML(xmlString)
        }
    }

    xhttp.open("GET", "data/verbetesWikipediaFull.xml", true)
    xhttp.send()
}

function addStyle() {
    searchInput.style.marginBottom = "0px"
    searchInput.style.width = "65%"
    hero.style.width = "95%"
    hero.style.flexDirection = "row"
}

function searchXML(xmlString) {
    xml = parser.parseFromString(xmlString, "text/html")
    var pages = xml.querySelectorAll("page")

    searchTerm = document.getElementById("searchInput").value.toLowerCase()
    searchButton.addEventListener("click", addStyle())

    searchList = ``
    pagesArray = []

    pages.forEach(function (page) {
        var title = page.querySelector("title").textContent
        var text = page.querySelector("text").textContent

        if (text.toLowerCase().includes(searchTerm)) {
            pagesArray.push({
                title: title,
                text: text,
                occurrences: countOccurrences(title, text, searchTerm),
                relevanceFactor: factor(title, text, searchTerm)
            })
        }
    })

    pagesArray.sort(function (a, b) {
        return b.occurrences - a.occurrences
    })

    if ((pagesArray.length == 0) || (searchTerm === "") || (searchTerm === " ")) {
        searchList += "<p>" +
            "Nenhum resultado encontrado" +
            "</p>"
    } else {
        pagesArray.forEach(function (page) {
            searchList +=
                "<summary>" +
                page.title + " <span>" + page.occurrences + " ocorrências | rf: " + Math.floor(page.relevanceFactor) + "</span>" +
                "<details>" +
                page.text +
                "</details>" +
                "</summary>"
        })
    }

    document.getElementById("xmlData").innerHTML = searchList
}

function countOccurrences(title, text, searchTerm) {
    title = title.toLowerCase()
    text = text.toLowerCase()

    title = title.split(' ')
    text = text.split(' ')

    var count = 0

    text.forEach(function (text) {
        if (text.includes(searchTerm)) {
            count++
        }
    })

    title.forEach(function (title) {
        if (title.includes(searchTerm)) {
            count += 10
        }
    })

    return count
}

function factor(title, text, searchTerm) {
    var count = countOccurrences(title, text, searchTerm)

    var factor = (text.length/count)

    return factor
}