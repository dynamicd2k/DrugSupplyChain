'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
*/

async function main(companyCRN, companyName, location, organisationRole) {

	try {
		const pharnetContract = await helper.getContractInstance();
		
		console.log('.....Requesting to register a New Company on the Network');
		const newCompanyBuffer = await pharnetContract.submitTransaction('registerCompany', companyCRN, companyName, location, organisationRole);

		// process response
		console.log('.....Processing Register New Company Transaction Response \n\n');
		let newCompany= JSON.parse(newCompanyBuffer.toString());
		console.log(newCompany);
		console.log('\n\n.....Register New Company Transaction Completed!');
		return newCompany;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
