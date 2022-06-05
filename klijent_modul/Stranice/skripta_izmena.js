//Liste
let listaOznaka = [];
let listaEmail = [];

//Obicni inputi u formi
let inputKategorija=document.getElementById("selektor")
let inputDatum=document.getElementById("datumID")
let inputCena=document.getElementById("cenaID")
let inputValuta=document.getElementById("valutaID")
let inputTekst=document.getElementById("tekstID")
let rbPoslovni = document.getElementById("rb_poslovniId");
let rbSluzbeni = document.getElementById("rb_sluzbeniId");

let inputOznaka = document.getElementById("oznakaInputId");
let inputEmail = document.getElementById("emailInputId");

//Hidden inputi
let hiddenOglasId=document.getElementById("hidden_oglasId")
let hiddenCena = document.getElementById("hidden_cenaId")
let hiddenOznaka = document.getElementById("hidden_oznakaId");
let hiddenEmail = document.getElementById("hidden_emailId");

//Prikaz elementi
let divOznake = document.getElementById("divOznakeId");
let divEmail = document.getElementById("divEmailId");

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
inputDatum.value=`${yyyy}-${mm}-${dd}`


let izmenaAktivna=false
let izmenaAktivnaE=false


let oglasObj="##dataObjOglas##"//Oglas dobijen od servera

if(typeof oglasObj === 'object' && oglasObj!=null){
    inputKategorija.value=oglasObj.kategorija
    inputDatum.value=oglasObj.datum
    inputCena.value=oglasObj.cena.vrednost
    inputValuta.value=oglasObj.cena.valuta
    inputTekst.value=oglasObj.tekst

    listaOznaka=oglasObj.oznake
    let ul_oz=document.createElement("ul")
    listaOznaka.forEach((value,index)=>{
        let li_oz=pravljenje_li_oznaka(value,index)
        ul_oz.append(li_oz);
    })
    if(listaOznaka.length!=0){
        divOznake.innerHTML=`<h5>Oznake:</h5>`
        divOznake.appendChild(ul_oz)
    }


    listaEmail=oglasObj.email
    let ul_em=document.createElement("ul")
    listaEmail.forEach((value,index)=>{
        let li_em=pravljenje_li_oznaka(value.email,index,value.tip)
        ul_em.append(li_em);
    })
    if(listaEmail.length!=0){
        divEmail.innerHTML=`<h5>Email:</h5>`
        divEmail.appendChild(ul_em)
    }


}



function prosiri(li_oz){
    console.log(li_oz)
    if(li_oz.children[0].classList.contains("kliknut")){
        for(let i=1;i<li_oz.children.length;i++)
            li_oz.children[i].style.visibility = "hidden";
        li_oz.children[0].classList.toggle("kliknut")
        return
    }
    for(let i=1;i<li_oz.children.length;i++)
        li_oz.children[i].style.visibility = "visible";
    li_oz.children[0].classList.toggle("kliknut")
}
function obrisiOznaku(li_oz){
    let parent=li_oz.parentElement
    let index=li_oz.id
    listaOznaka = listaOznaka.filter((el, indexEl) => {
        if (indexEl != index) return el;
    });
    if (listaOznaka.length == 0) {
        divOznake.innerHTML = "";
        return;
    }
    parent.removeChild(li_oz)
    for(let i=index;i<parent.children.length;i++)
    {  
        parent.children[i].id--
    }
    console.log(parent)
}
function izmeniOznaku(li_oz,stari=null){
    
    if(izmenaAktivna && li_oz.classList.contains("izmena")){
        // console.log("Novi");
        //console.log(li_oz);
        console.log("Stari");
        console.log(stari);
        if(li_oz.children[0].value==""){
            alert("Polje za unos oznake je prazno");
            zamena_li_elemenata(li_oz,listaOznaka[li_oz.id],li_oz.id)
            return;
        }
        if (listaOznaka.includes(li_oz.children[0].value)) {
            alert(`Oznaka: ${li_oz.children[0].value} vec postoji`);
            zamena_li_elemenata(li_oz,listaOznaka[li_oz.id],li_oz.id)
            return;
        }
        listaOznaka[li_oz.id]=li_oz.children[0].value
        zamena_li_elemenata(li_oz,listaOznaka[li_oz.id],li_oz.id)
        alert("Zamena uspesno odradjena")
        return
    }
    if(izmenaAktivna && !li_oz.classList.contains("izmena")){
        return
    }
    if(!izmenaAktivna){
        izmenaAktivna=!izmenaAktivna
        li_oz.classList.toggle("izmena")
    }
    let izmenaTekst=document.createElement('input')
    izmenaTekst.type="text"
    izmenaTekst.value=li_oz.children[0].innerHTML
    let potvrdiDugme=document.createElement('button')
    potvrdiDugme.textContent='Potvrdi'
    let tmpLi=li_oz.cloneNode(true)
    li_oz.innerHTML=""
    li_oz.appendChild(izmenaTekst)
    li_oz.appendChild(potvrdiDugme)
    li_oz.children[1].addEventListener('click',()=>{
        izmeniOznaku(li_oz,tmpLi)
    })
}
function zamena_li_elemenata(roditelj,value,index){
    let stari=pravljenje_li_oznaka(value,index)
    roditelj.parentNode.replaceChild(stari,roditelj)
    roditelj.classList.toggle("izmena")
    izmenaAktivna=!izmenaAktivna
}
function zamena_li_elemenata_email(roditelj,value,index){
    let stari=pravljenje_li_oznaka(value.email,index,value.tip)
    console.log(stari);
    roditelj.parentNode.replaceChild(stari,roditelj)
    roditelj.classList.toggle("izmena")
    izmenaAktivnaE=!izmenaAktivnaE
}

