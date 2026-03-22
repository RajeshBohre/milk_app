var express = require('express');

var app = express();
var path = require("path");
var cors = require('cors')
var bodyParser = require('body-parser');
//var studentModel = require('./student-model');
var mongo = require("mongoose");
const { type } = require('os');
mongo.set('debug', true);
//const DB = "mongodb://localhost:27017/milkhisab"
const DB = "mongodb+srv://rajeshkh76:rajesh@cluster0.2e8kjso.mongodb.net/milkhisab?retryWrites=true&w=majority"
// var db = mongo.connect(DB, function (err, response) {
//     if (err) { console.log(err); }
//     else { console.log('Connected to ' + db, ' + ', response); }
// });
mongo.connect(DB)
  .then(() => {
    console.log('Connected to DB:', mongo.connection?.db?.databaseName);
  })
  .catch((err) => {
    console.error('Mongo connect error:', err);
  });

app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200/home, http://127.0.0.1:8084/api/');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests')

        // Pass to next layer of middleware
        next();
    });
    next();
});
var Schema = mongo.Schema;
var userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, required: true }
}, { versionKey: false });
var userModel = mongo.model('milkhisab_users', userSchema, 'milkhisab_users');
app.post("/api/userInsert", function (req, res) {
    var mod = new userModel(req.body);
    if (req.body) {
        mod.save(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send({ data: "Record has been Inserted..!!" });
                createNewCollection(req.body.userName+"db").then(() => {
                    console.log(`Collection '${req.body.userName}db' created successfully.`);
                }).catch((error) => {
                    console.error(`Error creating collection '${req.body.userName}db':`, error);
                });
                createNewCollection(req.body.userName+"_payment_db").then(() => {
                    console.log(`Collection '${req.body.userName}db' created successfully.`);
                }).catch((error) => {
                    console.error(`Error creating collection '${req.body.userName}db':`, error);
                });
            }
        });
    }
});
const createNewCollection = async (collectionName) => {
    try {
        const newCollection = await mongo.connection.db.createCollection(collectionName);
        console.log(`Collection '${collectionName}' created successfully.`);
        return newCollection;
    } catch (error) {
        console.error(`Error creating collection '${collectionName}':`, error);
        throw error;
    }
}
var entrySchema = new Schema({
    Name: { type: String, required: true },
    quantity: { type: String, required: true },
    fatContent: { type: String, required: true },
    Amount: { type: String, required: true },
    billDate: { type: Date, required: true },
    milkType: { type: String, required: true },
    rate: { type: String, required: true },
    snf: { type: String, required: false },
    paymentStatus: {type: String, required: true}
}, { versionKey: false });
app.post("/api/insertEntry", function (req, res) {
const currEntryModel = mongo.model(req.body.userName + 'db', entrySchema, req.body.userName + 'db');
    var mod = new currEntryModel(req.body);
    if (req.body) {
        mod.save(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    }
});
var paymentSchema = new Schema({
    Name: { type: String, required: true },
    
    amount: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    id: { type: String, required: true }
    
}, { versionKey: false });
app.post("/api/paymentEntry", function (req, res) {
const currPaymentModel = mongo.model(req.body.userName + '_payment_db', paymentSchema, req.body.userName + '_payment_db');
    var mod = new currPaymentModel(req.body);
    if (req.body) {
        mod.save(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    }
});
app.get("/api/getEntry/:userName", function (req, res) {
    const currEntryModel = mongo.model(req.params.userName + 'db', entrySchema, req.params.userName + 'db');
    currEntryModel.find({}, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
app.get("/api/getPaymentEntry/:userName", function (req, res) {
    const currPaymentModel = mongo.model(req.params.userName + '_payment_db', paymentSchema, req.params.userName + '_payment_db');
    currPaymentModel.find({}, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
app.patch("/api/updateEntry", function (req, res) {
    const currEntryModel = mongo.model(req.body.userName + 'db', entrySchema, req.body.userName + 'db');
    const id = req.body._id || req.params._id;
    if (!id) {
        return res.status(400).send({ error: "Missing id" });
    }
    // prepare update object (avoid changing _id)
    const update = Object.assign({}, req.body);
    delete update._id;
    delete update.id;

    currEntryModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }, function (err, data) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!data) {
            return res.status(404).send({ error: "Record not found" });
        }
        return res.send({ message: "Record has been Updated..!!", updated: data });
    });
});

// const deleteManyBills = async (invoiceNumber) => {
//     try {
//         const result = await billModel.deleteMany({ "invoiceNumber": '23385' });
//         return result;
//     } catch (error) {
//         throw error;
//     }
// };
// deleteManyBills('23385');
app.delete("/api/entryDelete/:id", function (req, res) {
    const currEntryModel = mongo.model(req.body.userName + 'db', entrySchema, req.body.userName + 'db');
    const id = req.params.id;
    //billModel.deleteMany({"invoiceNumber": "23385"});
    if (!id) {
        return res.status(400).send({ error: "Missing id" });
    }

    currEntryModel.findByIdAndDelete(id, function (err, data) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!data) {
            return res.status(404).send({ error: "Record not found" });
        }
        return res.send({ message: "Record has been Deleted..!!", deleted: data });
    });
});

app.get("/api/getUser", function (req, res) {
    userModel.find({}, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

app.patch("/api/updateBacklog",function(req,res){
    feesModel.findByIdAndUpdate(req.body.id, { 
        _id: req.body.id,
        studentName: req.body.studentName,
        amount: req.body.amount,
        paidTo: req.body.paidTo,
        paidBy: req.body.paidBy,
        paidOn : req.body.paidOn,
        transactionMode: req.body.transactionMode,
        comment:req.body.comment
},
    function(err,data) {
    if (err) {
    res.send(err);
    }else{
    res.send({data:"Record has been Updated..!!"});
    }});
})
var port = process.env.PORT || 8084;
app.listen(port, function () {
    console.log('Example app listening on port 8084!')
})