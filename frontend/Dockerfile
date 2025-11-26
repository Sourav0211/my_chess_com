FROM node:18

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the app
COPY . .

EXPOSE 3001

# Start dev server
CMD ["pnpm", "start"]
