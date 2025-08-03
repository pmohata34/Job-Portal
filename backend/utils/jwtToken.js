export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction, // cookies are sent only over HTTPS in production
    sameSite: isProduction ? "None" : "Lax", // enables cross-origin cookies
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
};