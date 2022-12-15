export default class MXListItemRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: var( --item-renderer-height, 48px );
          min-height: var( --item-renderer-height, 48px );
          padding: 0 16px 0 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        

        p {
          flex-basis: 0;          
          flex-grow: 1;          
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;                    
          width: 100%;
        }
      </style>
      <p part="label"></p>
    `;

    // Properties
    this._data = null;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
    this.$label.innerText = this._data;
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'data' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null 
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
    this._render();
  }
}

window.customElements.define( 'mx-list-item-renderer', MXListItemRenderer );
