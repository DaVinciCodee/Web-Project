// Controllers for message routes
const axios = require('axios');
const cheerio = require('cheerio');

const Message = require('../models/Message');

// Get all messages between two users
module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const porjectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                time: msg.createdAt
            };
        });
        res.json(porjectedMessages);
    } catch (ex) {
        next(ex);
    }
};

// Add a new message
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        console.log("addMessage called with:", { from, to, message });

        if(!from || !to || !message){
            console.log("Données manquantes pour addMessage");
            return res.status(400).json({ msg: "Données manquantes." });
        }

        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            console.log("Message sauvegardé avec succès:", data);
            return res.json({ msg: "Message ajouté avec succès." });
        } else {
            console.log("Échec de la sauvegarde du message");
            return res.json({ msg: "Échec de l'ajout du message." });
        }
    } catch (ex) {
        console.error("Erreur dans addMessage:", ex);
        next(ex);
    }
};

// Get metadata from a URL
module.exports.getUrlMetadata = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL manquante." });
        }

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SpotiMateBot/1.0)' }
        });

        const $ = cheerio.load(data);

        const metaTags = {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
            image: $('meta[property="og:image"]').attr('content'),
            siteName: $('meta[property="og:site_name"]').attr('content'),
            url: url
        };
        
        res.json(metaTags);
    } catch (error) {
        console.error("Erreur getUrlMetadata:", error.message);
        res.json({ title: null, image: null });
    }
};