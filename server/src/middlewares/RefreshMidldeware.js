import { success } from "zod";

const RefreshMidldeware = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(404).json({
        success: false,
        message: "refresh token not found!",
      });
      return;
    }

    req.user = refreshToken;
    next();
  } catch (err) {
    res.status(400).json({
        success: false,
        message: 'refresh_token not found' + err.message
    })
  }
};

export default RefreshMidldeware;
