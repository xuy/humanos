#!/bin/bash
# Get the Windows host IP through WSL
ip route list default | awk '{print $3}' | head -n1