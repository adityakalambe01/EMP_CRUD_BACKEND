const JOI = require('joi');

exports.dataValidator = (schema)=>{
    return async (req, res, next)=>{
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            res.status(422).json({success: false, message: error.details[0].message });
        }
    }
}