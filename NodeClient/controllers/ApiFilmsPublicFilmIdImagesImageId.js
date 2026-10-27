'use strict';

var utils = require('../utils/writer.js');
var Images = require('../service/ImageService.js');
const link = require('./link');

module.exports.getSingleImage = function getSingleImage (req, res, next) {

  var mediaType = req.get('Accept');
  if(mediaType != 'application/json' && mediaType != 'image/png' && mediaType != 'image/jpg' && mediaType != 'image/gif'){
    utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Media Type not supported'}],}, 406);
    return;
  }
  var imageType = mediaType.substring(mediaType.lastIndexOf("/") );
  var imageType = imageType.replace('/', '');

  Images.getSingleImage(req.params.imageId, imageType, req.params.filmId, req.user.id)
    .then(function (response) {
       if(imageType == 'json'){
         utils.writeJson(res, link.addToImage(response));
       }
       else{
         res.sendFile(response, {root: './uploads'});
       }
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



module.exports.deleteSingleImage = function deleteSingleImage (req, res, next) {
  Images.deleteSingleImage(req.params.filmId, req.params.imageId, req.user.id)
    .then(function (response) {
       utils.writeJson(res, null, 204);
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the film' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });
};



