// Middleware to check for duplicates based on a specific field
async function checkUniqueField(model, field, value) {
    try {
        const existingDoc = await model.findOne({ [field]: value });
        if (existingDoc) {
            throw new Error(`${field} must be unique.`);
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    checkUniqueField
}