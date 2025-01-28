//————————————————————————//

/*

Created By Xyroo
WhatsApp Me : 6281543496975

 - Source ↓
 - https://chat.whatsapp.com/B5eed04F4v6LbstG2SuRbA
 - https://whatsapp.com/channel/0029Vak9tFD2P59bOJcv3N3b
 - https://whatsapp.com/channel/0029VajOwS32phHQj8bIpd3G

*/

//————————————————————————//
//🌌——————————————————————————————————————————————————————————————————————————🌌\\
require('./setting')
const Setting = require('./setting')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, getAggregateVotesInPollMessage, proto, delay, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys")
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const os = require('os')
const fetch = require('node-fetch')
const FileType = require('file-type')
const readline = require("readline");
const yargs = require('yargs/yargs')
const { HttpsProxyAgent } = require("https-proxy-agent");
const nodemailer = require('nodemailer')
const { Telegraf, Context } = require('telegraf')
const colors = require('@colors/colors/safe')
const { color } = require('./lib/color');
const { say } = require('cfonts')
const agent = new HttpsProxyAgent("http://proxy:clph123@103.123.63.106:3128");
const _ = require('lodash')
const { Boom } = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep} = require('./lib/myfunction')
const usePairingCode = true
const question = (text) => {
  const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
  });
  return new Promise((resolve) => {
rl.question(text, resolve)
  })
};
//=================================================//
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
//=================================================//
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')
//=================================================//
//=================================================//
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
//=================================================//
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./src/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()
//=========================//
const DATABASE_URL = 'https://raw.githubusercontent.com/xyrooo2/AliciaFpss/main/database.json';
const storageFile = './credentials.txt';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getUserInput = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const validateCredentials = (username, password, users) => {
    const user = users.find(user => user.username === username);
    if (!user) {
        return { valid: false, message: 'Use Ga Ada <!>, Sc ini dapet nyolong kah bang? beli makanya ke zakyGanteng😏' };
    }
    if (user.password !== password) {
        return { valid: false, message: 'Pwnya salah <!>, Sc ini dapet nyolong kah bang? beli makanya ke zakyGanteng😏' };
    }
    const expires = new Date(user.expires);
    const now = new Date();
    if (now > expires) {
        return { valid: false, message: 'Use Dan Pw Telah Expired, silahkan beli ke 6281543496975' };
    }
    return { valid: true, message: 'Sukses Login, Selamat menikmati Script ini' };
};

async function validIp() {
    try {
        const { delay } = require("@whiskeysockets/baileys")
        const response = await axios.get(DATABASE_URL);
        const data = response.data;
        let username, password, saveCredentials;

        console.log(color('Send Usernamemu :', 'yellow'));
        username = await getUserInput(': ');
        console.log(color('Send Passwordmu :', 'yellow'));
        password = await getUserInput(': ');
        console.log(color('Simpan kredensial? (1 = yes, 2 = no) :', 'yellow'));
        saveCredentials = await getUserInput(': ');

        const result = validateCredentials(username, password, data.users);
        if (result.valid) {
            console.log(color('Succes Login!', 'red'));
            console.table({
                "Username": `${username}`,
                "Password": `${password}`,
                "Expired": `?-?-?`
            })

            if (saveCredentials === '1') {
                fs.writeFileSync(storageFile, `${username}\n${password}`);
                console.log(color('Kredensial disimpan !', 'red'));
            } else {
                console.log(color('Kredensial tidak disimpan !.', 'red'));
            }

            delay(15000)
            AliciaWhatsapp()
        } else {
            console.log(result.message);
            process.exit(1);
        }
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        process.exit(1);
    } finally {
        rl.close();
    }
}
// FUNC SEND PAIR MAIL

