#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/.env"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/tmp/techshop-backup"
DUMP_FILE="${DB_NAME}.sql"
ARCHIVE_FILE="${TIMESTAMP}_backup_${DB_NAME}.tar.gz"

BUCKET="techshop-backup"
S3_API="https://8aa21ac41600f49624fe3a05cfec79ef.r2.cloudflarestorage.com"

mkdir -p "$BACKUP_DIR"

cd "$BACKUP_DIR"

#Step1: Dump mysql database
mariadb-dump \
    -h "$DB_HOST" \
    -P "$DB_PORT" \
    -u "$DB_USER" \
    --password="$DB_PASS" \
    "$DB_NAME" > "$DUMP_FILE"
if [[ "$?" -ne 0 ]]; then
    echo "cant dump your mysql database"
    exit 1
fi

#Step2: Compress the backup file
tar czf "$ARCHIVE_FILE" "$DUMP_FILE"

if [[ "$?" -ne 0 ]]; then
    echo "cant compress backup file"
    exit 1
fi

#remove the dump file.sql
rm -rf "$DUMP_FILE"

#Step3: upload file backup to Cloudflare R2
aws s3 cp "${ARCHIVE_FILE}" "s3://${BUCKET}" \
        --endpoint-url "${S3_API}" \
        --region auto

if [[ $? -ne 0 ]]; then
    echo "cant upload file to storage"
    exit 1
fi

#Step4: maintain only maximum 7 backup on storage R2
NUM_BACKUP=$(aws s3 ls "s3://${BUCKET}" \
        --endpoint-url "${S3_API}" \
        --region auto \
        | wc -l)
while [[ "$NUM_BACKUP" -gt 7 ]]; do
    echo "number of backups: ${NUM_BACKUP}"
    OLDEST=$(aws s3 ls  "s3://${BUCKET}" \
        --endpoint-url "${S3_API}" \
        --region auto \
        | head -1 \
        | awk '{print $4}')

    if [[ -z "$OLDEST" ]]; then
        echo "cant find the oldest backup on storage"
        exit 1
    fi

    aws s3 rm "s3://${BUCKET}/${OLDEST}" \
        --endpoint-url "${S3_API}" \
        --region auto
    if [[ "$?" -ne 0 ]]; then
        echo "cant remove the backup"
        exit 1
    fi

    ((NUM_BACKUP--))
done