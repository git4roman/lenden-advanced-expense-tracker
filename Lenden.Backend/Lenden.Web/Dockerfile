FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . .

WORKDIR /app

RUN dotnet restore Lenden.Web/Lenden.Web.csproj
RUN dotnet publish Lenden.Web/Lenden.Web.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /out .

ENTRYPOINT ["dotnet", "Lenden.Web.dll"]