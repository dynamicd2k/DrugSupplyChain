'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(drugName, serialNo, retailerCRN, customerAadhar) {

	try {
		const pharnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Retail a Drug on the Network');
		const newRetailDrugBuffer = await pharnetContract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);

		// process response
		console.log('.....Processing Retail Drug Transaction Response \n\n');
		let newRetailDrug= JSON.parse(newRetailDrugBuffer.toString());
		console.log(newRetailDrug);
		console.log('\n\n.....Update Retail Drug Transaction Completed!');
		return newRetailDrug;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
