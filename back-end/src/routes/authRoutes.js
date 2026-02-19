const router = require("express").Router();
const { sendOtp, verifyOtp,login, register,forgotPassword, resetPassword } = require("../controllers/authController");
const { requestMfaOtp, verifyMfaOtp,disableMfa,requestDisableMfaOtp,verifyDisableMfaOtp } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authmiddlewares");


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP to user email for registration
 *     description: Sends OTP to email. User must verify OTP using verify-otp API to complete registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, mobilenumber]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 example: youremail@gmail.com
 *               password:
 *                 type: string
 *               mobilenumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/register", register);


/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP (Register/Login)
 *     description: Use type=register for registration OTP, type=login for login OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               type:
 *                 type: string
 *                 enum: [register, login]
 *                 example: "login"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOtp);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login Step-1 (Password check + Send OTP)
 *     description: If password is correct, sends OTP to email. Then call verify-otp with type=login to get token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 */
router.post("/login", login);


/**
 * @openapi
 * /api/auth/mfa/request:
 *   patch:
 *     tags: [MFA]
 *     summary: Request OTP to enable MFA (Project Settings checkbox ON)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA OTP sent to email
 *       401:
 *         description: Unauthorized
 */
router.patch("/mfa/request", authMiddleware, requestMfaOtp);
/**
 * @openapi
 * /api/auth/mfa/verify:
 *   patch:
 *     tags: [MFA]
 *     summary: Verify OTP and enable MFA
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: MFA enabled
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */
router.patch("/mfa/verify", authMiddleware, verifyMfaOtp);
/**
 * @openapi
 * /api/auth/mfa/disable:
 *   patch:
 *     tags: [MFA]
 *     summary: Disable MFA (Project Settings checkbox OFF)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA disabled
 *       401:
 *         description: Unauthorized
 */
router.patch("/mfa/disable", authMiddleware, disableMfa);
/**
 * @openapi
 * /api/auth/mfa/disable/request:
 *   patch:
 *     tags: [MFA]
 *     summary: Request OTP to disable MFA
 *     description: Sends OTP to user's email. Use /mfa/disable/verify to confirm and disable MFA.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disable MFA OTP sent to email
 *       401:
 *         description: Unauthorized
 */
router.patch("/mfa/disable/request", authMiddleware, requestDisableMfaOtp);
/**
 * @openapi
 * /api/auth/mfa/disable/verify:
 *   patch:
 *     tags: [MFA]
 *     summary: Verify OTP and disable MFA
 *     description: Verifies OTP sent to email and disables MFA for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: MFA disabled successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */
router.patch("/mfa/disable/verify", authMiddleware, verifyDisableMfaOtp);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset OTP sent to email
 */
router.post("/forgot-password", forgotPassword);



/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword, confirmPassword]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);



module.exports = router;
