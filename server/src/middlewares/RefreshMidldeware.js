

/**
 * This middleware help to get verify the refresh token when the client visit to the /refersh route to get a new access token
 * this is take refresh token from req, 
 * check it exists?
 * and send the refresh token to as req.refreshToken to the route controller, so it can access it to grant new access token to the user 
 */
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