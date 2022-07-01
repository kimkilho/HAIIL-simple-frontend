const generateRandomRGBs = (numColors, opacity) => {
  function rand(frm, to) {
    return ~~(Math.random() * (to - frm)) + frm;
  }

  const colors = [];
  while (colors.length < numColors) {
    colors.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, ${opacity})`);
  }

  return colors;
};

export { generateRandomRGBs };