var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var path = require("path")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"))
var PORT = process.env.PORT || 3000;
let login = false
let register = false

var tab = [
    { id: 1, login: "ciskalw", password: "zaq1@WSX", age: 18, uczen: "on", plec: "M" },
    { id: 2, login: "Antoni", password: "Q!wertyuiop", age: 23, uczen: "", plec: "M" },
    { id: 3, login: "krysia123", password: "haselko", age: 11, uczen: "on", plec: "K" },
]

app.post("/login", function (req, res) {
    for (i = 0; i < tab.length; i++) {
        if (tab[i].login == req.body.login && tab[i].password == req.body.password) {
            login = true;
            res.redirect("/admin")
        }
    }
    if (login == false) {
        res.send("Podałeś/aś błędny login lub hasło")
    }
})

app.post("/register", function (req, res) {
    console.log(req.body)
    for (i = 0; i < tab.length; i++) {
        if (tab[i].login == req.body.login) {
            res.send("Taki użytkownik już istnieje")
            register = false
            break
        } else {
            register = true
        }
    }
    if (register) {
        console.log(req.body)
        tab.push(req.body)
        tab[tab.length - 1].id = tab.length
        res.redirect("/register")
    }
})

app.post("/sort", function (req, res) {
    if (req.body.sort == "R") {
        tab.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
        let tabela = "<pre><a href=sort> sort /</a><a href=gender> gender |</a><a href=show> show </a></pre><br><form action=/sort method = POST onchange = this.submit()><input type=radio name=sort value=R checked>rosnąco<input type=radio name=sort value=M>malejąco<br><br><table style=border:solid 1px black>"
        for (i = 0; i < tab.length; i++) {
            tabela += "<tr style=border:solid 1px black><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black>user: " + tab[i].login + "-  " + tab[i].password + "</td><td style=border:solid 1px black> uczeń: "
            if (tab[i].uczen == "on") {
                tabela += "<input type=checkbox checked disabled> </td>"
            } else {
                tabela += "<input type=checkbox disabled> </td>"
            }
            tabela += "<td style=border:solid 1px black>wiek: " + tab[i].age + "</td><td style=border:solid 1px black>płeć: " + tab[i].plec + "</td></tr>"
        }
        tabela += "</table>"
        res.send(tabela)
    } else if (req.body.sort == "M") {
        tab.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        }).reverse()
        let tabela = "<pre><a href=sort> sort /</a><a href=gender> gender |</a><a href=show> show </a></pre><br><form action=/sort method = POST onchange = this.submit()><input type=radio name=sort value=R>rosnąco<input type=radio name=sort value=M checked>malejąco<br><br><table style=border:solid 1px black>"
        for (i = 0; i < tab.length; i++) {
            tabela += "<tr style=border:solid 1px black><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black>user: " + tab[i].login + "-  " + tab[i].password + "</td><td style=border:solid 1px black> uczeń: "
            if (tab[i].uczen == "on") {
                tabela += "<input type=checkbox checked disabled> </td>"
            } else {
                tabela += "<input type=checkbox disabled> </td>"
            }
            tabela += "<td style=border:solid 1px black>wiek: " + tab[i].age + "</td><td style=border:solid 1px black>płeć: " + tab[i].plec + "</td></tr>"
        }
        tabela += "</table>"
        res.send(tabela)
    }
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})

app.get("/:id", function (req, res) {
    switch (req.params.id) {
        case "main":
            res.sendFile(path.join(__dirname + "/static/pages/main.html"))
            break
        case "login":
            res.sendFile(path.join(__dirname + "/static/pages/login.html"))
            break
        case "register":
            res.sendFile(path.join(__dirname + "/static/pages/register.html"))
            break
        case "admin":
            if (login) {
                res.sendFile(path.join(__dirname + "/static/pages/admin.html"))
            } else {
                res.sendFile(path.join(__dirname + "/static/pages/denied.html"))
            }
            break
        case "show":
            if (login) {
                let tabela = "<pre><a href=sort> sort |</a><a href=gender> gender |</a><a href=show> show </a></pre><table style=border:solid 1px black>"
                for (i = 0; i < tab.length; i++) {
                    tabela += "<tr style=border:solid 1px black><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black>user: " + tab[i].login + "-  " + tab[i].password + "</td><td style=border:solid 1px black> uczeń: "
                    if (tab[i].uczen == "on") {
                        tabela += "<input type=checkbox checked disabled> </td>"
                    } else {
                        tabela += "<input type=checkbox disabled> </td>"
                    }
                    tabela += "<td style=border:solid 1px black>wiek: " + tab[i].age + "</td><td style=border:solid 1px black>płeć: " + tab[i].plec + "</td></tr>"
                }
                tabela += "</table>"
                res.send(tabela)
            } else {
                res.send("Brak dostępu")
            }
            break
        case "gender":
            if (login) {
                let links = "<pre><a href=sort> sort |</a><a href=gender> gender |</a><a href=show> show </a></pre>"
                let table_male = "<table style=border:solid 1px black>"
                let table_female = "<table style=border:solid 1px black>"
                let string = ""
                for (i = 0; i < tab.length; i++) {
                    if (tab[i].plec == "M" || tab[i].plec == "m") {
                        table_male += "<tr><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black> płeć: " + tab[i].plec + "</td></tr>"
                    } else if (tab[i].plec == "K" || tab[i].plec == "k") {
                        table_female += "<tr><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black> płeć: " + tab[i].plec + "</td></tr>"
                    }
                }
                table_male += "</table><br>"
                table_female += "</table>"
                string += links + table_male + table_female
                res.send(string)
            } else {
                res.send("Brak dostępu")
            }
            break
        case "sort":
            if (login) {
                let tabela_x = "<pre><a href=sort> sort |</a><a href=gender> gender |</a><a href=show> show </a></pre><br><form action=/sort method = POST onchange = this.submit()><input type=radio name=sort value=R>rosnąco<input type=radio name=sort value=M>malejąco<br><br><table style=border:solid 1px black>"
                for (i = 0; i < tab.length; i++) {
                    tabela_x += "<tr><td style=border:solid 1px black> id: " + tab[i].id + "</td><td style=border:solid 1px black>user: " + tab[i].login + "-  " + tab[i].password + "</td><td style=border:solid 1px black> uczeń: "
                    if (tab[i].uczen == "on") {
                        tabela_x += "<input type=checkbox checked disabled> </td>"
                    } else {
                        tabela_x += "<input type=checkbox disabled> </td>"
                    }
                    tabela_x += "<td style=border:solid 1px black>wiek: " + tab[i].age + "</td><td style=border:solid 1px black>płeć: " + tab[i].plec + "</td></tr>"
                }
                tabela_x += "</table>"
                res.send(tabela_x)
            } else {
                res.send("Brak dostępu")
            }
            break
        case "logout":
            login = false
            res.redirect("/register")
            break
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})