const express = require('express');
const app = express();
// const cors = require('cors');
const port = 3000;

// Import all function modules

const addToWallet = require('./1_addToWallet.js');
const registerCompany = require('./2_registerCompany.js');
const addDrug = require('./3_addDrug.js');
const createPO = require('./4_createPO.js');
const createShipment = require('./5_createShipment.js');
const updateShipment = require('./6_updateShipment.js');
const retailDrug = require('./7_retailDrug.js');
const viewHistory = require('./8_viewHistory.js');
const viewDrugCurrentState = require('./9_viewDrugCurrentState.js');

// Define Express app settings
// app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma Network App');

app.get('/', (req, res) => res.send('Hello Manufacturer'));

app.post('/addToWallet', (req, res) => {
    addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath, req.body.iL, req.body.id, req.body.org).then (() => {
        console.log('User Credentials added to wallet');
        const result = {
            status: 'success',
            message: 'User credentials added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/registerCompany', (req, res) => {
    registerCompany.execute(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole).then (() => {
        console.log('Register New Company on the Network');
        const result = {
            status: 'success',
            message: 'Register New Company request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/addDrug', (req, res) => {
    addDrug.execute(req.body.drugName, req.body.serialNo, req.body.mfgDate, req.body.expDate, req.body.companyCRN, req.body.companyName).then (() => {
        console.log('Add Drug on the Network');
        const result = {
            status: 'success',
            message: 'Add Drug request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createPO', (req, res) => {
    createPO.execute(req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.serialNo, req.body.quantity).then (() => {
        console.log('Create PO on the Network');
        const result = {
            status: 'success',
            message: 'Create PO request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createShipment', (req, res) => {
    createShipment.execute(req.body.buyerCRN, req.body.drugName, req.body.listOfAssets, req.body.transporterCRN).then (() => {
        console.log('Create Shipment on the Network');
        const result = {
            status: 'success',
            message: 'Create Shipment request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/updateShipment', (req, res) => {
    updateShipment.execute(req.body.buyerCRN, req.body.buyerName, req.body.drugName, req.body.transporterCRN, req.body.transporterName).then (() => {
        console.log('Update Shipment on the Network');
        const result = {
            status: 'success',
            message: 'Update Shipment request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/retailDrug', (req, res) => {
    retailDrug.execute(req.body.drugName, req.body.serialNo, req.body.retailerCRN, req.body.customerAadhar).then (() => {
        console.log('Retail Drug on the Network');
        const result = {
            status: 'success',
            message: 'Retail Drug request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.get('/viewHistory', (req, res) => {
    viewHistory.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('View History on the Network');
        const result = {
            status: 'success',
            message: 'View History request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.get('/viewDrugCurrentState', (req, res) => {
    viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('View Current State of Drug on the Network');
        const result = {
            status: 'success',
            message: 'View Current State of Drug request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});


app.listen(port, () => console.log(`Distributed Manufacturer App listening on port ${port}!`));



// const express = require('express');
// const app = express();
// const port = 7053;
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.set('title', 'App');
// app.get('/', (req,res) => res.send('Hello world'));
// app.post('/sum', (req,res) => {
// // Printing the request submitted by the user on the console
// console.log(req.body);
// // Taking two numbers as input from user, storing them in keys x1 and x2 and calculating the sum
// var sum = Number(req.body.x1) + Number(req.body.x2);
// // Sending back the response
// res.send(sum.toString());
// });
// app.listen(port, () => console.log(`Listening on port ${port}!`));
