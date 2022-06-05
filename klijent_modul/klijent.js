const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5005;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let ucitajStranicu=(naziv,zavrsetak="html")=>{
    return fs.readFileSync(path.join(__dirname+"/Stranice/"+naziv+"."+zavrsetak),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(ucitajStranicu("index"));
});

app.get("/dodajOglas",(req,res)=>{
    res.send(ucitajStranicu("dodaj_izmeni")
    .replace("{#btnDodajT#}","Dodaj oglas")
    .replace("{#inputHiddenOglasId}","")
    .replace("{#akcijaPutanja}","/snimiOglas")
    .replace("//{skriptaDeoUbaci}",ucitajStranicu("skripta_izmena","js"))
    .replace('"##dataObjOglas##"',null)
    );
});
app.post("/snimiOglas",(req,res)=>{
    console.log(req.body)
    axios.post("http://localhost:3005/addOglas",{
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        oznake:req.body.oznake,
        email:req.body.email
    })
    //res.redirect("/dodajOglas")
    
    res.redirect("/sviOglasi");

})

app.get("/obrisiOglas/:id",(req,res)=>{
    axios.delete(`http://localhost:3005/deleteOglas/${req.params["id"]}`)
    res.redirect("/sviOglasi");
});


app.post('/cuvanjeIzmena',(req,res)=>{
    console.log(req.body)
    axios.post("http://localhost:3005/izmeniOglass",{
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        oznake:req.body.oznake,
        email:req.body.email,
        id:req.body.id
    })
    res.redirect("/sviOglasi");
})



app.get("/izmeniOglas/:id",(req,res)=>{
    axios.get(`http://localhost:3005/getoglasbyid/${req.params["id"]}`)
    .then(response=>{
        let oglas=response.data

        res.send(ucitajStranicu("dodaj_izmeni")
        .replace("{#inputHiddenOglasId}",`<input type="hidden" id="hidden_oglasId" name="id" value="${req.params["id"]}">`)
        .replace("{#akcijaPutanja}","/cuvanjeIzmena")
        .replace("{#btnDodajT#}","Izmeni oglas")
        .replace("//{skriptaDeoUbaci}",ucitajStranicu("skripta_izmena","js"))
        .replace('"##dataObjOglas##"',JSON.stringify(oglas))
        )
    })
    .catch(error => {
        console.log(error);
    });

});


app.get("/sviOglasi",(req,res)=>{
    axios.get('http://localhost:3005/sviOglasi')
    .then(response => {
        let prikaz="";
        response.data.forEach(oglas1 => {
            let prikazEmail="<ul>"
            for (let el of oglas1.email)
                prikazEmail+=`<li>${el.email} - ${el.tip}</li>`
            prikazEmail+="</ul>"
            prikaz+=`<tr>
            <td>${oglas1.tekst}</td>
            <td>${oglas1.datum}</td>
            <td>${oglas1.cena.vrednost} ${oglas1.cena.valuta}</td>
            <td>${oglas1.kategorija}</td>
            <td>${oglas1.oznake}</td>
            <td>${prikazEmail}</td>
            <td><a href="/obrisiOglas/${oglas1.id}">Obrisi</a></td>
            <td><a href="/izmeniOglas/${oglas1.id}">Izmeni</a></td>
        </tr>`;
        });
        //res.redirect('/dodajOglas')
        res.send(ucitajStranicu("sviOglasi").replace("#{data}",prikaz));
    })
    .catch(error => {
        console.log(error);
    });
    
    
});


app.post("/filtrirajPoOpciji",(req,res)=>{
    axios.get(`http://localhost:3005/getOglasPoOpcijiIPodatku?podatak=${req.body.podatak}&opcija=${req.body.opcija}`)
    .then(response=>{
        let prikaz="";
        response.data.forEach(oglas1 => {
            let prikazEmail="<ul>"
            for (let el of oglas1.email)
                prikazEmail+=`<li>${el.email} - ${el.tip}</li>`
            prikazEmail+="</ul>"
            prikaz+=`<tr>
            <td>${oglas1.tekst}</td>
            <td>${oglas1.datum}</td>
            <td>${oglas1.cena.vrednost} ${oglas1.cena.valuta}</td>
            <td>${oglas1.kategorija}</td>
            <td>${oglas1.oznake}</td>
            <td>${prikazEmail}</td>
            <td><a href="/obrisiOglas/${oglas1.id}">Obrisi</a></td>
            <td><a href="/izmeniOglas/${oglas1.id}">Izmeni</a></td>
        </tr>`;
        });
        
        res.send(ucitajStranicu("sviOglasi").replace("#{data}",prikaz));
    })
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});