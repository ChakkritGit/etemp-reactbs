// GlobalStyles.ts
import { createGlobalStyle, css } from 'styled-components'

const GlobalStyles = createGlobalStyle`
body {
  background-color: var(--bg-grey);
}

${(props) =>
    props.theme.mode === 'dark' ?
      css`
body {
  background-color: var(--main-seccond-color);
}
.login-card,
.modal-content {
  background-color: var(--main-last-color);
  color: var(--white);
}

.form-control {
  background-color: var(--main-seccond-color);
  border-color: var(--main-seccond-color);
  color: var(--white);
}

.form-control:focus {
  background-color: var(--main-seccond-color);
  color: var(--white);
}

.form-floating>.form-control:focus~label {
  color: var(--grey);
}

.form-floating>.form-control:focus~label::after {
  background-color: var(--main-seccond-color);
}

.form-floating>.form-control:not(:placeholder-shown)~label {
  color: var(--grey);
}

.form-floating>.form-control:not(:placeholder-shown)~label::after {
  background-color: unset;
}

.modal-header {
  border-bottom: var(--bs-modal-header-border-width) solid var(--border-dark-color);
}

.modal-footer {
  border-top: var(--bs-modal-footer-border-width) solid var(--border-dark-color);
}

.sidebar-dark-bg {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);

  .nav-link,
  .sidebar-dark-text {
    color: var(--white) !important;
  }
}

.outlet-dark-bg {
  background-color: var(--main-seccond-color) !important;
  color: var(--white);
}

.lang-switcher-dark {
  color: var(--white);
}

.dropdown-menu {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);

  & a {
    color: var(--white);
  }
}

.dropdown-item:focus,
.dropdown-item:hover {
  background-color: var(--main-seccond-color);
  color: var(--white);
}

.dropdown-item.disabled,
.dropdown-item:disabled {
  color: var(--soft-grey);
}

hr {
  color: var(--grey);
}

.profile-name-dark {
  color: var(--white);
}

div:where(.swal2-container).swal2-center>.swal2-popup {
  background-color: var(--main-last-color);
  color: var(--white);
}

.nav-tabs {
  border-bottom-color: var(--border-dark-color);
}

.nav-tabs .nav-link {
  color: var(--grey);
}

.nav-tabs .nav-link.active {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);
  color: var(--white) !important;
}

.nav-tabs .nav-link:hover {
  color: var(--white);
  border-color: var(--border-dark-color);
}

.container>nav>ol>li:nth-child(2),
.container>nav>ol>li:nth-child(3)>p,
.container>nav>ol>li:nth-child(4) {
  color: var(--grey) !important;
}

.offcanvas {
  background-color: var(--main-last-color) !important;
}

.go2072408551 {
  background-color: var(--main-last-color);
  color: var(--white);
}

.apexcharts-tooltip {
  background-color: rgba(100, 100, 100, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
}

.apexcharts-text tspan  {
  fill: white;
}

.apexcharts-legend-text {
  color: white !important;
}

.apexcharts-menu-icon, .apexcharts-pan-icon, .apexcharts-reset-icon, .apexcharts-selection-icon, .apexcharts-toolbar-custom-icon, .apexcharts-zoom-icon, .apexcharts-zoomin-icon, .apexcharts-zoomout-icon {
  color: white !important;

  svg {
    fill: white !important;
  }
}

.apexcharts-menu {
  background-color: rgba(100, 100, 100, 0.5) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
  border-color: transparent !important;
}

.apexcharts-gridline {
  stroke: var(--border-dark-color);
}

.form-select {
  background-color: var(--main-last-color);
  border-color: var(--border-dark-color);
  border-width: 1.5px;
  color: var(--white);
}

.swal2-popup.swal2-toast {
  background-color: var(--main-last-rgba) !important;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  color: white;
}

.error-page {
  color: white;
}

.form-select:disabled {
  background-color: var(--main-seccond-color);
}

.compare-text {
  color: white;
}

.react-select__menu {
  color: white !important;
  background-color: var(--main-last-color) !important;
}

.react-select__input-container, .react-select__single-value {
  color: white !important;
}

.react-select__control {
  border-color: var(--border-dark-color) !important;
}

.react-select__control:hover {
  border-color: var(--main-color) !important;
}
`
      :
      `
      .react-select__control:hover {
      border-color: var(--main-color) !important;
      }
      `
  }`

export default GlobalStyles