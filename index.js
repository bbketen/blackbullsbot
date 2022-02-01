require('dotenv').config();
const Discord = require('discord.js');
const mysql = require('mysql');
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const TOKEN = process.env.TOKEN;

/*const con = mysql.createConnection({
    host: "94.73.147.116",
    user: "u9175384_batuhan",
    password: "TKdx28R2NThu31A",
    database: "u9175384_batuhan"
})*/

const con = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11469708",
    password: "fgzTVPzMSL",
    database: "sql11469708"
})



const chars = ["Cadı","Büyücü","Archer","Okçu","DK","Avcı","Ninja","Kunoichi","Valkyrie","Savaşçı","Musa","Maehwa","Mistik","Striker","Sahire","Lahn","Vahşi","Guardian","Shai","Witch","Wizard","Ranger","Berserker","Tamer","Sorceress","Warrior"]
const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const items = ["Kzarka","Offin","Dandelion","Nouver","Kutum","Ejderha","Sönük","Red Nose","Urugon","Muskan","Bheg","Leebur","Grifon","Giath","Heve"];

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

bot.login(process.env.token);
//bot.login("NjkzMTk1NDg4NDg0MzkyOTYy.Xn5imw.QmKYj6Ui1SjqfPh9mtLLttZmDSo");
//bot.login("NjkzNjM2MDE2MzAwMzU5Nzgw.Xn_-_g.QohC56ARze18ITEgpK1PbnrBBDU");

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  const sql_channel = "SELECT * FROM discord_channel";
  con.query(sql_channel,(err,result) => {
    if(err){
        console.log("Hata: " + err);
    } else{
        if(result != ""){
            let main_channel = result[0].channel_id;
            if(msg.channel.id === main_channel){
                if (msg.content === '!status') {
                    msg.guild.channels.get(main_channel).send('Bot Aktif');
                } else if (msg.content.startsWith('!kick')) {
                    if (msg.mentions.users.size) {
                    const taggedUser = msg.mentions.users.first();
                    msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        let member = msg.mentions.members.first();
                        member.ban().then((member) => {
                            msg.channel.send(":wave: " + member.displayName + " başarıyla atıldı. :point_right:");
                        }) .catch(() => {
                            msg.channel.send("Atma Başarısız.");
                        })
                    }
                    else{
                        msg.channel.send("Maalesef Yetkin Bulunmamaktadır. Subaylarınız ile iletişime geçebilirsiniz.");
                    }
                }
                } else if (msg.content.startsWith('!kkayıt')){
                    let msg_temp = msg.content.replace("  ", " ");
                    let array = msg_temp.split(' ');
                    console.log(array);
                    if(array.length != 9){
                        msg.channel.send("Kayıt komutu sırasıyla tag-name, aile adı, karakter adı, karakter sınıfı, level, ap, uyanış ap ve dp içermelidir");
                    } else {
                        if(msg.mentions.users.size){
                            var sql = "SELECT discord_id from users where discord_id = ?";
                            var VALUES = [
                                msg.mentions.users.first().id
                            ]
                            con.query(sql,VALUES,(err,result) => {
                                if(err){
                                    console.log("Başarısız, Hata:" + err);
                                } else{
                                    console.log(result);
                                    let tmp = 0;
                                    if(result != ""){
                                        msg.channel.send("Kullanıcı zaten var");
                                    } else {
                                        let char = karakterkontrol(array[4]);
                                        if(char == 0){
                                            msg.channel.send("Eksik veya hatalı karakter sınıfı girdiniz. !kliste komutu ile karakter listesine bakabilirsiniz.")
                                        } else{
                                            sql = "INSERT INTO users (discord_id, discord_name, family_name, char_name, char_class, char_lvl, char_ap, char_uap, char_dp) VALUES (?,?,?,?,?,?,?,?,?)";
                                            VALUES = [
                                                msg.mentions.users.first().id,
                                                msg.mentions.users.first().username,
                                                array[2],
                                                array[3],
                                                char,
                                                array[5],
                                                array[6],
                                                array[7],
                                                array[8]
                                            ]
                                            con.query(sql,VALUES,(err,result) => {
                                                if(err){
                                                    console.log("Başarısız, Hata:" + err);
                                                } else{
                                                    console.log("1 insert başarılı");
                                                    msg.channel.send("Kayıt Başarılı.");
                                                }
                                            })
                                        }
                                    }
                                    
                                }
                            })
                        }
                    }
                } else if (msg.content.startsWith('!kgüncelle')){
                    let array = msg.content.split(' ');
                    let tmpArray = [];
                    let tmp = 0;
                    console.log(array);
                    if(array.length != 9){
                        msg.channel.send("Güncelle komutu sırasıyla tag-name, aile adı, karakter adı, karakter sınıfı, level, ap, uyanış ap ve dp içermelidir.");
                    } else {
                        if(karakterkontrol(array[4]) == 0){
                            msg.channel.send("Eksik veya hatalı karakter sınıfı girdiniz. !kliste komutu ile karakter listesine bakabilirsiniz.")
                        } else{
                            var sql = "SELECT * from users where discord_id = ?";
                            var VALUES = [
                                msg.mentions.users.first().id
                            ]
                            con.query(sql,VALUES,(err,result)=>{
                                if(err){
                                    console.log("HATA: "+ err);
                                } else{
                                    console.log(result[0].discord_name);
                                    tmpArray[2] = result[0].family_name;
                                    tmpArray[3] = result[0].char_name;
                                    tmpArray[4] = result[0].char_class;
                                    tmpArray[5] = result[0].char_lvl;
                                    tmpArray[6] = result[0].char_ap;
                                    tmpArray[7] = result[0].char_uap;
                                    tmpArray[8] = result[0].char_dp;
                                    for(let i=2;i<tmpArray.length;i++){
                                        if(tmpArray[i] != array[i]){
                                            tmp = 1;
                                        }
                                    }
                                    if(tmp == 0){
                                        msg.channel.send("Karakteriniz zaten güncel.");
                                    } else{
                                        sql = "UPDATE users SET discord_name = ?, family_name = ?, char_name = ?, char_class = ?, char_lvl = ?, char_ap = ?, char_uap = ?, char_dp = ? WHERE discord_id = ?";
                                        VALUES = [
                                            msg.mentions.users.first().username,
                                            array[2],
                                            array[3],
                                            array[4],
                                            array[5],
                                            array[6],
                                            array[7],
                                            array[8],
                                            msg.mentions.users.first().id
                                        ]
                                        con.query(sql,VALUES,(err,result) => {
                                            if(err){
                                                console.log("Başarısız, Hata:" + err);
                                            } else{
                                                console.log("1 update başarılı");
                                                msg.channel.send("Güncelleme Başarılı.");
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    } 
                } else if (msg.content.startsWith('!kgöster')) {
                
                    if(msg.mentions.users.size){
                        var sql = "SELECT * from users where discord_id = ?";
                        var VALUES = [
                            msg.mentions.users.first().id
                        ]
                        con.query(sql,VALUES,(err,result) => {
                            if(err){
                                console.log("Başarısız, Hata:" + err);
                            } else {
                                if(result == ''){
                                    msg.channel.send("Aradığınız karakter bulunamadı.");
                                } else{
                                    let embed = new Discord.RichEmbed()
                                    .setColor('FD0061')
                                    .addField('Discord ismi', result[0].discord_name, true)
                                    .addField('Aile ismi', result[0].family_name, true)
                                    .addField('Karakter ismi', result[0].char_name, true)
                                    .addField('Karakter Sınıfı', result[0].char_class, true)
                                    .addField('Karakter Seviyesi', result[0].char_lvl, true)
                                    .addField('AP', result[0].char_ap, true)
                                    .addField('Uyanış AP', result[0].char_uap, true)
                                    .addField('DP', result[0].char_dp, true)
                                    msg.channel.send(embed);
                                }
                
                            }
                        })
                    }
                } else if (msg.content.startsWith('!kliste')) {
                    //console.log(msg.content);
                    msg.channel.send(
                    "Karakter Listesi aşağıdaki gibidir:\n"+
                    "-"+chars[0] +"                    -"+chars[1] +"\n"+
                    "-"+chars[2] +"                -"+chars[3] +"\n" +
                    "-"+chars[4] +"     -"+chars[5] +"\n" +
                    "-"+chars[6] +"                   -"+chars[7] +"\n" +
                    "-"+chars[8] +"             -"+chars[9] +"\n" +
                    "-"+chars[10] +"                 -"+chars[11] +"\n" +
                    "-"+chars[12] +"                -"+chars[13] +"\n" +
                    "-"+chars[14] +"                -"+chars[15] +"\n" +
                    "-"+chars[16] +"                 -"+chars[17] +"\n" +
                    "-"+chars[18] +""
                    );
                } else if (msg.content.startsWith('!ksil')) {
                    let array = msg.content.split(' ');
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        if(array.length == 2){
                            var sql = "DELETE FROM users WHERE family_name = '"+array[1]+"'"
                            con.query(sql,(err,result) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else {
                                    msg.channel.send("Silme başarılı.");
                                }
                            })
                        } else{
                            msg.channel.send("Silmek istediğiniz kişiyi etiketlemeniz gerekmektedir.");
                        }
                    } else {
                        msg.channel.send("Maalesef yetkiniz bulunmamaktadır.");
                    }
                } else if (msg.content.startsWith('!help')) {
                    //console.log(msg.content);
                    msg.channel.send(
                    "Komut Listesi aşağıdaki gibidir:\n"+
                    "!kkayıt         --Sırasıyla tag-name, aile adı, karakter adı, karakter sınıfı, level, ap, uyanış ap ve dp\n"+
                    "!kick             --Tag-name ile birini discorddan kicklemek için kullanılır(Banlayarak)\n" +
                    "!kgöster      --Bilgilerini görüntülemek istediğiniz karakteri etiketleyerek görüntüleyebilirsiniz.\n" +
                    "!klistesi       --Oyundaki Karakter Listesi görüntüler.\n" +
                    "!kgüncelle   --Sırasıyla tag-name, aile adı, karakter adı, karakter sınıfı, level, ap, uyanış ap ve dp\n" +
                    "!saç             --Node savaşı açmak için kullanılır.\n" +
                    "!sgöster       --Açılan Node savaşını görüntülemek için kullanılır.\n" +
                    "!ssil              --Açılan savaşı iptal için kullanılır.\n" +
                    "!ssonuc        --Açılan savaşın bilgilerini girmek ve sonuçlandırmak için kullanılır.\n" + 
                    "!sözet          --Bu güne kadar olan ve biten savaşları göstermek için kullanılır.\n" +
                    "!kchat          --Hangi discord kanalını kullanılması isteniyorsa onun ismini vererek geçiş yapabilirsiniz.\n" +
                    "!ngöster       --Oyundaki nodeları görüntülemek için aşama ve gününü yazabilirsiniz.(Örn: !ngöster 1 Pazartesi)\n" +
                    "!buff             --Savaşa gelirken alınacak buffların listesini görüntülemek için kullanılır.\n" + 
                    "!caphras       --Caphras komutu sırasıyla item adı ve seviyesi ile çalışır. Örn. !caphras Kzarka TET veya !caphras Kzarka TET 5\n" +
                    "!cliste          --Caphras sistemimize kayıtlı olan itemleri listelemek için kullanılır."
                    );
                } else if (msg.content.startsWith('!saç')) {
                    let array = msg.content.split(' ');
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        var sql = "SELECT * FROM wars where war_date = CURRENT_DATE";
                        con.query(sql,(err,result) => {
                            if(err){
                                console.log("Hata: " + err);
                            } else{
                                if(result == ""){
                                    msg.react("✔️");
                                    sql = "INSERT INTO wars (total_joiners,total_guilds,result,war_date) VALUES (?,?,?,CURRENT_DATE)";
                                    VALUES = [
                                        0,
                                        0,
                                        false
                                    ]
                                    con.query(sql,VALUES,(err,result) => {
                                        if(err){
                                            console.log("Hata: " + err);
                                        } else{
                                            let role = msg.guild.roles.find(r => r.name === "moderator");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    console.log(user._roles[i]);
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Lütfen katıl yapmayı unutmayınız.(Katıl yapmak için yazının altında ki ticke tıklayınız.)");
                                                    }
                                                }
                                            })
                                            /*
                                            let role = msg.guild.roles.find(r => r.name === "Magic Knight");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız.");
                                                    }
                                                }
                                            })
                                            let role = msg.guild.roles.find(r => r.name === "Magic King");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız.");
                                                    }
                                                }
                                            })
                                            let role = msg.guild.roles.find(r => r.name === "Captain");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız.");
                                                    }
                                                }
                                            })
                                            */
                                            console.log("Savaş kaydı başarılı bir şekilde oluşturuldu.");
                                        }
                                    });
                                } else{
                                    console.log(result[0].war_sw);
                                    if(result[0].war_sw == 0) {
                                        msg.react("✔️");
                                        sql = "UPDATE wars SET war_sw = 1 where war_date = CURRENT_DATE";
                                        con.query(sql,(err,result) => {
                                            let role = msg.guild.roles.find(r => r.name === "moderator");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız. Daha önce kayıt yaptıysanız bu mesajı dikkate almayınız.");
                                                    }
                                                }
                                            })
                                                                    /*
                                            let role = msg.guild.roles.find(r => r.name === "Magic Knight");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız. Daha önce kayıt yaptıysanız bu mesajı dikkate almayınız.");
                                                    }
                                                }
                                            })
                                            let role = msg.guild.roles.find(r => r.name === "Magic King");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız. Daha önce kayıt yaptıysanız bu mesajı dikkate almayınız.");
                                                    }
                                                }
                                            })
                                            let role = msg.guild.roles.find(r => r.name === "Captain");
                                            role.guild.members.map((user)=>{
                                                for(let i = 0; i<user.roles.size; i++){
                                                    if(user._roles[i] == role.id){
                                                        user.send("Saat 9:00'da "+ array[1] +"-1'de savaşımız mevcuttur. Bot üzerinden emoji bırakmayı unutmayınız. Daha önce kayıt yaptıysanız bu mesajı dikkate almayınız.");
                                                    }
                                                }
                                            })
                                            */
                                            console.log("Savaş kaydı başarılı bir şekilde oluşturuldu.");
                                        })
                                    } else if(result[0].war_sw == 2){
                                        msg.channel.send("Bugün tamamlanan bir savaş bulunmaktadır.");
                                    } else{
                                        msg.channel.send("Bugün zaten açık olan bir savaşınız bulunmakta. Yeniden açmak istiyorsanız önceki savaşı silmelisiniz.");
                                    }
                                }
                            }
                        })
                    }
                    else{
                        msg.channel.send("Maalesef Yetkin Bulunmamaktadır");
                    }      
                } else if (msg.content.startsWith('!stekrar')) {
                    let array = msg.content.split(' ');
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        var sql = "SELECT * FROM wars where war_date = CURRENT_DATE";
                        con.query(sql,(err,result) => {
                            if(err){
                                console.log("Hata: " + err);
                            } else{
                                if(result != ""){
                                    console.log(result[0].war_sw);
                                    if(result[0].war_sw == 0) {
                                        msg.channel.send("Bugün aktif bir savaş bulunmamaktadır.");
                                    } else if(result[0].war_sw == 2){
                                        msg.channel.send("Bugün tamamlanan bir savaş bulunmaktadır.");
                                    } else{
                                        msg.react("✔️");
                                    }
                                } else{
                                    msg.channel.send("Bugün açık bir savaş bulunmamaktadır.");
                                }
                            }
                        })
                    }
                    else{
                        msg.channel.send("Maalesef Yetkin Bulunmamaktadır");
                    }      
                } else if (msg.content.startsWith('!sgöster')) {
                    var sql = "SELECT * FROM users where discord_id in (SELECT discord_id from war_detail where war_id in (SELECT MAX(war_id) from wars where war_sw = 1)) order by char_ap desc";
                    con.query(sql,(err,result) => {
                        if(err){
                            console.log("Hata: " + err);
                        } else{
                            if(result != ""){
                                for(let i=0;i<result.length;i++){
                                    let embed = new Discord.RichEmbed()
                                    .setColor('FD0061')
                                    .addField('Karakter', result[i].char_name, true)
                                    .addField('Sınıf', result[i].char_class, true)
                                    .addField('Level', result[i].char_lvl, true)
                                    .addField('AP', result[i].char_ap, true)
                                    .addField('UAP', result[i].char_uap, true)
                                    .addField('DP', result[i].char_dp, true)
                                    msg.channel.send(embed);
                                }
                            } else{
                                msg.channel.send("Bugün aktif savaşınız bulunmamaktadır veya katılan kimse yoktur.");
                                console.log("Bugün aktif savaşınız bulunmamaktadır  veya katılan kimse yoktur.")
                            }
                        }
                    })
                } else if (msg.content.startsWith('!ssayı')) {
                    var sql = "SELECT count(war_id) as sayi from war_detail where war_id in (SELECT war_id FROM wars where war_date = CURRENT_DATE)";
                    con.query(sql,(err,result) => {
                        if(err){
                            console.log("Hata: " + err);
                        } else{
                            if(result != ""){
                                let embed = new Discord.RichEmbed()
                                .setColor('FD0061')
                                .addField('Savaşa Katılan Sayısı', result[0].sayi-1, true)
                                msg.channel.send(embed);
                            } else{
                                msg.channel.send("Bugün aktif savaşınız bulunmamaktadır veya katılan kimse yoktur.");
                                console.log("Bugün aktif savaşınız bulunmamaktadır  veya katılan kimse yoktur.")
                            }
                        }
                    })
                } else if (msg.content.startsWith('!ssil')) {
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        var sql = "SELECT * FROM wars where war_date = CURRENT_DATE AND war_sw = 1";
                        con.query(sql,(err,result) => {
                            if(err){
                                console.log("Hata: " + err);
                            } else{
                                if(result == ""){
                                    msg.channel.send("Bugün aktif bir savaşınız bulunmamaktadır.");
                                } else{
                                    sql = "UPDATE wars SET war_sw = 0 where war_date = CURRENT_DATE AND war_sw = 1";
                    
                                    con.query(sql,(err,result) => {
                                        if(err){
                                            console.log("Hata: " + err);
                                        } else{
                                            if(result != ""){
                                                console.log("Silme başarılı.");
                                                msg.channel.send("Silme Başarılı");
                                                let role = msg.guild.roles.find(r => r.name === "moderator");
                                                role.guild.members.map((user)=>{
                                                    for(let i = 0; i<user.roles.size; i++){
                                                        if(user._roles[i] == role.id){
                                                            user.send("Saat 9:00'da olan savaşımız iptal edilmiştir.");
                                                        }
                                                    }
                                                })
                                                /*
                                                let role = msg.guild.roles.find(r => r.name === "Magic Knight");
                                                role.guild.members.map((user)=>{
                                                    for(let i = 0; i<user.roles.size; i++){
                                                        if(user._roles[i] == role.id){
                                                            user.send("Saat 9:00'da olan savaşımız iptal edilmiştir.");
                                                        }
                                                    }
                                                })
                                                let role = msg.guild.roles.find(r => r.name === "Magic King");
                                                role.guild.members.map((user)=>{
                                                    for(let i = 0; i<user.roles.size; i++){
                                                        if(user._roles[i] == role.id){
                                                            user.send("Saat 9:00'da olan savaşımız iptal edilmiştir.");
                                                        }
                                                    }
                                                })
                                                let role = msg.guild.roles.find(r => r.name === "Captain");
                                                role.guild.members.map((user)=>{
                                                    for(let i = 0; i<user.roles.size; i++){
                                                        if(user._roles[i] == role.id){
                                                            user.send("Saat 9:00'da olan savaşımız iptal edilmiştir.");
                                                        }
                                                    }
                                                })
                                                */
                                            } else{
                                                msg.channel.send("Bugün aktif bir savaşınız bulunmamaktadır.");
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else{
                        msg.channel.send("Maalesef Yetkin Bulunmamaktadır");
                    }
                } else if (msg.content.startsWith('!ssonuç')) {
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        let array = msg.content.split(' ');
                        if(array.length == 4){
                            var sql = "UPDATE wars SET total_joiners = ?, total_guilds = ?, result = ?, war_sw = 2 where war_date = CURRENT_DATE AND war_sw = 1";
                            var VALUES = [
                                array[1],
                                array[2],
                                array[3]
                            ]
                            con.query(sql,VALUES,(err,result) => {
                                if(err){
                                    console.log("Hata: " + err)
                                } else{
                                    msg.channel.send("Savaş sonuçlandırma başarılı.");
                                    console.log("Güncelleme başarılı.");
                                }
                            })
                        } else{
                            msg.channel.send("Savaş sonuçlandırmak için sırasıyla katılım sayısı, savaşan klan sayısı ve sonucu yazmanız gerekmektedir.\nNOT: Kaybetme = 0, Kazanma = 1, Beraber = 2");
                        }
                    } else{
                        msg.channel.send("Maalesef Yetkin Bulunmamaktadır");
                    } 
                } else if (msg.content.startsWith('!sözet')) {
                    var sql = "SELECT * FROM wars WHERE war_sw = 2";
                    con.query(sql,(err,result) => {
                        if(err){
                            console.log("Hata: " + err);
                        } else{
                            if(result != ""){
                                for(let i=0;i<result.length;i++){
                                    let sonuc;
                                    if(result[i].result == 0){
                                        sonuc = "Lose";
                                    } else if(result[i].result == 1){
                                        sonuc = "Win";
                                    } else{
                                        sonuc = "Draw";
                                    }
                                    let embed = new Discord.RichEmbed()
                                    .setColor('FD0061')
                                    .addField('Katılan Sayısı', result[i].total_joiners, true)
                                    .addField('Klan Sayısı', result[i].total_guilds, true)
                                    .addField('Sonuç', sonuc, true)
                                    .addField('Savaş Tarihi', result[i].war_date, true)
                                    msg.channel.send(embed);
                                }
                            } else{
                                msg.channel.send("Bitmiş savaşınız bulunmamaktadır.");
                                console.log("Bitmiş savaşınız bulunmamaktadır.")
                            }
                        }
                
                    })
                } else if (msg.content.startsWith('!ngöster')) {
                    let array = msg.content.split(' ');
                    var sql;
                    var VALUES = [];
                    let tmp_day = 0;
                
                    if(array.length == 2){
                        for(let i=0; i<days.length;i++){
                            if(array[1] == days[i]){
                                tmp_day = 1;
                            }
                        }
                        if(tmp_day == 1){
                            sql = "SELECT * FROM ref_node_war WHERE node_day = "+array[1];
                        } else{
                            if(array[1] == 1){
                                sql = "SELECT * FROM ref_node_war where node_level > 1 AND node_level < 2 order by node_player";
                            } else if(array[1] == 2){
                                sql = "SELECT * FROM ref_node_war where node_level = 2 order by node_player";
                            } else if(array[1] == 3){
                                sql = "SELECT * FROM ref_node_war where node_level = 3 order by node_player";
                            } else if(array[1] == 4){
                                sql = "SELECT * FROM ref_node_war where node_level = 4 order by node_player";
                            } else {
                                msg.channel.send("Seçtiğiniz node aşaması hatalıdır.")
                            }
                        }
                    } else if(array.length == 3){
                        for(let i=0; i<days.length;i++){
                            if(array[1] == days[i]){
                                tmp_day = 1;
                            } else if(array[2] == days[i]){
                                tmp_day = 2;
                            }
                        }
                        if(tmp_day == 1){
                            if(array[2] == 1){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level > 1 AND node_level < 2 order by node_player";
                                VALUES = [array[1]];
                            } else if(array[2] == 2){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 2 order by node_player";
                                VALUES = [array[1]];
                            } else if(array[2] == 3){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 3 order by node_player";
                                VALUES = [array[1]];
                            } else if(array[2] == 4){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 4 order by node_player";
                                VALUES = [array[1]];
                            } else {
                                msg.channel.send("Seçtiğiniz node aşaması hatalıdır.");
                            }
                        } else if(tmp_day == 2){
                            if(array[1] == 1){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level > 1 AND node_level < 2 order by node_player";
                                VALUES = [array[2]];
                            } else if(array[1] == 2){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 2 order by node_player";
                                VALUES = [array[2]];
                            } else if(array[1] == 3){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 3 order by node_player";
                                VALUES = [array[2]];
                            } else if(array[1] == 4){
                                sql = "SELECT * FROM ref_node_war WHERE node_day = ? AND node_level = 4 order by node_player";
                                VALUES = [array[2]];
                            } else {
                                msg.channel.send("Seçtiğiniz node aşaması hatalıdır.");
                            }
                        }
                    } else{
                        msg.channel.send("Girdiğiniz komut hatalı veya eksiktir. !help yazarak komut açıklamasına bakabilirsiniz.");
                    }
                
                    con.query(sql,VALUES,(err,result) => {
                        if(err){
                            console.log("Hata: " + err);
                        } else{
                            if(result != ""){
                                let level_text;
                                
                                for(let i=0;i<result.length;i++){
                                    if(result[i].node_level == 1.1){
                                        level_text = "Aşama 1 Acemi";
                                    } else if(result[i].node_level == 1.2){
                                        level_text = "Aşama 1 Orta";
                                    } else if(result[i].node_level == 1.3){
                                        level_text = "Aşama 1 Üstün";
                                    } else if(result[i].node_level == 2){
                                        level_text = "Aşama 2";
                                    } else if(result[i].node_level == 3){
                                        level_text = "Aşama 3";
                                    } else if(result[i].node_level == 4){
                                        level_text = "Aşama 4";
                                    } 
                                    let embed = new Discord.RichEmbed()
                                    .setColor('FD0061')
                                    .addField('İsim', result[i].node_name, true)
                                    .addField('Kişi Sayısı', result[i].node_player, true)
                                    .addField('Sunucu', result[i].node_region, true)
                                    .addField('Gün', result[i].node_day, true)
                                    .addField('War Hero', result[i].node_hero, true)
                                    .addField('Aşama', level_text, true)
                                    msg.channel.send(embed);
                                }
                
                            } else{
                                msg.channel.send("Girdiğiniz değerlere ait kayıtlı node bulunmamaktadır.");
                                console.log("Girdiğiniz değerlere ait kayıtlı node bulunmamaktadır.")
                            }
                        }
                    })
                } else if (msg.content.startsWith('!kchat')) {
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        let array = msg.content.split(' ');
                        if(array.length == 2){
                            var sql = "SELECT * FROM discord_channel";
                            con.query(sql,(err,result) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    if(result != ""){
                                        sql = "DELETE from discord_channel";
                                        con.query(sql,(err,result) => {
                                            if(err){
                                                console.log("Hata: " + err);
                                            } else{
                                                sql = "INSERT INTO discord_channel (channel_id,channel_name) VALUES (?,?)"
                                                VALUES = [
                                                    bot.channels.find("name",array[1]).id,
                                                    array[1]
                                                ]
                                                con.query(sql,VALUES,(err,result) => {
                                                    if(err){
                                                        console.log("Hata: " + err);
                                                    } else{
                                                        main_channel = bot.channels.find("name",array[1]).id;
                                                        msg.channel.send("Kanal değişimi başarılı.");
                                                    }
                                                })
                                            }
                                        })
                                    } else{
                                        sql = "INSERT INTO discord_channel (channel_id,channel_name) VALUES (?,?)"
                                        VALUES = [
                                            bot.channels.find("name",array[1]).id,
                                            array[1]
                                        ]
                                        con.query(sql,VALUES,(err,result) => {
                                            if(err){
                                                console.log("Hata: " + err);
                                            } else{
                                                main_channel = bot.channels.find("name",array[1]).id;
                                                msg.channel.send("Kanal değişimi başarılı.");
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    } else{
                        msg.channel.send("Maalesef Yetkiniz Bulunmamaktadır.");
                    }
                } else if (msg.content.startsWith('!buff')) {
                    //console.log(msg.content);
                    msg.channel.send(
                    "Buff listesi aşağıdaki gibidir:\n" +
                    "-Villa buff(Lohanın villasından villa parşömeni alarak içerideki NPC'den 48x Altın Külçe 100g vererek 3 saatlik alabilirsiniz.)\n" +
                    "-Seçkin Cron Yemeği\n" +
                    "-Dev iksiri\n" +
                    "-Cesaret Parfümü"
                    );
                } else if (msg.content.startsWith('!kherkes')) {
                    let array = msg.content.split(' ');
                    if(msg.member.hasPermission('ADMINISTRATOR')){
                        var sql = "";
                        if(array.length == 3){
                            if(array[1] == "büyük"){
                                sql = "SELECT * FROM users where char_uap >= "+array[2]+"";
                            } else if(array[1] == "küçük"){
                                sql = "SELECT * FROM users where char_uap <= "+array[2]+"";
                            }
                        } else if(array.length == 2){
                            let char = karakterkontrol(array[1]);
                            console.log(char);
                            if(char == 0){
                                msg.channel.send("Aradığınız karakter bulunmamaktadır.");
                            } else {
                                sql = "SELECT * FROM users where char_class = '"+char+"'";
                            }
                        } else{
                            sql = "SELECT * FROM users";
                        }
                        console.log(sql);
                        if(sql != ""){
                            console.log("Deneme");
                            con.query(sql,(err,result) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    if(result != ""){
                                        for(let i=0;i<result.length;i++){
                                            let embed = new Discord.RichEmbed()
                                            .setColor('FD0061')
                                            .addField('Discord ismi', result[i].discord_name, true)
                                            .addField('Aile ismi', result[i].family_name, true)
                                            .addField('Karakter ismi', result[i].char_name, true)
                                            .addField('Karakter Sınıfı', result[i].char_class, true)
                                            .addField('Karakter Seviyesi', result[i].char_lvl, true)
                                            .addField('AP', result[i].char_ap, true)
                                            .addField('Uyanış AP', result[i].char_uap, true)
                                            .addField('DP', result[i].char_dp, true)
                                            msg.channel.send(embed);
                                        }
                                    }
                                }
                            })
                        }
                    } else{
                        msg.channel.send("Maalesef Yetkiniz Bulunmamaktadır.");
                    }
                } else if (msg.content.startsWith('!caphras')) {
                    let array = msg.content.split(' ');
                    let item_tmp = 0;
                    if(array[1].length < 3){
                        msg.channel.send("Aradığınız item için en az 3 harf girmelisiniz.");
                    } else{
                        if(array.length == 3){
                            var sql = "SELECT * FROM caphras_header ch, caphras_detail cd where ch.item_id = cd.item_id AND ch.item_upgrade = upper('"+array[2]+"') AND ch.item_name like '%"+array[1]+"%'";
                            con.query(sql,(err,result) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    if(result != ""){
                                        for(let i=0;i<result.length;i++){
                                            let embed = new Discord.RichEmbed()
                                            .setColor('#FD0061')
                                            .setDescription(`İtem Adı: **${result[i].item_name}**, İtem Seviyesi: **${result[i].item_upgrade}**, İtem Tipi: **${result[i].item_type}**\nİtem Caphras Seviyesi: **${result[i].item_caphras_level}**, Caphras Sonraki Seviye: **${result[i].item_caphras_count}**\nCaphras Toplam: **${result[i].item_caphras_total}**, Bonus AP: **${result[i].item_caphras_ap}**, Bonus İsabet: **${result[i].item_caphras_accuracy}**, Bonus Kaçınma: **${result[i].item_caphras_accuracy}**\nBonus Gizli Kaçınma: **${result[i].item_caphras_hidden_kaçınma}**, Bonus DP: **${result[i].item_caphras_dp}**, Bonus Gizli DP: **${result[i].item_caphras_hidden_dp}**\nBonus HP: **${result[i].item_caphras_hp}**, Bonus MP: **${result[i].item_caphras_mp}**`)
                                            msg.channel.send(embed);
                                        }
                                    } else{
                                        console.log("1. Sorgu Boş");
                                    }
                                }
                            })
                        } else if(array.length == 4){
                            var sql = "SELECT * FROM caphras_header ch, caphras_detail cd where ch.item_id = cd.item_id AND ch.item_upgrade = upper('"+array[2]+"') AND ch.item_name like '%"+array[1]+"%' AND cd.item_caphras_level = "+array[3]+"";
                            con.query(sql,(err,result) =>{
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    if(result != ""){
                                        let embed = new Discord.RichEmbed()
                                        .setColor('#FD0061')
                                        .addField('İtem Adı', result[0].item_name, true)
                                        .addField('İtem Seviyesi', result[0].item_upgrade, true)
                                        .addField('İtem Tipi', result[0].item_type, true)
                                        .addField('İtem Caphras Seviyesi', result[0].item_caphras_level, true)
                                        .addField('Caphras sonraki seviye', result[0].item_caphras_count, true)
                                        .addField('Caphras toplam', result[0].item_caphras_total, true)
                                        .addField('Bonus AP', result[0].item_caphras_ap, true)
                                        .addField('Bonus DP', result[0].item_caphras_dp, true)
                                        .addField('Bonus Gizli DP', result[0].item_caphras_hidden_dp, true)
                                        .addField('Bonus İsabet', result[0].item_caphras_accuracy, true)
                                        .addField('Bonus Kaçınma', result[0].item_caphras_evasion, true)
                                        .addField('Bonus Gizli Kaçınma', result[0].item_caphras_hidden_kaçınma, true)
                                        .addField('Bonus HP', result[0].item_caphras_hp, true)
                                        .addField('Bonus MP', result[0].item_caphras_mp, true)
                                        msg.channel.send(embed);
                                    } else{
                                        console.log("Sorgu Boş");
                                    }
                                }
                            })
                        } else{
                            msg.channel.send("Caphras komutu sırasıyla item adı ve seviyesi ile çalışır. Caphras seviyesi isteğe bağlıdır. Örn. !caphras Kzarka TET veya !caphras Kzarka TET 5");
                        }
                    }
                } else if (msg.content.startsWith('!cliste')) {
                    msg.channel.send(
                        "Karakter Listesi aşağıdaki gibidir:\n"+
                        "-"+items[0] +"               -"+items[1] +"\n"+
                        "-"+items[2] +"         -"+items[3] +"\n" +
                        "-"+items[4] +"               -"+items[5] +"\n" +
                        "-"+items[6] +"                -"+items[7] +"\n" +
                        "-"+items[8] +"             -"+items[9] +"\n" +
                        "-"+items[10] +"                 -"+items[11] +"\n" +
                        "-"+items[12] +"                -"+items[13] +"\n" +
                        "-"+items[14] +""
                    );
                } else{
                    if(msg.content.startsWith("!")){
                        msg.channel.send("Girdiğiniz komut tanımamıştır. !help yazarak komut listesine bakabilirsiniz.")
                    }
                }
            }
        }
    }
  })
});
bot.on("guildMemberAdd",(new_user)=>{
    let role = new_user.guild.roles.find(r => r.name === "moderator");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(new_user + " Aramıza Katıldı.");
            }
        }
    })
    /*
    let role = new_user.guild.roles.find(r => r.name === "Magic King");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(new_user + " Aramıza Katıldı.");
            }
        }
    })
    let role = new_user.guild.roles.find(r => r.name === "Captain");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(new_user + " Aramıza Katıldı.");
            }
        }
    })
    */
});
bot.on("guildMemberRemove",(old_user)=>{
    let role = old_user.guild.roles.find(r => r.name === "moderator");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(old_user + " Aramızdan Ayrıldı.");
            }
        }
    })
    /*
    let role = old_user.guild.roles.find(r => r.name === "Magic King");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(old_user + " Aramızdan Ayrıldı.");
            }
        }
    })
    let role = old_user.guild.roles.find(r => r.name === "Captain");
    role.guild.members.map((user)=>{
        for(let i = 0; i<user.roles.size; i++){
            if(user._roles[i] == role.id){
                user.send(old_user + " Aramızdan Ayrıldı.");
            }
        }
    })
    */
});
bot.on("messageReactionAdd", async (reaction,user) => {
    if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
    if(reaction.emoji.name == '✔️'){
        reaction.fetchUsers()
        .then((users) => {
            users.map((user)=>{
                if(user.username != "BlackBulls Bot"){
                    var sql = "SELECT war_id,war_date from wars order by war_id desc";
                    con.query(sql,(err,result) => {
                        if(err){
                            console.log("Hata: " +err);
                        } else{
                            let today_date = new Date();
                            console.log(result);
                            sql = "SELECT discord_id from war_detail where discord_id = ? and war_id = ?"
                            VALUES = [
                                user.id,
                                result[0].war_id
                            ];
                            con.query(sql,VALUES,(err,result2) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    if(result2 == ""){
                                        console.log(user.id);
                                        sql = "INSERT INTO war_detail (discord_id,war_id) VALUES ("+user.id +","+result[0].war_id+")";
                                        con.query(sql,(err,result3)=>{
                                            if(err){
                                                console.log("Hata: " + err);
                                            } else{
                                                user.send("Saat 8.45'te bufflarınızı almış şekilde geçerli sunucuda hazır olarak bekleyiniz. Alınacak bufflar için !buff yazabilirsiniz.")
                                                console.log("Kayıt Başarılı");
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    });
                    console.log(user.username,reaction.emoji.name);
                }
            })
        })
    }
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
})
bot.on("messageReactionRemove", async (reaction,user) => {
    if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }
    console.log(user.username);
    if(reaction.emoji.name == '✔️'){
        var sql = "SELECT war_id,war_date,war_sw from wars order by war_id desc";
        con.query(sql,(err,result) => {
            if(err){
                console.log("Hata: " +err);
            } else{
                if(result[0].war_sw == 1){
                    console.log(result);
                    sql = "SELECT discord_id from war_detail where discord_id = ? and war_id = ?"
                    VALUES = [
                        user.id,
                        result[0].war_id
                    ];
                    con.query(sql,VALUES,(err,result2) => {
                        if(err){
                            console.log("Hata: " + err);
                        } else{
                            if(result2 != ""){
                                console.log(user.id);
                                sql = "DELETE FROM war_detail WHERE discord_id = "+user.id +" AND war_id = "+result[0].war_id;
                                con.query(sql,(err,result3)=>{
                                    if(err){
                                        console.log("Hataaaaaa: " + err);
                                    } else{
                                        user.send("Savaştan Çıktınız.")
                                        console.log("Silme Başarılı");
                                    }
                                })
                            }
                        }
                    })
                }
            }
        });




        /*reaction.fetchUsers()
        .then((users) => {
            console.log("test 2: " + users);
            users.map((user)=>{
                console.log("test 3: " + user.username);
                if(user.username != "BlackBulls Bot"){
                    console.log("test 84894 ");
                    var sql = "SELECT war_id,war_date from wars order by war_id desc";
                    con.query(sql,(err,result) => {
                        if(err){
                            console.log("test 645651");
                            console.log("Hata: " +err);
                        } else{
                            console.log("test 4: " + result);
                            let today_date = new Date();
                            console.log(result);
                            sql = "SELECT discord_id from war_detail where discord_id = ? and war_id = ?"
                            VALUES = [
                                user.id,
                                result[0].war_id
                            ];
                            con.query(sql,VALUES,(err,result2) => {
                                if(err){
                                    console.log("Hata: " + err);
                                } else{
                                    console.log("test 5: " + result2[0]);
                                    if(result2 == ""){
                                        console.log(user.id);
                                        sql = "DELETE FROM war_detail WHERE discord_id = "+user.id +" AND war_id = "+result[0].war_id;
                                        con.query(sql,(err,result3)=>{
                                            if(err){
                                                console.log("Hataaaaaa: " + err);
                                            } else{
                                                user.send("Savaştan Çıktınız")
                                                console.log("Silme Başarılı");
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    });
                    console.log(user.username,reaction.emoji.name);
                } else{
                    console.log("Bot algılandı.");
                }
            })
        })*/
    }



})

bot.on("guildMemberUpdate", (oldMember,newMember) => {
    newMember.roles.map((role) => {
        if(role.name == "genel"){
            newMember.send("Merhaba Yeni Üyemiz,\n"+
            "Öncelikle hoşgeldiniz. blackbulls-bot kanalından !help yazarak özelliklerimi görebilirsiniz.\n"+
            "!kkayıt komutunu kullanarak kayıt olmayı unutmayınız.\n" +
            "Bilgilerinizi !kgüncelle komutu ile sürekli güncel tutmayı unutmayınız.\n" +
            "Savaş zamanları botu kullanımının detayları için klanımızdaki subaylarımız ile iletişime geçiniz.");
        }
    })
})

bot.on("guildMemberAdd", (newMember) => {
    newMember.send("Merhaba discord adresimize hoşgeldiniz.\n"+
    "Şu an katıldığınız bütün subaylarımıza bildirildi.\n"+
    "Eğer müsaitseniz hoşgeldin kanalına giriş yaparak bekleyebilir değilseniz bir subay sizinle iletişime geçene kadar bekleyebilirsiniz.");
})

function karakterkontrol(char_class){
    let tmp = 0;
    for(let i=0;i<chars.length;i++){
        if(chars[i].includes(char_class)){
            tmp = 1;
            if(chars[i] == "Witch"){
                char_class = "Cadı";
            } else if(chars[i] == "Wizard"){
                char_class = "Büyücü";
            } else if(chars[i] == "Ranger"){
                char_class = "Okçu";
            } else if(chars[i] == "Berserker"){
                char_class = "Vahşi";
            } else if(chars[i] == "Tamer"){
                char_class = "Avcı";
            } else if(chars[i] == "Sorceress"){
                char_class = "Sahire";
            }  else if(chars[i] == "Warrior"){
                char_class = "Savaşçı";
            } else{
                char_class = chars[i];
            }
        }
    }
    if(tmp == 0){
        return 0;
    } else{
        console.log(char_class);
        return char_class;
    }
}

function find_main_channel(){
    const sql_channel = "SELECT * FROM discord_channel";
    con.query(sql_channel,(err,result) => {
        if(err){
            console.log("Hata: " + err);
        } else{
            if(result != ""){
                return result[0].channel_id;
            }
        }
    })
}

