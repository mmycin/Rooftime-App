# Use the official Bun image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the project
RUN bun run build

# Expose the port your app runs on (change if necessary)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "preview"]
