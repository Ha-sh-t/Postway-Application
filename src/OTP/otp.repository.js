import { getDB } from "../config/mongodb.config.js";
import { ObjectId } from "mongodb";

/**
 * Repository layer = Only talks to DB
 * No business logic here
 */
class OtpRepository {
    constructor() {
        this.collection = getDB().collection("OTP");
    }

    /**
     * Save OTP doc into DB
     */
    async save(otp) {
        const { insertedId } = await this.collection.insertOne(otp);
    }

    /**
     * Get OTP doc by ID
     */
    async getOtp(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Mark OTP as used (instead of deleting it)
     */
    async markUsed(id) {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { used: true } }
        );
    }
}

export default OtpRepository;