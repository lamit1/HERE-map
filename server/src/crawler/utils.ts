export const generator = {
    getRandomId: function generateNumericalId() {
        // Get the current timestamp in milliseconds
        const timestamp = new Date().getTime();
        // Generate a random component (4 digits)
        const randomComponent = Math.floor(Math.random() * 10000);
        // Combine timestamp and random component to form the ID
        const numericalId = parseInt(timestamp.toString() + randomComponent.toString());
        return numericalId;
    }
} 