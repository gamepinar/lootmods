module.exports = function (req, res, next) {
    // Verificamos si el usuario existe en la petición y si su rol es admin
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
    }
};
