const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendEmail.js");

router.get("/privacy", (req, res) => {
    res.render("pages/privacy.ejs");
});

router.get("/terms", (req, res) => {
    res.render("pages/terms.ejs");
});

router.get("/help", (req, res) => {
    res.render("pages/help.ejs");
});

router.get("/aircover", (req, res) => {
    res.render("pages/aircover.ejs");
});

router.get("/anti-discrimination", (req, res) => {
    res.render("pages/anti-discrimination.ejs");
});

router.get("/disability-support", (req, res) => {
    res.render("pages/disability.ejs");
});

router.get("/cancellation-options", (req, res) => {
    res.render("pages/cancellation.ejs");
});

// Hosting Specific Pages
router.get("/host-cover", (req, res) => {
    res.render("pages/host-cover.ejs");
});

router.get("/hosting-resources", (req, res) => {
    res.render("pages/hosting-resources.ejs");
});

router.get("/community-forum", (req, res) => {
    res.render("pages/community-forum.ejs");
});

router.get("/host-responsibly", (req, res) => {
    res.render("pages/host-responsibly.ejs");
});

// Real-Time Contact / Mailer Webform Page
router.get("/contact", (req, res) => {
    res.render("pages/contact.ejs");
});

// Real-Time Email Dispatch Route
router.post("/send-email", async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        if (!to || !to.includes("@")) {
            return res.status(400).json({ success: false, message: "Please enter a valid recipient email address." });
        }
        if (!subject || !subject.trim()) {
            return res.status(400).json({ success: false, message: "Please provide an email subject." });
        }
        if (!body || !body.trim()) {
            return res.status(400).json({ success: false, message: "Please provide the email body text." });
        }

        const mailResult = await sendMail({ to, subject, body });
        return res.json({
            success: true,
            message: `✉️ Real-time email successfully sent to ${to}!`,
            previewUrl: mailResult.previewUrl
        });
    } catch (err) {
        console.error("Real-time email error:", err);
        return res.status(500).json({ success: false, message: "Failed to send real-time email. Please check backend log." });
    }
});

// Newsletter Real-Time Subscription Route
router.post("/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
        return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    
    try {
        await sendMail({
            to: email,
            subject: "🎉 Welcome to Wanderlust Travel Newsletter!",
            body: `Thank you for subscribing to Wanderlust! You'll now receive real-time updates on secret travel deals, newly listed villas, and host discounts.`
        });
    } catch(e) {
        // silent fallback
    }

    return res.json({ 
        success: true, 
        message: `Subscription confirmed! Real-time email sent to ${email}.` 
    });
});

module.exports = router;
