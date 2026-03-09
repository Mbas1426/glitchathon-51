const patients = require("./patients.json");
const physicians = require("./physicians.json");
const testHistory = require("./test_history.json");
const outreachMsgs = require("./outreach_msgs.json");
const outreachResponses = require("./outreach_responses.json");
const careProtocols = require("./care_protocols.json");
const appointments = require("./appointments.json");

module.exports = {
	PATIENTS: patients,
	PHYSICIANS: physicians,
	TEST_HISTORY: testHistory,
	OUTREACH_MSGS: outreachMsgs,
	OUTREACH_RESPONSES: outreachResponses,
	CARE_PROTOCOLS: careProtocols,
	APPOINTMENTS: appointments
};