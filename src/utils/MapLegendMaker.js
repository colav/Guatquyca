export default function MapLegendMaker(items, max) {
  let fix_items = JSON.parse(JSON.stringify(items));
  for (let i = 0; i < fix_items.length; i++) {
    let valueA = parseInt(Math.exp(items[i].value[0]));
    let valueB = parseInt(Math.exp(items[i].value[1]));
    if (i === 0) {
      fix_items[i].value = '0';
    } else if (i === 1) {
      fix_items[i].value = '1 - ' + valueB;
    } else if (i === fix_items.length - 1) {
      fix_items[i].value = valueA + 1 + ' - ' + max;
    } else if (valueA === valueB) {
      fix_items[i].value = valueA + ' - ' + valueB;
    } else fix_items[i].value = valueA + 1 + ' - ' + valueB;
  }

  const listMaker = () => {
    return fix_items
      .map(
        (item) =>
          `<li class="l7plot-legend__list-item">
            <span class="l7plot-legend__category-marker" style="background: ${item.color}"></span>
            <span class="l7plot-legend__category-value">${item.value}</span>
          </li>`
      )
      .join('');
  };

  return `<div class="l7plot-legend l7plot-legend__category">
  <ul class="l7plot-legend__category-list">${listMaker()}</ul>
  </div>`;
}
