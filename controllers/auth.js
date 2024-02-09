const { response, request, json } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {

        const usuario = await Usuario.findOne({correo});

        if(!usuario) {
            return res.status(400).json({
                msg: 'Correo / Password no son correctos - correo'
            });
        }

        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Correo / Password no son correctos - estado:false'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword) {
            return res.status(400).json({
                msg: 'Correo / Password no son correctos - password'
            });
        }

        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: 'Algo salio mal. hable con el administrador'
        });
    }
}

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            // Tengo que crearlo

            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();

        }

        // Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuarios bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }


}

const renovarToken = async( req, res = response ) => {

    const { usuario } = req;
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}