function dodajOznaku() {
  let vrednostOznake = inputOznaka.value.trim();
  if (!vrednostOznake) {
    alert("Polje za unos oznake je prazno");
    return;
  }
  if (listaOznaka.includes(vrednostOznake)) {
    alert(`Oznaka: ${vrednostOznake} vec postoji`);
    return;
  }
  if (listaOznaka.length == 0) {
    let naslov = document.createElement("h5");
    naslov.textContent = "Oznake:";
    divOznake.appendChild(naslov);
    divOznake.appendChild(document.createElement("ul"));
  }
  listaOznaka.push(vrednostOznake);
  divOznake.children[1].appendChild(
    pravljenje_li_oznaka(vrednostOznake, listaOznaka.length - 1)
  );
  inputOznaka.value = "";
}
function pravljenje_li_oznaka(value,index,tipZaEmial=null){
    let li_oz = document.createElement("li");
    li_oz.setAttribute("id", index);

    let dugme = document.createElement("button");
    if(tipZaEmial==null)
        dugme.innerHTML = `${value}`;
    else
        dugme.innerHTML = `${value} - ${tipZaEmial}`;
    dugme.addEventListener("click", () => {
        prosiri(li_oz);
      });
    

    let dugmeObrisi = document.createElement("button");
    dugmeObrisi.innerHTML = "Obrisi";
    if(tipZaEmial!=null)
        dugmeObrisi.addEventListener("click", () => {
        obrisiEmail(li_oz);
        });
    else
        dugmeObrisi.addEventListener("click", () => {
        obrisiOznaku(li_oz);
        });

    dugmeObrisi.style.visibility = "hidden";

    let dugmeIzmeni = document.createElement("button");
    dugmeIzmeni.innerHTML = "Izmeni";
    if(tipZaEmial!=null)
        dugmeIzmeni.addEventListener("click", () => {
        izmeniEmail(li_oz,{email:value,tip:tipZaEmial});
        });
    else
        dugmeIzmeni.addEventListener("click", () => {
        izmeniOznaku(li_oz);
        });
    dugmeIzmeni.style.visibility = "hidden";
    dugmeIzmeni.style.marginLeft = "10px";

    li_oz.appendChild(dugme);
    li_oz.appendChild(dugmeIzmeni);
    li_oz.appendChild(dugmeObrisi);
    
    return li_oz
}
function dodajEmail(){
    let vrednostEmail = inputEmail.value.trim().toLowerCase();
            if (!vrednostEmail) {
                alert("Polje za unos email-a je prazno");
                return;
            }
            if (!rbPoslovni.checked && !rbSluzbeni.checked) {
                alert("Izaberi opciju za email");
                return;
            }
            if (!validacijaEmail(vrednostEmail)) {
                alert("Unesite ispravan email");
                return;
            }
            let opcija = rbPoslovni.checked ? "poslovni" : "sluzbeni";
            emailObjekat = { email: vrednostEmail, tip: opcija };
            if (
                listaEmail.find((ele) => {
                    return ele.email == vrednostEmail;
                })
            ) {
                alert(`Email: ${vrednostEmail} vec postoji`);
                inputEmail.value = "";
                return;
            }
            if (listaEmail.length == 0) {
                let naslov = document.createElement("h5");
                naslov.textContent = "Email:";
                divEmail.appendChild(naslov);
                divEmail.appendChild(document.createElement("ul"));
            }
            listaEmail.push(emailObjekat);
            divEmail.children[1].appendChild(
              pravljenje_li_oznaka(vrednostEmail, listaOznaka.length - 1,opcija)
            );
            inputEmail.value = "";
            rbPoslovni.checked = true;
}

