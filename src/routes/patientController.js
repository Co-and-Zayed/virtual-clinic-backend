const doctorModel = require('../models/doctorModel');

const getDoctordetails = async (req, res) => {
    // view doctor details by selecting the name.
    const name=req.body.name;
    
    try{
       const doctor = await doctorModel.find({name: name})
       
       
       res.status(200).json(doctor)
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}

module.exports={getDoctordetails}