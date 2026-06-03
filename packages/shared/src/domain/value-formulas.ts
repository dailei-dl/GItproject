type DecimalString = string;

type NetCashflowInput = {
  receivedAmount: DecimalString;
  paidCost: DecimalString;
  outsourceCost: DecimalString;
  taxFee: DecimalString;
  managementFee: DecimalString;
  otherApprovedCost: DecimalString;
};

type ConfirmedValueInput = {
  assignableValue: DecimalString;
  paymentRatio: DecimalString;
  stageCompletionRatio: DecimalString;
};

type PersonalValueInput = {
  departmentValue: DecimalString;
  roleWeight: DecimalString;
  contributionRatio: DecimalString;
  performanceCoefficient: DecimalString;
};

const MONEY_SCALE = 100n;
const RATIO_SCALE = 10000n;

function parseScaledDecimal(value: DecimalString, scale: bigint, label: string): bigint {
  if (!/^\d+(\.\d+)?$/.test(value)) {
    if (value.startsWith("-")) {
      throw new Error(`${label} cannot be negative`);
    }
    throw new Error(`${label} must be a decimal string`);
  }

  const [wholePart = "0", fractionPart = ""] = value.split(".");
  const scaleDigits = scale.toString().length - 1;
  const paddedFraction = fractionPart.padEnd(scaleDigits, "0").slice(0, scaleDigits);
  return BigInt(wholePart) * scale + BigInt(paddedFraction || "0");
}

function formatMoney(cents: bigint): string {
  const sign = cents < 0n ? "-" : "";
  const absolute = cents < 0n ? -cents : cents;
  const whole = absolute / MONEY_SCALE;
  const fraction = (absolute % MONEY_SCALE).toString().padStart(2, "0");
  return `${sign}${whole}.${fraction}`;
}

function money(value: DecimalString): bigint {
  return parseScaledDecimal(value, MONEY_SCALE, "Money value");
}

function ratio(value: DecimalString): bigint {
  return parseScaledDecimal(value, RATIO_SCALE, "Ratio value");
}

function multiplyMoneyByRatio(amount: bigint, multiplier: bigint): bigint {
  return (amount * multiplier) / RATIO_SCALE;
}

export function calculateNetCashflow(input: NetCashflowInput): string {
  const result =
    money(input.receivedAmount) -
    money(input.paidCost) -
    money(input.outsourceCost) -
    money(input.taxFee) -
    money(input.managementFee) -
    money(input.otherApprovedCost);

  return formatMoney(result);
}

export function calculateAssignableValue(
  netCashflow: DecimalString,
  allocationCoefficient: DecimalString
): string {
  return formatMoney(multiplyMoneyByRatio(money(netCashflow), ratio(allocationCoefficient)));
}

export function calculateConfirmedValue(input: ConfirmedValueInput): string {
  const paymentRatio = ratio(input.paymentRatio);
  const stageCompletionRatio = ratio(input.stageCompletionRatio);
  const confirmationRatio = paymentRatio < stageCompletionRatio ? paymentRatio : stageCompletionRatio;

  return formatMoney(multiplyMoneyByRatio(money(input.assignableValue), confirmationRatio));
}

export function calculatePersonalValue(input: PersonalValueInput): string {
  const afterRole = multiplyMoneyByRatio(money(input.departmentValue), ratio(input.roleWeight));
  const afterContribution = multiplyMoneyByRatio(afterRole, ratio(input.contributionRatio));
  return formatMoney(multiplyMoneyByRatio(afterContribution, ratio(input.performanceCoefficient)));
}
