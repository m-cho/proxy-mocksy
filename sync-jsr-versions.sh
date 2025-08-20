#!/bin/bash

# Script to sync versions across all JSR configurations
# Usage: ./sync-jsr-versions.sh [new-version]

if [ "$1" ]; then
    NEW_VERSION="$1"
    echo "Setting version to: $NEW_VERSION"
    
    # Update core package
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" packages/core/jsr.json
    
    # Update CLI package and its dependency
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" packages/cli/jsr.json
    sed -i "s/@proxy-mocksy\/core@[^\"]*\"/@proxy-mocksy\/core@$NEW_VERSION\"/" packages/cli/jsr.json
    
    echo "Updated JSR versions to $NEW_VERSION"
else
    echo "Current versions:"
    echo "Core: $(grep '"version"' packages/core/jsr.json | cut -d'"' -f4)"
    echo "CLI: $(grep '"version"' packages/cli/jsr.json | cut -d'"' -f4)"
    echo "CLI dependency: $(grep '@proxy-mocksy/core@' packages/cli/jsr.json | sed 's/.*@proxy-mocksy\/core@\([^"]*\).*/\1/')"
    echo ""
    echo "Usage: $0 [new-version]"
    echo "Example: $0 0.0.8"
fi
