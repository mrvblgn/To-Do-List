const { ipcRenderer } = require("electron");
var baglanti= require('./baglanti');

var veriler=[];
baglanti.db.query("SELECT * FROM gorev",(err,res)=>{
    if(err) throw err;
    if(res.length>0){
        for(i=0;i<res.length;i++){
            var gorev={
                id:res[i]['idform'],
                gorev:res[i]['yapilacaklar'],
                durum:res[i]['durum']
            }
            veriler.push(gorev);
        }
        VeriyiDoldur();
        console.log(veriler)
    }
    else{
        console.log("Sonuç bulunamadı")
    }
})
var sayi=0;

function GorevEkle(){
    // Textarea'ya girilen değeri buraya alıyoruz
    var gorevler=document.getElementById('gorev').value;

    // Obje oluşturuyoruz
    var gorev={
        id:sayi,
        gorev:gorevler,
        durum: 0,
    }
    // Objeyi veriler array'ine ekliyoruz
    veriler.push(gorev);
    baglanti.db.query("INSERT INTO `gorev` (`idform`, `yapilacaklar`) VALUES (NULL, '"+gorevler+"');",(err,res)=>{
        if(err) throw err;
        if (res.length>0){
            console.log(res)
        } 
        else{

        }
    })
    
    document.getElementById('gorev').value=null;

    VeriyiDoldur();
    sayi++;
}
// Array'e eklediğimiz veriyi ekranda göstermek için
function VeriyiDoldur(){
    var a="";
    var b="";

    for(var i=0; i<veriler.length; i++){
        if(veriler[i].durum==0){
            // Kaç tane görev girileceğini bilmediğimiz için HTML kodlarını buraya ekledik
            a += //Bootstrap'ten checkbox
            '<div class="input-group mb-3">'+
                '<div class="input-group-prepend">'+
                    '<div class="input-group-text">'+
                        '<input type="checkbox" aria-label="Checkbox for following text input" onclick="Tikleme('+veriler[i].id+')">'+
                    '</div>'+
                '</div>'+
            '<p type="text" class="form-control" aria-label="Text input with checkbox">'+veriler[i].gorev+'</p>'+
                '<div class="input-group-append">'+
                    '<button class="btn btn-outline-danger" type="button" onclick="GoreviSil('+veriler[i].id+');"><i class="fas fa-trash-alt"></i></button>'+
               '</div>'+
            '</div>';
        }
        else{
            b += '<div class="input-group mb-3">'+
            '<p type="text" class="form-control" aria-label="Text input with checkbox">'+veriler[i].gorev+'</p>'+
            '<div class="input-group-append">'+
                '<button class="btn btn-outline-primary" type="button" onclick="GeriAl('+veriler[i].id+');"><i class="fas fa-undo"></i></button>'+
                '<button class="btn btn-outline-danger" type="button" onclick="GoreviSil('+veriler[i].id+');"><i class="fas fa-trash-alt"></i></button>'+
               '</div>'+
            '</div>';
        }
    }

    document.getElementById('yapilacaklar').innerHTML=a;
    document.getElementById('tamamlananlar').innerHTML=b;
 }

function Tikleme(id){
    var index=veriler.findIndex(x=>x.id==id);
    
    veriler[index].durum='tamamlananlar';
    baglanti.db.query("UPDATE gorev SET durum= 1 WHERE gorev.idform= "+id)

    // Tik attığımızı görebilmek için
    setTimeout(function(){
        VeriyiDoldur();
    },500);
}

function GoreviSil(id){
    var index = veriler.findIndex(x=>x.id==id);
    veriler.splice(index,1);
    baglanti.db.query("DELETE FROM gorev WHERE `gorev`.`idform` = "+id)

    VeriyiDoldur();
}

function GeriAl(id){
    var index=veriler.findIndex(x=>x.id==id);
    veriler[index].durum='yapilacaklar';
    baglanti.db.query("UPDATE gorev SET durum= 0 WHERE gorev.idform = "+id)
    location.reload();

    VeriyiDoldur();
}

// Enter event
var giris = document.getElementById('gorev');
giris.addEventListener("keyup", function(event){
   if(event.keyCode === 13){
       event.preventDefault();
       document.getElementById("ekle").click();
   }
});