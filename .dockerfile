# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the source code to the working directory
COPY src ./src

# Copy the index.js file to the working directory
COPY index.js ./

# Expose the port that your application will run on
EXPOSE 5000

# Define the command to run your application
CMD ["npm", "run", "start"]
