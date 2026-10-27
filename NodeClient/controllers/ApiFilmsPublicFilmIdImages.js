'use strict';

var utils = require('../utils/writer.js');
var Images = require('../service/ImageService.js');
const link = require('./link');

module.exports.addImage = function addImage (req, res, next) {
  var file = req.files && req.files.find((f) => f.fieldname == 'image');
  if(!file){
    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'File not present in the request' }], }, 400);
  }
  else{
    Images.addImage(req.params.filmId, file, req.user.id)
      .then(function (response) {
          utils.writeJson(res, link.addToImage(response), 201);
      })
      .catch(function (response) {
        if(response == 403){
          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the film' }], }, 403);
        }
        else if (response == 404){
            utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
        }
        else if(response == 415){
          utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Unsupported Media Type'}],}, 415);
        } 
        else {
          utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
        }
      });
  }
};

module.exports.getImages = function getImages (req, res, next) {
  Images.getImages(req.params.filmId, req.user.id)
    .then(function (response) {
       utils.writeJson(res, link.addToImage(response));
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner or reviewer of the film' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });

  
};
