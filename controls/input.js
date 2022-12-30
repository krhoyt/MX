export default class MXInput extends HTMLElement {
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

        :host( [hidden] ),
        :host( :not( [label] ) ) p[part=label],
        :host( :not( [helper] ) ) p[part=helper] {
          display: none;
        }

        input {
          box-sizing: border-box;
          color: var( --input-color );
          font-family: var( --input-font-family );
          font-size: var( --input-font-size );
          font-weight: var( --input-font-weight );          
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent;                              
        }

        p[part=error],
        p[part=helper],
        p[part=label] {
          box-sizing: border-box;
          color: var( --label-color );
          cursor: var( --label-cursor );
          font-family: var( --label-font-family );
          font-size: var( --label-font-size );
          font-weight: var( --label-font-weight );
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;                    
        }        
      </style>
      <p part="label"></p>
      <p part="helper"></p>
      <input part="input" />
      <p part="error">&nbsp;</p>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$error = this.shadowRoot.querySelector( 'p[part=error]' );      
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );    
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => this.doInput() );  
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );  
  }

  // Fake the value attribute
  // Not part of the attribute changes
  doInput() {
    if( this.$input.value.trim().length === 0 ) {
      this.removeAttribute( 'value' );
    } else {
      this.setAttribute( 'value', this.$input.value );
    }    
  }  

  // When things change
  _render() {
    this.$error.innerHtml = this.error === null ? '&nbsp;' : this.error;
    this.$helper.innerText = this.helper === null ? '' : this.helper;    
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.type = this.type === null ? 'text' : this.type;
    this.$input.disabled = this.disabled;    
    this.$input.readOnly = this.readOnly;        
    this.$input.inputMode = this.mode === null ? '' : this.mode;
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
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );            
    this._upgrade( 'disabled' );                
    this._upgrade( 'error' );                    
    this._upgrade( 'helper' );                        
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );                
    this._upgrade( 'mode' );        
    this._upgrade( 'name' );            
    this._upgrade( 'placeholder' );        
    this._upgrade( 'readOnly' );            
    this._upgrade( 'type' );        
    this._upgrade( 'value' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'error',
      'helper',
      'hidden',
      'label',
      'mode',
      'name',
      'placeholder',
      'read-only',
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

  get value() {
    return this.$input.value.trim().length === 0 ? null : this.$input.value;
  }

  set value( content ) {
    this.$input.value = content === null ? '' : content;

    if( content === null ) {
      this.removeAttribute( 'value' );
    } else {
      this.setAttribute( 'value', content );
    }    
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

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( content ) {
    if( content !== null ) {
      this.setAttribute( 'error', content );
    } else {
      this.removeAttribute( 'error' );
    }
  }
  
  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( content ) {
    if( content !== null ) {
      this.setAttribute( 'helper', content );
    } else {
      this.removeAttribute( 'helper' );
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

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( content ) {
    if( content !== null ) {
      this.setAttribute( 'label', content );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get mode() {
    if( this.hasAttribute( 'mode' ) ) {
      return this.getAttribute( 'mode' );
    }

    return null;
  }

  set mode( content ) {
    if( content !== null ) {
      this.setAttribute( 'mode', content );
    } else {
      this.removeAttribute( 'mode' );
    }
  }
  
  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( content ) {
    if( content !== null ) {
      this.setAttribute( 'name', content );
    } else {
      this.removeAttribute( 'name' );
    }
  }  

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( content ) {
    if( content !== null ) {
      this.setAttribute( 'placeholder', content );
    } else {
      this.removeAttribute( 'placeholder' );
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

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( content ) {
    if( content !== null ) {
      this.setAttribute( 'type', content );
    } else {
      this.removeAttribute( 'type' );
    }
  }
}

window.customElements.define( 'mx-input', MXInput );
