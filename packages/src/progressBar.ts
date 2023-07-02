export const progressBar = (
  currentCount: number,
  completeCount: number,
) => {
  currentCount += 1; // Start at 1. 1 = 10%.
  const dots = ".".repeat(currentCount);
  const left = completeCount - currentCount;
  const empty = " ".repeat(left);

  process.stdout.write(`\r[${dots}${empty}] ${Math.round(currentCount / completeCount * 100)}%`);
};