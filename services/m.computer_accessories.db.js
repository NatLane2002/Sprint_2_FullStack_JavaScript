const { ObjectId } = require("mongodb");
const mdb = require("./mdb");

async function getComputerAccessories() {
if (DEBUG) console.log("logins.mongo.dal.getComputerAccessories()");
try {
    await mdb.connect();
    const cursor = mdb.db("Sprint2FullStackJavaScript").collection("computer_accessories").find();
    const results = await cursor.toArray();
    return results;
} catch (error) {
    console.error("Error occurred while connecting to MongoDB:", error);
    throw error;
} finally {
    mdb.close();
}
}

async function searchComputerAccessories(query) {
if (DEBUG) console.log("logins.mongo.dal.searchComputerAccessories()");
try {
    await mdb.connect();
    const database = mdb.db("Sprint2FullStackJavaScript");
    const collection = database.collection("computer_accessories");
    const result = await collection.find({
    $or: [
        { keyboard: { $regex: new RegExp(query, 'i') } },
        { mouse: { $regex: new RegExp(query, 'i') } },
        { mouse_pad: { $regex: new RegExp(query, 'i') } },
        { desk: { $regex: new RegExp(query, 'i') } },
        { chair: { $regex: new RegExp(query, 'i') } },
    ]
    }).toArray();
    return result;
} catch (error) {
    console.error("Error occurred while connecting to MongoDB:", error);
    throw error;
} finally {
    mdb.close();
}
}

module.exports = {
    getComputerAccessories,
    searchComputerAccessories,
};
