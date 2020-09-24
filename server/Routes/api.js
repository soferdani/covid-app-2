const express = require('express')
require('dotenv').config()
const axios = require('axios')
const moment = require('moment')
const router = express.Router()
const User = require('../model/User')
const msg = require('../model/msg')
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('../model/User')



router.get("/stats/:country", async (req, res) => {
    const { country } = req.params
    const { from, to } = req.query
    try {
        const response = await axios.get(`https://api.covid19api.com/country/${country}?from=${from}&to=${to}`);
        let dataToTheUser = (response.data)
        const newDataArrDate = dataToTheUser.map(c => c.Date)
        const newDataArrDeth = dataToTheUser.map(c => c.Deaths)
        const newDataArrInfected = dataToTheUser.map(c => c.Active)
        res.send([newDataArrDate, newDataArrDeth, newDataArrInfected])
    } catch (err) {
        res.send(err)
    }
})

router.post("/saveUser", async (req, res) => {
    try {
        let UserToSaveInDB = req.body
        toSave = new User(UserToSaveInDB)
        await toSave.save()
        res.send(toSave)
    } catch (err) {
        res.send(err)
    }
})

router.get('/getUsers', async (req, res) => {
    try {
        let toSend = await User.find({})
        res.send(toSend)
    } catch (err) {
        res.send(err)
    }
})

router.post('/sendMail', async (req, res) => {
    let mailInfo = req.body
    try {
        let msgToUser = await msg.find({})
        let theText = `Hello ${mailInfo.name} 
        ${msgToUser[0][mailInfo.status]}`
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        })

        let info = await transporter.sendMail({
            from: '"Covid 19 Web-Cheat" <Covid19@covidbot.com>', // sender address
            to: mailInfo.email,
            subject: "This is your Covid summery",
            text: theText,
            html: `<b>${theText}</b>`,
        });

        res.send("complit the mission")
    } catch (err) {
        res.send(err)
    }

})

router.get("/infoForCharts1", async (req, res) => {
    try {
        const response = await axios.get(`https://api.covid19api.com/world/total`);
        let dataToTheUser = (response.data)
        let TotalConfirmed = new Intl.NumberFormat().format(dataToTheUser.TotalConfirmed)
        let TotalDeaths = new Intl.NumberFormat().format(dataToTheUser.TotalDeaths)
        let TotalRecovered = new Intl.NumberFormat().format(dataToTheUser.TotalRecovered)

        res.send({ TotalConfirmed, TotalDeaths, TotalRecovered })
    } catch (err) {
        res.send(err)
    }
})

router.get("/infoForCharts2", async (req, res) => {
    const countrys = ['russia', 'south-africa', 'india ', 'brazil', 'spain']
    let promises = []
    countrys.forEach(c => promises.push(axios.get(`https://api.covid19api.com/total/country/${c}`)))
    let values = Promise.all(promises).then(function (responsFromApi) {
        let relevantInfo = responsFromApi.map(d => d.data)
            .map(d => d[d.length - 1])
            .map(d => { return { name: d.Country, active: d.Active } })
        res.send(relevantInfo)
    })
})


router.get("/news", async (req, res) => {
    const url = 'http://newsapi.org/v2/everything?' +
        'q=Covid&' +
        'from=' +
        moment().subtract(6, 'days').format('L') +
        '&sortBy=popularity&' +
        'apiKey=c9aa54cdd12c4fc8b1faae11fffdfbed';
    let news = await axios.get(url)
    news = news.data.articles
        .map(a => {
            return {
                title: a.title,
                author: a.author,
                description: a.description,
                url: a.url,
                urlToImage: a.urlToImage
            }
        })
    res.send(news)
})


router.get("/userStats", async (req, res) => {
    const symptoms = ["symptoms", "healthy", "abroad", "exposed", "sick"]
    let promises = []
    symptoms.forEach(s => promises.push(User.find({ status: s }).count()))
    Promise.all(promises).then(function (resFromDB) {
        let toSend = {}
        for (i in symptoms) {
            toSend[symptoms[i]] = resFromDB[i]
        }
        res.send(toSend)
    })
})

router.get("/location/:lat/:lon", async (req, res) => {
    const { lat, lon } = req.params
    try {
        let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyBpiTf5uzEtJsKXReoOKXYw4RO0ayT2Opc`)
        response = (response.data)
        response = response.results[response.results.length - 1].address_components[0].short_name
        res.send(response)
    } catch (err) {
        res.send(err)
    }
})


module.exports = router