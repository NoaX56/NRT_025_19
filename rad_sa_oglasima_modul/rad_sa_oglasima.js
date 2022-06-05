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
  
  let oglasObj={
    id:id,
    kategorija:noviOglas.kategorija,
    datum:noviOglas.datum,
    cena:JSON.parse(noviOglas.cena),
    tekst:noviOglas.tekst,
    oznake:JSON.parse(noviOglas.oznake),
    email:JSON.parse(noviOglas.email)
  }

  console.log(oglasObj)

  oglasi.push(oglasObj);
  snimiOglase(oglasi);
};

exports.getOglasByPodatakAndOpcija=(podatak,opcija)=>{
  if(opcija=="oznaka"){
        return this.sviOglasi().filter(oglas=>{
        if(oglas.oznake.length==0 && podatak.trim().length==0) return oglas
        for(el of oglas.oznake)
        {
          if(el.includes(podatak.trim())&& podatak.trim().length!=0){
            return oglas
          }
        }
    })
  }
  else if(opcija=="kategorija"){
    return this.sviOglasi().filter(oglas=>oglas.kategorija.includes(podatak.trim().toLowerCase()));
  }
  else if(opcija=="cena"){
    if(podatak.trim().match(/^[0-9]+$/))
      return this.sviOglasi().filter(oglas=>oglas.cena.vrednost==parseInt(podatak.trim()))
    else
      return []
  }
}

exports.izmeni=(oglas)=>{
  lista=this.sviOglasi()
  let oglasIzmenaObj={
    id:oglas.id,
    kategorija:oglas.kategorija,
    cena:JSON.parse(oglas.cena),
    email:JSON.parse(oglas.email),
    tekst:oglas.tekst,
    oznake:JSON.parse(oglas.oznake),
    datum:oglas.datum
  }
  for(el of lista)
  {
    if(el.id==oglasIzmenaObj.id)
    {
      el.kategorija=oglasIzmenaObj.kategorija
      el.datum=oglasIzmenaObj.datum
      el.cena=oglasIzmenaObj.cena
      el.tekst=oglasIzmenaObj.tekst
      el.email=oglasIzmenaObj.email
      el.oznake=oglasIzmenaObj.oznake
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
