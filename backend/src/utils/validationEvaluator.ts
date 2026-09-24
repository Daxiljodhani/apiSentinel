import { ValidationRule } from '../types';

export function evaluateValidationRules(
  rules: ValidationRule[] | null,
  statusCode: number | undefined,
  responseTimeMs: number,
  responseBodySnippet: string | undefined
): { isValid: boolean; failureReason?: string } {
  if (!rules || rules.length === 0) {
    return { isValid: true };
  }

  let bodyJson: any = null;
  if (responseBodySnippet) {
    try {
      bodyJson = JSON.parse(responseBodySnippet);
    } catch {
      // Body is not JSON
    }
  }

  for (const rule of rules) {
    let actualValue: any = undefined;

    if (rule.field === 'status') {
      actualValue = statusCode;
    } else if (rule.field === 'responseTime') {
      actualValue = responseTimeMs;
    } else if (rule.field.startsWith('body.') && bodyJson) {
      const key = rule.field.replace('body.', '');
      actualValue = bodyJson[key];
    }

    switch (rule.operator) {
      case 'equals':
        if (actualValue != rule.value) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} (${actualValue}) != expected (${rule.value})` };
        }
        break;
      case 'not_equals':
        if (actualValue == rule.value) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} should not equal ${rule.value}` };
        }
        break;
      case 'less_than':
        if (Number(actualValue) >= Number(rule.value)) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} (${actualValue}) is not < ${rule.value}` };
        }
        break;
      case 'greater_than':
        if (Number(actualValue) <= Number(rule.value)) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} (${actualValue}) is not > ${rule.value}` };
        }
        break;
      case 'contains':
        if (!String(actualValue).includes(String(rule.value))) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} does not contain "${rule.value}"` };
        }
        break;
      case 'not_null':
        if (actualValue === null || actualValue === undefined) {
          return { isValid: false, failureReason: `Validation Rule Failed: ${rule.field} is null or undefined` };
        }
        break;
    }
  }

  return { isValid: true };
}
