#!/bin/bash

# Script to modify values in .env files
# Usage: ./modify_env_values.sh <env_file> <variable_name> <new_value>

# Check if correct number of arguments provided
if [ "$#" -ne 3 ]; then
    echo "Error: Incorrect number of arguments"
    echo "Usage: $0 <env_file> <variable_name> <new_value>"
    echo "Example: $0 frontend/.env.local NEXT_PUBLIC_API_BASE_URL http://localhost:8000"
    exit 1
fi

ENV_FILE=$1
VAR_NAME=$2
NEW_VALUE=$3

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: File $ENV_FILE does not exist"
    exit 1
fi

# Create backup
BACKUP_FILE="${ENV_FILE}.bak"
cp "$ENV_FILE" "$BACKUP_FILE"

# Check if variable exists in file
if grep -q "^${VAR_NAME}=" "$ENV_FILE"; then
    # Use sed to replace the value
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS version of sed requires backup extension
        sed -i '' "s|^${VAR_NAME}=.*|${VAR_NAME}=${NEW_VALUE}|" "$ENV_FILE"
    else
        # Linux version of sed
        sed -i "s|^${VAR_NAME}=.*|${VAR_NAME}=${NEW_VALUE}|" "$ENV_FILE"
    fi
    echo "Successfully updated ${VAR_NAME} in ${ENV_FILE}"
    echo "Backup created at ${BACKUP_FILE}"
    echo "Old value preserved in backup file"
else
    echo "Warning: Variable ${VAR_NAME} not found in ${ENV_FILE}"
    echo "No changes made"
    rm "$BACKUP_FILE"
    exit 1
fi 