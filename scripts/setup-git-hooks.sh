#!/bin/bash

# Exit gracefully if .git directory does not exist (e.g., on CI or production servers)
if [ ! -d ".git" ]; then
  echo "No .git directory found. Skipping Git hooks setup."
  exit 0
fi

HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

echo "Setting up local Git hooks..."

# Ensure the hooks directory exists
mkdir -p "$HOOK_DIR"

# Write the pre-commit hook content
cat << 'EOF' > "$HOOK_FILE"
#!/bin/sh
# Pre-commit hook to catch build and typecheck errors

echo "========================================"
echo "Running pre-commit checks..."
echo "========================================"

# Run typecheck
npm run typecheck
if [ $? -ne 0 ]; then
  echo "Error: Typecheck failed. Aborting commit."
  exit 1
fi

# Run build
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed. Aborting commit."
  exit 1
fi

echo "========================================"
echo "Pre-commit checks passed successfully!"
echo "========================================"
exit 0
EOF

# Make the pre-commit hook executable
chmod +x "$HOOK_FILE"

echo "Git pre-commit hook successfully installed at $HOOK_FILE."
