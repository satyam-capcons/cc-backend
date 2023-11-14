# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory to the root of the application
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the source code to the working directory
COPY src ./src

# Expose the port that your application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start"]
