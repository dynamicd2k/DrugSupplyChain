'use strict';

const {Contract} = require('fabric-contract-api');

class PharmaContract extends Contract {

    constructor() {
        //Provide a custom name ot refer to thsi contract
        super('org.pharma-network.com-pharnet');
        global.manufacturerOrg= 'manufacturer.pharma-network.com';
        global.distributorOrg= 'distributor.pharma-network.com';
        global.retailerOrg= 'retailer.pharma-network.com';
        global.consumerOrg= 'consumer.pharma-network.com';
        global.transporterOrg= 'transporter.pharma-network.com';
    }

    validateInitiator(ctx, initiator){

        const initiatorID = ctx.clientIdentity.getX509Certificate();
        console.log(initiator);
        if(initiatorID.issuer.organizationName.trim() !== initiator){
            throw new Error('Not authorized to initiate the transaction: ' + initiatorID.issuer.organizationName + ' not authorised to initiate this transaction');
        }
    }
    /* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
    async instantiate(ctx) {
		console.log('Pharmanet Smart Contract Instantiated');
    }
    
    /**
	 * Create a register company function to register a new company on the network
	 * @param ctx - The transaction Context object
	 * @param companyCRN - CRN of the company to be registered
	 * @param companyName - Compnay Name
	 * @param location - Company Location
	 * @param organisationRole - Role of organisation
	 */
    async registerCompany(ctx, companyCRN, companyName, location, organisationRole){

        let h=0;
        if(organisationRole == "manufacturer")
        h=1;
        else if(organisationRole == "distributor")
        h=2;
        else if(organisationRole == "retailer")
        h=3;
        else if(organisationRole == "transporter")
        h=4;
        else
        throw new Error('Peer incorrect');

        const companyKey =  ctx.stub.createCompositeKey('org.pharma-network.com.company',[companyCRN,companyName]);

        let companyObject={
            companyId: companyKey,
            name: companyName,
            location: location,
            organisationRole: organisationRole,
            hierarchyKey: h,
            createdAt: new Date()
        };

        let dataBuffer = Buffer.from(JSON.stringify(companyObject));
        await ctx.stub.putState(companyKey, dataBuffer);

        return companyObject;
    }

    /**
	 * Create a function to add a drug on the network
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial Number of the drug
	 * @param mfgDate - Manufacturing Date of the drug
	 * @param expDate - Expiry Date of the drug
	 * @param companyCRN - Drug Manufacturing Companys CRN
     * @param companyName- Drug manufacturing company name
	 */

