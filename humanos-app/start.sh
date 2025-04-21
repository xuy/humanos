#!/bin/bash

# Get Windows IP using powershell
WINDOWS_IP=$(powershell.exe -Command "Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi' | Select-Object -ExpandProperty IPAddress" | tr -d '\r')

# If Wi-Fi doesn't work, try Ethernet
if [ -z "$WINDOWS_IP" ]; then
    WINDOWS_IP=$(powershell.exe -Command "Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Ethernet' | Select-Object -ExpandProperty IPAddress" | tr -d '\r')
fi

# Remove any local or virtual IPs
WINDOWS_IP=$(echo "$WINDOWS_IP" | grep -v "^169\." | grep -v "^127\." | grep -v "^172\." | grep -v "^10\." | head -n 1)

if [ -z "$WINDOWS_IP" ]; then
    echo "Could not determine Windows IP address. Falling back to localhost..."
    WINDOWS_IP="localhost"
fi

echo "Using Windows IP: $WINDOWS_IP"

# Export the environment variables
export EXPO_HOST=$WINDOWS_IP
export REACT_NATIVE_PACKAGER_HOSTNAME=$WINDOWS_IP

# Start Expo with any additional arguments passed to this script
npx expo start "$@"