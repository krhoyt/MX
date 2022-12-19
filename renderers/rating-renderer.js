export default class MXRatingRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        button {
          background: none;
          box-sizing: border-box;          
          border: none;
          color: var( --rating-color );
          cursor: var( --rating-cursor );                    
          direction: ltr;          
          display: block;
          font-family: var( --rating-font-family );
          font-size: var( --rating-size );          
          font-style: normal;          
          font-weight: var( --rating-font-weight );
          height: var( --rating-size );          
          letter-spacing: normal;
          line-height: var( --rating-size );
          margin: 0;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;          
          text-transform: none;          
          white-space: nowrap;          
          width: var( --rating-size );
          word-wrap: normal;                  
          -webkit-tap-highlight-color: transparent;                 
        }

        :host( .selected ) button {
          color: var( --rating-selected-color );
        }        
      </style>
      <button type="button"></button>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
  }

  // When things change
  _render() {
    if( this._data === null ) return;

    let symbol = null;
    switch( this._data ) {
      case 0:
        symbol = 'sentiment_extremely_dissatisfied';
        break;
      case 1:
        symbol = 'sentiment_dissatisfied';
        break;
      case 2:
        symbol = 'sentiment_neutral';
        break;
      case 3:
        symbol = 'sentiment_satisfied';
        break;        
      case 4:
        symbol = 'sentiment_very_satisfied';
        break;
    }

    this.$button.innerText = symbol;
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

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }

  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
    }
  }  
}

window.customElements.define( 'mx-rating-renderer', MXRatingRenderer );
