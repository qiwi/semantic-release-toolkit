packages="node_modules/tslib/package.json packages/plugin-creator/package.json packages/metabranch/package.json"

if [ $# -eq 1 ]; then
  for p in $packages;
  do jq 'if (.main) then ._main = .main | del(.main) else . end' $p | sponge $p;
  done;
  echo "package.json main disabled";
else
  for p in $packages;
  do jq 'if (._main) then .main = ._main | del(._main) else . end' $p | sponge $p;
  done;
  echo "package.json main restored";
fi
