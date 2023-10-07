const doctorModel = require('../models/doctorModel');

const getDoctordetails = async (req, res) => {
    // view doctor details by selecting the name.
    const id=req.body.id;
    
    try{
       const doctor = await doctorModel.findById(id);
       res.status(200).json(doctor)
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}

module.exports={getDoctordetails}