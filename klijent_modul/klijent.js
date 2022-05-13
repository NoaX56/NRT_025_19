const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5005;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let ucitajStranicu=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/Stranice/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(ucitajStranicu("index"));
});

app.get("/dodajOglas",(req,res)=>{
    res.send(ucitajStranicu("dodajOglasStrana"));
});
app.post("/snimiOglas",(req,res)=>{
    console.log(req.body)
    axios.post("http://localhost:3005/addOglas",{
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        valuta:req.body.valuta,
        oznake:req.body.oznake,
        email:req.body.email
    })
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
        valuta:req.body.valuta,
        oznake:req.body.oznake,
        email:req.body.email,
        id:req.body.id
    })
    res.redirect("/sviOglasi");





})



app.get("/izmeniOglas/:id",(req,res)=>{
    console.log(req.params["id"])
    axios.get(`http://localhost:3005/getoglasbyid/${req.params["id"]}`)
    .then(response=>{
        var div1=`
        <div>
            <label>Oznake:</label><textarea name="tekst" rows="4" cols="50" id="zaCuvanje1">${response.data.oznake}</textarea>
            <button onclick="sacuvaj1()">Sacuvaj izmene u boxu za oznake</button>
        </div>`
        var div2=`
        <div>
            <label>Email:</label><textarea name="tekst" rows="4" cols="50" id="zaCuvanje2">${response.data.email}</textarea>
            <button onclick="sacuvaj2()">Sacuvaj izmene u boxu za email</button>
        </div>`
        



        res.send(ucitajStranicu("izmenaOglasa").replace("#{kategorija}",response.data.kategorija)
        .replace("{#oglas_datum}",response.data.datum).replace("{#oglas_cena}",response.data.cena)
        .replace("{#oglas_valuta}",response.data.valuta).replace("{#oglas_tekst}",response.data.tekst)
        .replace("{#oglas_cena}",response.data.cena).replace("{#oglas_cena}",response.data.cena)
        .replace("{#listaOznakaMenjanje}",div1).replace("{#listaEmailMenjanje}",div2)
        .replace("#{id#}",response.data.id));






        //res.redirect("/sviOglasi")
    })
    .catch(error => {
        console.log(error);
    });

});


app.get("/sviOglasi",(req,res)=>{
    axios.get('http://localhost:3005/sviOglasi')
    .then(response => {
        let prikaz="";
        //console.log(response.data)
        response.data.forEach(oglas1 => {
            oznake=oglas1.oznake
            email=oglas1.email
            if(oznake=="#@#NEMA")
                oznake=""
            if(email=="nema@nema.nema"){
                email=""
            }
            prikaz+=`<tr>
            <td>${oglas1.tekst}</td>
            <td>${oglas1.datum}</td>
            <td>${oglas1.cena}</td>
            <td>${oglas1.kategorija}</td>
            <td>${oznake}</td>
            <td>${email}</td>
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
            oznake=oglas1.oznake
            email=oglas1.email
            if(oznake=="#@#NEMA")
                oznake=""
            if(email=="nema@nema.nema"){
                email=""
            }

            prikaz+=`<tr>
            <td>${oglas1.tekst}</td>
            <td>${oglas1.datum}</td>
            <td>${oglas1.cena}</td>
            <td>${oglas1.kategorija}</td>
            <td>${oznake}</td>
            <td>${email}</td>
            <td><a href="/obrisiOglas/${oglas1.id}">Obrisi</a></td>
            <td><a href="/izmeniOglas/${oglas1.id}">Izmeni</a></td>
        </tr>`;
        });
        
        res.send(ucitajStranicu("sviOglasi").replace("#{data}",prikaz));
    })
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});