#!/bin/bash
export NODE_OPTIONS=–max-old-space-size=32768
export MONGO_URL=mongodb://127.0.0.1/photowf
echo "RUNNING AT PORT 3666"
#echo "Writing output messages at file <output.log>"
meteor --port 3666 run
#&> output.log
