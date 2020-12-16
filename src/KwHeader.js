import { html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { HTMLChildrenMixin } from './HTMLChildrenMixin';
import { kwHeaderStyles } from './kw-header-style';

/**
 * `kw-header`
 * KwHeader
 *
 * @customElement kw-header
 * @litElement
 */
export class KwHeader extends HTMLChildrenMixin(LitElement) {
  static get is() {
    return 'kw-header';
  }

  static get properties() {
    return {
      /**
       *
       * @property
       * @type { String }
       */
      language: {
        type: String,
      },
      /**
       *
       * @property
       * @type { }
       */
      menuItems: {
        type: Array,
      },
      /**
       *
       * @property
       * @type { }
       */
      mainMenu: {
        type: Array,
      },
      /**
       * 
       * @property
       * @type { }
       */
      dropdownServices: {
        type: Array,
      },
      /**
       *
       * @property
       * @type { }
       */
      dropdownAboutUs: {
        type: Array,
      },
      /**
       *
       * @property
       * @type { }
       */
      capacities: {
        type: Array,
      },
      /**
       *
       * @property
       * @type { }
       */
      countries: {
        type: Array,
      },
      /**
       *
       * @property
       * @type { }
       */
      selected: {
        type: String,
      },
      /**
       *
       * @property
       * @type { }
       */
      route: {
        type: String,
      },
      /**
       *
       * @property
       * @type { Boolean }
       */
      languageSelected: {
        type: Boolean,
        attribute: false,
      },
      /**
       *
       * @property
       * @type { String }
       */
      lang: {
        type: String,
      },
    };
  }

  static get styles() {
    return [kwHeaderStyles];
  }

  constructor() {
    super();
    this.selected = '';
    this.menuItems = [];
    this.languages = ['ES', 'EN'];
    this.route = window.location.pathname;
    this.language = 'es';
    this.indexCounter = 0;

    this._allMenusInactive = this._allMenusInactive.bind(this);
  }

  _allMenusInactive() {
    const menus = this.shadowRoot.querySelectorAll('[id^="dropdown_container_"]');
    menus.forEach((menu) => {
      if (!menu.classList.contains('inactive')) {
        menu.classList.add('inactive');
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const childNodes = this._HTMLChildren();
    [this.mainMenu] = childNodes;
    document.body.addEventListener('click', this._allMenusInactive);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.removeEventListener('click', this._allMenusInactive);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this._allMenusInactive();
    const id = e.currentTarget.id.toLowerCase();
    const target = this.shadowRoot.getElementById(`dropdown_container_${id}`);
    target.classList.toggle('inactive');
  }

  handleClickEnter(e) {
    const arrowLeftId = `arrow-left-navigation_${e.currentTarget.attributes.index.value}`;
    const arrowLeft = this.shadowRoot.getElementById(arrowLeftId).classList;
    const arrowRight = this.shadowRoot.getElementById(e.currentTarget.id).classList;
    arrowRight.add(MENU_ITEMS.inactive);
    arrowLeft.remove(MENU_ITEMS.inactive);
    if (arrowRight.value.includes(MENU_ITEMS.es.firstItemNav)
      || arrowRight.value.includes(MENU_ITEMS.en.firstItemNav)) {
      const dropdownServicesContainer = this.shadowRoot
        .getElementById(MENU_ITEMS.dropdownServicesContainerId).classList;
      dropdownServicesContainer.add(MENU_ITEMS.active);
    }
    if (arrowRight.value.includes(MENU_ITEMS.es.secondItemNav)
      || arrowRight.value.includes(MENU_ITEMS.es.secondItemNav)) {
      const dropdownAboutUSContainer = this.shadowRoot
        .getElementById(MENU_ITEMS.dropdownAboutContainerId).classList;
      const ourServicesItem = this.shadowRoot
        .getElementById(MENU_ITEMS.es.firstItemNav || MENU_ITEMS.en.firstItemNav).classList;
      dropdownAboutUSContainer.add(MENU_ITEMS.active);
      ourServicesItem.add(MENU_ITEMS.inactive);
    }
  }

  handleClickBack(e) {
    const arrowRightId = `arrow-right-navigation_${e.currentTarget.attributes.index.value}`;
    const arrowLeft = this.shadowRoot.getElementById(e.currentTarget.id).classList;
    const arrowRight = this.shadowRoot.getElementById(arrowRightId).classList;
    arrowRight.remove(MENU_ITEMS.inactive);
    arrowLeft.add(MENU_ITEMS.inactive);
    const dropdownServicesContainer = this.shadowRoot
      .getElementById(MENU_ITEMS.dropdownServicesContainerId).classList;
    dropdownServicesContainer.remove(MENU_ITEMS.active);
    const dropdownAboutUSContainer = this.shadowRoot
      .getElementById(MENU_ITEMS.dropdownAboutContainerId).classList;
    dropdownAboutUSContainer.remove(MENU_ITEMS.active);

    const ourServicesItem = this.shadowRoot
      .getElementById(MENU_ITEMS.es.firstItemNav || MENU_ITEMS.en.firstItemNav).classList;
    ourServicesItem.remove(MENU_ITEMS.inactive);
  }

  renderDropdown(id, dropdownMenu) {
    const HTMLDropdown = [];
    const dropdownMenuKeys = Object.keys(dropdownMenu);
    dropdownMenuKeys.forEach((drodownMenuItem) => {
      const item = dropdownMenu[drodownMenuItem];
      HTMLDropdown.push(html`
        <li class="dropdown-nav-li">
          <a class=${classMap({ location__link: true, selected: this.route===item['data-link'] })}
            href="/${this.language}/${item['data-link']}" rel="noopener noreferrer" target="${item.target || '_self'}">
            ${item.title}
          </a>
        </li>
        ${this.capacities ? html`
        <div id="dropdown-capacities-container" class="dropdown-capacities-container inactive">
          <ul class="dropdown-nav dropdown-capacities">
            ${this.capacities.map((capacitiesItem) => html`
            <li class="dropdown-nav-li">
              ${capacitiesItem.title}
            </li>
            `)}
          </ul>
        </div>` : ''}
        `);
    });
    return html`
      <div id="dropdown_container_${id.toLowerCase()}" class="dropdown-services-container inactive">
        <ul class="dropdown-nav dropdown-services">
          ${HTMLDropdown.map((el) => el)}
        </ul>
      </div>`;
  }

  renderMenuItemComplex(menuItem) {
    const HTMLMenuItemComplex = [];

    HTMLMenuItemComplex.push(html`
      <img id="arrow-left-navigation_${this.indexCounter}"
        class="${menuItem.title.replace(/\s/g, '')} arrow-left-navigation inactive" src="/src/arrow-left-icon.svg"
        alt="flecha de acceso a submenu" @click="${this.handleClickBack}" index="${this.indexCounter}" />
      <span id="${menuItem.id}" class=${classMap({ location__link: true, selected: this.route===menuItem.link })}
        @click="${this.handleClick}">
        ${menuItem.title}
        <img class="${window.innerWidth < 1024 ? 'inactive' : 'arrow-down-dropdown'}" src="/src/arrow-down-kw.svg"
          alt="=>" />
      </span>
      ${window.innerWidth < 1024 ? html` <img id="arrow-right-navigation_${this.indexCounter}"
        class="${menuItem.title.replace(/\s/g, '')} arrow-right-navigation" src="/src/arrow-right-icon.svg" alt="=>"
        @click="${this.handleClickEnter}" index="${this.indexCounter}" />`
    : html``}
      ${this.renderDropdown(menuItem.id, menuItem[0])}`);
    this.indexCounter += 1;
    return html`${HTMLMenuItemComplex.map((el) => el)}`;
  }

  renderMenuItem(menuItem) {
    const linkItem = `/${this.language}/${menuItem['data-link']}`;
    const menuItemLink = menuItem['data-link'] === 'https://leadthechange.es/' ? 'https://leadthechange.es/' : linkItem;

    const htmlMenu = html`
    <li id="${menuItem.id}" class="navbar-list__item">
      ${menuItem['data-link'] ? html`
      <a class=${classMap({ location__link: true, selected: this.route===menuItem.link })} 
        href=${menuItemLink}
        rel="noopener noreferrer" target="${menuItem.target || '_self'}">
        ${menuItem.title}
      </a>`
    : html`${this.renderMenuItemComplex(menuItem)}`}
    </li>`;

    return htmlMenu;
  }

  renderMainMenu() {
    if (this.mainMenu === undefined) {
      return html``;
    }
    const HTMLMainMenu = [];
    const menuItemKeys = Object.keys(this.mainMenu);
    menuItemKeys.forEach((menuItem) => {
      HTMLMainMenu.push(this.renderMenuItem(this.mainMenu[menuItem]));
    });
    return html`${HTMLMainMenu.map(el => el)}`;
  }

  render() {
    return html`
      <div class="navbar-container">
        <input type="checkbox" class="navbar__input" id="toggleMenu" />
        <label tabindex="0" class="navbar-menu-icon  location__link" for="toggleMenu">
          <a href="#" class="navbar-menu__open" title="enlace a menú desplegable" rel="noopener noreferrer"
            aria-expanded="false"></a>
        </label>
        <div id="home" class="navbar-logo">
          <a class="navbar-logo__link location__link" rel="noopener noreferrer"
            href="${this.language === 'es' ? '/' : '/en/index.html'}">
            <img class="logo-kairos" src="/src/logo-k.webp" alt="kairos logo" />
          </a>
        </div>
        <nav role="navigation" class="navbar">
          <ul class="navbar-list">
            ${this.renderMainMenu()}
          </ul>
      
      
          ${this.dropdownAboutUs ? html`
          <div id="dropdown-about-container" class="dropdown-about-container inactive">
            <ul class="dropdown-nav dropdown-about-us">
              ${this.dropdownAboutUs.map((dropdownAboutUsItem) => html`
              <li class="dropdown-nav-li">
                <a class=${classMap({ location__link: true, selected: this.route===dropdownAboutUsItem.link })}
                  href="${dropdownAboutUsItem.link}" rel="noopener noreferrer"
                  target="${dropdownAboutUsItem.target || '_self'}">
                  ${dropdownAboutUsItem.title}
                </a>
              </li>
              `)}
            </ul>
          </div>
          ` : ''}
        </nav>
      </div>
    `;
  }
}
