export default class MXRating extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
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

        button.selected {
          color: var( --rating-selected-color );
        }

        button.star {
          background-image: var( --rating-background-image );
          background-position: center;
          background-repeat: no-repeat;
          background-size: var( --rating-size );
          opacity: var( --rating-opacity );
        }

        button.star.selected {
          opacity: 1.0;
        }

        div {
          display: flex;
          flex-direction: var( --rating-flex-direction );
          gap: var( --rating-gap );
        }
      </style>
      <div part="rating"></div>
    `;

    // Private
    this._data = null;
    this._symbol = null;

    // Events
    this.addEventListener( 'click', ( evt ) => this.doChildClick( evt ) );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$field = this.shadowRoot.querySelector( 'div' );
  }

  doChildClick( evt ) {
    if( this.readOnly ) return;

    const index = parseInt( evt.target.getAttribute( 'data-index' ) );

    if( this.toggle ) {
      this.value = this.value === index ? null : index;
    } else {
      this.value = index;
    }

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        value: this.value
      }
    } ) );
  }

  // When things change
  _render() {
    const maximum = this.maximum === null ? 5 : this.maximum;
    const renderer = this.ratingRenderer === null ? 'button' : this.ratingRenderer;
    const symbol = this.symbol === null ? 'star' : this.symbol;
    const value = this.value === null ? 0 : this.value;

    let variation = [];
    variation.push( `'FILL' ${this.filled ? '1' : '0'}` );
    variation.push( `'wght' ${this.weight === null ? '400' : this.weight}` );
    variation = variation.toString();

    while( this.$field.length > maximum ) {
      this.$field.children[0].removeEventListener( 'click', this.doChildClick );
      this.$field.children[0].remove();
    }

    while( this.$field.children.length < maximum ) {
      const element = document.createElement( renderer );
      element.type = 'button';
      element.addEventListener( 'click', this.doChildClick );
      this.$field.appendChild( element );
    }

    for( let c = 0; c < maximum; c++ ) {
      if( this.ratingRenderer !== null ) {
        this.$field.children[c].data = c;
      } else if( this.symbol !== null ) {
        this.$field.children[c].style.fontVariationSettings = variation;
        this.$field.children[c].innerText = this._symbol === null ? symbol : this._symbol( c );        
      } else {
        this.$field.children[c].className = 'star';
      }

      this.$field.children[c].setAttribute( 'data-index', c + 1 );
      this.$field.children[c].disabled = this.disabled;
      this.$field.children[c].readOnly = this.readOnly;

      if( value > c ) {
        this.$field.children[c].classList.add( 'selected' );
      } else {
        this.$field.children[c].classList.remove( 'selected' );
      }
    }
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
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );
    this._upgrade( 'filled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'maximum' );
    this._upgrade( 'ratingRenderer' );    
    this._upgrade( 'readOnly' );    
    this._upgrade( 'symbol' );
    this._upgrade( 'symbolFunction' );    
    this._upgrade( 'toggle' );    
    this._upgrade( 'value' );
    this._upgrade( 'weight' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'filled',
      'hidden',
      'maximum',
      'rating-renderer',
      'read-only',
      'symbol',
      'toggle',
      'value',
      'weight'
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

  get symbolFunction() {
    return this._symbol;
  }

  set symbolFunction( value ) {
    this._symbol = value;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

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

  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
    }
  }

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

  get maximum() {
    if( this.hasAttribute( 'maximum' ) ) {
      return parseInt( this.getAttribute( 'maximum' ) );
    }

    return null;
  }

  set maximum( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum', value );
    } else {
      this.removeAttribute( 'maximum' );
    }
  }

  get ratingRenderer() {
    if( this.hasAttribute( 'rating-renderer' ) ) {
      return this.getAttribute( 'rating-renderer' );
    }

    return null;
  }

  set symbol( value ) {
    if( value !== null ) {
      this.setAttribute( 'symbol', value );
    } else {
      this.removeAttribute( 'symbol' );
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

  get symbol() {
    if( this.hasAttribute( 'symbol' ) ) {
      return this.getAttribute( 'symbol' );
    }

    return null;
  }

  set symbol( value ) {
    if( value !== null ) {
      this.setAttribute( 'symbol', value );
    } else {
      this.removeAttribute( 'symbol' );
    }
  }

  get toggle() {
    return this.hasAttribute( 'toggle' );
  }

  set toggle( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'toggle' );
      } else {
        this.setAttribute( 'toggle', '' );
      }
    } else {
      this.removeAttribute( 'toggle' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return parseInt( this.getAttribute( 'value' ) );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }

  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return parseInt( this.getAttribute( 'weight' ) );
    }

    return null;
  }

  set weight( value ) {
    if( value !== null ) {
      this.setAttribute( 'weight', value );
    } else {
      this.removeAttribute( 'weight' );
    }
  }  
}

window.customElements.define( 'mx-rating', MXRating );
