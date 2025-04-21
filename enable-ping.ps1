Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing" -Direction Inbound; Get-NetFirewallRule -DisplayGroup "File and Printer Sharing" | Format-Table DisplayName,Enabled
