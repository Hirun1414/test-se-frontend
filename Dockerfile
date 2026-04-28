FROM node:20-bullseye

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build-time arguments so Next.js can inline env vars during `npm run build`
ARG BACKEND_URL=http://localhost:5000
ARG FRONTEND_URL=http://localhost:3000
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=placeholder

ENV BACKEND_URL=$BACKEND_URL
ENV FRONTEND_URL=$FRONTEND_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Build the Next.js application (now env vars are available)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
