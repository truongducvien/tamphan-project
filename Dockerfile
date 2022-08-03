FROM node:fermium-alpine AS builder

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy app files
COPY . .

ARG REACT_APP_API_BASE_URL=/

# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:stable-alpine as production

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
