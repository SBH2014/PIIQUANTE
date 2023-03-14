const Sauce = require('../models/sauce');

exports.getAllSauce =(req, res, next) => {
    Sauce.find()
        .then(things => res.status(201).json(things))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(newSauce => res.status(200).json(newSauce))
        .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  const newSauce = new Sauce({
    ...sauceObject,

 
  });
  newSauce
    .save()
    .then(() => res.status(201).json({ message : "Sauce créer " }))
    .catch((error) => res.status(400).json({ error }));
    
};


