#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/.env"

#init
#you should change these variables for suitable
RESTORE_DIR="${HOME}/restoredb"

BUCKET="techshop-backup"
S3_API="https://8aa21ac41600f49624fe3a05cfec79ef.r2.cloudflarestorage.com"

if [[ ! -e "$RESTORE_DIR" ]]; then
    mkdir "$RESTORE_DIR"
fi

cd "$RESTORE_DIR"

#Step1: determine the latest backup on storage
LATEST="$(aws s3 ls "s3://${BUCKET}" \
            --endpoint-url "${S3_API}" \
            | tail -1 \
            | awk '{print $4}')"

if [[ "$?" -ne 0 ]]; then
    echo "cant determine the latest version"
    exit 1
fi

echo "the latest backup is ${LATEST}"

#Step2: download the latest backup to my server
aws s3 cp "s3://${BUCKET}/${LATEST}" \
        "." \
        --endpoint-url "${S3_API}"

if [[ "$?" -ne 0 ]]; then
    echo "cant download the backup from storage"
    exit 1
fi

#Step3: uncompress file
tar xzf "${LATEST}"

if [[ "$?" -ne 0 ]]; then
    echo "cant uncompress file"
    exit 1
fi

#Step4: restore database
read -p "DO YOU WANT RESTORE YOUR DATABASE(Y/N)?" CHOOSE
if [[ "$CHOOSE" = "N" || "$CHOOSE" = "n" ]]; then
    echo "thank you! your restore file is $(pwd)/${LATEST}"
    echo "exiting..."
else
    echo "restoring your database..."
    mariadb \
    -h "$DB_HOST" \
    -P "$DB_PORT" \
    -u "$DB_USER" \
    --password="$DB_PASS" \
    "$DB_NAME" < "${DB_NAME}.sql"

    if [[ "$?" -ne 0 ]]; then
        echo "cant restore database"
        exit 1
    fi
fi

rm -rf "${DB_NAME}.sql"