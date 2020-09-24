const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exposedMsg = 'You have to get into quarantine for 2 weeks from exposure'
const symptomsMsg = 'You have to get into quarantine till your symptoms disappear for 2 days in a row'
const abroadMsg = 'You have to get into quarantine for 2 weeks from coming back'
const sickMsg = 'You have to get into quarantine for 2 weeks or 3 days from symptoms disappear, the later'
const healthyMsg = 'We glad to tell you dont have to get into quarantine'


const msgSchema = new Schema ({
    exposed: { type: String, default: exposedMsg },
    symptoms: { type: String, default: symptomsMsg },
    abroad: { type: String, default: abroadMsg },
    sick: { type: String, default: sickMsg },
    healthy: { type: String, default: healthyMsg }
})



const msg = mongoose.model("msg",msgSchema)

module.exports = msg