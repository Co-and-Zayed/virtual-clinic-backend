const patientModel = require("../../../../models/patientModel.js");

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const patient = await patientModel.findOne({ username: user.username });

  patient.password = password;
  await patient.save();

  return res.json({
    success: true,
    message: "Password Reset",
  });
};

module.exports = { resetPassword };
