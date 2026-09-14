import app from "./app.js";
import config from "./config/config.js";
import connectDb from "./db/db.js";


const startServer = async () => {
    try {
        await connectDb();

        app.listen(config.PORT, () => {
            console.log(`Skillio server is running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Skillio server:", error);
        process.exit(1);
    }
};

startServer();