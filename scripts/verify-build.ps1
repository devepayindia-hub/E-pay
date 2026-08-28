#!/usr/bin/env pwsh

# ePay CRM Build Verification Script
# This script verifies the build before deployment

Write-Host "============================================" -ForegroundColor Green
Write-Host "ePay CRM Build Verification" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if Firebase credentials exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your Firebase configuration." -ForegroundColor Yellow
    exit 1
}

# Load .env file
Write-Host "[INFO] Loading .env file..." -ForegroundColor Cyan
$content = Get-Content $envFile | Where-Object { $_ -notmatch '^\s*#' -and $_ -match '^[A-Z]' }

foreach ($line in $content) {
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        # Check for placeholder values
        if ($value -match 'placeholder|Placeholder|YOUR_|XXXX') {
            Write-Host "[WARN] $name contains placeholder value!" -ForegroundColor Yellow
        } else {
            Write-Host "[OK] $name is configured" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "[INFO] Checking build dependencies..." -ForegroundColor Cyan

# Check Node.js version
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
Write-Host "[OK] npm version: $npmVersion" -ForegroundColor Green

Write-Host ""
Write-Host "[INFO] Running build validation..." -ForegroundColor Cyan

# Check required files exist
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "lib/firebase.js",
    "lib/auth-context.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file exists" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Required file not found: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Build verification completed successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run build:prod" -ForegroundColor White
Write-Host "  2. Deploy: firebase deploy" -ForegroundColor White
Write-Host ""