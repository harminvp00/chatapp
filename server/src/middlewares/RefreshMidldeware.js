const RefreshMidldeware = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "refresh token not found!",
      });
      return;
    }

    // NOTE: this is the raw opaque refresh token, not a decoded user —
    // kept separate from req.user (which AuthMiddleware uses for the
    // decoded access-token payload) to avoid confusion downstream.
    req.refreshToken = refreshToken;
    next();
  } catch (err) {
    res.status(400).json({
        success: false,
        message: 'refresh_token not found: ' + err.message
    })
  }
};

export default RefreshMidldeware;