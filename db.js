const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://gofood:gofood2001@cluster0.736b5l3.mongodb.net/gofoodmern?retryWrites=true&w=majority"
const mongoDB = async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        if (err) {
            console.log("---", err);

        } else {
            console.log("DB connected");
            const fetched_Data = await mongoose.connection.db.collection("food_items");
            fetched_Data.find({}).toArray(async function (err, data) {
                const foodCategory = await mongoose.connection.db.collection("foodCategory");

                foodCategory.find({}).toArray(function (err, catData) {
                    if (err) console.log(err);
                    else {
                        global.food_items = data;
                        global.foodCategory = catData;
                    }

                })
                
            })

        }
    })
}

module.exports = mongoDB;