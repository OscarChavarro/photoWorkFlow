#!/bin/bash
meteor npm install --save @babel/runtime
meteor npm install event-stream
meteor npm install --save @types/meteor
meteor npm install meteor-typescript
meteor npm install jquery
meteor npm install bootstrap

# For cross compiling...
# meteor npm install --save --architecture=os.linux.x86_64 @babel/runtime
# meteor npm install --architecture=os.linux.x86_64 event-stream
# meteor npm install --save --architecture=os.linux.x86_64 @types/meteor
# meteor npm install --architecture=os.linux.x86_64 meteor-typescript
# meteor npm install --architecture=os.linux.x86_64 jquery
# meteor npm install --architecture=os.linux.x86_64 bootstrap
# meteor npm install --architecture=os.linux.x86_64 --save meteor-node-stubs
# meteor npm install --save --architecture=os.linux.x86_64 fibers lodash.has lodash.isobject lodash.isfunction lodash.isempty combined-stream2 postcss cssnano @meteorjs/reify decimal.js compression cookie-parser qs parseurl basic-auth-connect useragent send @vlasky/whomst connect
