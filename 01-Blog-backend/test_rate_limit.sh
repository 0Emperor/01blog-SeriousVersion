#!/bin/bash

URL="http://localhost:8080/auth/login" # Change to a valid endpoint if needed

echo "Testing rate limit on $URL"
echo "Quota is 5 requests per 10 seconds."
echo "Sending 10 requests..."

for i in {1..10}
do
   # Capture HTTP code and response body
   response=$(curl -s -w "\n%{http_code}" $URL)
   http_code=$(echo "$response" | tail -n1)
   body=$(echo "$response" | head -n -1)

   if [ "$http_code" -eq 429 ]; then
       echo "Request $i: Blocked (429). Body: $body"
   else
       echo "Request $i: Allowed ($http_code)"
   fi
done
