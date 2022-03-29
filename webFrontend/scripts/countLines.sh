#!/bin/bash
echo "==========================================================================="
echo "Version:"
date
echo "TypeScript source code text lines:"
wc -l `find client -name "*.ts"` `find server -name "*.ts"` `find lib -name "*.ts"` | sort -n
echo "Client HTML5 + SCSS source code text lines:"
wc -l `find client -name "*.html"` `find client -name "*.scss"` | sort -n
echo "TOTAL source code text lines:"
wc -l `find client -name "*.ts"` `find server -name "*.ts"` `find lib -name "*.ts"` `find client -name "*.html"` `find client -name "*.scss"` | sort -n | tail -1
