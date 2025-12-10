#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080"
AUTH_URL="$BASE_URL/auth/login"
POST_URL="$BASE_URL/api/posts"

# Credentials
USERNAME="Genghis"
PASSWORD="Genghis khan"

# 1. Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"jwt":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Login successful. Token: ${TOKEN:0:10}..."

# 2. Create dummy files
echo "Creating dummy files..."
# Valid image
dd if=/dev/zero of=valid.png bs=1024 count=10 > /dev/null 2>&1
# Invalid extension
echo "This is a text file" > invalid.txt
# Large file (11MB)
dd if=/dev/zero of=large.png bs=1024 count=11264 > /dev/null 2>&1

# 3. Test 1: Valid Upload
echo "---------------------------------------------------"
echo "Test 1: Uploading valid image (valid.png)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$POST_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Title" \
  -F "description=This is a valid description with enough characters." \
  -F "newMedia=@valid.png;type=image/png")

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ Success: Valid upload accepted (201)"
else
  echo "❌ Failure: Valid upload rejected ($HTTP_CODE)"
fi

# 4. Test 2: Invalid Extension
echo "---------------------------------------------------"
echo "Test 2: Uploading invalid extension (invalid.txt)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$POST_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Title" \
  -F "description=This is a valid description with enough characters." \
  -F "newMedia=@invalid.txt;type=text/plain")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -ne 201 ]; then
  echo "✅ Success: Invalid extension rejected ($HTTP_CODE)"
  echo "Response: $BODY"
  if echo "$BODY" | grep -q "toast"; then
      echo "✅ Toast response detected"
  else
      echo "❌ Toast response missing"
  fi
else
  echo "❌ Failure: Invalid extension accepted (201)"
fi

# 5. Test 3: Large File
echo "---------------------------------------------------"
echo "Test 3: Uploading large file (large.png > 10MB)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$POST_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Title" \
  -F "description=This is a valid description with enough characters." \
  -F "newMedia=@large.png;type=image/png")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -ne 201 ]; then
  echo "✅ Success: Large file rejected ($HTTP_CODE)"
  echo "Response: $BODY"
  if echo "$BODY" | grep -q "toast"; then
      echo "✅ Toast response detected"
  else
      echo "❌ Toast response missing"
  fi
else
  echo "❌ Failure: Large file accepted (201)"
fi

# Cleanup
rm valid.png invalid.txt large.png
