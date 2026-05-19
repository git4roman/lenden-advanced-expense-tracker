FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything from repo root
COPY . .

# Restore using the web project (it pulls in all referenced projects)
RUN dotnet restore Lenden.Backend/Lenden.Web/Lenden.Web.csproj

# Publish
RUN dotnet publish Lenden.Backend/Lenden.Web/Lenden.Web.csproj \
    -c Release \
    --no-restore \
    -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "Lenden.Web.dll"]