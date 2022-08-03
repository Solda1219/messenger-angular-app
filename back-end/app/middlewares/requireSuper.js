const requireAdmin = (req, res, next) => {
  if (req.user.role_name=='super'){
    next();
    
  } else{
    return res.status(401).json({
      message: "You are not super admin."
    });
  }
};

module.exports = requireAdmin;
