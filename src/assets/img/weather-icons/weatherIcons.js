const context = require.context(".", false, /\.svg$/);

const icons = {};

context.keys().forEach((key) => {
    const filename = key.replace("./", "").replace(".svg", "");
    icons[filename] = context(key);
});

export default icons;
