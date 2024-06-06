const formatTimeDifference = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60) % 60;
  const hours = Math.floor(milliseconds / (60 * 60)) % 24;
  const days = Math.floor(milliseconds / (60 * 60 * 24));
  if (days > 0) return `${days} days, ${hours} hours`;
  if (days == 0 && hours > 0) {
    return `${hours} hours, ${minutes} minutes`;
  }
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return milliseconds + " seconds";
};

export const mapper = {
  instructionToText: (instructions) => {
    return instructions.map(
      (instruction) =>
        `${formatTimeDifference(instruction?.duration)}: ${
          instruction.instruction
        }`
    );
  },
};
