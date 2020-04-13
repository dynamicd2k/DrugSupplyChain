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

		
		console.log('.....Requesting to View History of Drug on the Network');
		const newHistoryBuffer = await pharnetContract.submitTransaction('viewHistory', drugName, serialNo);

		// process response
		console.log('.....Processing View History of Drug Transaction Response \n\n');
		let newHistory= JSON.parse(newHistoryBuffer.toString());
		console.log(newHistory);
		console.log('\n\n.....View History of Drug Transaction Completed!');
		return newHistory;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
