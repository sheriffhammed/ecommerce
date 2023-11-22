
const db = require('../models')
// const Permission = db.Permission
// const Role = db.Role;
function checkRole(RoleName="") {
  return async (req, res, next) => {
    const roleDet = req.user.Role; // Assuming you have user information in req.user
    hasRole = RoleName.includes(roleDet.role_name) ? true : false
    
   // hasRole = RoleName && RoleName === roleDet.role_name? true: false;
    // Check if the user has the required Role
    console.log("UserDetails ", req.user)
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden - Unauthorized to access this role' });
    }
    
    next();
  }
}
  
  module.exports = checkRole;
  