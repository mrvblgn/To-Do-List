var mysql = require('mysql');

var baglanti = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "yapilacaklar_listesi"
});

baglanti.connect(function(err) {
  if (err) throw err;
  console.log("Veri Tabanı Bağlantısı Başarılı!");
});

module.exports = {
    db : baglanti 
}
