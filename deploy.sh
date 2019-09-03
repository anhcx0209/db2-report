#!/bin/bash

echo "starting deployment..."

ng build --prod

mv dist dist3

tar -czvf dist3.tar.gz dist3

scp ./dist3.tar.gz anhcx@data-analyzer-lab:./ 

ssh anhcx@data-analyzer-lab "tar xzf ./dist3.tar.gz"

echo "clean up..."

rm -rf dist3 ./dist3.tar.gz

echo "Deploy successful!"
