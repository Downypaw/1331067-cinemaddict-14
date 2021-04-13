const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const counter = name !== 'All movies' ? `<span class="main-navigation__item-count">${count}</span>` : '';
  return `<a href="#${name}" class="main-navigation__item">${name} ${counter}</a>`;
};

export const createSiteMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};
