'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(buyerCRN, sellerCRN, drugName,serialNo, quantity) {

	try {
		const pharnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Create New PO on the Network');
		const newPOBuffer = await pharnetContract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName,serialNo, quantity);

		// process response
		console.log('.....Processing Create New PO Transaction Response \n\n');
		let newPO= JSON.parse(newPOBuffer.toString());
		console.log(newPO);
		console.log('\n\n.....Create New PO Transaction Completed!');
		return newPO;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
