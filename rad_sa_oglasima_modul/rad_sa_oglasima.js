const fs = require("fs");
const PUTANJA = "oglasi.json";

let snimiOglase = (data) => {
  fs.writeFileSync(PUTANJA, JSON.stringify(data));
};

let procitajOglaseIzFajla = () => {
  let oglasi = fs.readFileSync(PUTANJA, (err, data) => {
    if (err) throw err;
    return data;
  });
  return JSON.parse(oglasi);
};

exports.addOglas = (noviOglas) => {
  let id = 1;
  let oglasi = this.sviOglasi();
  if (oglasi.length > 0) {
    id = oglasi[oglasi.length - 1].id + 1;
  }
  noviOglas.id = id;
  oglasi.push(noviOglas);
  snimiOglase(oglasi);
  console.log("addOglas prikaz liste")
  console.log(this.sviOglasi())
  console.log("kraj prikaza prikaz liste")
};

exports.getOglasByPodatakAndOpcija=(podatak,opcija)=>{
  // console.log("Opcija je: "+opcija)
  // console.log("Podatak je:"+podatak+"///")
  if(opcija=="oznaka"){
        return this.sviOglasi().filter(oglas=>{
        listaOznaka=oglas.oznake.split(",")
        for(el of listaOznaka)
        {
          if(el==podatak.trim().toLowerCase()){
            return oglas
          }
        }
    })
  }
  else if(opcija=="kategorija"){
    return this.sviOglasi().filter(oglas=>oglas.kategorija==podatak.trim().toLowerCase());
  }
  else if(opcija=="cena"){
    return this.sviOglasi().filter(oglas=>oglas.cena==podatak.trim().toLowerCase());
  }
}

exports.izmeni=(oglas)=>{
  //console.log(oglas)
  lista=this.sviOglasi()
  //console.log("/////////")
  //console.log(lista)
  for(el of lista)
  {
    if(el.id==oglas.id)
    {
      el.tekst=oglas.tekst
      el.cena=oglas.cena
      el.valuta=oglas.valuta
      el.email=oglas.email
      el.kategorija=oglas.kategorija
      el.oznake=oglas.oznake
      el.datum=oglas.datum
    }
  }
  snimiOglase(lista)
}


exports.sviOglasi = () => {
  return procitajOglaseIzFajla();
};

exports.deleteOglas = (id) => {
  snimiOglase(this.sviOglasi().filter((oglas) => oglas.id != id));
};

exports.getOglas = (id) => {
  return this.sviOglasi().find((oglas) => oglas.id == id);
};