async function sendEmail(to, subject, htmlContent) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: global.pairing.email,
            pass: global.pairing.password
        }
    });

    let mailOptions = {
        from: `"ALICIA ASISTENT Send Pair For Gmail" <${global.pairing.email}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
}
// CREATE TMP FILE
    function createTmpFolder() {
        const folderName = "tmp";
        const folderPath = path.join(__dirname, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(chalk.green.bold(`[ Success ] Folder '${folderName}' berhasil dibuat.`));
        }
    }
    createTmpFolder();
//STARTING PAIRING CODE 
async function AliciaWhatsapp() {
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState("Session")
	const Alicia = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.templateMessage ||
				message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
		version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});

    if (!Alicia.authState.creds.registered) {
          await clearConsole();
      say(`Alicia Asistent Gen 2`, {
         font: 'block',
         align: 'center',
         gradient: ['blue', 'white']
    })
      
    const choice = await question('Silahkan Pilih Verifikasi Lewat Apa:\n1. Lewat Gmail\n2. Lewat Nomor WhatsApp Yang Tertera Di Setting.js\n 3. Spam Request Kode Pairing ( Ini Tidak Memberi Verifikasi Mu, Cuma Buat Serang WhatsApp Lawan ) ( Tidak Disarankan )\nPilihan antara 1,2,3: ');

  if (choice === '1') {
    const email = await question('Masukkan Alamat Email Anda:\n');
    await requestPairingAndSendEmail(email);
  } else if (choice === '2') {
    console.log(`Mengkoneksikan Ke Nomor : ${global.pairing}\n`);
    const code = await Alicia.requestPairingCode(global.pairing);
    console.log('Process...');
    await sleep(3000); // Tunggu selama 3000 milidetik
    console.log(`Pair Codenya ni: ${code}`);
  } else if (choice === '3') {
    await spamPairingRequest();
  } else {
    console.log('Pilihan tidak sesuai');
  }
}
async function requestPairingAndSendEmail(email) {
  try {
    await new Promise((resolve) => setTimeout(resolve, Setting.pairing_wait));
    const code = await Alicia.requestPairingCode(global.nomorbot);
    
    async function sendVerificationEmail(email, code) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'rio28mei',  // Use environment variables
            pass: 'mktxfpdexwscxqbg',  // Use environment variables
          },
        });

        const mailOptions = {
          from: global.email,
          to: email,
          subject: global.subject,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Request Pairing Code</title>
</head>
<body>
  <div style="border: 1px solid #ccc; padding: 20px; font-family: monospace;">
    <div style="background-color: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 10px">
       <h2 style="color: #00000">Request Pairing Code</h2>
                  <p>Dear ${email},</p>
        <p>Thank you for using this WhatsApp bot. here is your pairing code:</p>
        <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 18px; font-weight: bold">
        <div style="text-align: center; font-family: monospace;">
        <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 18px; font-weight: bold">
             ${code}
                  </div>
          <hr style="display: inline-block; margin-top: 20px; margin-bottom: 20px; width: 60%;">
          <p style="font-size: 12px; display: inline-block;"> Notification Request Pairing'Code, Harap Masukkan Kode Pairing Untuk Dapat Terhubung Di Bot WhatsApp</p>
          <p style="font-size: 12px; display: inline-block;"> Time Limit for Request Pairing Code : 30 seconds !!!</p>
        </div>
      </div>
</body>
</html>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Silahkan periksa Gmail Anda.');
      } catch (error) {
        console.error('Terjadi kesalahan saat mengirim email:', error);
      }
    }

    await sendVerificationEmail(email, code);
  } catch (error) {
    console.error('Terjadi kesalahan saat meminta kode verifikasi:', error);
  }
}

async function requestPairingAndSendWhatsApp(phoneNumber) {
  try {
    await new Promise((resolve) => setTimeout(resolve, Setting.pairing_wait));
    const code = await Alicia.requestPairingCode(global.nomorbot);

    // Anda bisa menambahkan kode untuk mengirim pesan WhatsApp jika diperlukan di sini

    console.log(`Your Pairing Code: ${code}`);
  } catch (error) {
    console.error('Terjadi kesalahan saat meminta kode verifikasi:', error);
  }
}

async function spamPairingRequest() {
  const startTime = Date.now();
  const duration = 15 * 60 * 1000; // 15 menit dalam milidetik
  const phoneNumber = await question('Masukkan Nomor WhatsApp Target:\n');

  // Sanitasi nomor telepon
  const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

  while (Date.now() - startTime < duration) {
    let attempts = 100; // Jumlah percobaan per iterasi
    while (attempts > 0) {
      try {
        const pairingCodeResponse = await Alicia.requestPairingCode(sanitizedPhoneNumber);
        console.log(`Spam On Target: ${pairingCodeResponse}`);
      } catch (error) {
        console.error('Terjadi kesalahan saat meminta kode verifikasi:', error);
      }

      console.log(`DDOS WhatsApp: ${attempts} detik...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 detik per iterasi
      attempts--;
    }

    console.log('Mengirim Ulang Dalam 30 detik...');
    await new Promise(resolve => setTimeout(resolve, 30000)); // Tunggu 30 detik sebelum iterasi berikutnya
  }

  console.log('Selesai. 15 menit telah berlalu.');
}

