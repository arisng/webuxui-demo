# Use .NET 10 SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/blazor-pwa-recording.csproj", "src/"]
RUN dotnet restore "src/blazor-pwa-recording.csproj"

# Copy the rest of the source code
COPY . .

# Publish the app
RUN dotnet publish "src/blazor-pwa-recording.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use Nginx to serve the static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Install openssl for generating self-signed certificates
RUN apk add --no-cache openssl && \
    mkdir -p /etc/ssl/certs /etc/ssl/private && \
    openssl req -x509 -newkey rsa:2048 -keyout /etc/ssl/private/key.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/CN=localhost"

# Copy published files from build stage
COPY --from=build /app/publish/wwwroot .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
