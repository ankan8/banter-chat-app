# Use the official Node.js image for your backend
FROM node:20

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend is running on (adjust if needed)
EXPOSE 3001

# Define the command to start your app
CMD ["npm", "start"]
