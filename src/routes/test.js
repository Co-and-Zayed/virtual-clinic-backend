
const getRoute = (req, res) => {
    console.log("Hena");
    return res.json({message: 'Success'});
};

module.exports = { getRoute }