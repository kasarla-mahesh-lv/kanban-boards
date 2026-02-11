/**
 * @openapi
 * tags:
 *   - name: MFA
 *     description: Multi-Factor Authentication (Login OTP) APIs
 */

const router = require("express").Router();
const { loginSendOtp, verifyLoginOtp } = require("../controllers/multiFactorAuthController");

/**
 * @openapi
 * /api/mfa/login:
 *   post:
 *     tags: [MFA]
 *     summary: Step 1 - Login with password and send OTP to email
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
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "yourPassword"
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/login", loginSendOtp);

/**
 * @openapi
 * /api/mfa/login/verify-otp:
 *   post:
 *     tags: [MFA]
 *     summary: Step 2 - Verify OTP and return JWT token
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
 *                 example: "user@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login success with token
 */
router.post("/login/verify-otp", verifyLoginOtp);

module.exports = router;
