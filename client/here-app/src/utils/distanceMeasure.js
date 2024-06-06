export const measure = {
  meterToMiles: (meters = 0) => {
    return (meters / 1609.344).toFixed(1);
  },
  meterToFeets: (meters = 0) => {
    console.log(meters);
    return Math.floor(meters / 0.3048);
  },
  formatTimeDifference: (milliseconds = 0) => {
    const minutes = Math.floor(milliseconds / 60) % 60;
    const hours = Math.floor(milliseconds / (60 * 60)) % 24;
    const days = Math.floor(milliseconds / (60 * 60 * 24));
    if (days > 0) return `${days} days, ${hours} hours`;
    if (days == 0 && hours > 0) {
      return `${hours} hrs, ${minutes} mins`;
    }
    if (minutes > 0) {
      return `${minutes} minutes`;
    }
    return milliseconds + " seconds";
  },
  formatStringContainMeasurement: (text = "") => {
    const measurements = ["m.", "km."];
    const words = text.split(" ");
    let measureWordIndex = 0;
    let valueWordIndex = 0;
    for (let i = 1; i < words.length; i++) {
      if (measurements.includes(words[i])) {
        measureWordIndex = i;
        valueWordIndex = i - 1;
      }
    }
    console.log(
      "miles: " + measure.meterToMiles(parseFloat(words[valueWordIndex]))
    );

    if (measure.meterToMiles(parseFloat(words[valueWordIndex])) > 0.25) {
      words[valueWordIndex] = measure.meterToMiles(
        parseFloat(words[valueWordIndex])
      );
      words[measureWordIndex] = "miles";
    } else {
      words[measureWordIndex] = "feets";
      words[valueWordIndex] = measure.meterToFeets(
        parseFloat(words[valueWordIndex])
      );
    }

    return words.join(" ");
  },
};
