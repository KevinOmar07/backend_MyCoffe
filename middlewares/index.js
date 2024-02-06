
const validarCampos = require('../middlewares/validar-campos');
const validarJWT    = require('../middlewares/validar-jwt');
const validarRoles  = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos, //el "..." exporta todos los metodos incluidos
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}