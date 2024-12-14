FROM mcr.microsoft.com/playwright:v1.37.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