async function clearConsole() {
    const isWindows = process.platform === 'win32';
    const isLinuxOrMac = process.platform === 'linux' || process.platform === 'darwin';

    return new Promise((resolve, reject) => {
        const command = isWindows ? 'cls' : (isLinuxOrMac ? 'clear' : '');
        if (command) {
            require('child_process').exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    console.log(stdout);
                    resolve();
                }
            });
        } else {
            console.log('Platform not supported for clearing console.');
            resolve();
        }
    });
}

      say(`Alicia Asistent`, {
         font: 'block',
         align: 'center',
         gradient: ['blue', 'white']
      });
      console.table({
      "Info": "Information Developer",
      "NameDev": `zakyGanteng😏`,
      "WhatsApp": `6281543496975`,
      "Github": `https://github.com/zakyGanteng😏o2`,
      "Instagram": `https://instagram.com/biitheonx_`,
      "Tele": `https://t.me/@zakyGanteng😏NotSepuh`
      });
      console.table({
      "Info": "Information Bot",
      "NameBot": `Alicia Asistent`,
      "WhatsApp": `62815434969759`
      })
//=================================================//
Alicia.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

Alicia.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!Alicia.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(Alicia, mek, store)
require("./Alicia")(Alicia, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

Alicia.ev.on('call', async (celled) => {
let botNumber = await Alicia.decodeJid(Alicia.user.id)
let koloi = global.anticall
if (!koloi) return
console.log(celled)
for (let kopel of celled) {
if (kopel.isGroup == true) {
if (kopel.status == "offer") {
let nomer = await Alicia.sendTextWithMentions(kopel.from, `*${Alicia.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner membuka blok !`)
Alicia.sendContact(kopel.from, owner.map( i => i.split("@")[0]), nomer)
await sleep(8000)
await Alicia.updateBlockStatus(kopel.from, "block")
}
}
}
})

//————————————————————————//
// Detek Update Group

    Alicia.ev.on('group-participants.update', async (anu) => {
        //console.log(anu)
        try {
            let metadata = await Alicia.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
                // Get Profile Picture User
                try {
                    ppuser = await Alicia.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                }

                // Get Profile Picture Group
                try {
                    ppgroup = await Alicia.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                }

                if (anu.action == 'add') {
                    let a = `Halo ${num.split("@")[0]}*\n Selamat Datang Di Group : ${metadata.subject} \n- No sharelink
- No add bot
- No spam
- No mesum 
- No rusuh`
                    Alicia.sendMessage(anu.id, {
                        text: a,
                        contextInfo: {
                            externalAdReply: {
                                title: `Member Baru Disayang Atmin 🥰`,
                                body: `${ownername}`,
                                thumbnailUrl: ppuser,
                                sourceUrl: channel,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    })
                } else if (anu.action == 'remove') {
                    let a = `Byye ${num.split("@")[0]}*\n Selamat Jalan 😭😭`
                    Alicia.sendMessage(anu.id, {
                        text: a,
                        contextInfo: {
                            externalAdReply: {
                                title: `Dia Telah Meninggal 😭`,
                                body: `${ownername}`,
                                thumbnailUrl: ppuser,
                                sourceUrl: channel,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    })
                } else if (anu.action == 'promote') {
                    Alicia.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Telah Menjadi Admin Group ${metadata.subject}` })
                } else if (anu.action == 'demote') {
                    Alicia.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Sudah Bukan Admin Dari Group : ${metadata.subject}` })
                }
            }
        } catch (err) {
            console.log(err)
        }
    })

//————————————————————————//

//————————————————————————//
//autostatus view
Alicia.ev.on('messages.upsert', async chatUpdate => {
        	if (global.autoswview){
        try {
            if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
            const mek = chatUpdate.messages[0];

            if (!mek.message) return;
            mek.message =
                Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = [
                    '😹','😹','💦','💦','💕','🥺','😍','💦','😭','😂',
                ];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await Alicia.readMessages([mek.key]);
                Alicia.sendMessage(
                    'status@broadcast',
                    { react: { text: sigma, key: mek.key } },
                    { statusJidList: [mek.key.participant] },
                );
            }

        } catch (err) {
            console.error(err);
        }
      }
   }
 )

//————————————————————————// 

Alicia.ev.on('contacts.update', update => {
for (let contact of update) {
let id = Alicia.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }}})

