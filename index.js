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
            for (let i=0; i<cacheXml.length; i++) {
                if(cacheXml[i].title.toLowerCase().includes(searchTerm) || cacheXml[i].text.toLowerCase().includes(searchTerm)) {
                    pagesObject.push({
                        id: cacheXml[i].id,
                        title: cacheXml[i].title,
                        text: cacheXml[i].text,
                        occurrences: countOccurrences(cacheXml[i].title, cacheXml[i].text, searchTerm)
                    })
                }
            }

            pagesObject = pagesObject.sort(function (a, b) {
                return b.occurrences - a.occurrences
            }).slice(0, 50)
    
            cacheResult[searchTerm] = pagesObject
        
            console.log(`fazendo uma nova pesquisa com o termo "${searchTerm}"`)
            showResults(pagesObject)
        }
    }
}

function showResults(results) {
    searchList = ""
    results.forEach(function (page) {
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
    document.getElementById("xmlData").innerHTML = searchList
}

function countWordOccurrences(title, text) {
    const result = {}

    const words = [...title.toLowerCase().split(' '), ...text.toLowerCase().split(' ')].filter((word) => word.length >= 4)

    words.forEach(function (word) {
        if (result[word]) {
            result[word] += 10
        } else {
            result[word] = 10
        }
    })

    words.forEach(function (word) {
        if (result[word]) {
            result[word]++
        } else {
            result[word] = 1
        }
    })

    return result
}

function countOccurrences(title, text, searchTerm) {
    const words = [...title.toLowerCase().split(' '), ...text.toLowerCase().split(' ')].filter((word) => word.length >= 4)
    
    var count = 0

    words.forEach(function (word) {
        if (word.includes(searchTerm)) {
            count++
        }
    })

    return count
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