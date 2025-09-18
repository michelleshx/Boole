#!/bin/bash

# Exit on error
set -e

DEPLOY_DIR="james"

if [ -d "../$DEPLOY_DIR" ]; then
    echo "Directory $DEPLOY_DIR already exists. Exiting."
    exit 1
fi

if [ "$PWD" != "/u8/se212/public_html/george/james-repo" ]; then
        echo "The current dir name is not correct. This will mess up permissions when running ~/public_html/permission.sh. "
        echo "Please ensure the se212website-james branch is located in public_html/george/james-repo. "
        echo "Try: git clone --branch se212website-james https://github.com/michelleshx/Boole.git james-repo"
        exit 1
fi

git pull origin se212website-james

npm install
npm run build

mv build ../"$DEPLOY_DIR"

echo "Done. Please run ~/public_html/permission.sh to set permissions. "

