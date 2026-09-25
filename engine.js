 const fs = require("node:fs");
const path = require("node:path"); 
 const jsonLogic = require("json-logic-js");
  const rules = require("./rules.json");
  const packageData = require("./package-data.json");
  let passCount = 0;
  let failCount = 0;
  let manualCount = 0;

  const results = [];
  for (const rule of rules) {
    if (
    rule.id === "Demo-005" &&
    typeof packageData.declarations?.taxInclusive !== "boolean"
  ) {
    console.log(`MANUAL VERIFICATION REQUIRED: ${rule.name}`);
    console.log("Confirm whether tax-inclusive wording is present.");
    manualCount++;  
    results.push({
    ruleId: rule.id,
    name: rule.name,
    status: "MANUAL_VERIFICATION_REQUIRED",
    message: "Confirm whether tax-inclusive wording is present."
   });
    continue;
  }
    const passed = jsonLogic.apply(rule.logic, packageData);

    if (passed) {
      console.log(`PASS: ${rule.name}`);
      passCount++;
      results.push({
      ruleId: rule.id,
      name: rule.name,
      status: "PASS",
      message: "The supplied data passed this check."
});
    } else {
      console.log(`FAIL: ${rule.name}`);
      console.log(rule.failureMessage);
      failCount++;
      results.push({
      ruleId: rule.id,
     name: rule.name,
     status: "FAIL",
     message: rule.failureMessage
});
    }
  }
  console.log("\n--- CHECK SUMMARY ---");
  console.log(`Total rules: ${rules.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Manual verification: ${manualCount}`);

  const report = {
  checkedAt: new Date().toISOString(),
  totalRules: rules.length,
  passed: passCount,
  failed: failCount,
  manualVerification: manualCount,
  results: results
};

const reportPath = path.join(__dirname, "report.json");

fs.writeFileSync(
  reportPath,
  JSON.stringify(report, null, 2)
);

console.log("Summary saved in report.json");