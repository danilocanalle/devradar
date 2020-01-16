const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(req, res) {
        
        const {latitude, longitude, techs} = req.query

        const techsArray = parseStringAsArray(techs)

        // case insensitive search
        const optRegexp = [];
        techsArray.forEach(function(opt){
            optRegexp.push(  new RegExp(opt, "i") );
        });

        const devs = await Dev.find({
            techs: {
               $in: optRegexp
            },
            /*
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000 //metros
                }
            }
            */
        })
        
        return res.json({devs})
    }
}