var express= require('express')
var oglasiServis= require('rad_sa_oglasima_modul')
var app=express()
const port = 3005


//(request,response)=>

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(request,response)=>{
    response.send("Server radi")
})

app.get('/sviOglasi',(request,response)=>{
    response.send(oglasiServis.sviOglasi())
})

app.post('/addOglas',(request, response)=>{
    oglasiServis.addOglas(request.body);
    response.end("OK");
})

app.delete('/deleteOglas/:id',(request, response)=>{
    console.log("id je:"+request.params["id"])
    oglasiServis.deleteOglas(request.params["id"]);
    response.end("OK");
});
app.get('/getoglasbyid/:id',(request, response)=>{
    response.send(oglasiServis.getOglas(request.params["id"]));
})

app.get('/getOglasPoOpcijiIPodatku',(request, response)=>{
    response.send(oglasiServis.getOglasByPodatakAndOpcija(request.query["podatak"],request.query["opcija"]));
});

app.post('/izmeniOglass',(request, response)=>{
    oglasiServis.izmeni(request.body);
    response.end("OK");
})

app.listen(port,()=>{console.log(`startovan server na portu ${port}`)})