export default class MXDivider extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: var( --divider-background-color );
          box-sizing: border-box;
          display: inline-block;
          position: relative;
          height: var( --divider-width );
        } 

        :host( [vertical] ) {
          height: auto;
          width: var( --divider-width );
        }
      </style>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When things change
  _render() {;}

  // Properties set before module loaded
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
    this._upgrade( 'hidden' );                      
    this._upgrade( 'vertical' );                          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'vertical'
    ];
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
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }
  
  get vertical() {
    return this.hasAttribute( 'vertical' );
  }

  set vertical( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'vertical' );
      } else {
        this.setAttribute( 'vertical', '' );
      }
    } else {
      this.removeAttribute( 'vertical' );
    }
  }  
}

window.customElements.define( 'mx-divider', MXDivider );
