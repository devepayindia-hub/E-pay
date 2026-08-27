#!/usr/bin/env pwsh

# ePay CRM Docker Deploy Script for Windows
# Usage: .\deploy-docker.ps1 [environment]
# environments: development, staging, production

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "development"
)

Write-Host "============================================" -ForegroundColor Green
Write-Host "ePay CRM Docker Deploy - $Environment" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerExists) {
    Write-Host "[ERROR] Docker is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "[INFO] Checking Docker status..." -ForegroundColor Cyan
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker daemon is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker is installed and running" -ForegroundColor Green
Write-Host ""

# Build the Docker image
Write-Host "[INFO] Building Docker image..." -ForegroundColor Cyan
docker build `
    --build-arg NODE_ENV="$Environment" `
    -t "epay-crm:$Environment" `
    -t "epay-crm:latest" `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Docker build completed successfully" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "[WARN] .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create a .env file with your Firebase configuration." -ForegroundColor Yellow
    Write-Host "Use .env.example as a template." -ForegroundColor Yellow
    $createEnv = Read-Host "Would you like to create a template .env file? (y/n)"
    if ($createEnv -eq "y" -or $createEnv -eq "Y") {
        Copy-Item ".env.example" ".env"
        Write-Host "[OK] Created .env file. Please fill in your Firebase credentials." -ForegroundColor Green
        exit 0
    }
    exit 0
}

# Load environment variables from .env
Write-Host "[INFO] Loading .env configuration..." -ForegroundColor Cyan
$envContent = Get-Content ".env" | Where-Object { $_ -notmatch '^\s*#' -and $_ -match '^[A-Z]' }

$envArgs = ""
foreach ($line in $envContent) {
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        $envArgs += "-e $name=`"$value`" "
    }
}

# Run the container
Write-Host "[INFO] Starting container..." -ForegroundColor Cyan

# Remove existing container if it exists
docker rm -f epay-crm 2>$null

# Run the container
docker run -d `
    -p 8080:8080 `
    --name epay-crm `
    $envArgs `
    epay-crm:$Environment

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Container started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application is running at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:   docker logs -f epay-crm" -ForegroundColor White
Write-Host "  Stop:        docker stop epay-crm" -ForegroundColor White
Write-Host "  Restart:     docker restart epay-crm" -ForegroundColor White
Write-Host "  Remove:      docker rm epay-crm" -ForegroundColor White
Write-Host ""
Write-Host "Stop with Ctrl+C" -ForegroundColor Gray
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")