Alicia.getName = (jid, withoutContact  = false) => {
id = Alicia.decodeJid(jid)
withoutContact = Alicia.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = Alicia.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === Alicia.decodeJid(Alicia.user.id) ?
Alicia.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}

Alicia.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await Alicia.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await Alicia.getName(i + '@s.whatsapp.net')}\nFN:${await Alicia.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:aplusscell@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://chat.whatsapp.com/HbCl8qf3KQK1MEp3ZBBpSf\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`})}
Alicia.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })}
//=================================================//
//Kalau Mau Self Lu Buat Jadi false
Alicia.public = true
Alicia.ev.on('creds.update', saveCreds)
 //=================================================//
 Alicia.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 
 //=================================================//
 Alicia.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await Alicia.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })}
//=================================================//
Alicia.sendText = (jid, text, quoted = '', options) => Alicia.sendMessage(jid, { text: text, ...options }, { quoted })
//=================================================//
Alicia.sendTextWithMentions = async (jid, text, quoted, options = {}) => Alicia.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
 //=================================================//
Alicia.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
await Alicia.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

Alicia.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImgAV(buff, options)
} else {
buffer = await imageToWebp2(buff)}
await Alicia.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

Alicia.sendImageAsStickerAvatar = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp3(buff)}
await Alicia.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
 //=================================================//
Alicia.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
await Alicia.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
 //=================================================//
 Alicia.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName}
//=================================================
 Alicia.cMod = (jid, copy, text = '', sender = Alicia.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === Alicia.user.id
return proto.WebMessageInfo.fromObject(copy)}
Alicia.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
let types = await Alicia.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./lib/exif.js')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: global.packname, author: global.packname2, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await Alicia.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}
Alicia.parseMention = async(text) => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}
//=================================================//
Alicia.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message}}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo}} : {})} : {})
await Alicia.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage}
//=================================================//
Alicia.sendReact = async (jid, emoticon, keys = {}) => {
let reactionMessage = {
react: {
text: emoticon,
key: keys
}
}
return await Alicia.sendMessage(jid, reactionMessage)
}
//=================================================//
Alicia.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
	size: await getSizeMedia(data),
...type,
data
}
}
Alicia.serializeM = (m) => smsg(Alicia, m, store)
Alicia.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
  let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
  if (reason === DisconnectReason.badSession) {
console.log(`Bad Session File, Please Delete Session and Scan Again`);
process.exit();
  } else if (reason === DisconnectReason.connectionClosed) {
console.log("Connection closed, reconnecting....");
AliciaWhatsapp();
  } else if (reason === DisconnectReason.connectionLost) {
console.log("Connection Lost from Server, reconnecting...");
AliciaWhatsapp();
  } else if (reason === DisconnectReason.connectionReplaced) {
console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
process.exit();
  } else if (reason === DisconnectReason.loggedOut) {
console.log(`Device Logged Out, Please Delete Folder Session yusril and Scan Again.`);
process.exit();
  } else if (reason === DisconnectReason.restartRequired) {
console.log("Restart Required, Restarting...");
AliciaWhatsapp();
  } else if (reason === DisconnectReason.timedOut) {
console.log("Connection TimedOut, Reconnecting...");
AliciaWhatsapp();
  } else {
console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
AliciaWhatsapp();
  }
} else if (connection === "open") {
  Alicia.sendMessage('6281543496975' + "@s.whatsapp.net", { text: `Berhasil Terhubung <!>\n*Alicia Asistent New Version <!>*` });
}
});
return Alicia
};
validIp()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Succes Update : '${__filename}'`))
	delete require.cache[file]
	require(file)
})