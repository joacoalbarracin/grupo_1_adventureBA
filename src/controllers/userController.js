const fs = require('fs'); // Requerimos el módulo File System de Node
const path = require('path'); // Requerimos el módulo Path de Node
const bcrypt = require('bcrypt'); // Requerimos el módulo Bcrypt
const mainController = require('./mainController'); // Requerimos el controlador mainController
const { validationResult } = require('express-validator'); // Requerimos el módulo express-validator
const usuarios = JSON.parse(fs.readFileSync(path.resolve('./src/database/user.json'))); // Lee el archivo user.json
const rutaArchivoUsers = path.resolve('./src/database/user.json'); // Ruta del archivo user.json
const db = require('../database/models');
const { error } = require('console');

module.exports = {
  showLoginUserForm: (req, res) => {
      return res.render('login'); // Renderiza la vista login.ejs
  },
  processLoginUserForm: async (req, res) => {
    try {
      const usuarioEncontrado = await db.User.findOne({where: {email: req.body.email}})
      if (usuarioEncontrado) { 
        if (bcrypt.compareSync(req.body.password, usuarioEncontrado.password)){
          delete usuarioEncontrado.password
          req.session.usuarioLogueado = usuarioEncontrado
          if (req.body.cookie){
            res.cookie('recordame', usuarioEncontrado.email, {maxAge: 1000*60*60}) //Dura una hora la cookie
          }
          return res.redirect('profile')
        }
      }
      else {
        throw new error
      }
    } catch (error) {
      return res.render("login", {
        errors: {
          datosMal: {
            msg: "Datos incorrectos"
          }
        }
      })
    }
  },
  logout: (req,res) => {
    req.session.destroy()
    res.clearCookie("recordame")
    return res.redirect("/")
  },
  showProfile: async (req, res) => {
      return res.render('profile', {usuarioEncontrado: req.session.usuarioLogueado}); // Renderiza la vista profile.ejs
  },
  showCreateUserForm: (req, res) => { //
      res.render('register'); // Renderiza la vista register.ejs
  },
  /** Procesa el formulario de registro de usuario */
  processCreateUserForm: async (req, res) => {
    try {
      await db.User.create({
        name: req.body.name,
        lastName: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        userCategoryId: 1,
        image: req.file.filename || 'defaultUser.webp',
      })
      return res.redirect('/users/login')
    } catch (error) {
        console.log(error)
    }

  },
  /** Muestra el formulario de edición de usuario */
  showEditUserForm: async (req,res) => {
    try {
        const usuarioEncontrado = await db.User.findByPk(req.params.id)
        return res.render('editUser', {usuarioEncontrado: usuarioEncontrado}); // Muestra la vista editProduct.ejs con el producto encontrado
    } catch (error) {
        console.log(error);
    }
  },
  /** Procesa el formulario de edición de usuario */
  processEditUser: async (req, res) => {
    try {
      await db.User.update({
        name: req.body.name,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        image: req.file.image,
        
      }, {
          where: {id : req.params.id}
      })
      return res.redirect("/") // Redirecciona a la lista de productos
    } catch (error) {
        console.log(error)
    }
  },
      //Hace ["borrado": true] en la base de datos
    deleteUser: (req, res) => { 
      const usuarioEncontrado = usuarios.find(row => row.id == req.params.id); // Busca el producto por ID
      usuarioEncontrado.borrado = true; // Asigna el estado de borrado al producto encontrado
      fs.writeFileSync(rutaArchivoUsers, JSON.stringify(usuarios, null, 2)); // Escribe el archivo JSON
      return res.send(usuarioEncontrado);
    },
  };