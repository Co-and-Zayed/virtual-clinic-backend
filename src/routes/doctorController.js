const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const patientModel = require('../models/patientModel');

//GET a patient's information and health records
const getPatientInfo = async (req, res) => {
    // we will be getting the ID by selecting the name
    
    const _id = req.body._id;
    try{
       const patient = await patientModel.findById(_id);
       res.status(200).json(patient)
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}



//GET list of all patients 
const getPatients = async (req, res) => {

    const doctor = req.body.doctor;
    try{
      //  Find all appointments with the specified doctor's email
       const appointments = await appointmentModel.find({ doctor: doctor });
       const patientEmails = appointments.map(appointment => appointment.patient);

       // Find patients using the extracted patient emails
       const patients = await patientModel.find({ email: { $in: patientEmails } });
       res.status(200).json(patients);

     } catch (error) {
       console.error(error);
       res.status(400).json({ message: 'Server error' });
     }
}





//GET patients by searching name find({name : req.body.name})
const getPatientsByName = async (req, res) => {

    const name = req.body.name;
    try{
       const patient = await patientModel.find({name:name});
       res.status(200).json(patient)
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}



//GET patients based on upcomimg appointments
const getUpcomingAptmnts = async (req, res) => {
    
    try{
        const doctor = req.body.doctor; 

        // Find all upcoming appointments with the specified doctor's email
        const upcomingAppointments = await appointmentModel.find({
          doctor: doctor,
          status: 'UPCOMING'
        });
    
        res.status(200).json(upcomingAppointments);
     } 
     catch (error) {
       console.error(error);
       res.status(400).json({ message: 'Server error' });
     }
} 


//PATCH email, hourly rate, affiliation
const editSettings = async (req, res) => {

  const _id = req.body._id;
  try{
   const doctor =  await doctorModel.findOneAndUpdate({_id:_id},{...req.body});
   console.log(doctor)
   res.status(200).json(doctor);
  }
  catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server error' });
  }
}

module.exports = { getPatientInfo, getPatients, getPatientsByName, getUpcomingAptmnts, editSettings }