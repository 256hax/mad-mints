export const progressBar = (
  currentCount: number,
  completeCount: number,
) => {
  const dots = ".".repeat(currentCount);
  const left = completeCount - currentCount;
  const empty = " ".repeat(left);

  process.stdout.write(`\r[${dots}${empty}] ${Math.round(currentCount / completeCount * 100)}%`);
};