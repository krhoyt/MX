export default class MXIconButton extends HTMLElement {
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
          box-sizing: border-box;
          cursor: var( --icon-button-cursor );     
          margin: 0;
          padding: 0;     
          -webkit-tap-highlight-color: transparent;          
        }        

        img {
          box-sizing: border-box;          
          display: block;
        }

        i {
          box-sizing: border-box;          
          color: var( --icon-button-color );
          cursor: var( --icon-button-cursor );                    
          direction: ltr;          
          font-family: var( --icon-button-font-family );
          font-size: var( --icon-button-font-size );          
          font-style: normal;          
          font-weight: var( --icon-button-font-weight );
          height: var( --icon-button-size );          
          letter-spacing: normal;
          line-height: var( --icon-button-size );
          margin: 0;
          padding: 0;
          text-align: var( --icon-button-text-align );
          text-rendering: optimizeLegibility;          
          text-transform: none;          
          white-space: nowrap;          
          width: var( --icon-button-size );
          word-wrap: normal;        
        }

        :host( :not( [name] ) ) i,
        :host( [name] ) img {
          display: none;
        }
      </style>
      <button part="button">
        <img part="image" />
        <i part="symbol"></i>
        <slot></slot>
      </button>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
	  this.$button.addEventListener( 'click', ( evt ) => this.doButtonClick( evt ) );    
    this.$image = this.shadowRoot.querySelector( 'img' );
    this.$symbol = this.shadowRoot.querySelector( 'i' );    
  }

  doButtonClick( evt ) {
    if( this.href !== null ) {
      if( this.download === null ) {
        const target = this.target === null ? '_blank' : this.target;
        window.open( this.link, target );
      } else {
        // TODO: Something special with downloads?
      }
    }

	  this.selected = this.toggle ? !this.selected : false;
  }

  // When things change
  _render() {
    const type = this.type === null ? 'button' : this.type;

    this.$button.disabled = this.disabled;
    this.$button.type = type;    
    this.$symbol.innerText = this.name === null ? '' : this.name;
    this.$image.src = this.src === null ? '' : this.src;

    if( this.name !== null ) {
      const variation = [];

      if( this.filled )
        variation.push( '\'FILL\' 1' );
  
      if( this.weight !== null ) {
        variation.push( `'wght' ${this.weight}` );
      }
  
      this.$symbol.style.fontVariationSettings = variation.toString();    
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
    this._upgrade( 'download' );   
    this._upgrade( 'filled' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'href' );        
    this._upgrade( 'name' );        
    this._upgrade( 'selected' );            
    this._upgrade( 'src' );    
    this._upgrade( 'target' );            
    this._upgrade( 'toggle' );        
    this._upgrade( 'type' );            
    this._upgrade( 'weight' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',      
      'download',
      'hidden',
      'href',
      'name',
      'selected',
      'src',
      'target',
      'toggle',
      'type'
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

  get download() {
    if( this.hasAttribute( 'download' ) ) {
      return this.getAttribute( 'download' );
    }

    return null;
  }

  set download( value ) {
    if( value !== null ) {
      this.setAttribute( 'download', value );
    } else {
      this.removeAttribute( 'download' );
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

  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
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

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
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

  get target() {
    if( this.hasAttribute( 'target' ) ) {
      return this.getAttribute( 'target' );
    }

    return null;
  }

  set target( value ) {
    if( value !== null ) {
      this.setAttribute( 'target', value );
    } else {
      this.removeAttribute( 'target' );
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

  get target() {
    if( this.hasAttribute( 'target' ) ) {
      return this.getAttribute( 'target' );
    }

    return null;
  }

  set target( value ) {
    if( value !== null ) {
      this.setAttribute( 'target', value );
    } else {
      this.removeAttribute( 'target' );
    }
  }  

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( value ) {
    if( value !== null ) {
      this.setAttribute( 'type', value );
    } else {
      this.removeAttribute( 'type' );
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

window.customElements.define( 'mx-icon-button', MXIconButton );
