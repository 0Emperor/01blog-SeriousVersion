#!/bin/bash
set -e

# Configuration
INSTALL_DIR="$HOME/.local_dev_tools"
BIN_DIR="$INSTALL_DIR/bin"
mkdir -p "$BIN_DIR"
mkdir -p "$INSTALL_DIR/tmp"

# Detect Shell
SHELL_RC="$HOME/.zshrc"
if [ "$SHELL" = "/bin/bash" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

echo "=========================================="
echo "Project Dependency Installer (No Sudo)"
echo "Target Directory: $INSTALL_DIR"
echo "=========================================="

# Update PATH for this script execution
export PATH="$BIN_DIR:$PATH"

# Function to update RC file
update_rc() {
    if ! grep -q "$1" "$SHELL_RC"; then
        echo "Updating $SHELL_RC with $1..."
        echo "$2" >> "$SHELL_RC"
    fi
}

# --------------------------------------------------------
# 1. Java 17 Installation
# --------------------------------------------------------
echo "Checking Java..."
if ! java -version 2>&1 | grep -q "17" && ! [ -f "$BIN_DIR/java" ]; then
    echo "Installing Java 17 (OpenJDK)..."
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        JAVA_URL="https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse?project=jdk"
    elif [ "$ARCH" = "aarch64" ]; then
        JAVA_URL="https://api.adoptium.net/v3/binary/latest/17/ga/linux/aarch64/jdk/hotspot/normal/eclipse?project=jdk"
    else
        echo "Error: Unsupported architecture $ARCH for auto-install."
        exit 1
    fi

    curl -L -o "$INSTALL_DIR/tmp/java.tar.gz" "$JAVA_URL"
    mkdir -p "$INSTALL_DIR/java"
    tar -xzf "$INSTALL_DIR/tmp/java.tar.gz" -C "$INSTALL_DIR/java" --strip-components=1
    
    # Symlinks
    ln -sf "$INSTALL_DIR/java/bin/java" "$BIN_DIR/java"
    ln -sf "$INSTALL_DIR/java/bin/javac" "$BIN_DIR/javac"
    
    # Environment Setup
    export JAVA_HOME="$INSTALL_DIR/java"
    update_rc "JAVA_HOME" "export JAVA_HOME=\"$INSTALL_DIR/java\""
    
    echo "Java 17 installed."
else
    echo "Java 17 is already installed or configured."
fi

# --------------------------------------------------------
# 2. Node.js & NPM Installation
# --------------------------------------------------------
echo "Checking Node.js..."
NODE_VERSION="v20.10.0"
if ! node -v 2>/dev/null | grep -q "v20" && ! [ -f "$BIN_DIR/node" ]; then
    echo "Installing Node.js $NODE_VERSION..."
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        NODE_ARCH="linux-x64"
    elif [ "$ARCH" = "aarch64" ]; then
        NODE_ARCH="linux-arm64"
    else
        echo "Error: Unsupported architecture $ARCH for auto-install."
        exit 1
    fi
    
    NODE_URL="https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$NODE_ARCH.tar.xz"
    curl -L -o "$INSTALL_DIR/tmp/node.tar.xz" "$NODE_URL"
    mkdir -p "$INSTALL_DIR/node"
    tar -xf "$INSTALL_DIR/tmp/node.tar.xz" -C "$INSTALL_DIR/node" --strip-components=1
    
    # Symlinks
    ln -sf "$INSTALL_DIR/node/bin/node" "$BIN_DIR/node"
    ln -sf "$INSTALL_DIR/node/bin/npm" "$BIN_DIR/npm"
    ln -sf "$INSTALL_DIR/node/bin/npx" "$BIN_DIR/npx"
    
    echo "Node.js installed."
else
    echo "Node.js is already installed or configured."
fi

# --------------------------------------------------------
# 3. Angular CLI
# --------------------------------------------------------
echo "Checking Angular CLI..."
if ! command -v ng &> /dev/null; then
    echo "Installing Angular CLI..."
    # Use the just-installed npm
    "$BIN_DIR/npm" install -g @angular/cli
    ln -sf "$INSTALL_DIR/node/bin/ng" "$BIN_DIR/ng"
    echo "Angular CLI installed."
else
    echo "Angular CLI is already installed."
fi

# --------------------------------------------------------
# 4. Docker (Rootless)
# --------------------------------------------------------
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "Attempting to install Docker (Rootless)..."
    
    if ! command -v newuidmap &> /dev/null; then
        echo "WARNING: 'newuidmap' not found. Rootless Docker requires system dependencies (uidmap)."
        echo "Skipping Docker installation to prevent failure. lease ask an admin to install 'uidmap' or docker."
    else
        curl -fsSL https://get.docker.com/rootless | sh
        
        # Add docker bin to our path logic if script puts it elsewhere (usually ~/bin)
        if [ -d "$HOME/bin" ]; then
             cp -s "$HOME/bin/docker" "$BIN_DIR/docker" 2>/dev/null || true
        fi
        
        echo "Docker installation script executed."
        echo "NOTE: You may need to start the daemon manually: systemctl --user start docker"
    fi
else
    echo "Docker is already installed."
fi

# --------------------------------------------------------
# 5. Add to PATH permanently
# --------------------------------------------------------
update_rc "$BIN_DIR" "export PATH=\"$BIN_DIR:\$PATH\""

# --------------------------------------------------------
# 6. Install Project Library Dependencies
# --------------------------------------------------------
echo "------------------------------------------------"
echo "Installing Dependencies for Project Codebase..."
echo "------------------------------------------------"

# Backend
if [ -d "01-Blog-backend" ]; then
    echo "-> Backend: Resolving Maven Dependencies..."
    cd 01-Blog-backend
    if [ -f "mvnw" ]; then
        chmod +x mvnw
        ./mvnw dependency:resolve
    else
         echo "mvnw not found, skipping backend setup."
    fi
    cd ..
fi

# Frontend
if [ -d "01-Blog-frontend" ]; then
    echo "-> Frontend: Installing NPM Modules..."
    cd 01-Blog-frontend
    npm install
    cd ..
fi

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "IMPORTANT: Please run 'source $SHELL_RC' to load the new environment variables."
echo "=========================================="
