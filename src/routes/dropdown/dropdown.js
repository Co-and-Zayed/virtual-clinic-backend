const express = require("express")
const router = express.Router()

const { getSpecialities } = require('./dropdownController')

//GET list of all specialities 
router.get('/specialities' , getSpecialities)

module.exports = router


