# 1. Use Node.js official image
FROM node:18

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the app
COPY . .

# 6. Expose app port
EXPOSE 3000

# 7. Start the app
CMD ["node", "index.js"]
