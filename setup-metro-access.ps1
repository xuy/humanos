# Requires -RunAsAdministrator

# Configuration
$EXPO_PORTS = @(8081, 19000, 19001, 19002)  # All necessary Expo ports
$FIREWALL_RULE_NAME = "Expo Development Server"

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to get WSL IP address
function Get-WslIpAddress {
    $wslOutput = wsl -- ip -4 addr show eth0 | Select-String -Pattern "inet\s+(\d+\.\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    if (-not $wslOutput) {
        Write-Host "Failed to get WSL IP address. Please make sure WSL is running." -ForegroundColor Red
        exit 1
    }
    return $wslOutput
}

# Check if running as administrator
if (-not (Test-Administrator)) {
    Write-Host "This script must be run as Administrator. Please right-click and select 'Run as Administrator'." -ForegroundColor Red
    exit 1
}

# Get WSL IP address
$WSL_IP = Get-WslIpAddress
Write-Host "Detected WSL IP address: $WSL_IP" -ForegroundColor Green

# Remove existing port forwarding rules and firewall rules
foreach ($port in $EXPO_PORTS) {
    # Remove existing port forwarding rule if it exists
    netsh interface portproxy delete v4tov4 listenport=$port | Out-Null
    
    # Add new port forwarding rule
    netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$WSL_IP
    
    # Remove existing firewall rule if it exists
    Remove-NetFirewallRule -DisplayName "$FIREWALL_RULE_NAME (Port $port)" -ErrorAction SilentlyContinue
    
    # Add new firewall rule
    New-NetFirewallRule -DisplayName "$FIREWALL_RULE_NAME (Port $port)" -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port
}

# Get the Windows host IP address
$hostIP = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.PrefixOrigin -eq 'Dhcp' }).IPAddress

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
Write-Host "`nTo access your Expo server from your Android device:"
Write-Host "1. Make sure your Android device is connected to the same network as your Windows PC"
Write-Host "2. On your Android device, open the Expo Go app"
Write-Host "3. Scan the QR code or enter the following URL:"
Write-Host "   exp://$($hostIP):8081" -ForegroundColor Cyan
Write-Host "`nNote: If you can't connect, check that:"
Write-Host "- Your WSL IP address is correct (current: $WSL_IP)"
Write-Host "- Your Expo server is running in WSL"
Write-Host "- Your Android device is on the same network"
Write-Host "- Windows Defender Firewall is not blocking the connection"
Write-Host "`nPorts forwarded:"
foreach ($port in $EXPO_PORTS) {
    Write-Host "- Port $port" -ForegroundColor Yellow
} 