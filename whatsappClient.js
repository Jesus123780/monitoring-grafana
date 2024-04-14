const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal'); // Importa la biblioteca qrcode-terminal

const SESSION_FILE_PATH = 'session.json'

const fs = require('fs')

const wwebVersion = '2.2407.3';

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'ey' }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});

client.on('qr', (qr) => {
    // Genera y muestra el código QR en la terminal
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true }); // Utiliza qrcode-terminal para generar el código QR en la terminal
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
    console.log('Client authenticated');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();

module.exports = { client }