# Stage 1 — Build React app
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package files first
COPY package.json package-lock.json ./

# Install deps (React-friendly)
RUN npm install --legacy-peer-deps

# Copy the remaining source code
COPY . .

# Build the React production bundle
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# If you're using Vite: replace /app/build with /app/dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
