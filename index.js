const parser = new DOMParser()
const xhttp = new XMLHttpRequest()

const searchInput = document.getElementById("searchInput")
const searchButton = document.getElementById("searchButton")

var pagesArray = []

let loading = true

function loadXml() {
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var xmlString = this.responseText
            saveXml(xmlString)
        }
    }

    xhttp.open("GET", "data/verbetesWikipediaFull.xml", true)
    xhttp.send()
}

function saveXml(xmlString) {
    xml = parser.parseFromString(xmlString, "text/html")
    var pages = xml.querySelectorAll("page")
    pagesArray = pages

    return pagesArray
}

loadXml()

const hero = document.getElementById("hero")

var searchTerm = ""
var searchList = ``

function search() {
    searchTerm = document.getElementById("searchInput").value.toLowerCase()
    searchButton.addEventListener("click", addStyle())

    if ((searchTerm === "") || (searchTerm === " ") || (searchTerm.length <= 1)) {
        searchEmpty()
    } else {
        searchList = ``
        pagesObject = []

        pagesArray.forEach(function (page) {
            var title = page.querySelector("title").textContent
            var text = page.querySelector("text").textContent

            if (text.toLowerCase().includes(searchTerm)) {
                pagesObject.push({
                    title: title,
                    text: text,
                    occurrences: countOccurrences(title, text, searchTerm)
                })
            }
        })

        pagesObject.sort(function (a, b) {
            return b.occurrences - a.occurrences
        })

        pagesObject.forEach(function (page) {
            searchList +=
                "<summary>" +
                page.title + " <span>" + page.occurrences + " ocorrências" + "</span>" +
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

const searchEmpty = () => {
    searchList += "<p style='padding: 0 3.5em'>" +
        "Nenhum resultado encontrado" +
        "</p>"
}

function addStyle() {
    searchInput.style.marginBottom = "0px"
    searchInput.style.width = "65%"
    hero.style.width = "95%"
    hero.style.flexDirection = "row"
}