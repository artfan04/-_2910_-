#!/bin/bash

# ============================================================
# Remotion Video Renderer (macOS/Linux)
# ============================================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 1. Setup Node Path
# Check for portable node in various standard locations
if [ -x "$SCRIPT_DIR/node/bin/node" ]; then
    NODE_EXE="$SCRIPT_DIR/node/bin/node"
    export PATH="$SCRIPT_DIR/node/bin:$PATH"
elif [ -x "$SCRIPT_DIR/node/node" ]; then
    NODE_EXE="$SCRIPT_DIR/node/node"
    export PATH="$SCRIPT_DIR/node:$PATH"
else
    # Fallback to system node
    NODE_EXE="node"
fi

# 2. Check Input
if [ -z "$1" ]; then
    echo "Usage: ./render.sh input.tsx [output.mp4]"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "ERROR: File not found: $1"
    exit 1
fi

# 3. Check Extension (Fixed for macOS compatibility)
FILENAME=$(basename -- "$1")
EXTENSION="${FILENAME##*.}"
# Convert to lowercase using tr instead of ${,,}
EXTENSION_LOWER=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')

if [[ "$EXTENSION_LOWER" != "tsx" ]]; then
    echo "ERROR: File must be a .tsx file, got: .$EXTENSION"
    exit 1
fi

# 4. Run Render
INPUT_FILE="$1"
OUTPUT_FILE="$2"

if [ -z "$OUTPUT_FILE" ]; then
    "$NODE_EXE" "$SCRIPT_DIR/renderer/render-cli.js" --input="$INPUT_FILE"
else
    "$NODE_EXE" "$SCRIPT_DIR/renderer/render-cli.js" --input="$INPUT_FILE" --output="$OUTPUT_FILE"
fi
