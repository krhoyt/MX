export default class MXAvatar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
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

        img {
          object-fit: cover;  
        }

        p {
          box-sizing: border-box;
          color: var( --avatar-color );
          cursor: var( --avatar-cursor );
          font-family: var( --avatar-font-family );
          font-size: var( --avatar-font-size );
          font-weight: var( --avatar-font-weight );
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;          
        }        

        :host( [src] ) p {
          display: none;
        }

        :host( :not( [src] ) ) img {
          display: none;
        }
      </style>
      <p part="label"></p>
      <img part="image" />
      <slot></slot>
    `;

    // Private
    this._data = null;    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
    this.$image = this.shadowRoot.querySelector( 'img' );
  }

  _initials( name ) {
    const cleaned = name.replace( /\([^()]*\)/g, '' );
    const parts = cleaned.split( ' ' );
    let result = '';

    for( let p = 0; p < parts.length; p++ ) {
      const name = parts[p].trim();

      if( name.length === 0 ) {
        continue;
      }

      let letter = name.charAt( 0 );

      if( name.indexOf( '-' ) > -1 ) {
        const hyphens = name.split( '-' );

        for( let h = 1; h < hyphens.length; h++ ) {
          letter = letter + hyphens[h].charAt( 0 );
        }
      }

      result = result + letter;
    }

    return result.toUpperCase();    
  }     

  // When attributes change
  _render() {
    let label = this.label === null ? '' : this.label;

    if( this.initials ) {
      label = this._initials( label );
    }

    this.$label.innerText = label;
    this.$image.src = this.src === null ? '' : this.src;
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
    this._upgrade( 'favorite' );               
    this._upgrade( 'hidden' );                   
    this._upgrade( 'initials' );                       
    this._upgrade( 'label' );    
    this._upgrade( 'src' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'favorite',
      'hidden',
      'initials',
      'label',
      'src'
    ];
  }

  // Observed attribute has changed
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

  get favorite() {
    return this.hasAttribute( 'favorite' );
  }

  set favorite( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'favorite' );
      } else {
        this.setAttribute( 'favorite', '' );
      }
    } else {
      this.removeAttribute( 'favorite' );
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

  get initials() {
    return this.hasAttribute( 'initials' );
  }

  set initials( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'initials' );
      } else {
        this.setAttribute( 'initials', '' );
      }
    } else {
      this.removeAttribute( 'initials' );
    }
  }  

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
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
}

window.customElements.define( 'mx-avatar', MXAvatar );
