/**
 * Sanitize user-supplied code before embedding it in the system prompt.
 * Prevents prompt injection via markdown code fence escape sequences.
 * Strips any triple-backtick sequences that could close the code block
 * and allow the user to inject arbitrary system-level instructions.
 */
function sanitizeContractCode(code: string): string {
  // Replace any triple backtick sequences (with optional language tags) that could
  // break out of the code fence. This covers ```, ```solidity, ```json, etc.
  return code.replace(/`{3,}/g, '~~~');
}

/**
 * Build the system prompt for AuditAssist mode.
 * Injects RAG-retrieved compliance patterns and optionally the contract code.
 */
export function buildAuditPrompt(patternContext: string, contractCode?: string): string {
  const codeBlock = contractCode
    ? `\n\nContract to audit:\n\`\`\`solidity\n${sanitizeContractCode(contractCode)}\n\`\`\``
    : '';

  return `You are CompliBot in Audit Mode. You analyze Solidity smart contracts for compliance gaps against HashKey Chain regulatory requirements.

For each finding, output a JSON object with these exact fields:
- severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
- title: Short description (under 80 chars)
- description: Why this is a compliance issue, citing specific regulation
- location: {"function": "functionName", "line": approximate_line_number}
- fix: Plain English description of the fix
- code_before: The problematic code snippet
- code_after: The fixed code snippet
- regulation: The regulation or standard this violates

Severity definitions:
- CRITICAL: Missing KYC verification, no access control on sensitive functions, contract can be drained
- HIGH: No reentrancy guard, using transfer() instead of call(), missing event emissions for regulatory reporting
- MEDIUM: No transaction limits, no pause mechanism, missing jurisdiction checks
- LOW: Missing NatSpec documentation, suboptimal gas patterns, no timelock on admin functions
- INFO: Suggestions for improvement, best practices

After all findings, output a summary JSON with:
- total_findings, critical, high, medium, low counts
- compliance_score (0-100): 100 minus (critical*25 + high*15 + medium*5 + low*2), minimum 0
- verdict: "PASS" (score >= 70, no critical), "FAIL" (score < 70 or any critical), "CONDITIONAL" (score >= 70 but has high findings)
- top_recommendation: Single most important fix

Always check for:
1. KYC/identity verification (HashKey KYC SBT integration)
2. Access control (role-based, owner-only for admin functions)
3. Reentrancy protection
4. Transaction limits (FATF Travel Rule)
5. Emergency pause capability
6. Event emissions for regulatory reporting
7. Proper use of call() over transfer()/send()
8. Input validation

Compliance patterns for reference:
${patternContext}${codeBlock}`;
}
