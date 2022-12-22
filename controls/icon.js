export default class MXIcon extends HTMLElement {
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

        i {
          box-sizing: border-box;
          color: var( --icon-color );
          cursor: var( --icon-cursor );
          direction: ltr;
          display: block;
          font-family: var( --icon-font-family );
          font-size: var( --icon-size );
          font-style: normal;
          font-weight: var( --icon-font-weight );
          height: var( --icon-size );
          letter-spacing: normal;
          line-height: var( --icon-size );
          margin: 0;
          padding: 0;
          text-align: var( --icon-text-align );
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: var( --icon-size );
          word-wrap: normal;
        }

        svg {
          display: block;
          fill: var( --icon-color );
          height: var( --icon-size );
          width: var( --icon-size );
        }

        :host( :not( [name] ) ) i,
        :host( [name] ) svg {
          display: none;
        }
      </style>
      <i part="symbol"></i>
    `;

    // Properties
    this._data = null;
    this._parser = new DOMParser();
    this._src = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$image = null;
    this.$symbol = this.shadowRoot.querySelector( 'i' );
  }

  // When things change
  _render() {
    this.$symbol.innerText = this.name === null ? '' : this.name;

    if( this.name !== null ) {
      const variation = [];

      if( this.filled )
        variation.push( '\'FILL\' 1' );

      if( this.weight !== null ) {
        variation.push( `'wght' ${this.weight}` );
      }

      this.$symbol.style.fontVariationSettings = variation.toString();
    }

    if( this.src === null ) {
      if( this.$image !== null ) {
        this.$image.remove();
        this.$image = null;
        this._src = null;
      }
    } else {
      if( this.src !== this._src ) {
        this._src = this.src;
        fetch( this.src )
        .then( ( response ) => response.text() )
        .then( ( text ) => {
          const doc = this._parser.parseFromString( text, 'text/html' );
          this.$image = doc.body.querySelector( 'svg' );
          this.shadowRoot.insertBefore( this.$image, this.$symbol );
        } );
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
    this._upgrade( 'filled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'name' );
    this._upgrade( 'src' );
    this._upgrade( 'weight' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'filled',
      'hidden',
      'name',
      'src',
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

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }

  get src() {
    if( this.hasAttribute( 'src' ) ) {
      return this.getAttribute( 'src' );
    }

    return null;
  }

  set src( value ) {
    if( value !== null ) {
      this.setAttribute( 'src', value );
    } else {
      this.removeAttribute( 'src' );
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

window.customElements.define( 'mx-icon', MXIcon );
