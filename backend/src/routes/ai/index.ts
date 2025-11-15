import Router from "express";
import askRouter from "../../openRouter";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const message = req.body.message;
        if (!message) {
            return res.status(400).send("Message is required");
        }
        const response = await askRouter(message as string);
        res.send(response);
    } catch (error) {
        console.error("Error in AI route:", error);
        res.status(500).send("Error processing your request");
    }
});

export default router;