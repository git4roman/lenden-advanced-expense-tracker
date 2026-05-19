FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore Lenden.Backend/Lenden.Web/Lenden.Web.csproj
RUN dotnet publish Lenden.Backend/Lenden.Web/Lenden.Web.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /out .

ENTRYPOINT ["dotnet", "Lenden.Web.dll"]