const requireAdmin = (req, res, next) => {
  if (req.user.role_name=='super'||req.user.role_name=='admin'){
    next();
    
  } else{
    return res.status(401).json({
      message: "You are not admin."
    });
  }
};

module.exports = requireAdmin;
