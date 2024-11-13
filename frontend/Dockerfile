# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose port 5173 for the dev server
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev"]