function obrisiEmail(li_em){
    let parent=li_em.parentElement
    let index=li_em.id
    listaEmail = listaEmail.filter((el, indexEl) => {
        if (indexEl != index) return el;
    });
    if (listaEmail.length == 0) {
        divEmail.innerHTML = "";
        return;
    }
    parent.removeChild(li_em)
    for(let i=index;i<parent.children.length;i++)
    {  
        parent.children[i].id--
    }
    console.log(parent)
}

function izmeniEmail(li_oz,izObj,stari=null){
    if(izmenaAktivnaE && li_oz.classList.contains("izmena")){
        if(li_oz.children[0].value==""){
            alert("Polje za unos oznake je prazno");
            zamena_li_elemenata_email(li_oz,listaEmail[li_oz.id],li_oz.id)
            return;
        }
        if (!validacijaEmail(li_oz.children[0].value)) {
            alert("Unesite ispravan email");
            zamena_li_elemenata_email(li_oz,listaEmail[li_oz.id],li_oz.id)
            return;
        }
        let tmpOpcija=(li_oz.children[1].checked)?"poslovni":"sluzbeni"
        let tmpElzaPoredjenjeOpcija=null
        if (listaEmail.find((ele) => {
            if(ele.email == li_oz.children[0].value){
                tmpElzaPoredjenjeOpcija=ele
            }
            return ele.email == li_oz.children[0].value;
        })) {
            if(tmpOpcija==tmpElzaPoredjenjeOpcija.tip){
                alert(`Email: ${li_oz.children[0].value} vec postoji`);
                zamena_li_elemenata_email(li_oz,listaEmail[li_oz.id],li_oz.id)
                return;
            }
        }
        listaEmail[li_oz.id]={email:li_oz.children[0].value,tip:tmpOpcija}
        zamena_li_elemenata_email(li_oz,listaEmail[li_oz.id],li_oz.id)
        alert("Zamena uspesno odradjena")
        return
    }
    if(izmenaAktivnaE && !li_oz.classList.contains("izmena")){
        return
    }
    if(!izmenaAktivnaE){
        izmenaAktivnaE=!izmenaAktivnaE
        li_oz.classList.toggle("izmena")
    }
    let izmenaTekst=document.createElement('input')
    izmenaTekst.type="text"
    izmenaTekst.value=izObj.email
    let chkPoslovni=document.createElement('input')
    chkPoslovni.type="checkbox"
    if(izObj.tip=="poslovni")
        chkPoslovni.checked=true
    else
        chkPoslovni.checked=false
    let tipText=document.createTextNode("Yes - Poslovni / No - Sluzbeni");
    let potvrdiDugme=document.createElement('button')
    potvrdiDugme.textContent='Potvrdi'
    let tmpLi=li_oz.cloneNode(true)
    li_oz.innerHTML=""
    li_oz.appendChild(izmenaTekst)
    li_oz.appendChild(chkPoslovni)
    li_oz.appendChild(tipText)
    li_oz.appendChild(potvrdiDugme)
    li_oz.children[2].addEventListener('click',()=>{
        izmeniEmail(li_oz,izObj,tmpLi)
    })
}




