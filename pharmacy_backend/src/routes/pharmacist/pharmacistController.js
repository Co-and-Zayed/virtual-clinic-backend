const pharmacistModel = require("../../../../models/pharmacistModel");
const contractModel = require("../../../../models/contractModel");

const viewAllContracts = async (req, res) => {
  const { username } = req.user;
  try {
    const contract = await contractModel.find({ username: username });
    res.status(200).json(contract);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const acceptContract = async (req, res) => {
  const { _id } = req.body;
  const { username } = req.user;
  try {
    const contract = await contractModel.findOneAndUpdate(
      { _id: _id },
      { status: "ACCEPTED" },
      { new: true }
    );
    const pharmacist = await pharmacistModel.findOneAndUpdate(
      { username: username },
      { status: "ACCEPTED" },
      { new: true }
    );
    res.status(200).json({ contract, pharmacist });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const rejectContract = async (req, res) => {
  const { _id } = req.body;
  const { username } = req.user;

  try {
    const contract = await contractModel.findOneAndUpdate(
      { _id: _id },
      { status: "REJECTED" },
      { new: true }
    );
    const doctor = await pharmacistModel.findOneAndUpdate(
      { username: username },
      { status: "REJECTED" },
      { new: true }
    );
    res.status(200).json({ contract, pharmacist });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const pharmacist = await pharmacistModel.findOne({ username: user.username });

  pharmacist.password = password;
  await pharmacist.save();

  return res.json({
    success: true,
    message: "Password Reset",
  });
};

module.exports = {
  resetPassword,
  viewAllContracts,
  acceptContract,
  rejectContract,
};