    async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN, companyName){

        this.validateInitiator(ctx, manufacturerOrg);

        const drugKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,serialNo]);
        const companyKey = ctx.stub.createCompositeKey('org.pharma-network.com.company',[companyCRN,companyName]);

        let drugObject={
            productId: drugKey,
            name: drugName,
            manufacturer: companyKey,
            manufacturingDate: mfgDate,
            expiryDate: expDate,
            owner:companyKey,
            shipment:'',
            createdAt:new Date()
        };

        let dataBuffer = Buffer.from(JSON.stringify(drugObject));
        await ctx.stub.putState(drugKey, dataBuffer);
        return drugObject;
    }

    /**
	 * Create a function to create a PO
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial Number of the drug
	 * @param buyerCRN - Buyer CRN 
     * @param sellerCRN - Seller CRN
     * @param quantity - Quantity of drugs
	 */
    async createPO(ctx, buyerCRN, sellerCRN, drugName,serialNo, quantity){

        const poKey = ctx.stub.createCompositeKey('org.pharma-network.com.po',[buyerCRN,drugName]);
        const buyerKey = ctx. stub.createCompositeKey('org.pharma-network.com.company',[buyerCRN,drugName]);
        const sellerKey = ctx.stub.createCompositeKey('org.pharma-network.com.company',[sellerCRN,drugName]);
        const drugKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,serialNo]);

        let drugBuffer = await ctx.stub.getState(drugKey).catch(err=>console.log(err));

        let drugObject = JSON.parse(drugBuffer.toString());
        let ownerKey= drugObject.owner;

        let ownerBuffer = await ctx.stub.getState(ownerKey).catch(err=>console.log(err));

        let ownerObject = JSON.parse(ownerBuffer.toString());

        // if(ownerObject.hierarchyKey == 1){
        //     this.validateInitiator(ctx,distributorOrg);
        // }
        // else if(ownerObject.hierarchyKey ==2){
        //     this.validateInitiator(ctx, retailerOrg);
        // }
        // else 
        // throw new Error('Initiator not authorized for creating order of this drug.');

        let poObject ={
            poId: poKey,
            drugName: drugName,
            quantity: quantity,
            buyer: buyerKey,
            seller: sellerKey,
            createdAt: new Date()
        }

        let dataBuffer = Buffer.from(JSON.stringify(poObject));

        await ctx.stub.putState(poKey, dataBuffer);

        return poObject;

    }

    // async createShipment(ctx, buyerCRN, drugName, serialNo, transporterCRN){

    //     const poId= ctx.stub.createCompositeKey('org.pharma-network.com.po'[buyerCRN,drugName]))
    // }
     /**
	 * Create a function to create a shipment
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param listOfAssets - Serial nos of drugs to be shipped
	 * @param buyerCRN - Buyer CRN 
     * @param transporterCRN - Transporter CRN
	 */
    async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN){
        const poId = ctx.stub.createCompositeKey('org.pharma-network.com.po',[buyerCRN,drugName]);

        let poBuffer= await ctx.stub.getState(poId).catch(err=>console.log(err));

        let poObject = JSON.parse(poBuffer.toString());

        let listOfAsset = listOfAssets.split(',');

        if(listOfAsset.length != poObject.quantity){

            console.log('Quantity does not match');
        }
        
            const startKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,listOfAsset[0]]);

            const endKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,((Number(listOfAsset[listOfAsset.length-1])-1).toString())]);

            let resIterator1 = await ctx.stub.getStateByRange(startKey,endKey).catch(err=>console.log(err));

            var results = await this.getAllResults(resIterator1);

            if(results.length==0){
                console.log('Invaild ID');
            }

        

                const shipmentKey = ctx.stub.createCompositeKey('org.pharma-network.com.shipment',[buyerCRN,drugName]);

                let resIterator = await ctx.stub.getStateByPartialCompositeKey('org.pharma-network.com.company',[transporterCRN]).catch(err=>console.log(err));
                let results1 = await this.getAllResults(resIterator);
                let transporter = JSON.parse(results1[0]);


                var assets = [];
                var assetIDs = [];
                results.forEach(drug=>{
                    assets.push(JSON.parse(drug));
                    assetIDs.push(JSON.parse(drug).productId);
                });

                let shipmentObject={
                    shipmentId:shipmentKey,
                    creator:poObject.seller,
                    assets:assetIDs,
                    transporter: transporter.companyId,
                    status: 'in-transit'
                };

                let dataBuffer= Buffer.from(JSON.stringify(shipmentObject));

                await ctx.stub.putState(shipmentKey,dataBuffer);

                for(let i=0;i<assets.length;i++){
                    assets[i].owner = transporter.companyId;
                    let dataBuffer = Buffer.from(JSON.stringify(assets[i]));
                    await ctx.stub.putState(assets[i].productId, dataBuffer);
                }
            
        
        return shipmentObject;
    }
     /**
	 * Create a function to update a shipment
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param buyerName - Name of buyer
	 * @param buyerCRN - Buyer CRN 
     * @param transporterCRN - Transporter CRN
     * @param transporterName- Transporter Name
	 */
    async updateShipment(ctx, buyerCRN, buyerName, drugName, transporterCRN, transporterName){

        let shipmentKey = ctx.stub.createCompositeKey('org.pharma-network.com.shipment',[buyerCRN,drugName]);
        let transporterKey = ctx.stub.createCompositeKey('org.pharma-network.com.company',[transporterCRN,transporterName]);
        let buyerKey = ctx.stub.createCompositeKey('org.pharma-network.com.company',[buyerCRN,buyerName]);

        let shipmentbuffer = await ctx.stub.getState(shipmentKey).catch(err=>console.log(err));

        let shipmentObject = JSON.parse(shipmentbuffer.toString());

        if(shipmentObject.transporter !== transporterKey || shipmentObject.shipmentId !== shipmentKey){
            throw new Error ('Transporter key does not match or Shipment id is incorrect');
        }
        
        shipmentObject.status = 'delivered';

        let startKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,shipmentObject.assets[0]]);

        let endKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,(Number(shipmentObject.assets[shipmentObject.assets.length-1]).toString())]);

        let resIterator1 = await ctx.stub.getStateByRange(startKey,endKey).catch(err=>console.log(err));

        var results = await this.getAllResults(resIterator1);

        var assets = [];
        results.forEach(drug=>{
        assets.push(JSON.parse(drug));
        });

        for(let i=0;i<assets.length;i++){
            assets[i].owner = buyerKey;
            assets[i].shipment = assets[i].shipment + '-'+ shipmentKey;
            let dataBuffer = Buffer.from(JSON.stringify(assets[i]));
            await ctx.stub.putState(assets[i].productId, dataBuffer);
        }
        return shipmentObject;
    }
      /**
	 * Create a function to retail drug
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial No of drug
	 * @param retailerCRN - CRN of retailer
     * @param customerAdhaar - Adhaar number of customer drug is to be sold to.
	 */
    async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAdhaar){

        let resIterator = await ctx.stub.getStateByPartialCompositeKey('org.pharma-network.com.company',[retailerCRN]).catch(err=>console.log(err));
        let results = await this.getAllResults(resIterator);
        let retailerObject= JSON.parse(results[0]);

        let drugKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,serialNo]);

        let drugBuffer = await ctx.stub.getState(drugKey).catch(err=>console.log(err));

        if(drugBuffer.length === 0){
            throw new Error('Drug not registered on network');
        }

        let drugObject = JSON.parse(drugBuffer.toString());

        if(drugObject.owner !== retailerObject.companyId){
            throw new Error('Retailer not authorized to retail the drug');
        }
        else
        drugObject.owner = customerAdhaar;

        await ctx.stub.putState(drugKey, Buffer.from(JSON.stringify(drugObject)));

        return drugObject;

    }
     /**
	 * Create a function to view History of drug
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial No of drug
	 */

    async viewHistory(ctx, drugName, serialNo){

		const drugKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,serialNo]);
		let history = await ctx.stub.getHistoryForKey(drugKey).catch(err=>console.log(err));

		let results = await this.getAllResults(history);

		return results;
	}

     /**
	 * Create a function to view current state of drug
	 * @param ctx - The transaction Context object
	 * @param drugName - Name of the drug
	 * @param serialNo - Serial No of drug
	 */
	async viewDrugCurrentState(ctx, drugName, serialNo){

		const drugKey = ctx.stub.createCompositeKey('org.pharma-network.com.drug',[drugName,serialNo]);

		let drugBuffer = await ctx.stub.getState(drugKey).catch(err=>console.log(err));

		let drugObject = JSON.parse(drugBuffer.toString());

		return drugObject;
	}

    async getAllResults(iterator) {
		const allResults = [];
		while (true) {
		  const res = await iterator.next();
   
		  if (res.value) {
			// if not a getHistoryForKey iterator then key is contained in res.value.key
			allResults.push(res.value.value.toString('utf8'));
		  }
   
		  // check to see if we have reached then end
		  if (res.done) {
			// explicitly close the iterator
			await iterator.close();
			return allResults;
		  }
		}
	   }
}
module.exports = PharmaContract;