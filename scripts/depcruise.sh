#!/usr/bin/env sh

rm -r graphs
mkdir -p graphs

depcruise --config .dependency-cruiser.js --output-type archi src | dot -T svg > graphs/overview.svg
echo "✔ package overview"

depcruise --config .dependency-cruiser.js --output-type archi src -x components |  dot -T svg > graphs/framework.svg
echo "✔ framework"

depcruise --config .dependency-cruiser.js --output-type archi src/components |  dot -T svg > graphs/components.svg
echo "✔ components"

./node_modules/.bin/madge --dot src/scss/engine.scss | dot -T svg > graphs/styling-engine.svg
echo "✔ styling engine"

./node_modules/.bin/madge --exclude 'engine\.scss' --dot src/global.scss | dot -T svg > graphs/global-styles.svg
echo "✔ global styles"
