'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(drugName, serialNo) {

	try {
		const pharnetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to View current state of a Drug on the Network');
		const newStateBuffer = await pharnetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);

		// process response
		console.log('.....Processing View current state of a Drug Transaction Response \n\n');
		let newState= JSON.parse(newStateBuffer.toString());
		console.log(newState);
		console.log('\n\n.....View current state of a Drug Transaction Completed!');
		return newState;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
