export default class MXButton extends HTMLElement {
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
          cursor: var( --button-cursor );
          -webkit-tap-highlight-color: transparent;          
        }

        p {
          box-sizing: border-box;
          color: var( --button-color );
          cursor: var( --button-cursor );  
          font-family: var( --button-font-family );
          font-size: var( --button-font-size );
          font-weight: var( --button-font-weight );        
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;                    
        }

        :host( [truncate] ) button p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;                    
        }
      </style>
	    <button part="button">
        <slot name="prefix"></slot>
        <p part="label"></p>
        <slot name="suffix"></slot>
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
    this.$label = this.shadowRoot.querySelector( 'p' );   
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
	  this.$label.innerText = this.label === null ? '' : this.label;
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
    this._upgrade( 'caret' );        
    this._upgrade( 'circle' );    
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );    	
    this._upgrade( 'disabled' );    	
    this._upgrade( 'download' );    	    
    this._upgrade( 'hidden' );    
    this._upgrade( 'href' );        
    this._upgrade( 'kind' );            
    this._upgrade( 'label' );    
    this._upgrade( 'loading' );            
    this._upgrade( 'pill' );    
    this._upgrade( 'selected' );        	
    this._upgrade( 'target' );        	    
    this._upgrade( 'toggle' );        		
    this._upgrade( 'truncate' );        		        
    this._upgrade( 'type' );        		    
    this._upgrade( 'variant' );        		    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'caret',
      'circle',
      'concealed',
      'disabled',
      'download',
      'hidden',
      'href',
      'kind',
      'label',
      'loading',
      'pill',
	    'selected',
      'target',
	    'toggle',
      'truncate',
      'type',
      'variant'
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
  get caret() {
    return this.hasAttribute( 'caret' );
  }

  set caret( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'caret' );
      } else {
        this.setAttribute( 'caret', '' );
      }
    } else {
      this.removeAttribute( 'caret' );
    }
  }

  get circle() {
    return this.hasAttribute( 'circle' );
  }

  set circle( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'circle' );
      } else {
        this.setAttribute( 'circle', '' );
      }
    } else {
      this.removeAttribute( 'circle' );
    }
  }

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
  
  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return null;
  }

  set kind( value ) {
    if( value !== null ) {
      this.setAttribute( 'kind', value );
    } else {
      this.removeAttribute( 'kind' );
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

  get loading() {
    return this.hasAttribute( 'loading' );
  }

  set loading( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'loading' );
      } else {
        this.setAttribute( 'loading', '' );
      }
    } else {
      this.removeAttribute( 'loading' );
    }
  }    

  get pill() {
    return this.hasAttribute( 'pill' );
  }

  set pill( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'pill' );
      } else {
        this.setAttribute( 'pill', '' );
      }
    } else {
      this.removeAttribute( 'pill' );
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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
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

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
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

  get variant() {
    if( this.hasAttribute( 'variant' ) ) {
      return this.getAttribute( 'variant' );
    }

    return null;
  }

  set variant( value ) {
    if( value !== null ) {
      this.setAttribute( 'variant', value );
    } else {
      this.removeAttribute( 'variant' );
    }
  }        
}

window.customElements.define( 'mx-button', MXButton );
