'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(drugName, serialNo, mfgDate, expDate, companyCRN, companyName) {

	try {
		const pharnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to Add New Drug on the Network');
		const newDrugBuffer = await pharnetContract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN, companyName);

		// process response
		console.log('.....Processing Add New Drug Transaction Response \n\n');
		let newDrug= JSON.parse(newDrugBuffer.toString());
		console.log(newDrug);
		console.log('\n\n.....Add New Drug Transaction Completed!');
		return newDrug;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
